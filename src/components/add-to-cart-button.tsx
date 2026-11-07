"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/products";

export function AddToCartButton({
  product,
  disabled,
  qty = 1,
  compact,
}: {
  product: Product;
  disabled?: boolean;
  qty?: number;
  compact?: boolean;
}) {
  const { add } = useCart();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        add(product, qty);
      }}
      className={
        compact
          ? "grid size-10 place-items-center rounded-full bg-white/95 text-stone-900 shadow-lg backdrop-blur transition hover:bg-stone-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          : "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      }
      aria-label={compact ? "Ajouter au panier" : undefined}
    >
      <ShoppingBag className="size-4" />
      {!compact && (disabled ? "Rupture de stock" : "Ajouter au panier")}
    </button>
  );
}
