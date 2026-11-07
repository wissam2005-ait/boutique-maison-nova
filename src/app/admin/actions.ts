"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { deleteProduct, getProducts, saveProduct, setOrderStatus, type OrderStatus } from "@/lib/db";
import { categories, type Category, type Product } from "@/lib/products";

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function login(_prev: string | null, formData: FormData) {
  if (!checkPassword(String(formData.get("password") ?? ""))) return "Mot de passe incorrect.";
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/connexion");
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export type ProductFormState = { error?: string } | null;

export async function saveProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const previousSlug = get("previousSlug") || undefined;
  const name = get("name");
  const slug = slugify(get("slug") || name);
  const price = Number(get("price").replace(",", "."));
  const compareAt = get("compareAt") ? Number(get("compareAt").replace(",", ".")) : undefined;
  const stock = Math.max(0, Math.floor(Number(get("stock") || 0)));
  const category = get("category") as Category;

  if (!name || !slug) return { error: "Le nom est obligatoire." };
  if (!(price > 0)) return { error: "Le prix doit être supérieur à 0." };
  if (!categories.some((c) => c.id === category)) return { error: "Catégorie invalide." };

  const all = await getProducts();
  if (slug !== previousSlug && all.some((p) => p.slug === slug)) {
    return { error: "Un produit avec ce lien (slug) existe déjà." };
  }
  const existing = all.find((p) => p.slug === previousSlug);

  const product: Product = {
    slug,
    name,
    category,
    price,
    compareAt: compareAt && compareAt > price ? compareAt : undefined,
    image: get("image"),
    hue: existing?.hue ?? [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7),
    rating: existing?.rating ?? 5,
    reviews: existing?.reviews ?? 0,
    stock,
    badge: get("badge") || undefined,
    featured: formData.get("featured") === "on",
    short: get("short"),
    description: get("description"),
    details: get("details").split("\n").map((d) => d.trim()).filter(Boolean),
  };

  await saveProduct(product, previousSlug);
  revalidatePath("/", "layout");
  redirect("/admin/produits");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await deleteProduct(String(formData.get("slug")));
  revalidatePath("/", "layout");
}

export async function setOrderStatusAction(formData: FormData) {
  await requireAdmin();
  await setOrderStatus(String(formData.get("id")), String(formData.get("status")) as OrderStatus);
  revalidatePath("/admin");
}
