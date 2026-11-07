"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { siteConfig, formatPrice } from "@/lib/config";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count, open, ready } = useCart();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur-xl">
      <div className="bg-stone-900 py-2 text-center text-xs text-stone-100">
        Livraison offerte dès {formatPrice(siteConfig.freeShippingThreshold)} · Retours gratuits sous 30 jours
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button className="md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menu">
          {menu ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        <Link href="/" className="font-serif text-2xl tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm transition hover:text-stone-900 ${
                pathname === n.href ? "font-medium text-stone-900" : "text-stone-500"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={open}
          className="relative grid size-10 place-items-center rounded-full transition hover:bg-stone-100"
          aria-label={`Panier (${count} articles)`}
        >
          <ShoppingBag className="size-5" />
          {ready && count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
      {menu && (
        <nav className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="block py-2 text-lg">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
