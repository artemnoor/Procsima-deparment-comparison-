import { expect, test } from "@playwright/test";

test.describe("prisma public smoke", () => {
  test("covers catalog, detail, compare, and profile test in prisma mode", async ({
    page,
  }) => {
    await page.goto("/directions");

    await expect(
      page.getByRole("heading", { name: "Directions catalog" }),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/directions/program-09-02-07"]'),
    ).toBeVisible();
    await expect(page.getByText("09.02.07")).toBeVisible();

    await page.goto("/directions/program-09-02-07");
    await expect(
      page.getByRole("heading", { name: "Program snapshot" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What you will learn" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Passing score trend" }),
    ).toBeVisible();

    await page.goto(
      "/compare?ids=direction-09-02-07,direction-10-02-05&source=catalog",
    );
    await expect(
      page.getByRole("heading", { name: "Compare selected directions" }),
    ).toBeVisible();
    await expect(page.locator(".compareGrid .catalogCard")).toHaveCount(2);
    await expect(page.locator(".compareMatrixRow")).toHaveCount(5);

    await page.goto(
      "/profile-test?motivation=build-products&activities=write-code&activities=work-with-data&outcome=launch-products",
    );
    await expect(
      page.getByRole("heading", { name: "Your strongest direction pattern" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Информационные системы и программирование",
      }),
    ).toBeVisible();
  });
});
