import { expect, test } from "@playwright/test";

test.describe("profile test smoke", () => {
  test("covers profile-test to recommendation to compare flow", async ({
    page,
  }) => {
    await page.goto("/profile-test");

    await expect(
      page.getByRole("heading", { name: "Answer a short guided questionnaire" }),
    ).toBeVisible();

    await page
      .getByLabel("Build applications and digital services")
      .check();
    await page.getByLabel("Write code and debug features").check();
    await page.getByLabel("Work with databases and structured logic").check();
    await page.getByLabel("Launch applications people use").check();
    await page.getByRole("button", { name: "Show recommendations" }).click();

    await page.waitForURL("**/profile-test?**");
    await expect(
      page.getByRole("heading", { name: "Your strongest direction pattern" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Информационные системы и программирование",
      }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: "Compare all recommended directions" })
      .click();

    await page.waitForURL(
      "**/compare?ids=direction-09-02-07%2Cdirection-10-02-05%2Cdirection-09-02-01&source=recommendation-flow",
    );
    await expect(
      page.getByRole("heading", { name: "Compare selected directions" }),
    ).toBeVisible();
  });
});
