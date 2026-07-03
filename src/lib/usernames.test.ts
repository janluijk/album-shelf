import { describe, expect, it } from "vitest";
import { deriveUsername } from "./usernames";

describe("deriveUsername", () => {
  it("uses the email prefix when available", () => {
    expect(deriveUsername("Jan Luijk", "j.luijk@example.com")).toBe("j-luijk");
  });

  it("falls back to the name when there is no email", () => {
    expect(deriveUsername("Jan Luijk", null)).toBe("jan-luijk");
  });

  it("strips leading and trailing separators", () => {
    expect(deriveUsername(null, "__jan__@example.com")).toBe("jan");
  });

  it("falls back to listener when nothing usable remains", () => {
    expect(deriveUsername(null, null)).toBe("listener");
    expect(deriveUsername("___", null)).toBe("listener");
  });
});
