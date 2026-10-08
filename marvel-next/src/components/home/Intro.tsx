'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { AnimationEvent } from 'react';
import { Logo } from '../layout/Logo';

const SEEN_KEY = 'marvel-intro-seen';
const FRAME_MS = 125; // 16 vignettes × 125 ms = 2 s de défilement
const MAX_WAIT_MS = 1200; // on ne fait jamais attendre plus longtemps les images

// Intro "flipbook" façon génériques Marvel Studios, jouée une seule fois par navigateur.
// Jamais jouée si le visiteur a demandé de réduire les animations.
// La décision est prise avant l'affichage par INTRO_SCRIPT (layout.tsx), qui pose data-intro sur <html> :
// le serveur rend toujours le même HTML (pas d'écart d'hydratation) et le CSS cache l'intro si besoin.
export const INTRO_SCRIPT = `try{if(localStorage.getItem('${SEEN_KEY}')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='1'}catch(e){}`;

const noop = () => () => {};
const introRequested = () => document.documentElement.dataset.intro === '1';

function markSeen() {
  delete document.documentElement.dataset.intro;
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Stockage indisponible (navigation privée) : l'intro rejouera, rien de grave.
  }
}

export function Intro({ frames }: { frames: string[] }) {
  // Côté serveur et pendant l'hydratation : « à jouer » (même HTML partout) ; ensuite, la vraie valeur.
  const requested = useSyncExternalStore(noop, introRequested, () => true);
  const [closed, setClosed] = useState(false);
  const visible = requested && !closed;
  // Vignettes figées au démarrage : celles qui arriveraient après ne joueraient pas en rythme.
  const [played, setPlayed] = useState<string[] | null>(null);
  const started = played !== null;

  const close = () => {
    markSeen();
    setClosed(true);
  };

  // Démarre quand les vignettes sont décodées, ou au plus tard après MAX_WAIT_MS, pour que
  // le défilement ne montre pas de cases vides sans jamais faire attendre le visiteur.
  useEffect(() => {
    // Relecture directe : pendant l'hydratation `visible` vaut encore true pour tout le monde.
    if (!visible || !introRequested()) return;
    const timer = window.setTimeout(() => setPlayed((p) => p ?? []), MAX_WAIT_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible || !introRequested() || frames.length === 0) return;
    let cancelled = false;
    Promise.allSettled(
      frames.map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode();
      }),
    ).then(() => {
      if (!cancelled) setPlayed((p) => p ?? frames);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, frames]);

  // Bloque le défilement de la page et permet de passer l'intro avec Échap.
  useEffect(() => {
    // Relecture directe : pendant l'hydratation `visible` vaut encore true pour tout le monde.
    if (!visible || !introRequested()) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [visible]);

  if (!visible) return null;

  const flipDuration = (played?.length || 8) * FRAME_MS;
  const onAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.animationName === 'intro-out') close();
  };

  return (
    <div
      className="intro-overlay fixed inset-0 z-50 bg-black overflow-hidden"
      style={started ? { animation: `intro-out 400ms ease ${flipDuration + 900}ms forwards` } : undefined}
      onAnimationEnd={onAnimationEnd}
    >
      {started && (
        <>
          {played?.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 contrast-115 saturate-125"
              style={{ animation: `intro-flip ${flipDuration}ms step-end ${i * FRAME_MS}ms` }}
            />
          ))}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-marvel mix-blend-multiply"
            style={{ animation: `intro-wash ${flipDuration}ms ease-in forwards` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-3.5 opacity-0"
              style={{ animation: `intro-slam 600ms ease-out ${flipDuration - 100}ms both` }}
            >
              <span className="border-[6px] border-white">
                <span className="block bg-marvel text-white font-display leading-none text-[clamp(72px,13vw,168px)] tracking-[-3px] px-[0.2em] pt-[0.08em] pb-[0.04em]">
                  MARVEL
                </span>
              </span>
              <span className="text-white font-display text-[clamp(20px,3vw,40px)] tracking-[0.55em] pl-[0.55em]">EXPLORER</span>
            </div>
          </div>
        </>
      )}

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Logo />
        </div>
      )}

      <button
        type="button"
        onClick={close}
        className="absolute right-7 bottom-6 bg-black/55 border-2 border-white px-4 py-2.5 text-white font-bold text-lg tracking-[2px] uppercase cursor-pointer hover:bg-white hover:text-ink transition-colors"
      >
        Passer l’intro →
      </button>
    </div>
  );
}
