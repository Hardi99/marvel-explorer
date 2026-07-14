import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Character } from '../../types';
import { thumbnailUrl } from '../../utils/thumbnail';

// Carousel d'arrière-plan du hero (décoratif). Extrait en composant lazy pour que
// embla-carousel ne soit chargé que côté connecté, jamais sur la landing anonyme (/).
export default function HeroCarousel({ characters }: { characters: Character[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {characters.map((char) => {
          const imgUrl = thumbnailUrl(char.thumbnail.path, char.thumbnail.extension);
          return (
            <div key={char._id} className="flex-none w-full h-full relative">
              <img
                src={imgUrl}
                alt={char.name}
                className="absolute right-0 h-full w-1/2 object-cover object-top opacity-40"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
