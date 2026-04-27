import { test, expect } from "@playwright/test";
import { mockBookingsForReview } from "../fixtures/bookings";
import { mockAuthSession } from "../helpers/mock-api";

test.describe("Campground Review Update Process (2-2)", () => {
  const BOOKING_ID = "booking_id_123";
  let reviewUpdated = false;

  test.beforeEach(async ({ page }) => {
    reviewUpdated = false;
    // Mock user session
    await mockAuthSession(page);

    // Mock Bookings API with an already reviewed booking
    await page.route("**/api/v1/bookings", async (route) => {
      const bookings = { 
        success: true,
        count: 1,
        data: [
          {
            ...mockBookingsForReview.data[0],
            status: "reviewed",
            review_rating: 4,
            review_comment: "Original review comment",
            review_createdAt: new Date().toISOString(),
          }
        ]
      };
      
      if (reviewUpdated) {
        bookings.data[0].review_rating = 5;
        bookings.data[0].review_comment = "Updated review comment";
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(bookings),
      });
    });

    // Mock Review Update API
    await page.route(`**/api/v1/bookings/${BOOKING_ID}/review/update`, async (route) => {
      if (route.request().method() === "PUT") {
        const payload = route.request().postDataJSON();
        
        // Basic validation for the success case
        if (payload.review_comment && payload.review_comment.trim() !== "") {
          reviewUpdated = true;
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ 
              success: true, 
              message: "Your review has been updated",
              data: payload 
            }),
          });
        } else {
          await route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({ success: false, message: "Comment cannot be empty" }),
          });
        }
      } else {
        await route.continue();
      }
    });
  });

  test("should successfully update a review with new rating and comment", async ({ page }) => {
    // Given I have already submitted a review for a campground
    await page.goto("/bookings");

    const reviewSection = page.locator('div:has-text("Your Review")').first();
    await expect(reviewSection).toBeVisible();
    await expect(page.getByText("Original review comment")).toBeVisible();

    // When I click the "Edit Review" button
    await page.getByRole("button", { name: "Edit Review" }).click();

    // And I change my star rating (e.g., to 5 stars)
    const stars = page.locator('button').filter({ hasText: "★" });
    await stars.nth(4).click(); // Click 5th star

    // And I edit the text comment
    const commentBox = page.locator('textarea');
    await commentBox.fill("Updated review comment");

    // เตรียมดักจับ Alert ที่จะเด้งขึ้นมาหลังจากกด Update
    const dialogPromise = page.waitForEvent('dialog');

    // And I click the "Update" button
    await page.getByRole("button", { name: "Update" }).click();

    // Then I should see a success message saying "Your review has been updated"
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Your review has been updated');
    await dialog.accept();

    // Then the existing review should be updated in the UI (Optimistic or Refresh)
    await expect(page.getByText("Updated review comment")).toBeVisible();
    // Check if 5 stars are yellow
    const yellowStars = page.locator('span.text-yellow-400').filter({ hasText: "★" });
    await expect(yellowStars).toHaveCount(5);
  });

  test("should show error when updating with an empty comment", async ({ page }) => {
    // Given I am on the bookings page
    await page.goto("/bookings");

    // Click "Edit Review"
    await page.getByRole("button", { name: "Edit Review" }).click();

    // When I delete all the text in the comment box
    const commentBox = page.locator('textarea');
    await commentBox.fill("");

    // And I click the "Update" button
    await page.getByRole("button", { name: "Update" }).click();

    // Then the review should not be saved
    // And I should see an error message saying "Comment cannot be empty"
    await expect(page.getByText("Comment cannot be empty")).toBeVisible();
  });
});
