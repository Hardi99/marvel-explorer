import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getComic, listComics, FEATURED_COMIC_IDS } from '@/server/data';
import { MARVEL_ID } from '@/server/utils/proxy';
import { thumbnailUrl } from '@/utils/thumbnail';
import { parseComic } from '@/utils/comicInfo';
import { FavouriteButton } from '@/components/FavouriteButton';
import { ComicsWall } from '@/components/ComicsWall';

// « Amazing Spider-Man: Renew Your Vows Vol. 2 » → « Amazing Spider-Man » : la série, pour « À lire aussi ».
const seriesOf = (title: string) => title.split(/:|\s+Vol\.|\s+-\s+/)[0]!.trim();

export async function generateStaticParams() {
  return FEATURED_COMIC_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/comic/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const comic = MARVEL_ID.test(id) ? await getComic(id) : null;
  if (!comic) return { title: 'Comic introuvable' };

  const info = parseComic(comic.title, comic.description);
  const description = comic.description?.trim() || `${info.title} : couverture, format et informations du comic Marvel.`;
  const image = thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension);
  return {
    title: info.issue ? `${info.title} #${info.issue}` : info.title,
    description: description.slice(0, 160),
    alternates: { canonical: `/comic/${id}` },
    openGraph: { title: info.title, description: description.slice(0, 200), images: [{ url: image, alt: info.title }] },
  };
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[18px] py-3.5 border-[1.5px] border-white">
      <dt className="text-sm tracking-[1.5px] uppercase text-neutral-400">{label}</dt>
      <dd className="mt-1 font-display text-[22px] leading-tight uppercase">{value}</dd>
    </div>
  );
}

async function RelatedComics({ series, excludeId }: { series: string; excludeId: string }) {
  const related = await listComics({ name: series, skip: 0, limit: 9 });
  const items = related.results
    .filter((c) => c._id !== excludeId)
    .slice(0, 8)
    .map((c) => {
      const r = parseComic(c.title);
      return { ...c, title: r.issue ? `${r.title} #${r.issue}` : r.title };
    });
  if (items.length === 0) return null;

  return (
    <ComicsWall
      className="pt-16 pb-[72px]"
      titleId="related-comics"
      title={<>À lire <span className="text-marvel">aussi</span></>}
      link={{ to: `/comics?q=${encodeURIComponent(series)}`, label: `Toute la série ${series}` }}
      items={items}
    />
  );
}

async function ComicDetails({ params }: { params: PageProps<'/comic/[id]'>['params'] }) {
  const { id } = await params;
  if (!MARVEL_ID.test(id)) notFound();
  const comic = await getComic(id);
  if (!comic) notFound();

  const info = parseComic(comic.title, comic.description);
  const series = seriesOf(info.title);
  const badges = [info.format, info.collects ? 'Recueil' : null, info.issue ? `N° ${info.issue}` : null].filter(
    (b): b is string => Boolean(b),
  );
  const cells = [
    info.collects && { label: 'Contient', value: info.collects },
    info.year && { label: 'Année', value: info.year },
    info.format && { label: 'Format', value: info.format },
  ].filter((cell): cell is { label: string; value: string } => Boolean(cell));

  return (
    <>
      {/* EN-TÊTE : la couverture en vedette */}
      <section className="dots-light bg-panel border-b-4 border-white">
        <div className="max-w-[1320px] mx-auto px-6 pt-7 pb-20 flex flex-col gap-8">
          <Link href="/comics" className="self-start flex items-center gap-2 font-bold text-[17px] tracking-[2px] uppercase hover:text-caption transition-colors">
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
              />
            </div>
          </div>
        </div>
      </section>

      {/* À LIRE AUSSI : la même série */}
      {series && <RelatedComics series={series} excludeId={comic._id} />}
    </>
  );
}

function DetailsSkeleton() {
  return (
    <div className="bg-panel min-h-[760px]" aria-hidden="true">
      <div className="max-w-[1320px] mx-auto px-6 pt-20 flex flex-wrap gap-16">
        <div className="w-[min(100%,400px)] aspect-[2/3] bg-neutral-800 border-[6px] border-white/30 rotate-2" />
        <div className="flex-1 min-w-[280px] flex flex-col gap-6 pt-6">
          <div className="h-8 w-48 bg-white/10" />
          <div className="h-24 w-full max-w-[560px] bg-white/10" />
          <div className="h-40 w-full max-w-[640px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function ComicPage({ params }: PageProps<'/comic/[id]'>) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <ComicDetails params={params} />
    </Suspense>
  );
}
