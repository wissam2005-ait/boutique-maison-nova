import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm text-stone-500">{siteConfig.description}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Boutique</p>
          <ul className="space-y-2 text-sm text-stone-500">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/boutique?categorie=${c.id}`} className="hover:text-stone-900">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Aide</p>
          <ul className="space-y-2 text-sm text-stone-500">
            <li><Link href="/a-propos" className="hover:text-stone-900">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-stone-900">Contact</Link></li>
            <li><Link href="/panier" className="hover:text-stone-900">Mon panier</Link></li>
            <li><a href={`mailto:${siteConfig.email}`} className="hover:text-stone-900">{siteConfig.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
        © 2026 {siteConfig.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
