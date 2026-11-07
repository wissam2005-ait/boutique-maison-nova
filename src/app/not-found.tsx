import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="font-serif text-8xl text-stone-200">404</p>
      <h1 className="mt-4 font-serif text-3xl">Page introuvable</h1>
      <p className="mt-2 text-stone-500">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
