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

export async function mockAuthSession(page: Page, user = {
  name: "Test User",
  email: "test@example.com",
  role: "user",
  _id: "user_id_123",
  token: "fake_token"
}) {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user,
        expires: new Date(Date.now() + 3600000).toISOString(),
      }),
    });
  });

  // Also mock the csrf token which next-auth often requests
  await page.route("**/api/auth/csrf", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ csrfToken: "fake_csrf_token" }),
    });
  });
}
