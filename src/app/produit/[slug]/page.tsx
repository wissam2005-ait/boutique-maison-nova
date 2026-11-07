import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, RotateCcw, Truck } from "lucide-react";
import { connection } from "next/server";
import { categoryLabel } from "@/lib/products";
import { getProduct, getProducts } from "@/lib/db";
import { formatPrice, siteConfig } from "@/lib/config";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/product-card";
import { Stars } from "@/components/stars";
import { BuyBox } from "./buy-box";

export async function generateMetadata(props: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.short,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage(props: PageProps<"/produit/[slug]">) {
  await connection();
  const { slug } = await props.params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const more = related.length ? related : products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-900">Accueil</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/boutique?categorie=${product.category}`} className="hover:text-stone-900">
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="group">
          <ProductImage product={product} className="aspect-square rounded-3xl" />
        </div>
        <div className="md:py-6">
          <p className="text-sm uppercase tracking-wider text-stone-500">{categoryLabel(product.category)}</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-3">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-stone-400 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </p>
          <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>

          <p className={`mt-6 text-sm font-medium ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-amber-700" : "text-emerald-700"}`}>
            {product.stock === 0
              ? "Rupture de stock"
              : product.stock < 10
                ? `Plus que ${product.stock} en stock — commandez vite`
                : "En stock, expédié sous 48 h"}
          </p>

          <BuyBox product={product} />

          <ul className="mt-8 space-y-2 border-t border-stone-200 pt-8 text-sm">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" /> {d}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3 rounded-2xl bg-stone-50 p-4">
              <Truck className="size-5 shrink-0 text-amber-700" />
              <span>Livraison offerte dès {formatPrice(siteConfig.freeShippingThreshold)}</span>
            </div>
            <div className="flex gap-3 rounded-2xl bg-stone-50 p-4">
              <RotateCcw className="size-5 shrink-0 text-amber-700" />
              <span>Retours gratuits sous 30 jours</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-serif text-3xl">Vous aimerez aussi</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {more.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
