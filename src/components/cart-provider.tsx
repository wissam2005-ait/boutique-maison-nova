"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/products";
import { shippingFor } from "@/lib/config";

export type CartLine = { slug: string; qty: number };
type CartItem = CartLine & { product: Product };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  ready: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "maison-nova-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    const product = getProduct(slug);
    if (!product || product.stock === 0) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, product.stock) } : l,
        );
      }
      return [...prev, { slug, qty: Math.min(qty, product.stock) }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const product = getProduct(slug);
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, product?.stock ?? qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((l) => ({ ...l, product: getProduct(l.slug) }))
      .filter((i): i is CartItem => Boolean(i.product));
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const shipping = shippingFor(subtotal);
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      ready,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, isOpen, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
