import { Campground } from "@/types";

export type SortOption = "default" | "name-az" | "name-za" | "rating-low-high" | "rating-high-low";

export type RatingFilter =
  | "all"
  | "unrated"
  | "0-1"
  | "1-2"
  | "2-3"
  | "3-4"
  | "4-5";

export function filterCampgroundsByRating(
  list: Campground[],
  filter: RatingFilter,
): Campground[] {
  if (filter === "all") return list;
  if (filter === "unrated") {
    return list.filter(
      (c) =>
        typeof c.averageRating !== "number" ||
        Number.isNaN(c.averageRating),
    );
  }
  const [lo, hi] = filter.split("-").map(Number);
  return list.filter((c) => {
    const hasRating =
      typeof c.averageRating === "number" && !Number.isNaN(c.averageRating);
    if (!hasRating) return false;
    const r = c.averageRating as number;
    return filter === "4-5" ? r >= lo && r <= hi : r >= lo && r < hi;
  });
}

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