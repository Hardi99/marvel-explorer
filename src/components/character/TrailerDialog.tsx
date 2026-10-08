'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  youtubeKey: string;
  onClose: () => void;
}

// Bande-annonce chargée uniquement après le clic du visiteur, via youtube-nocookie :
// aucun contenu YouTube (ni cookie) n'est chargé tant qu'il n'a rien demandé.
export function TrailerDialog({ title, youtubeKey, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-label={`Bande-annonce : ${title}`}
      className="m-auto w-[min(92vw,1100px)] bg-black border-4 border-white p-0 text-white backdrop:bg-black/85"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b-2 border-white/20">
        <p className="font-display text-xl uppercase truncate">{title}</p>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Fermer la bande-annonce"
          className="w-11 h-11 flex items-center justify-center border-2 border-white hover:bg-white hover:text-ink transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeKey)}?autoplay=1&rel=0`}
          title={`Bande-annonce : ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </dialog>
  );
}
