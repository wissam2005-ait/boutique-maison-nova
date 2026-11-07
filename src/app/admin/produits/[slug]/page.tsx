import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProduct } from "@/lib/db";
import { AdminShell } from "../../admin-shell";
import { ProductForm } from "../product-form";

export default async function EditProductPage(props: PageProps<"/admin/produits/[slug]">) {
  if (!(await isAdmin())) redirect("/admin/connexion");
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return (
    <AdminShell active="produits">
      <h2 className="mb-6 text-lg font-semibold">Modifier « {product.name} »</h2>
      <ProductForm product={product} />
    </AdminShell>
  );
}
