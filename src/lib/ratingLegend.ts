export type LegendInterval = {
  min: number;
  max: number;
  label: string;
};

export const legendMaxIntervals = 10;
export const legendLabelMaxLength = 60;

function isValidBound(value: unknown): value is number {
  return (
    typeof value === "number" &&
    value >= 1 &&
    value <= 5 &&
    Math.round(value * 10) / 10 === value
  );
}

function isWellFormedInterval(entry: unknown): entry is LegendInterval {
  if (typeof entry !== "object" || entry === null) return false;
  const { min, max, label } = entry as Record<string, unknown>;
  return (
    isValidBound(min) &&
    isValidBound(max) &&
    min <= max &&
    typeof label === "string" &&
    label.trim().length > 0 &&
    label.length <= legendLabelMaxLength
  );
}

export function isValidLegend(value: unknown): value is LegendInterval[] {
  if (!Array.isArray(value) || value.length > legendMaxIntervals) return false;
  if (!value.every(isWellFormedInterval)) return false;
  const sorted = [...value].sort((a, b) => a.min - b.min);
  return sorted.every(
    (entry, index) => index === 0 || entry.min > sorted[index - 1].max,
  );
}

export function normalizeLegend(value: LegendInterval[]): LegendInterval[] {
  return [...value]
    .sort((a, b) => a.min - b.min)
    .map((entry) => ({
      min: entry.min,
      max: entry.max,
      label: entry.label.trim(),
    }));
}

export function formatInterval(interval: LegendInterval): string {
  const isSingleValue = interval.min === interval.max;
  return isSingleValue
    ? String(interval.min)
    : `${interval.min}–${interval.max}`;
}
