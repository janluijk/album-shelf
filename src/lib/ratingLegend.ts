export type RatingLegend = string[];

export type LegendEntry = {
  stars: number;
  label: string;
};

export const legendStarCount = 5;
export const legendLabelMaxLength = 60;

export function isValidLegend(value: unknown): value is RatingLegend {
  if (!Array.isArray(value) || value.length !== legendStarCount) return false;
  const labelsAreValid = value.every(
    (label) =>
      typeof label === "string" && label.length <= legendLabelMaxLength,
  );
  if (!labelsAreValid) return false;
  return value.some((label) => label.trim().length > 0);
}

export function normalizeLegend(legend: RatingLegend): RatingLegend {
  return legend.map((label) => label.trim());
}

export function legendEntries(legend: RatingLegend): LegendEntry[] {
  return legend.flatMap((label, index) =>
    label.trim().length > 0
      ? [{ stars: index + 1, label: label.trim() }]
      : [],
  );
}
