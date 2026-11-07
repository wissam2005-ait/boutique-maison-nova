"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, type Category, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const sorts = {
  pertinence: "Pertinence",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  note: "Mieux notés",
} as const;
type Sort = keyof typeof sorts;

export function ShopGrid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = (params.get("categorie") as Category | null) ?? null;
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("pertinence");
  const [inStock, setInStock] = useState(false);

  const setCategory = (c: Category | null) => {
    const next = new URLSearchParams(params);
    if (c) next.set("categorie", c);
    else next.delete("categorie");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!inStock || p.stock > 0) &&
        (!q || `${p.name} ${p.short}`.toLowerCase().includes(q)),
    );
    const sorted = [...filtered];
    if (sort === "prix-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "note") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, category, query, sort, inStock]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition ${
      active ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 hover:border-stone-900"
    }`;

  return (
    <>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <button className={chip(!category)} onClick={() => setCategory(null)}>
          Tout
        </button>
        {categories.map((c) => (
          <button key={c.id} className={chip(category === c.id)} onClick={() => setCategory(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-y border-stone-200 py-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="h-11 w-full rounded-full border border-stone-300 pl-11 pr-4 outline-none focus:border-stone-900"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="size-4 accent-stone-900" />
          En stock uniquement
        </label>
        <label className="flex items-center gap-2 text-sm">
          <SlidersHorizontal className="size-4" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-900"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-stone-500">{list.length} produit{list.length > 1 ? "s" : ""}</p>
      {list.length === 0 ? (
        <div className="py-24 text-center text-stone-500">Aucun produit ne correspond à votre recherche.</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
