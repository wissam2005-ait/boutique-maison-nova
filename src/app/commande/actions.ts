"use server";

import { revalidatePath } from "next/cache";
import { createOrder, getProducts, type Order } from "@/lib/db";
import { shippingFor } from "@/lib/config";
import { promoRate } from "@/lib/promo";

export type OrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string> }
  | { status: "success"; orderId: string; total: number; email: string; firstName: string };

const required = ["email", "firstName", "lastName", "address", "city", "zip", "country"] as const;

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const data = Object.fromEntries(
    [...required, "phone", "promo", "cart", "payment"].map((k) => [k, String(formData.get(k) ?? "").trim().slice(0, 500)]),
  );

  const fields: Record<string, string> = {};
  for (const k of required) if (!data[k]) fields[k] = "Champ obligatoire";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fields.email = "E‑mail invalide";
  if (Object.keys(fields).length) return { status: "error", message: "Merci de corriger le formulaire.", fields };

  let lines: { slug: string; qty: number }[] = [];
  try {
    lines = JSON.parse(data.cart);
  } catch {}

  // Prix et stocks relus depuis la base : le navigateur ne peut pas les modifier.
  const catalogue = await getProducts();
  const items: Order["items"] = [];
  for (const line of Array.isArray(lines) ? lines : []) {
    const product = catalogue.find((p) => p.slug === line.slug);
    const qty = Math.floor(Number(line.qty));
    if (!product || !(qty > 0)) continue;
    if (product.stock < qty) {
      return {
        status: "error",
        message: product.stock === 0
          ? `« ${product.name} » n'est plus en stock. Retirez‑le du panier.`
          : `Il ne reste que ${product.stock} « ${product.name} ». Ajustez la quantité.`,
      };
    }
    items.push({ slug: product.slug, name: product.name, price: product.price, qty });
  }
  if (!items.length) return { status: "error", message: "Votre panier est vide." };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * promoRate(data.promo) * 100) / 100;
  const shipping = shippingFor(subtotal);
  const order: Order = {
    id: `MN-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "nouvelle",
    customer: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: `${data.address}, ${data.zip} ${data.city}, ${data.country}`,
    },
    payment: data.payment === "virement" ? "virement" : "livraison",
    items,
    subtotal,
    discount,
    shipping,
    total: Math.round((subtotal - discount + shipping) * 100) / 100,
  };

  await createOrder(order);

  // Optionnel : notification e‑mail / Discord / Google Sheets (Formspree, Make, Zapier…)
  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(order),
    }).catch((e) => console.error("Webhook commande échoué", e));
  }

  revalidatePath("/", "layout");
  return { status: "success", orderId: order.id, total: order.total, email: data.email, firstName: data.firstName };
}
