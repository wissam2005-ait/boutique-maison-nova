import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminShell } from "../../admin-shell";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/connexion");
  return (
    <AdminShell active="produits">
      <h2 className="mb-6 text-lg font-semibold">Nouveau produit</h2>
      <ProductForm />
    </AdminShell>
  );
}
