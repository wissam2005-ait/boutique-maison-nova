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

const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);

async function netlifyBackend(): Promise<Backend> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: "boutique", consistency: "strong" });
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

let backendPromise: Promise<Backend> | null = null;
function backend() {
  backendPromise ??= onNetlify ? netlifyBackend() : Promise.resolve(fileBackend);
  return backendPromise;
}

/* ------------------------------ Produits ------------------------------ */

export async function getProducts(): Promise<Product[]> {
  const b = await backend();
  const list = await b.read<Product[]>("products");
  if (list) return list;
  await b.write("products", seedProducts); // premier lancement : catalogue de démonstration
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
