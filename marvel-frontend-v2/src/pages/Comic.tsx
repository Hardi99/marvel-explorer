import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getComic, getComics } from '../api/comics';
import { thumbnailUrl } from '../utils/thumbnail';
import { parseComic } from '../utils/comicInfo';
import { PageSpinner } from '../components/ui/Spinner';
import { FavouriteButton } from '../components/FavouriteButton';
import { ComicsWall } from '../components/ComicsWall';
import { useFavourites } from '../hooks/useFavourites';

// « Amazing Spider-Man: Renew Your Vows Vol. 2 » → « Amazing Spider-Man » : la série, pour « À lire aussi ».
const seriesOf = (title: string) => title.split(/:|\s+Vol\.|\s+-\s+/)[0]!.trim();

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[18px] py-3.5 border-[1.5px] border-white">
      <dt className="text-sm tracking-[1.5px] uppercase text-neutral-400">{label}</dt>
      <dd className="mt-1 font-display text-[22px] leading-tight uppercase">{value}</dd>
    </div>
  );
}

export default function Comic() {
  const { id } = useParams<{ id: string }>();
  const { isFavourite } = useFavourites();

  const { data: comic, isLoading, isError } = useQuery({
    queryKey: ['comic', id],
    queryFn: () => getComic(id!),
    enabled: !!id,
  });

  const info = comic ? parseComic(comic.title, comic.description) : null;
  const series = info ? seriesOf(info.title) : '';

  const { data: related } = useQuery({
    queryKey: ['comics', 'series', series],
    queryFn: () => getComics({ name: series, limit: 9 }),
    enabled: series.length > 0,
  });

  if (isLoading) return <PageSpinner />;

  if (isError || !comic || !info) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <p className="bg-caption text-ink border-[3px] border-ink px-4 py-2 font-bold text-lg uppercase -rotate-2">
          Ce numéro s’est égaré dans les archives…
        </p>
        <Link to="/comics" className="font-bold text-lg tracking-[2px] uppercase underline underline-offset-[6px]">
          Tous les comics →
        </Link>
      </div>
    );
  }

  const badges = [info.format, info.collects ? 'Recueil' : null, info.issue ? `N° ${info.issue}` : null].filter(Boolean);
  const cells = [
    info.collects && { label: 'Contient', value: info.collects },
    info.year && { label: 'Année', value: info.year },
    info.format && { label: 'Format', value: info.format },
  ].filter((cell): cell is { label: string; value: string } => Boolean(cell));

  const relatedItems = related?.results
    .filter((c) => c._id !== comic._id)
    .slice(0, 8)
    .map((c) => {
      const r = parseComic(c.title);
      return { ...c, title: r.issue ? `${r.title} #${r.issue}` : r.title };
    });

  return (
    <div>
      {/* EN-TÊTE : la couverture en vedette */}
      <section className="dots-light bg-panel border-b-4 border-white">
        <div className="max-w-[1320px] mx-auto px-6 pt-7 pb-20 flex flex-col gap-8">
          <Link to="/comics" className="self-start flex items-center gap-2 font-bold text-[17px] tracking-[2px] uppercase hover:text-caption transition-colors">
            <ArrowLeft size={18} strokeWidth={3} aria-hidden="true" />
            Tous les comics
          </Link>

          <div className="flex flex-wrap items-start gap-16">
            {/* Couverture */}
            <div className="flex-[0_1_400px] min-w-0 relative mx-auto md:mx-0">
              <div className="relative aspect-[2/3] border-[6px] border-white shadow-[16px_16px_0_#ec1d24] rotate-2 overflow-hidden bg-neutral-800">
                <img
                  src={thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension)}
                  alt={`Couverture de ${info.title}`}
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {info.omnibus && (
                <span className="absolute -bottom-[18px] -left-3.5 bg-caption text-ink border-[3px] border-ink px-3 py-1.5 font-display text-xl tracking-[1px] uppercase -rotate-[4deg]">
                  Omnibus
                </span>
              )}
            </div>

            {/* Infos */}
            <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-6">
              {badges.length > 0 && (
                <ul className="flex flex-wrap gap-2.5">
                  {badges.map((badge, i) => (
                    <li
                      key={badge}
                      className={`px-3 py-1 font-bold text-base tracking-[1.5px] uppercase ${i === 0 ? 'bg-marvel-dark' : 'border-2 border-white'}`}
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-2">
                <h1 className="font-display font-normal text-[clamp(44px,6vw,92px)] leading-[0.95] uppercase break-words">{info.title}</h1>
                {info.authors && <p className="text-2xl font-semibold text-neutral-300">par {info.authors}</p>}
              </div>

              {cells.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 border-[1.5px] border-white max-w-[640px]">
                  {cells.map((cell) => (
                    <InfoCell key={cell.label} {...cell} />
                  ))}
                </dl>
              )}

              {comic.description?.trim() && (
                <div className="relative bg-white text-ink border-4 border-ink shadow-[8px_8px_0_#0b0b0b] px-[26px] pt-[26px] pb-[22px] max-w-[640px] mt-2">
                  <span className="absolute -top-4 left-[18px] bg-caption border-[3px] border-ink px-2.5 py-0.5 font-bold text-sm tracking-[1.5px] uppercase">
                    L’histoire
                  </span>
                  <p className="text-xl leading-[1.4] font-medium">{comic.description.trim()}</p>
                </div>
              )}

              <FavouriteButton
                variant="label"
                className="self-start shadow-[6px_6px_0_#ec1d24]"
                itemId={comic._id}
                itemType="comic"
                name={info.title}
                thumbnailPath={comic.thumbnail.path}
                thumbnailExtension={comic.thumbnail.extension}
                isFavourite={isFavourite(comic._id)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* À LIRE AUSSI : la même série */}
      {(!relatedItems || relatedItems.length > 0) && (
        <ComicsWall
          className="pt-16 pb-[72px]"
          titleId="related-comics"
          title={<>À lire <span className="text-marvel">aussi</span></>}
          link={{ to: `/comics?q=${encodeURIComponent(series)}`, label: `Toute la série ${series}` }}
          items={relatedItems}
        />
      )}
    </div>
  );
}
