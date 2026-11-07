import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-amber-700">Notre histoire</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight">Moins, mais mieux.</h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-stone-600">
        <p>
          {siteConfig.name} est née d&apos;une conviction simple : les objets qui nous entourent méritent d&apos;être beaux,
          utiles et durables. Nous sélectionnons chaque pièce auprès d&apos;artisans et de marques engagées.
        </p>
        <p>
          Matériaux nobles, fabrication responsable, emballages recyclés : nous préférons une pièce que vous garderez
          dix ans à dix pièces que vous jetterez demain.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-6 border-y border-stone-200 py-10 text-center">
        {[["2019", "création"], ["120+", "artisans partenaires"], ["98 %", "clients satisfaits"]].map(([v, l]) => (
          <div key={l}>
            <p className="font-serif text-4xl">{v}</p>
            <p className="text-sm text-stone-500">{l}</p>
          </div>
        ))}
      </div>
      <Link href="/boutique" className="mt-12 inline-flex h-12 items-center rounded-full bg-stone-900 px-7 font-medium text-white">
        Découvrir la collection
      </Link>
    </div>
  );
}
