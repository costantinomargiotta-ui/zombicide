import { createBrowserRouter, Navigate, RouterProvider, useParams, type RouteObject } from 'react-router-dom';
import { AppShell } from './ui/layout/AppShell';
import { GlobalDashboard } from './pages/GlobalDashboard';
import { UniverseDashboard } from './pages/UniverseDashboard';
import { CollectionPage } from './pages/CollectionPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { SettingsPage } from './pages/SettingsPage';
import { CharactersPage } from './pages/CharactersPage';
import { RioSheet } from './pages/rio/RioSheet';
import { isUniverseId } from './domain/universes';
import { AuthGate } from './ui/auth/AuthGate';

function UniverseIndex() {
  const { universeId } = useParams();
  return isUniverseId(universeId) ? <UniverseDashboard universeId={universeId} /> : <Navigate to="/" replace />;
}

/** Sezioni disponibili sia in ambito globale sia per singolo universo. */
const sections: RouteObject[] = [
  { path: 'collezione', element: <CollectionPage /> },
  { path: 'campagne', element: <CampaignsPage /> },
  { path: 'impostazioni', element: <SettingsPage /> },
  { path: 'personaggi', element: <CharactersPage /> },
  { path: 'scenari', element: <PlaceholderPage title="Scenari" phase="Fase 3" description="Catalogo degli scenari con obiettivi, condizioni di vittoria e sconfitta, regole speciali e collegamenti. Si comincia con gli scenari di Rio Z Janeiro." /> },
  { path: 'partite', element: <PlaceholderPage title="Partite" phase="Fase 3" description="Avvio di una partita da uno scenario, registrazione di giocatori, personaggi, obiettivi ed esito, con aggiornamento automatico dei progressi e correzione senza duplicazioni." /> },
  { path: 'equipaggiamento', element: <PlaceholderPage title="Equipaggiamento" phase="Fase 4" description="Catalogo degli oggetti, inventario di campagna, equipaggiamento dei personaggi ed equipaggiamento conservato tra le missioni, solo dove previsto dal gioco." /> },
  { path: 'carte', element: <PlaceholderPage title="Carte" phase="Fase 4" description="Archivio delle carte della collezione con immagini fronte e retro, categorie specifiche per gioco e filtri per universo, prodotto, categoria e testo." /> },
  { path: 'statistiche', element: <PlaceholderPage title="Statistiche" phase="Fase 5" description="Statistiche globali, per universo, campagna, personaggio e giocatore, con grafici e classifiche calcolati solo dai dati registrati." /> },
];

const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <GlobalDashboard /> },
      ...sections.map((r) => ({ ...r, path: `/${r.path}` })),
      { path: '/campagne/:campaignId', element: <CampaignDashboard /> },
      { path: '/campagne/:campaignId/scheda/:participantId', element: <RioSheet /> },
      { path: '/u/:universeId', element: <UniverseIndex /> },
      ...sections.map((r) => ({ ...r, path: `/u/:universeId/${r.path}` })),
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function App() {
  return <AuthGate><RouterProvider router={router} /></AuthGate>;
}
