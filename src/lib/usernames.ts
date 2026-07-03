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
