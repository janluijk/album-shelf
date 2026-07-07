export const bioMaxLength = 280;

export function isValidBio(value: unknown): value is string {
  return typeof value === "string" && value.trim().length <= bioMaxLength;
}

export function normalizeBio(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
