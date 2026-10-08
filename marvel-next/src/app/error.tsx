'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6">
        <p className="bg-caption text-ink border-[3px] border-ink px-4 py-2 font-bold text-lg uppercase -rotate-2">
          Un super-vilain a coupé le courant…
        </p>
        <h1 className="font-display font-normal text-3xl uppercase">Une erreur est survenue</h1>
        <button
          type="button"
          onClick={reset}
          className="btn-comic bg-white text-ink font-display text-xl uppercase px-6 py-3 border-[3px] border-ink shadow-[6px_6px_0_#ec1d24] cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
