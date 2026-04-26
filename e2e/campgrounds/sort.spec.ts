import { test, expect } from "@playwright/test";
import { mockCampgroundsApi } from "../helpers/mock-api";
import { mockCampgrounds } from "../fixtures/campgrounds";

test.describe("Campground sorting", () => {
  test.beforeEach(async ({ page }) => {
    await mockCampgroundsApi(page);
    await page.goto("/campgrounds");
    await expect(page.getByTestId("campground-card").first()).toBeVisible();
  });

  test("displays all campgrounds on load", async ({ page }) => {
    const cards = page.getByTestId("campground-card");
    await expect(cards).toHaveCount(mockCampgrounds.length);
  });

  test("default sort preserves API order", async ({ page }) => {
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual([
      "Cedar Valley Camp",
      "Alpine Retreat",
      "Emerald Lakeside",
      "Beach Haven",
      "Desert Star Camp",
    ]);
  });

  test("sort by Name A → Z", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("name-az");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual([
      "Alpine Retreat",
      "Beach Haven",
      "Cedar Valley Camp",
      "Desert Star Camp",
      "Emerald Lakeside",
    ]);
  });

  test("sort by Name Z → A", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("name-za");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual([
      "Emerald Lakeside",
      "Desert Star Camp",
      "Cedar Valley Camp",
      "Beach Haven",
      "Alpine Retreat",
    ]);
  });

  test("sort by Rating Low → High", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("rating-low-high");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual([
      "Desert Star Camp",
      "Emerald Lakeside",
      "Cedar Valley Camp",
      "Beach Haven",
      "Alpine Retreat",
    ]);
  });

  test("sort by Rating High → Low", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("rating-high-low");
    const names = await page.getByTestId("campground-name").allTextContents();
    expect(names).toEqual([
      "Alpine Retreat",
      "Beach Haven",
      "Cedar Valley Camp",
      "Emerald Lakeside",
      "Desert Star Camp",
    ]);
  });

  test("switching sort options updates order immediately", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("name-az");
    let names = await page.getByTestId("campground-name").allTextContents();
    expect(names[0]).toBe("Alpine Retreat");

    await page.getByTestId("sort-select").selectOption("name-za");
    names = await page.getByTestId("campground-name").allTextContents();
    expect(names[0]).toBe("Emerald Lakeside");
  });
});
