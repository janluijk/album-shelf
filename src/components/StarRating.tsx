"use client";

type StarRatingProps = {
  value: number | null;
  onChange?: (value: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const isFractional = value !== null && !Number.isInteger(value);
  return (
    <div className="flex items-center gap-0.5">
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
      {isFractional && (
        <span className="ml-1 text-xs text-[var(--muted)]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
