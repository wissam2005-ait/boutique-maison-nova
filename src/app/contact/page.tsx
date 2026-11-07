import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-5xl">Parlons‑en</h1>
        <p className="mt-4 text-lg text-stone-600">Une question sur un produit ou une commande ? Notre équipe répond sous 24 h.</p>
        <ul className="mt-10 space-y-4">
          <li className="flex items-center gap-3"><Mail className="size-5 text-amber-700" /> {siteConfig.email}</li>
          <li className="flex items-center gap-3"><Phone className="size-5 text-amber-700" /> +33 1 23 45 67 89</li>
          <li className="flex items-center gap-3"><MapPin className="size-5 text-amber-700" /> 12 rue des Artisans, 75011 Paris</li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
