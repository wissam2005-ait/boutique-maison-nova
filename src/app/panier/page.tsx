"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductImage } from "@/components/product-image";
import { Quantity } from "@/components/quantity";
import { formatPrice } from "@/lib/config";

export default function CartPage() {
  const { items, subtotal, shipping, total, setQty, remove, ready } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Mon panier</h1>
      {!ready ? (
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-stone-100" />
      ) : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-stone-500">Votre panier est vide.</p>
          <Link href="/boutique" className="mt-6 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {items.map(({ product, qty, slug }) => (
              <li key={slug} className="flex gap-6 py-6">
                <Link href={`/produit/${slug}`} className="group">
                  <ProductImage product={product} className="size-28 rounded-2xl sm:size-32" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/produit/${slug}`} className="font-medium hover:underline">{product.name}</Link>
                      <p className="text-sm text-stone-500">{product.short}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(product.price * qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <Quantity value={qty} onChange={(v) => setQty(slug, v)} max={product.stock} />
                    <button onClick={() => remove(slug)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600">
                      <Trash2 className="size-4" /> Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-3xl bg-stone-50 p-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt>Sous‑total</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Livraison</dt><dd>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            <Link href="/commande" className="mt-6 flex h-12 items-center justify-center rounded-full bg-stone-900 font-medium text-white hover:bg-stone-700">
              Passer commande
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
