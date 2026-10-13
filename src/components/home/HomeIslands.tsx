'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { FavouriteButton } from '../FavouriteButton';
import type { Thumbnail } from '@/types';

// Petites parties de l'accueil qui dépendent du visiteur (connecté ou non) :
// le reste de la page est rendu côté serveur et servi tel quel par le CDN.

export function CardFavourite({ id, name, thumbnail }: { id: string; name: string; thumbnail: Thumbnail }) {
  return (
    <FavouriteButton
      itemId={id}
      itemType="character"
      name={name}
      thumbnailPath={thumbnail.path}
      thumbnailExtension={thumbnail.extension}
      className="absolute top-3 right-3"
    />
  );
}

export function TeamCta() {
  const { isLoggedIn } = useAuthStore();
  return (
    <>
      <p className="text-[21px] leading-[1.4] text-neutral-300">
        {isLoggedIn
          ? 'Retrouve tes personnages et tes comics préférés, sur tous tes appareils.'
          : 'Crée un compte gratuit pour sauvegarder tes personnages et tes comics préférés, et les retrouver sur tous tes appareils.'}
      </p>
      <Link
        href={isLoggedIn ? '/favourites' : '/user/signup'}
        className="btn-comic self-start bg-marvel-dark text-white font-display text-[22px] tracking-[1px] uppercase px-[26px] py-3.5 border-[3px] border-white shadow-[6px_6px_0_#ffffff]"
      >
        {isLoggedIn ? 'Voir mes favoris' : 'Créer mon compte'}
      </Link>
    </>
  );
}
