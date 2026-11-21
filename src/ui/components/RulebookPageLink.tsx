import { Link } from 'react-router-dom';
import { rulebookForProduct } from '../../rules/rulebooks';

/** «pag. N» che apre il regolamento della scatola a quella pagina (testo semplice se il regolamento non c'è). */
export function RulebookPageLink({ productId, page, short }: { productId?: string; page: number; short?: boolean }) {
  const rb = rulebookForProduct(productId);
  if (!rb || !page || page > rb.pages) return <span>pag. {page}</span>;
  return (
    <Link to={`/regolamenti/${rb.id}?p=${page}`} onClick={(e) => e.stopPropagation()} className="underline decoration-dotted underline-offset-2 hover:text-[var(--accent-2)]">
      pag. {page}{short ? '' : ' del regolamento'}
    </Link>
  );
}
