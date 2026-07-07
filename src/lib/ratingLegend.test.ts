import { describe, expect, it } from "vitest";
import {
  isValidLegend,
  legendEntries,
  legendLabelMaxLength,
  legendStarCount,
  normalizeLegend,
} from "./ratingLegend";

const legend = ["did not finish", "", "fine", "", "masterpiece"];

describe("isValidLegend", () => {
  it("accepts five labels with at least one filled in", () => {
    expect(isValidLegend(legend)).toBe(true);
    expect(isValidLegend(["only ones", "", "", "", ""])).toBe(true);
  });

  it("rejects malformed shapes", () => {
    expect(isValidLegend(null)).toBe(false);
    expect(isValidLegend("great")).toBe(false);
    expect(isValidLegend({ cuts: [], labels: ["everything"] })).toBe(false);
    expect(isValidLegend(["a", "b", "c", "d"])).toBe(false);
    expect(isValidLegend(["a", "b", "c", "d", "e", "f"])).toBe(false);
    expect(isValidLegend(["a", "b", "c", "d", 5])).toBe(false);
  });

  it("rejects legends with no descriptions at all", () => {
    expect(isValidLegend(["", "", "", "", ""])).toBe(false);
    expect(isValidLegend(["  ", "", "", "", "\t"])).toBe(false);
  });

  it("rejects labels over the maximum length", () => {
    const long = "x".repeat(legendLabelMaxLength + 1);
    expect(isValidLegend([long, "", "", "", ""])).toBe(false);
    expect(isValidLegend(["x".repeat(legendLabelMaxLength), "", "", "", ""])).toBe(
      true,
    );
  });
});

describe("normalizeLegend", () => {
  it("trims every label", () => {
    expect(normalizeLegend(["  a  ", "", " b", "c ", ""])).toEqual([
      "a",
      "",
      "b",
      "c",
      "",
    ]);
  });
});

describe("legendEntries", () => {
  it("maps filled labels to their star value", () => {
    expect(legendEntries(legend)).toEqual([
      { stars: 1, label: "did not finish" },
      { stars: 3, label: "fine" },
      { stars: 5, label: "masterpiece" },
    ]);
  });

  it("skips blank labels entirely", () => {
    expect(legendEntries(["", " ", "", "", ""])).toEqual([]);
  });

  it("covers all five stars when every label is filled", () => {
    const full = ["one", "two", "three", "four", "five"];
    expect(legendEntries(full)).toHaveLength(legendStarCount);
  });
});
