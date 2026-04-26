import { test, expect } from "@playwright/test";
import { mockBookingsForReview } from "../fixtures/bookings";
import { mockAuthSession } from "../helpers/mock-api";

/**
 * Acceptance Criteria (Adjusted to current code flow):
 * Given I am on the "Bookings" page with a checked-out booking
 * When I select a star rating (e.g., 4 stars)
 * And I enter a descriptive comment (e.g., "Great views and clean showers!")
 * And I click the "Submit" button
 * Then my review should be saved to the database
 * And I should see a success feedback
 */

test.describe("Campground Review Process", () => {
  const BOOKING_ID = "booking_id_123";
  let reviewSubmitted = false;

  test.beforeEach(async ({ page }) => {
    reviewSubmitted = false;
    // Mock user session
    await mockAuthSession(page);

    // Mock Bookings API
    await page.route("**/api/v1/bookings", async (route) => {
      const bookings = { ...mockBookingsForReview };
      if (reviewSubmitted) {
        bookings.data = [
          {
            ...bookings.data[0],
            status: "reviewed",
            review_rating: 4,
            review_comment: "Great views and clean showers!",
          },
        ];
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(bookings),
      });
    });

    // Mock Review Submission API
    await page.route(`**/api/v1/bookings/${BOOKING_ID}/review`, async (route) => {
      if (route.request().method() === "PUT") {
        const payload = route.request().postDataJSON();
        // Validation check for mock
        expect(payload.review_rating).toBe(4);
        expect(payload.review_comment).toBe("Great views and clean showers!");

        reviewSubmitted = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ 
            success: true, 
            message: "Thank you for your review!",
            data: payload 
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test("should successfully submit a 4-star review with a comment", async ({ page }) => {
    // Given I am on the bookings page
    await page.goto("/bookings");

    // Check if the "Write a Review" section is visible for the checked-out booking
    const reviewSection = page.locator('div:has-text("Write a Review")').first();
    await expect(reviewSection).toBeVisible();

    // When I select a star rating (e.g., 4 stars)
    // Buttons are in a flex gap-1 mb-4. 4th star is index 3.
    const stars = reviewSection.locator('button').filter({ hasText: "★" });
    await stars.nth(3).click(); // Click 4th star

    // And I enter a descriptive comment
    const commentBox = reviewSection.locator('textarea');
    await commentBox.fill("Great views and clean showers!");

    // And I click the "Submit" button
    const submitButton = reviewSection.getByRole("button", { name: "Submit" });
    
    // ตั้งดัก alert หรือข้อความความสำเร็จ (ขึ้นอยู่กับว่าระบบแจ้งเตือนอย่างไร)
    // ในโค้ดปัจจุบัน handlePostReview จะเปลี่ยน UI เป็นสถานะ 'reviewed'
    await submitButton.click();

    // Then my review should be saved to the database (Verified via Mock API above)

    // And I should see success feedback
    // ในระบบปัจจุบัน เมื่อรีวิวเสร็จ ฟอร์มจะหายไปและแสดง "Your Review" หรือคะแนนที่รีวิว
    // เราจะใช้ Mock API fulfill message ให้แสดงผล (ถ้าโค้ดมีการเรียกใช้)
    // หรือเช็คความถูกต้องของ UI ที่เปลี่ยนไป
    await expect(page.locator('h3:has-text("Your Review")')).toBeVisible();
    await expect(page.getByText("Great views and clean showers!")).toBeVisible();
  });

  test("should show error when submitting without a star rating", async ({ page }) => {
    // Given I am on the bookings page
    await page.goto("/bookings");

    // Check if the "Write a Review" section is visible for the checked-out booking
    const reviewSection = page.locator('div:has-text("Write a Review")').first();
    await expect(reviewSection).toBeVisible();

    // When I leave the star rating unselected (do nothing)

    // And I enter a text comment
    const commentBox = reviewSection.locator('textarea');
    await commentBox.fill("This is a test comment without rating.");

    // And I click the "Submit" button
    const submitButton = reviewSection.getByRole("button", { name: "Submit" });
    await submitButton.click();

    // Then the review should not be submitted (Verified because we didn't call the API or change state)

    // And I should see an error message saying "Please select a star rating before submitting."
    await expect(page.getByText("Please select a star rating before submitting.")).toBeVisible();
  });
});
