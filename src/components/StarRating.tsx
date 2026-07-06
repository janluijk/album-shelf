"use client";

import { useState } from "react";
import { isValidRating } from "@/lib/albums";
import type { RatingGranularity } from "@/lib/ratings";

type StarRatingProps = {
  value: number | null;
  onChange?: (value: number) => void;
  mode?: RatingGranularity;
};

function StarShape({ fill }: { fill: number }) {
  return (
    <span className="relative inline-block text-lg leading-none text-[var(--card-border)]">
      ★
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-[var(--accent)]"
        style={{ width: `${fill * 100}%` }}
      >
        ★
      </span>
    </span>
  );
}

export default function StarRating({
  value,
  onChange,
  mode = "integer",
}: StarRatingProps) {
  const [showInput, setShowInput] = useState(false);
  const display = value ?? 0;
  const stars = [1, 2, 3, 4, 5];
  const fillOf = (star: number) => Math.max(0, Math.min(1, display - (star - 1)));

  if (!onChange) {
    return (
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={value === null ? "Not rated" : `Rated ${value} out of 5`}
      >
        {stars.map((star) => (
          <StarShape key={star} fill={fillOf(star)} />
        ))}
      </div>
    );
  }

  if (mode === "decimal") {
    return (
      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setShowInput(true)}
        onMouseLeave={() => setShowInput(false)}
        onFocus={() => setShowInput(true)}
        onBlur={() => setShowInput(false)}
      >
        <div className="flex items-center gap-0.5">
          {stars.map((star) => (
            <StarShape key={star} fill={fillOf(star)} />
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={5}
          step={0.1}
          defaultValue={value ?? undefined}
          aria-label="Rating from 1.0 to 5.0"
          onChange={(event) => {
            const next = parseFloat(event.target.value);
            if (isValidRating(next)) onChange(next);
          }}
          className={`w-16 rounded border border-[var(--card-border)] bg-transparent px-1 py-0.5 text-xs outline-none focus:border-[var(--accent)] ${
            showInput ? "" : "sr-only"
          }`}
        />
      </div>
    );
  }

  if (mode === "half") {
    return (
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <span
            key={star}
            className="relative inline-block text-lg leading-none text-[var(--card-border)]"
          >
            ★
            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-[var(--accent)]"
              style={{ width: `${fillOf(star) * 100}%` }}
            >
              ★
            </span>
            <button
              type="button"
              aria-label={`Rate ${star - 0.5} stars`}
              onClick={() => onChange(star - 0.5)}
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
            />
            <button
              type="button"
              aria-label={`Rate ${star} stars`}
              onClick={() => onChange(star)}
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
            />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          className={`cursor-pointer text-lg leading-none hover:text-[var(--accent)] ${
            star <= display ? "text-[var(--accent)]" : "text-[var(--card-border)]"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
