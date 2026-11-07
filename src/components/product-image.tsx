"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  const emoji = categories.find((c) => c.id === product.category)?.emoji;
  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${product.hue} 45% 88%), hsl(${product.hue + 30} 35% 78%))`,
      }}
    >
      {failed ? (
        <div className="absolute inset-0 grid place-items-center text-6xl" aria-hidden>
          {emoji}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}
    </div>
  );
}
