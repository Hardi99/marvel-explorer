import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getComics } from '../api/comics';
import { ComicCard } from '../components/ComicCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 20;

export default function Comics() {
  const { isLoggedIn } = useAuthStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comics', debouncedSearch, page],
    queryFn: () =>
      getComics({
        name: debouncedSearch,
        skip: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      }),
    enabled: isLoggedIn,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.ceil(data.count / ITEMS_PER_PAGE);
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Comics
        </h1>
        <div className="h-1 w-12 bg-[#ec1d24]" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <SearchBar
          placeholder="Rechercher un comic..."
          value={search}
          onChange={handleSearch}
        />
        {data && (
          <p className="text-white/40 text-sm whitespace-nowrap">
            {data.count} comic{data.count > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading && <PageSpinner />}

      {isError && (
        <p className="text-center text-red-400 py-20">
          Erreur lors du chargement des comics.
        </p>
      )}

      {data && data.results.length === 0 && (
        <p className="text-center text-white/40 py-20">
          Aucun comic trouvé pour « {debouncedSearch} ».
        </p>
      )}

      {data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.results.map((comic) => (
              <ComicCard key={comic._id} comic={comic} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          <p className="text-center text-white/20 text-xs mt-4">
            Page {page} / {totalPages}
          </p>
        </>
      )}
    </div>
  );
}
