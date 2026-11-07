"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="font-serif text-3xl">Une erreur est survenue</h1>
      <p className="mt-2 text-stone-500">Le serveur n&apos;a pas pu afficher cette page. Réessayez dans un instant.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-stone-400">Code : {error.digest}</p>}
      <button onClick={reset} className="mt-8 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
        Réessayer
      </button>
    </div>
  );
}
