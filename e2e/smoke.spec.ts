import { expect, test } from "@playwright/test";

test("landing page renders and offers sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Album Shelf" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in with GitHub" }),
  ).toBeVisible();
});

test("unknown profile returns 404", async ({ page }) => {
  const response = await page.goto("/u/this-user-does-not-exist");
  expect(response?.status()).toBe(404);
});
