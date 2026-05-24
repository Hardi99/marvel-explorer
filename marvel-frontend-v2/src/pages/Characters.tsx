import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getCharacters } from '../api/characters';
import { CharacterCard } from '../components/CharacterCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { PageSpinner } from '../components/ui/Spinner';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 20;

export default function Characters() {
  const { isLoggedIn } = useAuthStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  // Reset page on search change
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['characters', debouncedSearch, page],
    queryFn: () =>
      getCharacters({
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">
          Personnages
        </h1>
        <div className="h-1 w-12 bg-[#ec1d24]" />
      </div>

      {/* Search + count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <SearchBar
          placeholder="Rechercher un personnage..."
          value={search}
          onChange={handleSearch}
        />
        {data && (
          <p className="text-white/40 text-sm whitespace-nowrap">
            {data.count} personnage{data.count > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Content */}
      {isLoading && <PageSpinner />}

      {isError && (
        <p className="text-center text-red-400 py-20">
          Erreur lors du chargement des personnages.
        </p>
      )}

      {data && data.results.length === 0 && (
        <p className="text-center text-white/40 py-20">
          Aucun personnage trouvé pour « {debouncedSearch} ».
        </p>
      )}

      {data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.results.map((char) => (
              <CharacterCard key={char._id} character={char} />
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
