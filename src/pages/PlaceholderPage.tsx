import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { useScope } from '../lib/scope';
import { UNIVERSES } from '../domain/universes';
import { Panel } from '../ui/components/Panel';

export function PlaceholderPage({ title, phase, description }: { title: string; phase: string; description: string }) {
  const { universeId, path } = useScope();
  return (
    <Panel title={universeId ? `${title} · ${UNIVERSES[universeId].name}` : title} icon={Construction}>
      <div className="flex flex-col items-start gap-3">
        <span className="hazard-stripe rounded px-2 py-0.5 text-sm font-semibold text-black">
          <span className="rounded bg-black px-2 text-[var(--accent-2)]">{phase}</span>
        </span>
        <p className="max-w-2xl text-[var(--muted)]">{description}</p>
        <Link to={path()} className="btn">Torna alla dashboard</Link>
      </div>
    </Panel>
  );
}
