import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="font-display text-[10rem] leading-none text-white/10 select-none" aria-hidden="true">404</div>
        <p className="-mt-16 bg-caption text-ink border-[3px] border-ink px-4 py-2 font-bold text-lg uppercase -rotate-2">
          Cette page a disparu dans le multivers…
        </p>
        <h1 className="font-display font-normal text-3xl uppercase">Page introuvable</h1>
        <Link
          href="/"
          className="btn-comic bg-white text-ink font-display text-xl uppercase px-6 py-3 border-[3px] border-ink shadow-[6px_6px_0_#ec1d24]"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
