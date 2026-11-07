# Zombicide Hub

Web app personale per gestire collezione, campagne, personaggi, partite e statistiche dei quattro universi Zombicide: Fantasy, Moderno, Western e Marvel.

Architettura, schema del database e piano di sviluppo: [docs/ARCHITETTURA.md](docs/ARCHITETTURA.md).

## Avvio

```bash
npm install
```

```bash
npm run dev
```

Apri l'indirizzo mostrato nel terminale (di solito http://localhost:5173).

## Comandi

| Comando | Effetto |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Controllo dei tipi e compilazione in `dist/` |
| `npm run preview` | Anteprima della versione compilata |
| `npm test` | Test di regole, statistiche e database |

## Stato

Fase 1 completata: navigazione a tre livelli, dashboard globale e per universo, collezione (catalogo separato dalla collezione personale, aggiunta di prodotti dall'app), campagne di base, backup ed esportazione, dati dimostrativi rimovibili.

I dati sono salvati nel browser (IndexedDB). Lo schema per Supabase è in `supabase/migrations/`.
