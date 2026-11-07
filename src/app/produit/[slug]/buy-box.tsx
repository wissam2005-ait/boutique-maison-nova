"use client";

import { useState } from "react";
import { Quantity } from "@/components/quantity";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function BuyBox({ slug, stock }: { slug: string; stock: number }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-8 flex items-center gap-4">
      {stock > 0 && <Quantity value={qty} onChange={(v) => setQty(Math.max(1, v))} max={stock} />}
      <div className="flex-1">
        <AddToCartButton slug={slug} qty={qty} disabled={stock === 0} />
      </div>
    </div>
  );
}
