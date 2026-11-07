"use client";

import { Trash2 } from "lucide-react";
import { deleteProductAction } from "../actions";

export function DeleteButton({ slug, name }: { slug: string; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Supprimer « ${name} » ?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button className="grid size-9 place-items-center rounded-full text-stone-500 hover:bg-red-50 hover:text-red-600" aria-label={`Supprimer ${name}`}>
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
