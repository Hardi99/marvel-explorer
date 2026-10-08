import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="page-x bg-black border-t-4 border-marvel py-10">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-3.5">
          <Logo size="sm" />
          {/* Attribution exigée par les conditions d'utilisation de l'API Marvel. */}
          <span className="text-base text-neutral-400">Projet de fan non officiel · Data provided by Marvel. © Marvel · Films : TMDB</span>
        </div>
        <nav aria-label="Liens légaux" className="flex flex-wrap gap-6 text-base tracking-[1px] uppercase font-bold">
          <Link href="/mentions-legales" className="hover:text-caption transition-colors">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-caption transition-colors">Confidentialité</Link>
        </nav>
      </div>
    </footer>
  );
}
