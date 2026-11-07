import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { categoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import { ProductImage } from "@/components/product-image";
import { AdminShell } from "../admin-shell";
import { DeleteButton } from "./delete-button";

export const metadata: Metadata = { title: "Produits · Admin", robots: { index: false } };

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/admin/connexion");
  const products = await getProducts();
  return (
    <AdminShell active="produits">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{products.length} produits</h2>
        <Link
          href="/admin/produits/nouveau"
          className="flex h-11 items-center gap-2 rounded-full bg-stone-900 px-5 text-sm font-medium text-white hover:bg-stone-700"
        >
          <Plus className="size-4" /> Ajouter un produit
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="p-4 font-medium">Produit</th>
              <th className="p-4 font-medium">Catégorie</th>
              <th className="p-4 font-medium">Prix</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.slug}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <ProductImage product={p} className="size-12 shrink-0 rounded-lg" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      {p.featured && <p className="text-xs text-amber-700">★ Coup de cœur</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-stone-600">{categoryLabel(p.category)}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className={`p-4 font-medium ${p.stock === 0 ? "text-red-600" : p.stock < 5 ? "text-amber-700" : ""}`}>
                  {p.stock}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/produits/${p.slug}`}
                      className="grid size-9 place-items-center rounded-full hover:bg-stone-100"
                      aria-label={`Modifier ${p.name}`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton slug={p.slug} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
