"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/config";
import { promoRate } from "@/lib/promo";
import { placeOrder, type OrderState } from "./actions";

function Field({
  name,
  label,
  type = "text",
  error,
  className = "",
  autoComplete,
  optional,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">
        {label} {optional && <span className="font-normal text-stone-400">(optionnel)</span>}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={!optional}
        className={`h-12 w-full rounded-xl border px-4 outline-none transition focus:border-stone-900 ${
          error ? "border-red-500" : "border-stone-300"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function CheckoutForm() {
  const { items, subtotal, shipping, clear, ready } = useCart();
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, { status: "idle" });
  const [promo, setPromo] = useState("");
  const rate = promoRate(promo);
  const discount = Math.round(subtotal * rate * 100) / 100;

  useEffect(() => {
    if (state.status === "success") clear();
  }, [state, clear]);

  if (state.status === "success") {
    return (
      <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-stone-200 p-10 text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
        <h2 className="mt-4 font-serif text-3xl">Merci {state.firstName} !</h2>
        <p className="mt-3 text-stone-600">
          Votre commande <strong>{state.orderId}</strong> d&apos;un montant de <strong>{formatPrice(state.total)}</strong> est
          confirmée. Un récapitulatif sera envoyé à {state.email}.
        </p>
        <Link href="/boutique" className="mt-8 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (ready && items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-500">Votre panier est vide.</p>
        <Link href="/boutique" className="mt-6 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  const err = state.status === "error" ? state.fields ?? {} : {};

  return (
    <form action={action} className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
      <input type="hidden" name="cart" value={JSON.stringify(items.map(({ slug, qty }) => ({ slug, qty })))} />
      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-lg font-semibold">1. Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="email" label="E‑mail" type="email" autoComplete="email" error={err.email} />
            <Field name="phone" label="Téléphone" type="tel" autoComplete="tel" optional />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold">2. Livraison</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="firstName" label="Prénom" autoComplete="given-name" error={err.firstName} />
            <Field name="lastName" label="Nom" autoComplete="family-name" error={err.lastName} />
            <Field name="address" label="Adresse" autoComplete="street-address" error={err.address} className="sm:col-span-2" />
            <Field name="zip" label="Code postal" autoComplete="postal-code" error={err.zip} />
            <Field name="city" label="Ville" autoComplete="address-level2" error={err.city} />
            <Field name="country" label="Pays" autoComplete="country-name" error={err.country} className="sm:col-span-2" />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold">3. Paiement</h2>
          <div className="space-y-3">
            {[
              ["livraison", "Paiement à la livraison", "Réglez en espèces ou par carte à la réception."],
              ["virement", "Virement bancaire", "Les coordonnées vous seront envoyées par e‑mail."],
            ].map(([v, t, d], i) => (
              <label key={v} className="flex cursor-pointer gap-3 rounded-xl border border-stone-300 p-4 has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50">
                <input type="radio" name="payment" value={v} defaultChecked={i === 0} className="mt-1 accent-stone-900" />
                <span>
                  <span className="block font-medium">{t}</span>
                  <span className="text-sm text-stone-500">{d}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-3xl bg-stone-50 p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">Récapitulatif</h2>
        <ul className="mt-4 divide-y divide-stone-200">
          {items.map(({ product, qty, slug }) => (
            <li key={slug} className="flex items-center gap-3 py-3">
              <div className="relative">
                <ProductImage product={product} className="size-16 rounded-lg" />
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-stone-900 text-[10px] text-white">
                  {qty}
                </span>
              </div>
              <span className="flex-1 text-sm">{product.name}</span>
              <span className="text-sm font-medium">{formatPrice(product.price * qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            name="promo"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Code promo"
            className="h-11 flex-1 rounded-xl border border-stone-300 bg-white px-4 text-sm uppercase outline-none focus:border-stone-900"
          />
        </div>
        {promo && (
          <p className={`mt-2 text-xs ${rate ? "text-emerald-700" : "text-stone-500"}`}>
            {rate ? `Code appliqué : -${rate * 100} %` : "Code non reconnu (essayez BIENVENUE10)"}
          </p>
        )}
        <dl className="mt-6 space-y-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between"><dt>Sous‑total</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Réduction</dt><dd>-{formatPrice(discount)}</dd></div>}
          <div className="flex justify-between"><dt>Livraison</dt><dd>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd></div>
          <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal - discount + shipping)}</dd>
          </div>
        </dl>
        {state.status === "error" && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}
        <button
          disabled={pending || !ready}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-900 font-medium text-white transition hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          Confirmer la commande
        </button>
      </aside>
    </form>
  );
}
