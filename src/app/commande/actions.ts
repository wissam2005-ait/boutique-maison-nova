"use server";

import { getProduct } from "@/lib/products";
import { shippingFor } from "@/lib/config";
import { promoRate } from "@/lib/promo";

export type OrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string> }
  | { status: "success"; orderId: string; total: number; email: string; firstName: string };

const required = ["email", "firstName", "lastName", "address", "city", "zip", "country"] as const;

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const data = Object.fromEntries(
    [...required, "phone", "promo", "cart", "payment"].map((k) => [k, String(formData.get(k) ?? "").trim()]),
  );

  const fields: Record<string, string> = {};
  for (const k of required) if (!data[k]) fields[k] = "Champ obligatoire";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fields.email = "E‑mail invalide";
  if (Object.keys(fields).length) return { status: "error", message: "Merci de corriger le formulaire.", fields };

  // Les prix sont recalculés côté serveur : le client ne peut pas les modifier.
  let lines: { slug: string; qty: number }[] = [];
  try {
    lines = JSON.parse(data.cart);
  } catch {}
  const items = lines
    .map((l) => ({ product: getProduct(l.slug), qty: Math.floor(Number(l.qty)) }))
    .filter((i) => i.product && i.qty > 0 && i.product.stock > 0);
  if (!items.length) return { status: "error", message: "Votre panier est vide." };

  const subtotal = items.reduce((s, i) => s + i.product!.price * Math.min(i.qty, i.product!.stock), 0);
  const discount = Math.round(subtotal * promoRate(data.promo) * 100) / 100;
  const total = subtotal - discount + shippingFor(subtotal);
  const orderId = `MN-${Date.now().toString(36).toUpperCase()}`;

  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: `${data.address}, ${data.zip} ${data.city}, ${data.country}`,
    },
    payment: data.payment || "livraison",
    items: items.map((i) => ({ name: i.product!.name, slug: i.product!.slug, qty: i.qty, price: i.product!.price })),
    subtotal,
    discount,
    total,
  };

  // Optionnel : recevez chaque commande par e‑mail / Discord / Google Sheets
  // en définissant ORDER_WEBHOOK_URL (ex. Formspree, Make, Zapier, webhook Discord).
  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(order),
      });
    } catch (e) {
      console.error("Webhook commande échoué", e);
    }
  }
  console.log("Nouvelle commande", JSON.stringify(order));

  return { status: "success", orderId, total, email: data.email, firstName: data.firstName };
}
