import { test, expect } from "@playwright/test";
import { mockCampgroundsApi } from "../helpers/mock-api";
import { mockCampgrounds } from "../fixtures/campgrounds";

test.describe("Campground rating filter", () => {
  test.beforeEach(async ({ page }) => {
    await mockCampgroundsApi(page);
    await page.goto("/campgrounds");
    await expect(page.getByTestId("campground-card").first()).toBeVisible();
  });

  test("default filter 'All' shows every campground", async ({ page }) => {
    await expect(page.getByTestId("rating-filter-select")).toHaveValue("all");
    const cards = page.getByTestId("campground-card");
    await expect(cards).toHaveCount(mockCampgrounds.length);
  });

  test("filter 0 - 1 shows no campgrounds", async ({ page }) => {
    await page.getByTestId("rating-filter-select").selectOption("0-1");
    await expect(page.getByTestId("campground-card")).toHaveCount(0);
  });

  test("filter 1 - 2 shows only Desert Star Camp", async ({ page }) => {
    await page.getByTestId("rating-filter-select").selectOption("1-2");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual(["Desert Star Camp"]);
  });

  test("filter 2 - 3 shows only Emerald Lakeside", async ({ page }) => {
    await page.getByTestId("rating-filter-select").selectOption("2-3");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual(["Emerald Lakeside"]);
  });

  test("filter 3 - 4 shows only Cedar Valley Camp", async ({ page }) => {
    await page.getByTestId("rating-filter-select").selectOption("3-4");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual(["Cedar Valley Camp"]);
  });

  test("filter 4 - 5 shows campgrounds with ratings 4.0 - 5.0 inclusive", async ({
    page,
  }) => {
    await page.getByTestId("rating-filter-select").selectOption("4-5");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names.sort()).toEqual(["Alpine Retreat", "Beach Haven"]);
  });

  test("filter 'Unrated' shows no campgrounds when all are rated", async ({
    page,
  }) => {
    await page.getByTestId("rating-filter-select").selectOption("unrated");
    await expect(page.getByTestId("campground-card")).toHaveCount(0);
  });

  test("filter combines with sort: 4-5 bucket sorted High → Low", async ({
    page,
  }) => {
    await page.getByTestId("rating-filter-select").selectOption("4-5");
    await page.getByTestId("sort-select").selectOption("rating-high-low");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual(["Alpine Retreat", "Beach Haven"]);
  });

  test("filter combines with sort: 4-5 bucket sorted Low → High", async ({
    page,
  }) => {
    await page.getByTestId("rating-filter-select").selectOption("4-5");
    await page.getByTestId("sort-select").selectOption("rating-low-high");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual(["Beach Haven", "Alpine Retreat"]);
  });

  test("switching filter back to 'All' restores full list", async ({ page }) => {
    await page.getByTestId("rating-filter-select").selectOption("3-4");
    await expect(page.getByTestId("campground-card")).toHaveCount(1);

    await page.getByTestId("rating-filter-select").selectOption("all");
    await expect(page.getByTestId("campground-card")).toHaveCount(
      mockCampgrounds.length,
    );
  });
});
