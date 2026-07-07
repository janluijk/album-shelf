import { describe, expect, it } from "vitest";
import {
  formatInterval,
  isValidLegend,
  legendLabelMaxLength,
  legendMaxIntervals,
  normalizeLegend,
} from "./ratingLegend";

describe("isValidLegend", () => {
  it("accepts an empty legend", () => {
    expect(isValidLegend([])).toBe(true);
  });

  it("accepts non-overlapping intervals in any order", () => {
    expect(
      isValidLegend([
        { min: 5, max: 5, label: "all-time favorite" },
        { min: 1, max: 1.5, label: "did not finish" },
      ]),
    ).toBe(true);
  });

  it("accepts single-point intervals", () => {
    expect(isValidLegend([{ min: 3, max: 3, label: "fine" }])).toBe(true);
  });

  it("rejects non-arrays and malformed entries", () => {
    expect(isValidLegend(null)).toBe(false);
    expect(isValidLegend("legend")).toBe(false);
    expect(isValidLegend([{ min: 1, max: 2 }])).toBe(false);
    expect(isValidLegend([{ min: "1", max: 2, label: "x" }])).toBe(false);
  });

  it("rejects bounds outside 1-5 or with more than one decimal", () => {
    expect(isValidLegend([{ min: 0.5, max: 2, label: "x" }])).toBe(false);
    expect(isValidLegend([{ min: 1, max: 5.5, label: "x" }])).toBe(false);
    expect(isValidLegend([{ min: 1.25, max: 2, label: "x" }])).toBe(false);
  });

  it("rejects inverted ranges", () => {
    expect(isValidLegend([{ min: 3, max: 2, label: "x" }])).toBe(false);
  });

  it("rejects blank or too-long labels", () => {
    expect(isValidLegend([{ min: 1, max: 2, label: "   " }])).toBe(false);
    expect(
      isValidLegend([
        { min: 1, max: 2, label: "a".repeat(legendLabelMaxLength + 1) },
      ]),
    ).toBe(false);
  });

  it("rejects overlapping intervals", () => {
    expect(
      isValidLegend([
        { min: 1, max: 2.5, label: "meh" },
        { min: 2.5, max: 4, label: "good" },
      ]),
    ).toBe(false);
  });

  it("rejects more than the maximum number of intervals", () => {
    const tooMany = Array.from({ length: legendMaxIntervals + 1 }, (_, i) => ({
      min: 1,
      max: 1,
      label: `entry ${i}`,
    }));
    expect(isValidLegend(tooMany)).toBe(false);
  });
});

describe("normalizeLegend", () => {
  it("sorts by lower bound and trims labels", () => {
    expect(
      normalizeLegend([
        { min: 5, max: 5, label: "  favorite  " },
        { min: 1, max: 1.5, label: "did not finish" },
      ]),
    ).toEqual([
      { min: 1, max: 1.5, label: "did not finish" },
      { min: 5, max: 5, label: "favorite" },
    ]);
  });
});

describe("formatInterval", () => {
  it("collapses single-point intervals", () => {
    expect(formatInterval({ min: 5, max: 5, label: "x" })).toBe("5");
  });

  it("renders ranges with an en dash", () => {
    expect(formatInterval({ min: 1, max: 1.5, label: "x" })).toBe("1–1.5");
  });
});
