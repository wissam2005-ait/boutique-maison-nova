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
    email: data.email,
    nom: `${data.firstName} ${data.lastName}`,
    telephone: data.phone,
    adresse: `${data.address}, ${data.zip} ${data.city}, ${data.country}`,
    paiement: data.payment || "livraison",
    articles: items.map((i) => `${i.qty} × ${i.product!.name} (${i.product!.price} €)`).join(" | "),
    sousTotal: subtotal,
    reduction: discount,
    total,
  };

  // Pour recevoir chaque commande par e‑mail gratuitement : créez un formulaire
  // sur formspree.io et définissez NEXT_PUBLIC_ORDER_WEBHOOK_URL
  // (ex. https://formspree.io/f/xxxxxxx) dans les variables d'environnement.
  const webhook = process.env.NEXT_PUBLIC_ORDER_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      return { status: "error", message: "La commande n'a pas pu être envoyée. Réessayez dans un instant." };
    }
  } else {
    console.info("Commande (aucun NEXT_PUBLIC_ORDER_WEBHOOK_URL défini) :", order);
  }

  return { status: "success", orderId, total, email: data.email, firstName: data.firstName };
}
