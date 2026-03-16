import { expect, test } from "@playwright/test";

test.describe("nps comparison smoke", () => {
  test("covers catalog, direction detail, and ready comparison states", async ({
    page,
  }) => {
    await page.goto("/directions");

    await expect(
      page.getByRole("heading", { name: "Directions catalog" }),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/directions/program-09-02-07"]'),
    ).toBeVisible();

    await page
      .locator('a[href="/directions?ids=direction-09-02-07&source=catalog"]')
      .click();
    await expect(
      page.getByRole("heading", { name: "Selected directions: 1" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open comparison" }),
    ).toHaveCount(0);

    await page
      .locator(
        'a[href="/directions?ids=direction-09-02-07%2Cdirection-10-02-05&source=catalog"]',
      )
      .click();
    await expect(
      page.getByRole("heading", { name: "Selected directions: 2" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Open comparison" }).click();
    await page.waitForURL(
      "**/compare?ids=direction-09-02-07%2Cdirection-10-02-05&source=catalog",
    );

    await expect(
      page.getByRole("heading", { name: "Compare selected directions" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Shared criteria" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "What changes from one direction to another",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How the selected directions differ" }),
    ).toBeVisible();
    await expect(page.locator(".compareMatrixRow")).toHaveCount(5);
    await expect(page.locator(".compareGrid .catalogCard")).toHaveCount(2);

    await page.goto("/directions");
    await page.locator('a[href="/directions/program-09-02-07"]').click();
    await page.waitForURL("**/directions/program-09-02-07");

    await expect(
      page.getByRole("heading", { name: "Program snapshot" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What you will learn" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Learning outcomes" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Add to compare" }),
    ).toHaveAttribute(
      "href",
      "/directions/program-09-02-07?ids=direction-09-02-07&source=direction-detail",
    );
  });

  test("shows an under-minimum compare state from a single-direction entry point", async ({
    page,
  }) => {
    await page.goto("/directions");

    await page
      .locator('a[href="/directions?ids=direction-09-02-01&source=catalog"]')
      .click();
    await expect(
      page.getByRole("heading", { name: "Selected directions: 1" }),
    ).toBeVisible();
    await page.goto("/compare?ids=direction-09-02-01&source=catalog");

    await expect(
      page.getByRole("heading", {
        name: "Comparison needs at least two directions",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Return to directions catalog" }),
    ).toBeVisible();
  });
});
