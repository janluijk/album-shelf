import { describe, expect, it } from "vitest";
import { deriveUsername, isValidUsername } from "./usernames";

describe("isValidUsername", () => {
  it("accepts lowercase slugs", () => {
    expect(isValidUsername("jan-luijk")).toBe(true);
    expect(isValidUsername("listener2")).toBe(true);
    expect(isValidUsername("abc")).toBe(true);
  });

  it("rejects wrong types and casing", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(42)).toBe(false);
    expect(isValidUsername("Jan")).toBe(false);
  });

  it("rejects invalid characters and hyphen placement", () => {
    expect(isValidUsername("jan luijk")).toBe(false);
    expect(isValidUsername("jan_luijk")).toBe(false);
    expect(isValidUsername("-jan")).toBe(false);
    expect(isValidUsername("jan-")).toBe(false);
  });

  it("rejects out-of-range lengths", () => {
    expect(isValidUsername("ab")).toBe(false);
    expect(isValidUsername("a".repeat(31))).toBe(false);
    expect(isValidUsername("a".repeat(30))).toBe(true);
  });
});

describe("deriveUsername", () => {
  it("prefers the profile name when available", () => {
    expect(deriveUsername("Jan Luijk", "j.luijk@example.com")).toBe(
      "jan-luijk",
    );
  });

  it("falls back to the email prefix when there is no name", () => {
    expect(deriveUsername(null, "j.luijk@example.com")).toBe("j-luijk");
  });

  it("strips leading and trailing separators", () => {
    expect(deriveUsername(null, "__jan__@example.com")).toBe("jan");
  });

  it("falls back to listener when nothing usable remains", () => {
    expect(deriveUsername(null, null)).toBe("listener");
    expect(deriveUsername("___", null)).toBe("listener");
  });
});
