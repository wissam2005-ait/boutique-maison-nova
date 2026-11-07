"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductImage } from "./product-image";
import { Quantity } from "./quantity";
import { formatPrice, siteConfig } from "@/lib/config";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();
  const remaining = siteConfig.freeShippingThreshold - subtotal;
  const progress = Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Panier"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <h2 className="text-lg font-semibold">Votre panier</h2>
          <button onClick={close} aria-label="Fermer" className="rounded-full p-2 hover:bg-stone-100">
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-stone-100">
              <ShoppingBag className="size-7 text-stone-400" />
            </div>
            <p className="text-stone-500">Votre panier est vide.</p>
            <Link href="/boutique" onClick={close} className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-stone-200 px-6 py-4 text-sm">
              {remaining > 0 ? (
                <p>
                  Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison offerte
                </p>
              ) : (
                <p className="text-emerald-700">🎉 Livraison offerte !</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-6">
              {items.map(({ product, qty, slug }) => (
                <li key={slug} className="flex gap-4 py-5">
                  <ProductImage product={product} className="size-24 shrink-0 rounded-xl" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/produit/${slug}`} onClick={close} className="font-medium hover:underline">
                        {product.name}
                      </Link>
                      <button onClick={() => remove(slug)} aria-label="Retirer" className="text-stone-400 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-500">{formatPrice(product.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <Quantity value={qty} onChange={(v) => setQty(slug, v)} max={product.stock} />
                      <span className="font-semibold">{formatPrice(product.price * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-stone-200 p-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Sous‑total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/commande"
                onClick={close}
                className="flex h-12 items-center justify-center rounded-full bg-stone-900 font-medium text-white transition hover:bg-stone-700"
              >
                Passer commande
              </Link>
              <Link href="/panier" onClick={close} className="block text-center text-sm text-stone-500 underline-offset-4 hover:underline">
                Voir le panier
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
