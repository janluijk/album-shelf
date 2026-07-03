"use client";

type StarRatingProps = {
  value: number | null;
  onChange?: (value: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(star)}
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
            className={`text-lg leading-none ${
              filled ? "text-[var(--accent)]" : "text-[var(--card-border)]"
            } ${onChange ? "cursor-pointer hover:text-[var(--accent)]" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
