import { Campground } from "@/types";

export type SortOption = "default" | "name-az" | "name-za" | "rating-low-high" | "rating-high-low";

export function sortCampgrounds(
  campgrounds: Campground[],
  sort: SortOption,
): Campground[] {
  const list = [...campgrounds];

  switch (sort) {
    case "name-az":
      return list.sort((a, b) => a.name.localeCompare(b.name));

    case "name-za":
      return list.sort((a, b) => b.name.localeCompare(a.name));

    case "rating-low-high":
      return list.sort(
        (a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0)
      );

    case "rating-high-low":
      return list.sort(
        (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
      );

    default:
      return list;
  }
}