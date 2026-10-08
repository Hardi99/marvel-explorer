'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '../SearchBar';
import { useDebounce } from '@/hooks/useDebounce';

// Champ de recherche qui pilote l'URL (?q=) : la liste est rendue côté serveur à partir de l'URL,
// donc une recherche se partage et s'indexe comme n'importe quelle page.
export function CatalogSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('q') ?? '';
  const [value, setValue] = useState(current);
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    if (debounced.trim() === current) return;
    const params = new URLSearchParams();
    if (debounced.trim()) params.set('q', debounced.trim());
    // Nouvelle recherche : retour en page 1.
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  }, [debounced, current, pathname, router]);

  return <SearchBar placeholder={placeholder} value={value} onChange={setValue} />;
}
