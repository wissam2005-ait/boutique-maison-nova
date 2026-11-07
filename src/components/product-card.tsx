import Link from "next/link";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import { ProductImage } from "./product-image";
import { AddToCartButton } from "./add-to-cart-button";
import { Stars } from "./stars";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative">
        <ProductImage product={product} className="aspect-[4/5] rounded-2xl" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm">
            {product.badge}
          </span>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
            Épuisé
          </span>
        )}
        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <AddToCartButton slug={product.slug} disabled={soldOut} compact />
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-wider text-stone-500">{categoryLabel(product.category)}</p>
        <h3 className="font-medium text-stone-900">{product.name}</h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="flex items-baseline gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-stone-400 line-through">{formatPrice(product.compareAt)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
