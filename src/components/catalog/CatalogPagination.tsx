import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  basePath: string;
  query: string;
  page: number;
  totalPages: number;
}

// Pagination en liens (?page=) : chaque page de résultats a sa propre adresse.
export function CatalogPagination({ basePath, query, page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (p > 1) params.set('page', String(p));
    return params.size ? `${basePath}?${params}` : basePath;
  };

  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const arrow = 'w-11 h-11 flex items-center justify-center border-2 border-white/30 hover:border-white transition-colors';

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 mt-12">
      {page > 1 ? (
        <Link href={href(page - 1)} className={arrow} aria-label="Page précédente">
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <span className={`${arrow} opacity-30`} aria-hidden="true"><ChevronLeft size={20} /></span>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-neutral-400">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`min-w-11 h-11 px-2 flex items-center justify-center font-display text-lg transition-colors ${
              p === page ? 'bg-marvel-dark text-white' : 'border-2 border-white/30 hover:border-white'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={arrow} aria-label="Page suivante">
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className={`${arrow} opacity-30`} aria-hidden="true"><ChevronRight size={20} /></span>
      )}
    </nav>
  );
}
