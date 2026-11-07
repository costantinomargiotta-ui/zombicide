# Zombicide Hub: architettura e piano di sviluppo

Documento di riferimento del progetto. Copre i punti 1–7 della richiesta iniziale; il punto 8 (prima versione funzionante) è nel codice di questo repository.

## 1. Architettura proposta

### Tecnologie

La base proposta (React, TypeScript, Vite, Tailwind CSS, Supabase, Netlify o Vercel) è adatta allo scopo e la confermo. Due precisazioni motivate:

| Scelta | Motivo |
|---|---|
| **Supabase come database principale** | L'app sarà usata da computer, iPad e smartphone: serve un'unica fonte di verità sincronizzata. Postgres gestisce bene relazioni esplicite e vincoli. |
| **IndexedDB (Dexie) come adattatore locale** | Permette di sviluppare e provare l'app subito, senza credenziali. Resterà come cache per l'uso senza connessione (es. al tavolo da gioco). |
| **React Router** | Tre livelli di navigazione con URL condivisibili (`/`, `/u/moderno`, `/campagne/:id`). |
| **Vitest** | Le regole di gioco e le statistiche sono funzioni pure: vanno testate, perché un errore lì altera i progressi. |

Netlify e Vercel si equivalgono per un'app statica privata: va bene quello che preferisci.

### Livelli del codice

```
src/
  domain/      Tipi e concetti condivisi (nessuna dipendenza da React o dal database)
  rules/       Moduli regole per universo: fantasy, moderno, western, marvel
  data/        Database, repository (scritture), backup, dati dimostrativi, hook di lettura
  services/    Logica applicativa pura (statistiche, avanzamento campagne)
  ui/          Componenti grafici riutilizzabili e layout
  pages/       Pagine: compongono ui + data + services + rules
  lib/         Utilità (id, formattazione, ambito di navigazione)
```

Regole di dipendenza: `pages → ui, data, services, rules, domain`; `services → domain, rules`; `rules → domain`. I componenti grafici non contengono regole di gioco: le chiedono al modulo regole.

### Persistenza

- **Ora**: IndexedDB tramite Dexie (`src/data/db.ts`), con tabelle che rispecchiano lo schema SQL.
- **Prossimo passo**: adattatore Supabase con le stesse operazioni del repository (`src/data/repository.ts`). Lo schema è pronto in `supabase/migrations/0001_schema_iniziale.sql`.
- **Backup**: esportazione e ripristino JSON completi, immagini incluse (già funzionanti in Impostazioni).

## 2. Criticità tecniche e funzionali

1. **Perdita dei dati locali su iPhone e iPad.** Safari può cancellare i dati di un sito non installato dopo 7 giorni di inutilizzo. Finché non colleghiamo Supabase, esporta un backup dopo ogni sessione. È il motivo principale per anticipare Supabase alla Fase 2.
2. **Correzione delle partite senza duplicare progressi.** Se i PE venissero sommati direttamente sulla scheda, correggere una partita li raddoppierebbe. Soluzione: un **registro dei progressi** (`progress_ledger`) in cui ogni riga è legata alla partita che l'ha generata. Correggere una partita significa cancellare e rigenerare solo le sue righe, in un'unica transazione. Lo stato della scheda è sempre ricalcolabile.
3. **Regole diverse tra universi.** Un modello rigido (stessi campi per tutti) costringerebbe a forzare le regole. Soluzione: colonne comuni più un campo `traits`/`state` in jsonb, interpretato e validato dal modulo regole dell'universo.
4. **Catalogo da costruire a mano.** Non esiste un catalogo completo affidabile: ogni dato ha uno stato `verificato` / `da-verificare` e un'origine (`base`, `utente`, `demo`). Servirà un'importazione da CSV o JSON per inserire carte e personaggi in blocco.
5. **Immagini.** Le foto da smartphone pesano 3–5 MB: vanno ridimensionate e compresse prima del salvataggio (Fase 7, ma conviene già dalla Fase 2 con i ritratti).
6. **Materiale protetto da diritto d'autore.** Immagini e testi ufficiali CMON vanno bene per uso personale in un'app privata; l'app non deve essere pubblicata con quei contenuti. Per questo l'interfaccia usa grafiche originali e le immagini ufficiali si caricano manualmente.
7. **Accesso privato.** Supabase Auth con registrazione disattivata e criteri di sicurezza per riga (RLS) già previsti nello schema.
8. **Mockup e regole.** I mockup contengono abilità e meccaniche illustrative (es. le abilità di Doug e Odin, il tracciato PEC della scheda di Beatriz): li uso solo come riferimento grafico, mai come fonte di regole.
9. **Sincronizzazione tra dispositivi.** Con un solo utente il rischio di conflitti è basso; basta il criterio "vince l'ultima modifica" più il numero di revisione sulle partite.

## 3. Schema del database

Schema completo: `supabase/migrations/0001_schema_iniziale.sql`. Separazione tra catalogo e salvataggi:

| # | Area | Tabelle | Natura |
|---|---|---|---|
| 1 | Universi | `universes` | Fissa |
| 2 | Prodotti | `products`, `product_dependencies`, `collection_entries` | Catalogo + collezione personale separata |
| 3 | Personaggi | `characters` | Catalogo |
| 4 | Abilità | `abilities`, `character_abilities` | Catalogo, per universo |
| 5 | Carte | `cards`, `card_links` | Catalogo |
| 6 | Scenari | `scenarios`, `campaign_templates`, `campaign_template_scenarios` | Catalogo (struttura ufficiale, anche ramificata) |
| 7 | Campagne | `campaigns`, `campaign_scenarios` | Salvataggio |
| 8 | Partecipazioni | `campaign_participants` | Salvataggio (un personaggio, più campagne) |
| 9 | Sessioni | `game_sessions`, `session_participants`, `session_events` | Salvataggio |
| 10 | Progressi | `progress_ledger`, `participant_progress` | Registro + stato ricalcolabile |
| 11 | Inventari | `inventory_items` (`campagna` / `personaggio` / `conservato`) | Salvataggio, riferisce `cards` |
| 12 | Ricompense | righe `ricompensa` / `oggetto` del registro | Salvataggio |
| 13 | Traguardi | `milestones` (catalogo), `milestone_progress` | Catalogo + salvataggio |
| 14 | Giocatori | `players` | Archivio (senza account) |

Identificativi: slug stabili per il catalogo (`rio-z-janeiro`), id generati per i salvataggi (`camp_…`). Nessun dato di catalogo viene copiato nelle campagne.

## 4. Struttura delle pagine e dei componenti

### Navigazione a tre livelli

| Livello | Percorso | Stato |
|---|---|---|
| 1 · Dashboard globale | `/` | ✅ Fase 1 |
| 2 · Dashboard universo | `/u/:universo` | ✅ Fase 1 |
| 3 · Dashboard campagna | `/campagne/:id` | ✅ base (gestione stato e note); scheda completa in Fase 3 |

Ogni sezione esiste in versione globale e per universo: `/collezione` e `/u/fantasy/collezione`. Il selettore universi (barra laterale su desktop, striscia orizzontale su tablet e smartphone) mantiene la sezione corrente quando si cambia universo.

### Sezioni

| Sezione | Percorso | Fase |
|---|---|---|
| Collezione | `collezione` | ✅ 1 |
| Campagne | `campagne` | ✅ 1 (creazione, stati) · 3 (scheda) |
| Personaggi | `personaggi` | 2 |
| Scenari, Partite | `scenari`, `partite` | 3 |
| Equipaggiamento, Carte | `equipaggiamento`, `carte` | 4 |
| Statistiche | `statistiche` | 5 |
| Impostazioni (backup, demo) | `impostazioni` | ✅ 1 |

### Componenti riutilizzabili (`src/ui/components`)

`Panel`, `StatTile` (mostra "Non disponibile" per i dati non registrati), `ProgressBar`, `Badge`, `EmptyState`, `Modal` + `Field`, `ImagePicker`, `StoredImage`, `UniverseCard`, `CampaignRow`, `UniverseEmblem`.

### Identità visiva per universo

Un solo foglio di stile con token CSS (`--accent`, `--accent-2`, `--scene`, …) ridefiniti da `data-universe="fantasy|moderno|western|marvel"`. La struttura delle pagine non cambia; cambiano colori, atmosfera ed emblema. Qualsiasi elemento può assumere il tema di un altro universo (es. le card della dashboard globale).

## 5. Separazione delle regole dei quattro universi

Ogni universo ha un modulo in `src/rules/` che implementa l'interfaccia `UniverseRules`:

```ts
interface UniverseRules {
  universeId: UniverseId;
  characterKinds: CharacterKind[];       // es. Marvel: eroe-zombie, supereroe, passante
  progression: ProgressionTrack | null;  // null = non documentata
  campaignTemplates: CampaignTemplate[]; // es. Rio Z Janeiro
  missingMaterials: string[];
  sources: SourceRef[];                  // documento e pagina di origine
}
```

Principi:

- **Nessuna eredità tra universi.** Moderno e Western hanno `progression: null` finché non avrò i loro regolamenti, anche se probabilmente somigliano al Fantasy. I test lo verificano.
- **Ogni regola cita la fonte.** Esempio: livelli di pericolo di Black Plague, regolamento pag. 16; Marvel Zombies, regolamento pag. 11.
- **Differenze già emerse dai regolamenti forniti.** In Black Plague, al livello Arancio si sceglie 1 abilità tra 2 e al Rosso 1 tra 3; in Marvel Zombies, all'Arancione si sblocca un'altra abilità e al Rosso tutte le abilità sono disponibili. Marvel ha inoltre la Modalità Zombie (Eroi Zombie) e la Modalità Eroe (Supereroi, X-Men Resistance), quindi tipologie di personaggio diverse.
- **Campagne come moduli.** Rio Z Janeiro avrà un modulo dedicato (`rules/moderno/rio-z-janeiro`) che definirà PE, azioni bonus, abilità di campagna e traguardi, e saprà trasformare l'esito di una partita in righe del registro dei progressi.

## 6. Piano di sviluppo

| Fase | Contenuto | Stato |
|---|---|---|
| 1 · Fondamenta | Architettura, schema, navigazione, dashboard globale e per universo, collezione, campagne di base, backup | ✅ consegnata |
| 2 · Personaggi | Archivio, schede originali, abilità, ritratti, importazione dei 24 sopravvissuti, **collegamento a Supabase** | Prossima |
| 3 · Rio Z Janeiro | Modulo regole, scheda campagna fedele all'originale, scenari, registro partite con correzione, PE, azioni bonus, equipaggiamento conservato, traguardi | |
| 4 · Carte ed equipaggiamento | Catalogo, inventari, collegamento alle campagne, ricompense | |
| 5 · Statistiche | Dashboard, classifiche, grafici, storico, giocatori | |
| 6 · Altri universi | Regole e schede Fantasy, Western, Marvel; altre campagne | |
| 7 · Ottimizzazione | Prestazioni, compressione immagini, controlli di integrità, rifinitura grafica, installazione come app | |

Ho anticipato Supabase alla Fase 2 per il rischio descritto al punto 2.1.

## 7. Materiali ufficiali mancanti

### Indispensabili per la Fase 2

- Fotografie leggibili delle schede dei **24 sopravvissuti** (fronte, e retro se presente). In questo messaggio ho ricevuto i mockup, non le foto delle schede.
- Regolamento di **Zombicide 2ª edizione** (o della scatola da cui provengono i sopravvissuti) per livelli di pericolo e descrizione delle abilità Moderno.
- Indicazione del prodotto di provenienza di ciascun sopravvissuto non di Rio Z Janeiro.

### Indispensabili per la Fase 3 (Rio Z Janeiro)

- Fotografia leggibile della **scheda campagna ufficiale**.
- Pagine del regolamento di Rio Z Janeiro relative a campagna, PE, azioni bonus, abilità della campagna, equipaggiamento conservato e traguardi.
- Elenco degli scenari della campagna, con ordine ed eventuali ramificazioni.

### Utili più avanti

- Regolamenti di Green Horde, Wulfsburg, Friends and Foes, No Rest for the Wicked, White Death.
- Regolamenti di Undead or Alive, Gears & Guns, Running Wild.
- Regolamento di X-Men Resistance e delle espansioni Marvel.
- Foto delle scatole (facoltative: si caricano dall'app).

### Dati del catalogo da confermare

Ho segnato come `verificato` solo Black Plague, Marvel Zombies e X-Men Resistance (gioco base, citato a pag. 5 del regolamento Marvel Zombies). Le tipologie degli altri prodotti (gioco base o espansione) sono `da-verificare` e modificabili dalla pagina Collezione.

## Materiali analizzati

- *Zombicide: Black Plague – Regolamento* (ITA): indice, contenuto, esperienza e livelli di pericolo (pag. 2, 3, 16).
- *Marvel Zombies – Un gioco Zombicide* (ITA): indice, contenuto, modalità di gioco, esperienza e livelli di pericolo (pag. 2, 3, 5, 11).
- Sei mockup grafici: riferimento per stile e disposizione, non per le regole.
