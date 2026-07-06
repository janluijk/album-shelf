export const RATING_GRANULARITIES = ["integer", "half", "decimal"] as const;

export type RatingGranularity = (typeof RATING_GRANULARITIES)[number];

export const GRANULARITY_LABELS: Record<RatingGranularity, string> = {
  integer: "Whole stars",
  half: "Half stars",
  decimal: "Decimal (1.0–5.0)",
};

export function isValidGranularity(value: unknown): value is RatingGranularity {
  return (
    typeof value === "string" &&
    (RATING_GRANULARITIES as readonly string[]).includes(value)
  );
}
