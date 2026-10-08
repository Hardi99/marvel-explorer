import { Suspense } from 'react';
import { listCharacters, listComics } from '@/server/data';
import { CharacterCard } from '../CharacterCard';
import { ComicCard } from '../ComicCard';
import { CatalogSearch } from './CatalogSearch';
import { CatalogPagination } from './CatalogPagination';

const PER_PAGE = 20;

type Kind = 'characters' | 'comics';
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LABELS: Record<Kind, { title: string; placeholder: string; one: string; many: string }> = {
  characters: { title: 'Personnages', placeholder: 'Rechercher un personnage…', one: 'personnage', many: 'personnages' },
  comics: { title: 'Comics', placeholder: 'Rechercher un comic…', one: 'comic', many: 'comics' },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

function GridSkeleton({ kind }: { kind: Kind }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={`${kind === 'characters' ? 'aspect-[3/4]' : 'aspect-[2/3]'} border-4 border-white/10 bg-panel`} />
      ))}
    </div>
  );
}

async function Results({ kind, searchParams }: { kind: Kind; searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(params.page), 10) || 1);
  const args = { name: query, skip: (page - 1) * PER_PAGE, limit: PER_PAGE };
  const data = kind === 'characters'
    ? { kind: 'characters' as const, ...(await listCharacters(args)) }
    : { kind: 'comics' as const, ...(await listComics(args)) };
  const totalPages = Math.max(1, Math.ceil(data.count / PER_PAGE));
  const { one, many } = LABELS[kind];

  return (
    <>
      <p className="text-neutral-400 text-base mb-6" aria-live="polite">
        {data.count} {data.count > 1 ? many : one}
        {query && <> pour « {query} »</>}
        {totalPages > 1 && <> · page {page} / {totalPages}</>}
      </p>

      {data.results.length === 0 ? (
        <p className="py-20 text-center text-xl text-neutral-400">Aucun {one} trouvé{query && <> pour « {query} »</>}.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {data.kind === 'characters'
            ? data.results.map((item, i) => <CharacterCard key={item._id} character={item} priority={i < 6} />)
            : data.results.map((item, i) => <ComicCard key={item._id} comic={item} priority={i < 6} />)}
        </div>
      )}

      <CatalogPagination basePath={`/${kind}`} query={query} page={page} totalPages={totalPages} />
    </>
  );
}

// Liste paginée rendue côté serveur à partir de l'URL (?q=…&page=…), données en cache.
export function CatalogPage({ kind, searchParams }: { kind: Kind; searchParams: SearchParams }) {
  const { title, placeholder } = LABELS[kind];

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="font-display font-normal text-5xl md:text-6xl uppercase">{title}</h1>
        <div className="h-1 w-12 bg-marvel" />
      </div>

      <div className="mb-6">
        <Suspense fallback={<div className="h-[46px] max-w-md border-2 border-white/30 bg-white/5" aria-hidden="true" />}>
          <CatalogSearch placeholder={placeholder} />
        </Suspense>
      </div>

      <Suspense fallback={<GridSkeleton kind={kind} />}>
        <Results kind={kind} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
