import type { RatingGranularity } from "@/lib/ratings";

export type RatingLegend = {
  cuts: number[];
  labels: string[];
};

export type LegendSegment = {
  min: number;
  max: number;
  label: string;
};

export const legendMaxSegments = 8;
export const legendLabelMaxLength = 60;

const minTenths = 10;
const maxTenths = 50;

const stepTenthsByMode: Record<RatingGranularity, number> = {
  integer: 10,
  half: 5,
  decimal: 1,
};

function toTenths(value: number): number {
  return Math.round(value * 10);
}

function fromTenths(tenths: number): number {
  return tenths / 10;
}

function isOnTenthGrid(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value * 10 - Math.round(value * 10)) < 1e-6
  );
}

export function stepFor(mode: RatingGranularity): number {
  return fromTenths(stepTenthsByMode[mode]);
}

export function snapToGrid(value: number, mode: RatingGranularity): number {
  const stepTenths = stepTenthsByMode[mode];
  const snapped =
    minTenths +
    Math.round((value * 10 - minTenths) / stepTenths) * stepTenths;
  return fromTenths(Math.min(Math.max(snapped, minTenths), maxTenths));
}

export function isValidLegend(value: unknown): value is RatingLegend {
  if (typeof value !== "object" || value === null) return false;
  const { cuts, labels } = value as Record<string, unknown>;
  if (!Array.isArray(cuts) || !Array.isArray(labels)) return false;
  if (labels.length !== cuts.length + 1) return false;
  if (labels.length > legendMaxSegments) return false;

  const labelsAreValid = labels.every(
    (label) =>
      typeof label === "string" &&
      label.trim().length > 0 &&
      label.length <= legendLabelMaxLength,
  );
  if (!labelsAreValid) return false;

  const cutsAreOnGrid = cuts.every(
    (cut) =>
      isOnTenthGrid(cut) &&
      toTenths(cut) > minTenths &&
      toTenths(cut) <= maxTenths,
  );
  if (!cutsAreOnGrid) return false;

  return cuts.every(
    (cut, index) => index === 0 || toTenths(cut) > toTenths(cuts[index - 1]),
  );
}

export function normalizeLegend(legend: RatingLegend): RatingLegend {
  return {
    cuts: legend.cuts.map((cut) => fromTenths(toTenths(cut))),
    labels: legend.labels.map((label) => label.trim()),
  };
}

function gridCeil(tenths: number, stepTenths: number): number {
  return minTenths + Math.ceil((tenths - minTenths) / stepTenths) * stepTenths;
}

function gridFloor(tenths: number, stepTenths: number): number {
  return (
    minTenths + Math.floor((tenths - minTenths) / stepTenths) * stepTenths
  );
}

export function segmentRanges(
  legend: RatingLegend,
  mode: RatingGranularity,
): ({ min: number; max: number } | null)[] {
  const stepTenths = stepTenthsByMode[mode];
  const boundaries = [
    minTenths,
    ...legend.cuts.map(toTenths),
    maxTenths + stepTenths,
  ];

  return legend.labels.map((_, i) => {
    const start = boundaries[i];
    const end = boundaries[i + 1];
    const lowest = Math.max(minTenths, gridCeil(start, stepTenths));
    const highest = Math.min(maxTenths, gridFloor(end - 1, stepTenths));
    const hasNoGridValues = lowest > highest;
    if (hasNoGridValues) return null;
    return { min: fromTenths(lowest), max: fromTenths(highest) };
  });
}

export function segmentsFor(
  legend: RatingLegend,
  mode: RatingGranularity,
): LegendSegment[] {
  const ranges = segmentRanges(legend, mode);
  const segments: LegendSegment[] = [];
  ranges.forEach((range, i) => {
    if (!range) return;
    segments.push({ ...range, label: legend.labels[i] });
  });
  return segments;
}

export function formatValue(value: number, mode: RatingGranularity): string {
  if (mode === "decimal") return value.toFixed(1);
  return String(value);
}

export function formatSegment(
  segment: LegendSegment,
  mode: RatingGranularity,
): string {
  const isSingleValue = segment.min === segment.max;
  return isSingleValue
    ? formatValue(segment.min, mode)
    : `${formatValue(segment.min, mode)}–${formatValue(segment.max, mode)}`;
}

export function allowedCutsBetween(
  legend: RatingLegend,
  cutIndex: number,
  mode: RatingGranularity,
): number[] {
  const stepTenths = stepTenthsByMode[mode];
  const cutTenths = legend.cuts.map(toTenths);
  const lower = cutIndex === 0 ? minTenths : cutTenths[cutIndex - 1];
  const upper =
    cutIndex === cutTenths.length - 1
      ? maxTenths
      : cutTenths[cutIndex + 1] - 1;

  const values: number[] = [];
  for (let t = gridCeil(lower + 1, stepTenths); t <= upper; t += stepTenths) {
    values.push(fromTenths(t));
  }
  return values;
}

export function splitSegment(
  legend: RatingLegend,
  segmentIndex: number,
  mode: RatingGranularity,
): RatingLegend | null {
  if (legend.labels.length >= legendMaxSegments) return null;
  const stepTenths = stepTenthsByMode[mode];
  const cutTenths = legend.cuts.map(toTenths);
  const start = segmentIndex === 0 ? minTenths : cutTenths[segmentIndex - 1];
  const end =
    segmentIndex >= cutTenths.length
      ? maxTenths + stepTenths
      : cutTenths[segmentIndex];

  const lowestCut = gridCeil(start + 1, stepTenths);
  const highestCut = Math.min(maxTenths, gridFloor(end - 1, stepTenths));
  const cannotSplit = lowestCut > highestCut;
  if (cannotSplit) return null;

  const middle = gridFloor(Math.round((start + end) / 2), stepTenths);
  const cut = Math.min(Math.max(middle, lowestCut), highestCut);

  const cuts = [...legend.cuts];
  const labels = [...legend.labels];
  cuts.splice(segmentIndex, 0, fromTenths(cut));
  labels.splice(segmentIndex + 1, 0, "");
  return { cuts, labels };
}

export function moveCut(
  legend: RatingLegend,
  cutIndex: number,
  value: number,
): RatingLegend {
  const cutTenths = legend.cuts.map(toTenths);
  const lower = cutIndex === 0 ? minTenths + 1 : cutTenths[cutIndex - 1] + 1;
  const upper =
    cutIndex === cutTenths.length - 1 ? maxTenths : cutTenths[cutIndex + 1] - 1;
  const clamped = Math.min(Math.max(toTenths(value), lower), upper);
  const cuts = legend.cuts.map((cut, index) =>
    index === cutIndex ? fromTenths(clamped) : cut,
  );
  return { ...legend, cuts };
}

export function removeCut(
  legend: RatingLegend,
  cutIndex: number,
): RatingLegend {
  const cuts = legend.cuts.filter((_, index) => index !== cutIndex);
  const labels = legend.labels.filter((_, index) => index !== cutIndex + 1);
  return { cuts, labels };
}
