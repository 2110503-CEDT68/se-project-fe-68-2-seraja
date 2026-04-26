import { test, expect } from "@playwright/test";
import { mockAuthSession } from "../helpers/mock-api";
import { mockBookingsForReview } from "../fixtures/bookings";

test.describe("User Story 2-3: Delete Review", () => {
  let reviewDeleted = false;

  test.beforeEach(async ({ page }) => {
    reviewDeleted = false;

    await mockAuthSession(page);

    await page.route("**/api/v1/bookings", async (route) => {
      const bookings = { ...mockBookingsForReview };

      if (reviewDeleted) {
        bookings.data = [
          {
            ...bookings.data[0],
            status: "checked-out",
            review_rating: null,
            review_comment: null,
          },
        ];
      } else {
        bookings.data = [
          {
            ...bookings.data[0],
            status: "reviewed",
            review_rating: 4,
            review_comment: "Nice place",
          },
        ];
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(bookings),
      });
    });

    await page.route("**/api/v1/bookings/*/review", async (route) => {
      if (route.request().method() === "DELETE") {
        reviewDeleted = true;

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Review deleted",
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  // 🔹 TC1
  test("TC2-3-1: click delete review", async ({ page }) => {
    await page.goto("/bookings");

    const deleteBtn = page.getByRole("button", { name: "Delete Review" });
    await expect(deleteBtn.first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Are you sure");
      await dialog.dismiss();
    });

    await deleteBtn.first().click();
  });

  // 🔹 TC2
  test("TC2-3-2: cancel delete review", async ({ page }) => {
    await page.goto("/bookings");

    const deleteBtn = page.getByRole("button", { name: "Delete Review" });
    await expect(deleteBtn.first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    await deleteBtn.first().click();

    await expect(deleteBtn.first()).toBeVisible();
  });

  // 🔹 TC3
  test("TC2-3-3: confirm delete review", async ({ page }) => {
    await page.goto("/bookings");

    const deleteBtn = page.getByRole("button", { name: "Delete Review" });
    await expect(deleteBtn.first()).toBeVisible();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await deleteBtn.first().click();

    await page.reload();

    await expect(page.getByText("Write a Review")).toBeVisible();
  });
});