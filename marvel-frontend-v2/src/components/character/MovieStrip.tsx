import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Movie } from '../../api/characters';
import { TrailerDialog } from './TrailerDialog';

// Section « Sur grand écran » : les films du personnage (données TMDB), présentés comme une pellicule.
export function MovieStrip({ movies }: { movies: Movie[] }) {
  const [playing, setPlaying] = useState<Movie | null>(null);

  return (
    <section className="film-strip border-y-4 border-white py-16" aria-labelledby="movies-title">
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="self-start bg-marvel-dark text-white font-bold text-base tracking-[1.5px] px-2.5 py-1 uppercase">
              Pendant ce temps, au cinéma…
            </span>
            <h2 id="movies-title" className="font-display font-normal text-[clamp(36px,5vw,64px)] leading-none uppercase">
              Sur grand écran
            </h2>
          </div>
          <p className="max-w-[360px] text-[17px] text-neutral-400 leading-snug">
            Clique sur une affiche pour voir la bande-annonce (chargée depuis YouTube seulement à ce moment-là).
          </p>
        </div>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(160px,100%),1fr))] gap-6">
          {movies.map((movie) => {
            const poster = (
              <span className="relative block aspect-[2/3] bg-gradient-to-br from-neutral-800 to-neutral-950 border-[3px] border-neutral-700 overflow-hidden">
                {movie.poster ? (
                  <img src={movie.poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-display text-lg uppercase text-neutral-400">
                    {movie.title}
                  </span>
                )}
                {movie.trailer && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    <span className="w-16 h-16 rounded-full bg-marvel flex items-center justify-center">
                      <Play size={26} fill="currentColor" aria-hidden="true" />
                    </span>
                  </span>
                )}
              </span>
            );
            const caption = (
              <>
                <span className="font-display text-xl leading-[1.05] uppercase">{movie.title}</span>
                <span className="text-base text-neutral-400 tracking-[1px]">{movie.year}</span>
              </>
            );

            return (
              <li key={movie.id}>
                {movie.trailer ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(movie)}
                    aria-label={`Bande-annonce : ${movie.title} (${movie.year})`}
                    className="group w-full flex flex-col gap-2.5 text-left cursor-pointer"
                  >
                    {poster}
                    {caption}
                  </button>
                ) : (
                  <a href={movie.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-2.5">
                    {poster}
                    {caption}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mention exigée par les conditions d'utilisation de TMDB. */}
        <p className="flex items-center gap-3 text-sm text-neutral-500">
          <span className="bg-gradient-to-r from-[#90cea1] to-[#01b4e4] text-[#0d253f] font-bold px-2 py-0.5 tracking-[1px]">TMDB</span>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>

      {playing?.trailer && <TrailerDialog title={playing.title} youtubeKey={playing.trailer} onClose={() => setPlaying(null)} />}
    </section>
  );
}
