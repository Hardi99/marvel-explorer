import { Link } from 'react-router-dom';
import { Logo } from './Header';

export function Footer() {
  return (
    <footer className="bg-black border-t-4 border-marvel px-6 py-10">
      <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-3.5">
          <Logo size="sm" />
          {/* Attribution exigée par les conditions d'utilisation de l'API Marvel. */}
          <span className="text-base text-neutral-400">Projet de fan non officiel · Data provided by Marvel. © Marvel · Films : TMDB</span>
        </div>
        <nav aria-label="Liens légaux" className="flex flex-wrap gap-6 text-base tracking-[1px] uppercase font-bold">
          <Link to="/mentions-legales" className="hover:text-caption transition-colors">Mentions légales</Link>
          <Link to="/confidentialite" className="hover:text-caption transition-colors">Confidentialité</Link>
        </nav>
      </div>
    </footer>
  );
}
