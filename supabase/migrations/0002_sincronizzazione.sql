-- Zombicide Hub · sincronizzazione tra dispositivi
-- L'app lavora su un database locale (IndexedDB) e sincronizza ogni record in questa tabella.
-- Il prefisso zh_ evita conflitti se il progetto Supabase ospita anche altre app.

create table if not exists public.zh_records (
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  tbl text not null,                       -- tabella locale (campaigns, sessions, progress, ...)
  id text not null,                        -- id stabile del record
  data jsonb,                              -- contenuto; null se eliminato
  deleted boolean not null default false,
  client_updated_at timestamptz not null default now(),
  server_updated_at timestamptz not null default now(),
  primary key (owner_id, tbl, id)
);

create index if not exists zh_records_pull on public.zh_records (owner_id, server_updated_at);

-- L'ora del server decide l'ordine di lettura, non quella del dispositivo.
create or replace function public.zh_touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.server_updated_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists zh_records_touch on public.zh_records;
create trigger zh_records_touch before insert or update on public.zh_records
  for each row execute function public.zh_touch();

alter table public.zh_records enable row level security;

drop policy if exists zh_records_owner on public.zh_records;
create policy zh_records_owner on public.zh_records for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

-- Immagini (ritratti, scatole): bucket privato, una cartella per utente.
insert into storage.buckets (id, name, public) values ('zh-immagini', 'zh-immagini', false)
  on conflict (id) do nothing;

drop policy if exists zh_immagini_owner on storage.objects;
create policy zh_immagini_owner on storage.objects for all to authenticated
  using (bucket_id = 'zh-immagini' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'zh-immagini' and (storage.foldername(name))[1] = (select auth.uid())::text);
