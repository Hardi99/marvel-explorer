import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-[10rem] font-display font-normal text-white/5 leading-none select-none">404</div>
        <div className="bg-marvel text-white font-display text-2xl px-3 pt-1.5 pb-1 inline-block mb-6 -mt-8 relative">
          MARVEL
        </div>
        <h1 className="text-2xl font-display font-normal uppercase text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">
          Cette page n'existe pas ou a été déplacée dans un autre univers.
        </p>
        <Link to="/">
          <Button size="lg">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
