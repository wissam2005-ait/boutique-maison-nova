"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { categories, type Product } from "@/lib/products";
import { saveProductAction } from "../actions";

const input = "h-11 w-full rounded-xl border border-stone-300 bg-white px-4 outline-none focus:border-stone-900";

function L({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProductAction, null);
  return (
    <form action={action} className="grid max-w-3xl gap-5 sm:grid-cols-2">
      {product && <input type="hidden" name="previousSlug" value={product.slug} />}
      <L label="Nom du produit *" className="sm:col-span-2">
        <input name="name" required defaultValue={product?.name} className={input} />
      </L>
      <L label="Catégorie *">
        <select name="category" defaultValue={product?.category ?? categories[0].id} className={input}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </L>
      <L label="Lien (slug) — laissez vide pour le générer">
        <input name="slug" defaultValue={product?.slug} placeholder="mon-produit" className={input} />
      </L>
      <L label="Prix (€) *">
        <input name="price" required inputMode="decimal" defaultValue={product?.price} className={input} />
      </L>
      <L label="Prix barré (€)">
        <input name="compareAt" inputMode="decimal" defaultValue={product?.compareAt} className={input} />
      </L>
      <L label="Stock *">
        <input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 10} className={input} />
      </L>
      <L label="Badge (ex. Nouveau, -20 %)">
        <input name="badge" defaultValue={product?.badge} className={input} />
      </L>
      <L label="URL de l'image" className="sm:col-span-2">
        <input name="image" type="url" defaultValue={product?.image} placeholder="https://…" className={input} />
      </L>
      <L label="Accroche courte" className="sm:col-span-2">
        <input name="short" defaultValue={product?.short} className={input} />
      </L>
      <L label="Description" className="sm:col-span-2">
        <textarea name="description" rows={4} defaultValue={product?.description} className={`${input} h-auto py-3`} />
      </L>
      <L label="Caractéristiques (une par ligne)" className="sm:col-span-2">
        <textarea name="details" rows={4} defaultValue={product?.details.join("\n")} className={`${input} h-auto py-3`} />
      </L>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-stone-900" />
        Afficher dans les « coups de cœur » de l&apos;accueil
      </label>
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <button
          disabled={pending}
          className="flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 font-medium text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />} Enregistrer
        </button>
        <Link href="/admin/produits" className="flex h-12 items-center rounded-full border border-stone-300 px-7 font-medium">
          Annuler
        </Link>
      </div>
    </form>
  );
}
