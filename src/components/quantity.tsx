"use client";

import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-stone-300">
      <button
        type="button"
        className="grid size-9 place-items-center rounded-full hover:bg-stone-100"
        onClick={() => onChange(value - 1)}
        aria-label="Diminuer"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        className="grid size-9 place-items-center rounded-full hover:bg-stone-100 disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Augmenter"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
