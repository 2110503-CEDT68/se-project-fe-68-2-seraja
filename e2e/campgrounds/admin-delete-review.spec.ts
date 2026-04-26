import { test, expect } from "@playwright/test";
import { mockAuthSession } from "../helpers/mock-api";

test.describe("Admin delete review (detailed)", () => {
  const CAMPGROUND_ID = "camp_123";
  const BOOKING_ID = "booking_to_delete";
  let reviewDeleted = false;

  test.beforeEach(async ({ page }) => {
    reviewDeleted = false;

    // Mock campground details
    await page.route(`**/api/v1/campgrounds/${CAMPGROUND_ID}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: { _id: CAMPGROUND_ID, name: "Test Camp" } }),
      });
    });

    // Mock campground reviews GET; return one review until deleted
    await page.route(`**/api/v1/campgrounds/${CAMPGROUND_ID}/reviews`, async (route) => {
      const body = reviewDeleted
        ? { success: true, data: [], averageRating: 0 }
        : {
            success: true,
            data: [
              {
                _id: BOOKING_ID,
                user: { name: "Offending User" },
                review_rating: 1,
                review_comment: "This review violates guidelines",
                review_createdAt: new Date().toISOString(),
              },
            ],
            averageRating: 1,
          };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });

    // Mock delete review API
    await page.route(`**/api/v1/bookings/${BOOKING_ID}/review`, async (route) => {
      if (route.request().method() === "DELETE") {
        reviewDeleted = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Review deleted" }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test("Confirming deletion removes the review from admin view", async ({ page }) => {
    await mockAuthSession(page, { name: "Admin User", email: "admin@example.com", role: "admin", _id: "admin_id", token: "admin_token" });
    await page.goto(`/campgrounds/${CAMPGROUND_ID}`);
    await expect(page.getByText("Test Camp")).toBeVisible();

    // Ensure the offending review is visible
    const reviewText = page.getByText("This review violates guidelines");
    await expect(reviewText).toBeVisible();

    // Attach dialog accept handler before clicking
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Delete" }).first().click();

    // After deletion, the mocked GET will return no reviews
    await expect(reviewText).toHaveCount(0);
    await expect(page.getByText("This review violates guidelines")).not.toBeVisible();
  });

  test("Non-admin users do not see the Delete button", async ({ page }) => {
    await mockAuthSession(page, { name: "Regular User", email: "user@example.com", role: "user", _id: "user_id", token: "user_token" });
    await page.goto(`/campgrounds/${CAMPGROUND_ID}`);
    await expect(page.getByText("Test Camp")).toBeVisible();

    const deleteButtons = page.getByRole("button", { name: "Delete" });
    await expect(deleteButtons).toHaveCount(0);
  });

  test("Deleted review is not visible any user", async ({ page }) => {
    // Login as admin and delete
    await mockAuthSession(page, { name: "Admin User", email: "admin@example.com", role: "admin", _id: "admin_id", token: "admin_token" });
    await page.goto(`/campgrounds/${CAMPGROUND_ID}`);
    await expect(page.getByText("Test Camp")).toBeVisible();

    // Attach dialog accept handler before clicking
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Delete" }).first().click();

    // Now override session to a regular user and reload the page
    await mockAuthSession(page, { name: "Regular User", email: "user@example.com", role: "user", _id: "user_id", token: "user_token" });
    await page.reload();

    // The review should remain absent for non-admins as well
    await expect(page.getByText("This review violates guidelines")).toHaveCount(0);
  });
});
