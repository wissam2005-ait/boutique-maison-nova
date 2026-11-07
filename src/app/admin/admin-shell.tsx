import Link from "next/link";
import { LayoutDashboard, LogOut, Package, Store } from "lucide-react";
import { logout } from "./actions";

export function AdminShell({ children, active }: { children: React.ReactNode; active: "commandes" | "produits" }) {
  const tab = (on: boolean) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${on ? "bg-stone-900 text-white" : "hover:bg-stone-100"}`;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-700">Administration</p>
          <h1 className="font-serif text-3xl">Tableau de bord</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href="/admin" className={tab(active === "commandes")}>
            <LayoutDashboard className="size-4" /> Commandes
          </Link>
          <Link href="/admin/produits" className={tab(active === "produits")}>
            <Package className="size-4" /> Produits
          </Link>
          <Link href="/" className={tab(false)}>
            <Store className="size-4" /> Voir la boutique
          </Link>
          <form action={logout}>
            <button className={tab(false)}>
              <LogOut className="size-4" /> Déconnexion
            </button>
          </form>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
