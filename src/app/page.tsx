import Link from "next/link";
import { ArrowRight, Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Newsletter } from "@/components/newsletter";
import { formatPrice, siteConfig } from "@/lib/config";

export default function Home() {
  const featured = products.filter((p) => p.featured);
  const hero = products[0];
  const heroSecond = products[5];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-100">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-amber-700 shadow-sm">
              Nouvelle collection
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
              L&apos;essentiel, <em className="text-amber-700">sublimé.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-stone-600">{siteConfig.tagline} Une sélection d&apos;objets beaux, utiles et faits pour durer.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/boutique" className="inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 font-medium text-white transition hover:bg-stone-700">
                Explorer la boutique <ArrowRight className="size-4" />
              </Link>
              <Link href={`/produit/${hero.slug}`} className="inline-flex h-12 items-center rounded-full border border-stone-300 bg-white px-7 font-medium transition hover:border-stone-900">
                Produit phare
              </Link>
            </div>
            <dl className="mt-12 flex gap-10">
              {[["12k+", "clients heureux"], ["4,8/5", "note moyenne"], ["48 h", "expédition"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-serif text-3xl">{v}</dt>
                  <dd className="text-sm text-stone-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative grid grid-cols-5 gap-4">
            <Link href={`/produit/${hero.slug}`} className="group col-span-3">
              <ProductImage product={hero} className="aspect-[3/4] rounded-3xl shadow-xl" />
            </Link>
            <div className="col-span-2 flex flex-col gap-4 pt-16">
              <Link href={`/produit/${heroSecond.slug}`} className="group">
                <ProductImage product={heroSecond} className="aspect-square rounded-3xl shadow-xl" />
              </Link>
              <div className="rounded-3xl bg-white p-5 shadow-xl">
                <p className="text-xs text-stone-500">À partir de</p>
                <p className="font-serif text-2xl">{formatPrice(35)}</p>
                <p className="mt-1 text-xs text-emerald-700">Livraison offerte dès {formatPrice(siteConfig.freeShippingThreshold)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="border-b border-stone-200">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            [Truck, "Livraison rapide", "Expédiée sous 48 h"],
            [RotateCcw, "Retours gratuits", "30 jours pour changer d'avis"],
            [ShieldCheck, "Paiement sécurisé", "Données chiffrées"],
            [Leaf, "Éco‑responsable", "Emballages recyclés"],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={t as string} className="flex items-start gap-3">
                <I className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-medium">{t as string}</p>
                  <p className="text-xs text-stone-500">{d as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl">Parcourir par catégorie</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/boutique?categorie=${c.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-stone-900 hover:shadow-lg"
            >
              <span className="text-4xl transition group-hover:scale-110">{c.emoji}</span>
              <span className="text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sélection */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Nos coups de cœur</h2>
            <p className="mt-2 text-stone-500">Les pièces préférées de notre communauté.</p>
          </div>
          <Link href="/boutique" className="hidden items-center gap-1 text-sm font-medium hover:underline sm:inline-flex">
            Tout voir <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Bannière */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-8 py-16 text-white md:px-16">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-amber-600/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-80 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="relative max-w-xl">
            <p className="text-sm uppercase tracking-widest text-amber-400">Offre de bienvenue</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">-10 % sur votre première commande</h2>
            <p className="mt-4 text-stone-300">Inscrivez‑vous à la newsletter et recevez votre code instantanément.</p>
            <Newsletter dark />
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <h2 className="text-center font-serif text-3xl md:text-4xl">Ils nous font confiance</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["Sarah M.", "Le casque est incroyable, la réduction de bruit est bluffante. Livré en 2 jours !"],
            ["Yassine B.", "Le cabas en cuir est magnifique, finitions impeccables. Je recommande à 100 %."],
            ["Camille D.", "Service client au top et emballage soigné. Ma nouvelle boutique préférée."],
          ].map(([name, text]) => (
            <figure key={name} className="rounded-2xl border border-stone-200 p-8">
              <p className="text-amber-500">★★★★★</p>
              <blockquote className="mt-4 text-stone-700">“{text}”</blockquote>
              <figcaption className="mt-6 text-sm font-medium">{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
