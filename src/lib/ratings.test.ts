import { describe, expect, it } from "vitest";
import { displayRating, isValidGranularity } from "./ratings";

describe("isValidGranularity", () => {
  it("accepts the three supported modes", () => {
    ["integer", "half", "decimal"].forEach((mode) => {
      expect(isValidGranularity(mode)).toBe(true);
    });
  });

  it("rejects unknown or non-string values", () => {
    ["quarter", "", "INTEGER", 1, null, undefined, {}].forEach((mode) => {
      expect(isValidGranularity(mode)).toBe(false);
    });
  });
});

describe("displayRating", () => {
  it("rounds down to a whole star in integer mode", () => {
    expect(displayRating(3.7, "integer")).toBe(3);
    expect(displayRating(3.5, "integer")).toBe(3);
    expect(displayRating(4, "integer")).toBe(4);
  });

  it("rounds to the nearest half in half mode", () => {
    expect(displayRating(3.7, "half")).toBe(3.5);
    expect(displayRating(3.8, "half")).toBe(4);
    expect(displayRating(3.2, "half")).toBe(3);
  });

  it("keeps the exact value in decimal mode", () => {
    expect(displayRating(3.7, "decimal")).toBe(3.7);
  });

  it("passes null through unchanged", () => {
    expect(displayRating(null, "integer")).toBeNull();
    expect(displayRating(null, "half")).toBeNull();
    expect(displayRating(null, "decimal")).toBeNull();
  });
});
