import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import type { Comic } from '../../types';
import { thumbnailUrl } from '../../utils/thumbnail';

// Carousel horizontal des comics à la une. Extrait en composant lazy : embla-carousel
// n'est chargé que lorsqu'il rend réellement (côté connecté), jamais sur la landing anonyme (/).
export default function ComicsCarousel({ comics }: { comics: Comic[] }) {
  const [emblaComicsRef] = useEmblaCarousel({ loop: false, dragFree: true });

  return (
    <div className="overflow-hidden" ref={emblaComicsRef}>
      <div className="flex gap-4 px-6 ml-[max(0px,calc((100vw-1280px)/2))]">
        {comics.map((comic) => {
          const imgUrl = thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension);
          return (
            <Link
              key={comic._id}
              to={`/comic/${comic._id}`}
              className="group flex-none w-36 md:w-44 relative overflow-hidden rounded-lg aspect-[2/3] bg-zinc-900"
            >
              <img
                src={imgUrl}
                alt={comic.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ec1d24] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-bold text-xs line-clamp-2">{comic.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
