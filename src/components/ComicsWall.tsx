import type { ReactNode } from 'react';
import Link from 'next/link';
import { thumbnailUrl } from '@/utils/thumbnail';

export interface WallItem {
  _id: string;
  title: string;
  thumbnail: { path: string; extension: string };
}

interface Props {
  title: ReactNode;
  titleId: string;
  /** Lien « Voir tout » à droite du titre. */
  link?: { to: string; label: string };
  /** `undefined` pendant le chargement : des cases vides gardent la place (pas de saut de mise en page). */
  items: WallItem[] | undefined;
  placeholderCount?: number;
  className?: string;
}

// Mur de couvertures qui défile horizontalement, légèrement inclinées comme posées sur une table.
export function ComicsWall({ title, titleId, link, items, placeholderCount = 8, className = '' }: Props) {
  const tilt = (i: number) => (i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]');

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className="max-w-[1320px] mx-auto px-6 pb-7 flex flex-wrap items-end justify-between gap-4">
        <h2 id={titleId} className="font-display font-normal text-[clamp(36px,5vw,64px)] leading-none uppercase">
          {title}
        </h2>
        {link && (
          <Link href={link.to} className="font-bold text-lg tracking-[2px] uppercase underline underline-offset-[6px] hover:text-caption transition-colors">
            {link.label} →
          </Link>
        )}
      </div>
      <ul className="hscroll flex gap-[22px] px-6 pt-[18px] pb-7 overflow-x-auto">
        {(items ?? Array.from({ length: placeholderCount }, () => null)).map((comic, i) => (
          <li key={comic?._id ?? i} className="flex-none w-[170px] md:w-[190px]">
            {comic ? (
              <Link href={`/comic/${comic._id}`} className={`panel flex flex-col gap-2.5 ${tilt(i)}`}>
                <div className="relative aspect-[2/3] border-4 border-white bg-panel overflow-hidden">
                  <img
                    src={thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension, 'portrait_uncanny')}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-[17px] leading-[1.15]">{comic.title}</span>
              </Link>
            ) : (
              <div className={`aspect-[2/3] border-4 border-white/30 bg-panel ${tilt(i)}`} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
