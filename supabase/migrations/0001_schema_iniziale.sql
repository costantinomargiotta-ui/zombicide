-- Zombicide Hub · schema iniziale (PostgreSQL / Supabase)
-- Principi:
--   * il CATALOGO (prodotti, personaggi, abilità, carte, scenari, modelli di campagna) non viene mai copiato nei salvataggi;
--   * i SALVATAGGI (campagne, partecipazioni, partite, progressi, inventari) lo referenziano con id stabili;
--   * i progressi derivano da un REGISTRO (progress_ledger) legato alla partita che li ha generati:
--     correggere una partita = rigenerare le sue righe, senza duplicare PE, abilità o ricompense;
--   * i campi specifici di un universo stanno in colonne jsonb, validate dal modulo regole dell'app.
-- Gli id sono testuali: slug stabili per il catalogo (es. 'rio-z-janeiro'), id generati per i salvataggi.

create extension if not exists pgcrypto;

-- ---------- Tipi ----------
create type data_status as enum ('verificato', 'da-verificare');
create type record_origin as enum ('base', 'utente', 'demo');
create type product_kind as enum ('gioco-base', 'espansione', 'campagna', 'contenuto-aggiuntivo');
create type campaign_status as enum ('da-iniziare', 'in-corso', 'sospesa', 'completata');
create type scenario_state as enum ('bloccato', 'disponibile', 'completato');
create type session_outcome as enum ('vittoria', 'sconfitta', 'in-corso', 'abbandonata');
create type inventory_location as enum ('campagna', 'personaggio', 'conservato');

-- ---------- 1. Universi ----------
create table universes (
  id text primary key check (id in ('fantasy', 'moderno', 'western', 'marvel')),
  name text not null,
  sort_order smallint not null
);
insert into universes values ('fantasy', 'Fantasy', 1), ('moderno', 'Moderno', 2), ('western', 'Western', 3), ('marvel', 'Marvel', 4);

-- Colonne comuni di proprietà: un solo amministratore, ma ogni riga ha il suo proprietario per la RLS.
-- owner_id default auth.uid() evita di passarlo dal client.

-- ---------- 2. Prodotti e collezione ----------
create table products (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  name text not null,
  kind product_kind not null,
  description text,
  cover_image_path text,            -- percorso nel bucket "immagini"
  contents jsonb not null default '[]',
  data_status data_status not null default 'da-verificare',
  origin record_origin not null default 'utente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_dependencies (
  product_id text references products on delete cascade,
  requires_product_id text references products on delete restrict,
  primary key (product_id, requires_product_id),
  check (product_id <> requires_product_id)
);

-- Collezione personale, distinta dal catalogo.
create table collection_entries (
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  product_id text not null references products on delete cascade,
  owned boolean not null default false,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (owner_id, product_id)
);

-- ---------- 3–4. Personaggi e abilità ----------
create table abilities (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,   -- le abilità non attraversano gli universi
  name text not null,
  description text,
  data_status data_status not null default 'da-verificare',
  origin record_origin not null default 'utente',
  unique (universe_id, name)
);

create table characters (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  product_id text not null references products,
  name text not null,
  kind text not null,                -- definito dal modulo regole: 'sopravvissuto', 'eroe-zombie', 'supereroe', ...
  portrait_image_path text,
  traits jsonb not null default '{}', -- caratteristiche specifiche dell'universo
  data_status data_status not null default 'da-verificare',
  origin record_origin not null default 'utente'
);

-- Abilità originali stampate sulla scheda, per livello e posizione.
create table character_abilities (
  character_id text references characters on delete cascade,
  ability_id text references abilities,
  level text not null,               -- id del livello nel modulo regole ('blu', 'giallo', ...)
  slot smallint not null default 1,
  primary key (character_id, level, slot)
);

-- ---------- 5. Carte ----------
create table cards (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  product_id text not null references products,
  category text not null,            -- 'equipaggiamento', 'zombie', 'evento', 'obiettivo', ... (per gioco)
  name text not null,
  description text,
  effects text,
  quantity smallint not null default 1 check (quantity > 0),
  front_image_path text,
  back_image_path text,
  traits jsonb not null default '{}', -- es. gittata, danni, dadi, precisione
  data_status data_status not null default 'da-verificare',
  origin record_origin not null default 'utente'
);

create table card_links (
  card_id text references cards on delete cascade,
  target_type text not null check (target_type in ('personaggio', 'scenario', 'modello-campagna')),
  target_id text not null,
  primary key (card_id, target_type, target_id)
);

-- ---------- 6. Scenari e modelli di campagna ----------
create table scenarios (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  product_id text not null references products,
  code text not null,
  title text not null,
  description text,
  objectives jsonb not null default '[]',
  victory_conditions text,
  defeat_conditions text,
  special_rules text,
  map_image_path text,
  rewards jsonb not null default '[]',
  data_status data_status not null default 'da-verificare',
  origin record_origin not null default 'utente',
  unique (product_id, code)
);

-- Struttura ufficiale di una campagna (lineare o ramificata). Non è un salvataggio.
create table campaign_templates (
  id text primary key,
  universe_id text not null references universes,
  product_id text not null references products,
  name text not null,
  rules_module text not null,        -- es. 'moderno/rio-z-janeiro': chiave del modulo regole nell'app
  data_status data_status not null default 'da-verificare'
);

create table campaign_template_scenarios (
  template_id text references campaign_templates on delete cascade,
  scenario_id text references scenarios,
  position smallint not null,
  unlocked_by jsonb not null default '[]', -- condizioni di sblocco (id scenari / esiti) per le ramificazioni
  primary key (template_id, scenario_id)
);

create table milestones (               -- 13. Traguardi (definizione di catalogo)
  id text primary key,
  template_id text references campaign_templates on delete cascade,
  universe_id text not null references universes,
  name text not null,
  description text,
  effect jsonb not null default '{}'
);

-- ---------- 14. Giocatori ----------
create table players (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  notes text,
  origin record_origin not null default 'utente',
  created_at timestamptz not null default now()
);

-- ---------- 7–8. Campagne e partecipazioni ----------
create table campaigns (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  product_id text not null references products,
  template_id text references campaign_templates,
  name text not null,
  description text,
  cover_image_path text,
  status campaign_status not null default 'da-iniziare',
  planned_scenario_count smallint check (planned_scenario_count > 0),
  notes text,
  origin record_origin not null default 'utente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stato degli scenari nel salvataggio (bloccato / disponibile / completato).
create table campaign_scenarios (
  campaign_id text references campaigns on delete cascade,
  scenario_id text references scenarios,
  position smallint not null,
  state scenario_state not null default 'bloccato',
  primary key (campaign_id, scenario_id)
);

-- Lo stesso personaggio può stare in più campagne: i progressi sono per partecipazione.
create table campaign_participants (
  id text primary key,
  campaign_id text not null references campaigns on delete cascade,
  character_id text not null references characters,
  player_id text references players on delete set null,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (campaign_id, character_id)
);

-- ---------- 9. Sessioni di gioco ----------
create table game_sessions (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  universe_id text not null references universes,
  campaign_id text references campaigns on delete cascade,
  scenario_id text references scenarios,
  scenario_title text,
  played_on date not null,
  duration_minutes integer check (duration_minutes > 0),
  outcome session_outcome not null default 'in-corso',
  zombies_killed integer check (zombies_killed >= 0),  -- null = non registrato
  notes text,
  revision integer not null default 1,                 -- aumenta a ogni correzione
  origin record_origin not null default 'utente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table session_participants (
  id text primary key,
  session_id text not null references game_sessions on delete cascade,
  participant_id text references campaign_participants on delete set null,
  character_id text references characters,
  character_name text,
  player_id text references players on delete set null,
  kills integer check (kills >= 0)
);

create table session_events (
  id text primary key,
  session_id text not null references game_sessions on delete cascade,
  at timestamptz not null default now(),
  kind text not null,                -- 'obiettivo', 'evento', 'nota', ...
  payload jsonb not null default '{}'
);

-- ---------- 10–12. Progressi, inventari, ricompense ----------
-- Registro dei progressi: ogni riga nasce da una partita (o da una modifica manuale, session_id null).
-- Lo stato attuale di un partecipante è la somma delle righe: correggere una partita significa
-- cancellare e rigenerare le righe con quel session_id, in un'unica transazione.
create table progress_ledger (
  id text primary key,
  campaign_id text not null references campaigns on delete cascade,
  participant_id text references campaign_participants on delete cascade,
  session_id text references game_sessions on delete cascade,
  kind text not null check (kind in ('pe', 'abilita', 'azione-bonus', 'traguardo', 'oggetto', 'ricompensa', 'scenario')),
  payload jsonb not null,            -- interpretato dal modulo regole (es. {"delta": 3}, {"abilityId": "..."})
  note text,
  created_at timestamptz not null default now()
);
create index on progress_ledger (participant_id);
create index on progress_ledger (session_id);

-- Vista materializzabile dello stato corrente (cache, ricalcolabile dal registro).
create table participant_progress (
  participant_id text primary key references campaign_participants on delete cascade,
  xp integer not null default 0,
  state jsonb not null default '{}', -- abilità di campagna, azioni bonus, ecc. secondo il modulo regole
  computed_at timestamptz not null default now()
);

create table inventory_items (
  id text primary key,
  campaign_id text not null references campaigns on delete cascade,
  participant_id text references campaign_participants on delete cascade,  -- null = inventario di campagna
  card_id text not null references cards,
  location inventory_location not null,
  quantity smallint not null default 1 check (quantity > 0),
  source_ledger_id text references progress_ledger on delete cascade,     -- da quale partita/ricompensa arriva
  check ((location = 'campagna') = (participant_id is null))
);

create table milestone_progress (
  milestone_id text references milestones,
  participant_id text references campaign_participants on delete cascade,
  source_ledger_id text references progress_ledger on delete cascade,
  achieved_at timestamptz not null default now(),
  primary key (milestone_id, participant_id)
);

-- ---------- Storico attività ----------
create table activities (
  id text primary key,
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  kind text not null,
  universe_id text references universes,
  message text not null,
  ref_id text,
  origin record_origin not null default 'utente',
  at timestamptz not null default now()
);

-- ---------- Sicurezza: app privata, un solo amministratore ----------
-- La registrazione pubblica va disattivata da Supabase (Authentication → Providers → disable sign ups).
do $$
declare t text;
begin
  foreach t in array array['products','collection_entries','abilities','characters','cards','scenarios','players','campaigns','game_sessions','activities'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy proprietario on %I for all using (owner_id = auth.uid()) with check (owner_id = auth.uid())', t);
  end loop;
end $$;

-- Tabelle figlie: accesso consentito agli utenti autenticati (l'unico è l'amministratore).
do $$
declare t text;
begin
  foreach t in array array['universes','product_dependencies','character_abilities','card_links','campaign_templates','campaign_template_scenarios','milestones','campaign_scenarios','campaign_participants','session_participants','session_events','progress_ledger','participant_progress','inventory_items','milestone_progress'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy autenticato on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Bucket privato per le immagini (scatole, ritratti, carte, mappe).
insert into storage.buckets (id, name, public) values ('immagini', 'immagini', false) on conflict do nothing;
create policy immagini_proprietario on storage.objects for all to authenticated
  using (bucket_id = 'immagini' and owner = auth.uid())
  with check (bucket_id = 'immagini' and owner = auth.uid());
