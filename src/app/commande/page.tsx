import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Commande" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl">Finaliser la commande</h1>
      <CheckoutForm />
    </div>
  );
}
