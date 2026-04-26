import { test, expect } from "@playwright/test";

test.describe("User Story 2-3: Delete Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[type="email"]', "owo2@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/");
  });

  test("TC2-3-1: click delete review", async ({ page }) => {
    await page.goto("http://localhost:3000/bookings");

    const deleteBtn = page.getByRole("button", { name: "Delete Review" });
    await expect(deleteBtn.first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Are you sure");
      await dialog.dismiss();
    });

    await deleteBtn.first().click();
  });

  test("TC2-3-2: cancel delete review", async ({ page }) => {
    await page.goto("http://localhost:3000/bookings");

    const deleteBtn = page.getByRole("button", { name: "Delete Review" });
    await expect(deleteBtn.first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    await deleteBtn.first().click();

    await expect(deleteBtn.first()).toBeVisible();
  });

  test("TC2-3-3: confirm delete review", async ({ page }) => {
    await page.goto("http://localhost:3000/bookings");

    const deleteBtns = page.getByRole("button", { name: "Delete Review" });

    const before = await deleteBtns.count();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
  });
});