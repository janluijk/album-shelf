export const usernameRules =
  "3–30 characters: lowercase letters, digits and hyphens, starting and ending with a letter or digit.";

export function isValidUsername(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 30 &&
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value)
  );
}

export function deriveUsername(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = email?.split("@")[0] || name || "listener";
  const slug = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "listener";
}
