import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion admin", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-serif text-3xl">Espace administrateur</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
          L&apos;administration est désactivée. Définissez la variable d&apos;environnement{" "}
          <code className="font-mono font-semibold">ADMIN_PASSWORD</code> (Netlify → Configuration du projet → Variables
          d&apos;environnement), puis redéployez.
        </p>
      )}
    </div>
  );
}
