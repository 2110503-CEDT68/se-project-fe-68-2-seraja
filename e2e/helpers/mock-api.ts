import { Page } from "@playwright/test";
import { mockCampgrounds } from "../fixtures/campgrounds";

export async function mockCampgroundsApi(page: Page) {
  await page.route("**/api/v1/campgrounds", (route) => {
    if (route.request().url().includes("/campgrounds/")) return route.continue();

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        count: mockCampgrounds.length,
        data: mockCampgrounds,
      }),
    });
  });
}
