import { expect, test } from "@playwright/test";

test.describe("foundation smoke", () => {
  test("starts the app and serves the public shell", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "NPS Choice Platform" }),
    ).toBeVisible();
    await expect(page.getByText("Public contour for applicants")).toBeVisible();
    await expect(page.getByRole("link", { name: "Directions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Compare" })).toBeVisible();
  });

  test("returns the directions API response and records the public flow path", async ({
    request,
  }) => {
    const response = await request.get("/api/directions");

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as {
      items: Array<{ slug: string }>;
      total: number;
    };

    expect(body.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(body.items)).toBe(true);
  });

  test("opens the protected internal dashboard through the dev auth skeleton", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");

    await expect(
      page.getByRole("heading", { name: "NPS Choice Platform Admin" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Internal dashboard contour is protected by the foundation auth skeleton.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Current role: admissions_admin"),
    ).toBeVisible();
  });
});
