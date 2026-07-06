"use client";

type StarRatingProps = {
  value: number | null;
  onChange?: (value: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const showBadge = value !== null && !Number.isInteger(value * 2);
  return (
    <div
      role={onChange ? undefined : "img"}
      aria-label={
        onChange
          ? undefined
          : value === null
            ? "Not rated"
            : `Rated ${value} out of 5`
      }
      className="flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fillFraction =
          value === null ? 0 : Math.min(Math.max(value - star + 1, 0), 1);
        return (
          <span key={star} className="relative text-lg leading-none">
            <span aria-hidden className="text-[var(--card-border)]">
              ★
            </span>
            <span
              aria-hidden
              className="absolute inset-0 overflow-hidden text-[var(--accent)]"
              style={{ width: `${fillFraction * 100}%` }}
            >
              ★
            </span>
            {onChange && (
              <>
                <button
                  type="button"
                  onClick={() => onChange(star - 0.5)}
                  aria-label={`Rate ${star - 0.5} stars`}
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => onChange(star)}
                  aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                  className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                />
              </>
            )}
          </span>
        );
      })}
      {showBadge && (
        <span className="ml-1 text-xs text-[var(--muted)]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
