"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent)
    return <div className="rounded-3xl bg-stone-50 p-10 text-center text-lg">Merci ! Nous revenons vers vous très vite.</div>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
          `Contact — ${f.get("name")}`,
        )}&body=${encodeURIComponent(String(f.get("message")))}`;
        setSent(true);
      }}
      className="space-y-4 rounded-3xl bg-stone-50 p-8"
    >
      <input name="name" required placeholder="Votre nom" className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 outline-none focus:border-stone-900" />
      <input name="email" type="email" required placeholder="Votre e‑mail" className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 outline-none focus:border-stone-900" />
      <textarea name="message" required rows={6} placeholder="Votre message" className="w-full rounded-xl border border-stone-300 bg-white p-4 outline-none focus:border-stone-900" />
      <button className="h-12 w-full rounded-full bg-stone-900 font-medium text-white hover:bg-stone-700">Envoyer</button>
    </form>
  );
}
