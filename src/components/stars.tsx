import { Star } from "lucide-react";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1 text-sm text-stone-500">
      <div className="flex" aria-label={`Note ${rating} sur 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3.5 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
          />
        ))}
      </div>
      <span>{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews})</span>}
    </div>
  );
}
