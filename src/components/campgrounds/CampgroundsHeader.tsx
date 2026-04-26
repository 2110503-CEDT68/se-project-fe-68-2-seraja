"use client";

import { RatingFilter, SortOption } from "@/libs/utils/campgroundSort";

interface CampgroundsHeaderProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  ratingFilter: RatingFilter;
  onRatingFilterChange: (filter: RatingFilter) => void;
}

const selectClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function CampgroundsHeader({
  sort,
  onSortChange,
  ratingFilter,
  onRatingFilterChange,
}: CampgroundsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campgrounds</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse campgrounds and book your next stay.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Rating:</label>
          <select
            data-testid="rating-filter-select"
            value={ratingFilter}
            onChange={(e) =>
              onRatingFilterChange(e.target.value as RatingFilter)
            }
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="unrated">Unrated</option>
            <option value="1-2">1 - 2</option>
            <option value="2-3">2 - 3</option>
            <option value="3-4">3 - 4</option>
            <option value="4-5">4 - 5</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Sort by:</label>
          <select
            data-testid="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={selectClass}
          >
            <option value="default">Default</option>
            <option value="name-az">Name: A → Z</option>
            <option value="name-za">Name: Z → A</option>
            <option value="rating-low-high">Rating: Low → High</option>
            <option value="rating-high-low">Rating: High → Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
