"use client";

import { useState } from "react";
import { Quantity } from "@/components/quantity";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/products";

export function BuyBox({ product }: { product: Product }) {
  const { stock } = product;
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-8 flex items-center gap-4">
      {stock > 0 && <Quantity value={qty} onChange={(v) => setQty(Math.max(1, v))} max={stock} />}
      <div className="flex-1">
        <AddToCartButton product={product} qty={qty} disabled={stock === 0} />
      </div>
    </div>
  );
}
