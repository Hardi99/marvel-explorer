'use client';

import { Search, X } from 'lucide-react';

interface Props {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder = 'Rechercher...', value, onChange }: Props) {
  return (
    <div className="relative max-w-md w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border-2 border-white/30 px-5 pl-11 pr-10 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-marvel transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
          aria-label="Effacer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
