import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { seedProducts, type Product } from "./products";

export type OrderStatus = "nouvelle" | "expediee" | "livree" | "annulee";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { email: string; firstName: string; lastName: string; phone: string; address: string };
  payment: string;
  items: { slug: string; name: string; price: number; qty: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

/* ------------------------------------------------------------------ */
/* Stockage : Netlify Blobs en production, fichier JSON en local.       */
/* ------------------------------------------------------------------ */

type Backend = { read<T>(key: string): Promise<T | null>; write(key: string, value: unknown): Promise<void> };

/** Netlify Blobs si le contexte Netlify est disponible (production), sinon null. */
async function netlifyBackend(): Promise<Backend | null> {
  const { getStore } = await import("@netlify/blobs");
  let store: ReturnType<typeof getStore>;
  try {
    // Le contexte Blobs est injecté par Netlify à l'exécution (variable ou globalThis).
    store = getStore({ name: "boutique", consistency: "strong" });
  } catch {
    return null; // hors Netlify (développement local)
  }
  return {
    read: async <T,>(key: string) => ((await store.get(key, { type: "json" })) as T | null) ?? null,
    write: async (key, value) => {
      await store.setJSON(key, value);
    },
  };
}

const dataDir = path.join(process.cwd(), ".data");
const fileBackend: Backend = {
  async read<T>(key: string) {
    try {
      return JSON.parse(await fs.readFile(path.join(dataDir, `${key}.json`), "utf8")) as T;
    } catch {
      return null;
    }
  },
  async write(key, value) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(path.join(dataDir, `${key}.json`), JSON.stringify(value, null, 2));
  },
};

// Résolu à chaque appel : sur Netlify, le contexte peut être fourni par requête.
async function backend(): Promise<Backend> {
  const netlify = await netlifyBackend();
  if (netlify) return netlify;
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    throw new Error("Netlify Blobs indisponible : le contexte de stockage n'a pas été fourni par Netlify.");
  }
  return fileBackend;
}

/* ------------------------------ Produits ------------------------------ */

export async function getProducts(): Promise<Product[]> {
  const b = await backend();
  const list = await b.read<Product[]>("products");
  if (list) return list;
  try {
    await b.write("products", seedProducts); // premier lancement : catalogue de démonstration
  } catch (e) {
    console.error("Impossible d'enregistrer le catalogue initial", e);
  }
  return seedProducts;
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function saveProduct(product: Product, previousSlug?: string) {
  const list = await getProducts();
  const key = previousSlug ?? product.slug;
  const idx = list.findIndex((p) => p.slug === key);
  if (idx >= 0) list[idx] = product;
  else list.unshift(product);
  await (await backend()).write("products", list);
}

export async function deleteProduct(slug: string) {
  const list = (await getProducts()).filter((p) => p.slug !== slug);
  await (await backend()).write("products", list);
}

/* ------------------------------ Commandes ------------------------------ */

export async function getOrders(): Promise<Order[]> {
  return (await (await backend()).read<Order[]>("orders")) ?? [];
}

export async function createOrder(order: Order) {
  const b = await backend();
  const orders = await getOrders();
  await b.write("orders", [order, ...orders]);

  // Décrémente le stock
  const products = await getProducts();
  for (const item of order.items) {
    const p = products.find((x) => x.slug === item.slug);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  }
  await b.write("products", products);
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const orders = await getOrders();
  const o = orders.find((x) => x.id === id);
  if (o) o.status = status;
  await (await backend()).write("orders", orders);
}

/** Diagnostic du stockage (utilisé par /api/sante). */
export async function storageHealth() {
  try {
    const b = await backend();
    const kind = b === fileBackend ? "fichiers locaux" : "Netlify Blobs";
    await b.write("healthcheck", { at: new Date().toISOString() });
    const read = await b.read<{ at: string }>("healthcheck");
    return { ok: Boolean(read), stockage: kind };
  } catch (e) {
    return { ok: false, erreur: e instanceof Error ? e.message : String(e) };
  }
}
