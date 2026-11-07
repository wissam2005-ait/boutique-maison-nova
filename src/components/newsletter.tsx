"use client";

import { useState } from "react";

export function Newsletter({ dark }: { dark?: boolean }) {
  const [done, setDone] = useState(false);
  if (done)
    return (
      <p className="mt-8 rounded-2xl bg-white/10 px-5 py-4 text-sm">
        Merci ! Votre code : <strong className="tracking-widest">BIENVENUE10</strong>
      </p>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="mt-8 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        placeholder="votre@email.com"
        aria-label="Adresse e‑mail"
        className={`h-12 flex-1 rounded-full px-5 outline-none ring-amber-500 focus:ring-2 ${
          dark ? "bg-white/10 text-white placeholder:text-stone-400" : "border border-stone-300"
        }`}
      />
      <button className="h-12 rounded-full bg-amber-600 px-7 font-medium text-white transition hover:bg-amber-500">
        Je m&apos;inscris
      </button>
    </form>
  );
}
