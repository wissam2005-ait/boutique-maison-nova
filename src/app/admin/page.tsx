import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrders, getProducts, type OrderStatus } from "@/lib/db";
import { formatPrice } from "@/lib/config";
import { AdminShell } from "./admin-shell";
import { setOrderStatusAction } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const statusLabels: Record<OrderStatus, [string, string]> = {
  nouvelle: ["Nouvelle", "bg-amber-100 text-amber-800"],
  expediee: ["Expédiée", "bg-sky-100 text-sky-800"],
  livree: ["Livrée", "bg-emerald-100 text-emerald-800"],
  annulee: ["Annulée", "bg-stone-200 text-stone-600"],
};

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/connexion");
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);
  const valid = orders.filter((o) => o.status !== "annulee");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 5);

  const stats = [
    ["Chiffre d'affaires", formatPrice(revenue)],
    ["Commandes", String(valid.length)],
    ["À traiter", String(orders.filter((o) => o.status === "nouvelle").length)],
    ["Panier moyen", formatPrice(valid.length ? revenue / valid.length : 0)],
  ];

  return (
    <AdminShell active="commandes">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-stone-200 p-5">
            <p className="text-sm text-stone-500">{l}</p>
            <p className="mt-1 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ Stock faible : {lowStock.map((p) => `${p.name} (${p.stock})`).join(", ")}
        </p>
      )}

      <h2 className="mt-10 text-lg font-semibold">Commandes</h2>
      {orders.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-stone-50 p-8 text-center text-stone-500">Aucune commande pour le moment.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((o) => {
            const [label, cls] = statusLabels[o.status];
            return (
              <details key={o.id} className="group rounded-2xl border border-stone-200 open:shadow-sm">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-6 gap-y-2 p-5">
                  <span className="font-mono text-sm font-semibold">{o.id}</span>
                  <span className="text-sm text-stone-500">
                    {new Date(o.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  <span className="flex-1 text-sm">
                    {o.customer.firstName} {o.customer.lastName}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                </summary>
                <div className="grid gap-6 border-t border-stone-200 p-5 text-sm md:grid-cols-3">
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="mt-1 text-stone-600">
                      {o.customer.email}
                      <br />
                      {o.customer.phone || "—"}
                      <br />
                      {o.customer.address}
                    </p>
                    <p className="mt-2 text-stone-600">Paiement : {o.payment === "virement" ? "virement" : "à la livraison"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Articles</p>
                    <ul className="mt-1 space-y-1 text-stone-600">
                      {o.items.map((i) => (
                        <li key={i.slug}>
                          {i.qty} × {i.name} — {formatPrice(i.price * i.qty)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-stone-600">
                      {o.discount > 0 && <>Réduction : -{formatPrice(o.discount)} · </>}
                      Livraison : {o.shipping ? formatPrice(o.shipping) : "offerte"}
                    </p>
                  </div>
                  <form key={o.status} action={setOrderStatusAction} className="flex items-start gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="h-10 flex-1 rounded-xl border border-stone-300 bg-white px-3"
                    >
                      {Object.entries(statusLabels).map(([v, [l]]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <button className="h-10 rounded-xl bg-stone-900 px-4 text-white hover:bg-stone-700">Mettre à jour</button>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
