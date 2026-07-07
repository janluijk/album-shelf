import { describe, expect, it } from "vitest";
import { bioMaxLength, isValidBio, normalizeBio } from "./bio";

describe("isValidBio", () => {
  it("accepts short text and the empty string", () => {
    expect(isValidBio("Vinyl collector from Utrecht.")).toBe(true);
    expect(isValidBio("")).toBe(true);
  });

  it("accepts text at the maximum length", () => {
    expect(isValidBio("a".repeat(bioMaxLength))).toBe(true);
  });

  it("measures length after trimming", () => {
    expect(isValidBio(`  ${"a".repeat(bioMaxLength)}  `)).toBe(true);
  });

  it("rejects text over the maximum length", () => {
    expect(isValidBio("a".repeat(bioMaxLength + 1))).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(isValidBio(null)).toBe(false);
    expect(isValidBio(undefined)).toBe(false);
    expect(isValidBio(42)).toBe(false);
  });
});

describe("normalizeBio", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeBio("  hello  ")).toBe("hello");
  });

  it("turns blank input into null", () => {
    expect(normalizeBio("")).toBe(null);
    expect(normalizeBio("   ")).toBe(null);
  });

  it("keeps inner whitespace and newlines", () => {
    expect(normalizeBio("line one\nline two")).toBe("line one\nline two");
  });
});
