import { describe, expect, it } from "vitest";
import {
  allowedCutsBetween,
  formatSegment,
  isValidLegend,
  legendLabelMaxLength,
  legendMaxSegments,
  moveCut,
  normalizeLegend,
  removeCut,
  segmentsFor,
  splitSegment,
} from "./ratingLegend";

const legend = {
  cuts: [1.6, 3.5],
  labels: ["did not finish", "fine", "great"],
};

describe("isValidLegend", () => {
  it("accepts a single unlabeled-range legend", () => {
    expect(isValidLegend({ cuts: [], labels: ["everything"] })).toBe(true);
  });

  it("accepts sorted cuts with one label per segment", () => {
    expect(isValidLegend(legend)).toBe(true);
  });

  it("rejects malformed shapes", () => {
    expect(isValidLegend(null)).toBe(false);
    expect(isValidLegend([])).toBe(false);
    expect(isValidLegend({ cuts: [], labels: [] })).toBe(false);
    expect(isValidLegend({ cuts: [2], labels: ["one"] })).toBe(false);
  });

  it("rejects cuts outside (1, 5] or off the tenth grid", () => {
    expect(isValidLegend({ cuts: [1], labels: ["a", "b"] })).toBe(false);
    expect(isValidLegend({ cuts: [5.1], labels: ["a", "b"] })).toBe(false);
    expect(isValidLegend({ cuts: [2.55], labels: ["a", "b"] })).toBe(false);
  });

  it("rejects unsorted or duplicate cuts", () => {
    expect(isValidLegend({ cuts: [3, 2], labels: ["a", "b", "c"] })).toBe(
      false,
    );
    expect(isValidLegend({ cuts: [3, 3], labels: ["a", "b", "c"] })).toBe(
      false,
    );
  });

  it("rejects blank or too-long labels", () => {
    expect(isValidLegend({ cuts: [], labels: ["  "] })).toBe(false);
    expect(
      isValidLegend({
        cuts: [],
        labels: ["a".repeat(legendLabelMaxLength + 1)],
      }),
    ).toBe(false);
  });

  it("rejects more than the maximum number of segments", () => {
    const cuts = Array.from({ length: legendMaxSegments }, (_, i) => 1.1 + i * 0.1);
    const labels = Array.from({ length: legendMaxSegments + 1 }, (_, i) => `s${i}`);
    expect(isValidLegend({ cuts, labels })).toBe(false);
  });
});

describe("segmentsFor", () => {
  it("renders inclusive decimal ranges with the cut starting the right segment", () => {
    expect(segmentsFor(legend, "decimal")).toEqual([
      { min: 1, max: 1.5, label: "did not finish" },
      { min: 1.6, max: 3.4, label: "fine" },
      { min: 3.5, max: 5, label: "great" },
    ]);
  });

  it("coarsens the same cuts to the half-star grid", () => {
    expect(segmentsFor(legend, "half")).toEqual([
      { min: 1, max: 1.5, label: "did not finish" },
      { min: 2, max: 3, label: "fine" },
      { min: 3.5, max: 5, label: "great" },
    ]);
  });

  it("coarsens the same cuts to the whole-star grid", () => {
    expect(segmentsFor(legend, "integer")).toEqual([
      { min: 1, max: 1, label: "did not finish" },
      { min: 2, max: 3, label: "fine" },
      { min: 4, max: 5, label: "great" },
    ]);
  });

  it("hides segments with no representable values in a coarser mode", () => {
    const tight = { cuts: [3.3, 3.6], labels: ["low", "middle", "high"] };
    expect(segmentsFor(tight, "integer")).toEqual([
      { min: 1, max: 3, label: "low" },
      { min: 4, max: 5, label: "high" },
    ]);
  });

  it("covers the whole scale with a single segment", () => {
    expect(segmentsFor({ cuts: [], labels: ["all"] }, "decimal")).toEqual([
      { min: 1, max: 5, label: "all" },
    ]);
  });
});

describe("formatSegment", () => {
  it("formats decimal ranges with one decimal", () => {
    expect(formatSegment({ min: 1, max: 3.4, label: "x" }, "decimal")).toBe(
      "1.0–3.4",
    );
  });

  it("collapses single-value segments", () => {
    expect(formatSegment({ min: 1, max: 1, label: "x" }, "integer")).toBe("1");
  });
});

describe("splitSegment", () => {
  it("splits the full range near the middle on the mode grid", () => {
    const result = splitSegment({ cuts: [], labels: ["all"] }, 0, "integer");
    expect(result).toEqual({ cuts: [3], labels: ["all", ""] });
  });

  it("splits a middle segment between its neighboring cuts", () => {
    const result = splitSegment(legend, 1, "decimal");
    expect(result?.cuts).toEqual([1.6, 2.6, 3.5]);
    expect(result?.labels).toEqual(["did not finish", "fine", "", "great"]);
  });

  it("returns null when the segment has a single representable value", () => {
    const tight = { cuts: [1.1], labels: ["only one", "rest"] };
    expect(splitSegment(tight, 0, "decimal")).toBe(null);
  });

  it("returns null at the segment cap", () => {
    const cuts = Array.from({ length: legendMaxSegments - 1 }, (_, i) => 1.5 + i * 0.5);
    const labels = Array.from({ length: legendMaxSegments }, (_, i) => `s${i}`);
    expect(splitSegment({ cuts, labels }, 0, "decimal")).toBe(null);
  });
});

describe("moveCut", () => {
  it("moves a cut to the requested value", () => {
    expect(moveCut(legend, 1, 4.2).cuts).toEqual([1.6, 4.2]);
  });

  it("clamps against neighboring cuts and scale edges", () => {
    expect(moveCut(legend, 1, 1.2).cuts).toEqual([1.6, 1.7]);
    expect(moveCut(legend, 1, 9).cuts).toEqual([1.6, 5]);
    expect(moveCut(legend, 0, 0).cuts).toEqual([1.1, 3.5]);
  });
});

describe("removeCut", () => {
  it("merges the right segment into the left, keeping the left label", () => {
    expect(removeCut(legend, 0)).toEqual({
      cuts: [3.5],
      labels: ["did not finish", "great"],
    });
  });
});

describe("allowedCutsBetween", () => {
  it("lists grid values strictly between the neighbors", () => {
    expect(allowedCutsBetween(legend, 0, "half")).toEqual([1.5, 2, 2.5, 3]);
  });

  it("extends to the scale edges for outer cuts", () => {
    expect(allowedCutsBetween(legend, 1, "integer")).toEqual([2, 3, 4, 5]);
  });
});

describe("normalizeLegend", () => {
  it("trims labels and snaps cuts to the tenth grid", () => {
    expect(
      normalizeLegend({ cuts: [1.5000000001], labels: ["  ok  "] as never }),
    ).toEqual({ cuts: [1.5], labels: ["ok"] });
  });
});
