import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "./shop-grid";

export const metadata: Metadata = { title: "Boutique" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl md:text-5xl">La boutique</h1>
      <p className="mt-2 text-stone-500">Des objets choisis avec soin, pour chaque moment de votre journée.</p>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-2xl bg-stone-100" />}>
        <ShopGrid />
      </Suspense>
    </div>
  );
}
