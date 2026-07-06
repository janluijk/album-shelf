import { describe, expect, it } from "vitest";
import { isValidGranularity } from "./ratings";

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
