import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getHome, type HomeData } from '@/server/data';
import { thumbnailUrl } from '@/utils/thumbnail';
import { Intro } from '@/components/home/Intro';
import { CardFavourite, TeamCta } from '@/components/home/HomeIslands';
import { ComicsWall } from '@/components/ComicsWall';

type Thumb = HomeData['hero']['thumbnail'];
const img = (t: Thumb, variant?: Parameters<typeof thumbnailUrl>[2]) => thumbnailUrl(t.path, t.extension, variant);

// Vignettes de l'intro : couvertures et héros en alternance, comme une liasse de comics feuilletée.
// Même format que les cartes de la page : les images téléchargées pour l'intro resservent juste après.
function introFrames(data: HomeData) {
  const frames: string[] = [];
  for (let i = 0; i < 8; i++) {
    const comic = data.comics[i];
    const character = data.characters[i];
    if (comic) frames.push(img(comic.thumbnail, 'portrait_uncanny'));
    if (character) frames.push(img(character.thumbnail, 'portrait_uncanny'));
  }
  frames.push(img(data.hero.thumbnail, 'portrait_uncanny'));
  return frames.slice(-16);
}

function SectionTitle({ children, link, linkLabel }: { children: React.ReactNode; link: string; linkLabel: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className="font-display font-normal text-[clamp(40px,5vw,64px)] leading-none uppercase">{children}</h2>
      <Link href={link} className="font-bold text-lg tracking-[2px] uppercase underline underline-offset-[6px] hover:text-caption transition-colors">
        {linkLabel} →
      </Link>
    </div>
  );
}

// Page rendue côté serveur à partir de données en cache (`getHome`) : elle arrive complète,
// images comprises, et se sert depuis le CDN.
export default async function Home() {
  const data = await getHome();

  return (
    <div>
      <Intro frames={introFrames(data)} />

      {/* HERO : case de BD géante */}
      <section className="relative bg-marvel overflow-hidden [clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]">
        <div className="dots absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#0b0b0b_0%,rgb(11_11_11/0.92)_38%,rgb(11_11_11/0)_62%)]" />

        <div className="relative max-w-[1320px] mx-auto px-6 pt-[72px] pb-[140px] flex flex-wrap items-center gap-12">
          <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-[26px]">
            <p className="self-start bg-caption text-ink border-[3px] border-ink shadow-[6px_6px_0_#0b0b0b] px-4 py-2 font-bold text-lg tracking-[1px] uppercase -rotate-2">
              Pendant ce temps, sur Terre-616…
            </p>
            <h1 className="font-display font-normal text-[clamp(48px,6vw,104px)] leading-[1.02] uppercase tracking-[-0.5px] -skew-y-3 origin-left">
              Tout l’univers
              <br />
              <span className="text-marvel">Marvel</span> <span className="whitespace-nowrap">dans ta poche</span>
            </h1>
            <p className="mt-2 max-w-[480px] text-[22px] leading-[1.35] text-neutral-200 font-medium">
              Des milliers de héros, de vilains et de comics. Parcours-les librement, garde tes favoris quand tu veux.
            </p>
            <div className="flex flex-wrap items-center gap-[22px]">
              <Link
                href="/characters"
                className="btn-comic inline-flex items-center gap-3 bg-white text-ink font-display text-2xl tracking-[1px] uppercase px-7 py-4 border-[3px] border-ink shadow-[6px_6px_0_#0b0b0b]"
              >
                Explorer les personnages
                <ArrowRight size={22} strokeWidth={3} aria-hidden="true" />
              </Link>
              <Link href="/comics" className="font-bold text-[19px] tracking-[1.5px] uppercase underline underline-offset-[6px] hover:text-caption transition-colors">
                ou parcourir les comics
              </Link>
            </div>
          </div>

          {/* Héros du jour */}
          <div className="flex-[1_1_420px] min-w-0 flex justify-center relative">
            <Link
              href={`/character/${data.hero._id}`}
              className="relative block w-[min(100%,460px)] aspect-[3/4] border-[5px] border-ink shadow-[14px_14px_0_#0b0b0b] rotate-2 bg-blue-700 overflow-hidden"
            >
              <img
                src={img(data.hero.thumbnail)}
                alt=""
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover object-[40%_20%]"
              />
              <div className="dots absolute inset-0 opacity-20" />
              <div className="absolute inset-x-0 bottom-0 bg-ink px-[18px] py-3.5 flex justify-between items-baseline gap-3">
                <span className="font-display text-[30px] uppercase">{data.hero.name}</span>
                <span className="text-[15px] text-neutral-300 tracking-[2px] uppercase whitespace-nowrap">Héros du jour</span>
              </div>
            </Link>
            <div
              aria-hidden="true"
              className="starburst absolute -top-[18px] right-[4%] w-[150px] h-[150px] bg-caption text-ink flex items-center justify-center font-comic text-[40px] tracking-[2px] rotate-[10deg]"
            >
              {data.hero.sound}
            </div>
          </div>
        </div>
      </section>

      {/* MUR DE COUVERTURES */}
      <ComicsWall
        className="pt-6 pb-[72px]"
        titleId="home-comics"
        title={<>Les comics <span className="text-marvel">du moment</span></>}
        link={{ to: '/comics', label: 'Voir tous les comics' }}
        items={data.comics}
      />

      {/* PERSONNAGES : grille de cases */}
      <section className="dots-light bg-panel border-y-4 border-white py-[72px]" aria-labelledby="home-characters">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <span className="self-start bg-caption text-ink font-bold text-base tracking-[1.5px] px-2.5 py-1 uppercase">Rassemblement</span>
            <SectionTitle link="/characters" linkLabel="Voir tous les personnages">
              <span id="home-characters">Héros &amp; vilains</span>
            </SectionTitle>
          </div>

          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {data.characters.map((character) => (
              <li key={character._id}>
                <Link
                  href={`/character/${character._id}`}
                  className="panel relative block aspect-[3/4] border-4 border-ink outline-[3px] outline-solid outline-white bg-panel overflow-hidden shadow-[8px_8px_0_#0b0b0b]"
                >
                  <img
                    src={img(character.thumbnail, 'portrait_uncanny')}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-4 pt-10 pb-3.5 bg-gradient-to-b from-transparent to-black/90">
                    <div className="h-1 w-11 bg-marvel mb-2.5" />
                    <h3 className="font-display text-[28px] leading-none uppercase">{character.name}</h3>
                    <p className="text-[15px] text-neutral-300 tracking-[1px] uppercase mt-1">{character.alias}</p>
                  </div>
                  <CardFavourite id={character._id} name={character.name} thumbnail={character.thumbnail} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAVORIS : la seule invitation à créer un compte de la page */}
      <section className="px-6 py-24" aria-labelledby="home-team">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center gap-12">
          <div className="flex-[1_1_380px] min-w-0 relative bg-white text-ink border-4 border-ink rounded-[48%_52%_50%_46%/58%_54%_46%_42%] px-12 py-14 shadow-[10px_10px_0_#ec1d24]">
            <p className="font-comic text-[clamp(32px,4vw,44px)] leading-[1.05] tracking-[1.5px] text-center">
              Un grand pouvoir implique une grande collection !
            </p>
            <div
              aria-hidden="true"
              className="absolute -bottom-[34px] left-[22%] w-0 h-0 border-x-[18px] border-x-transparent border-t-[36px] border-t-ink"
            />
          </div>
          <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
            <h2 id="home-team" className="font-display font-normal text-[clamp(38px,4.5vw,56px)] leading-none uppercase">
              Forme ton <span className="text-marvel">équipe</span>
            </h2>
            <TeamCta />
          </div>
        </div>
      </section>
    </div>
  );
}
