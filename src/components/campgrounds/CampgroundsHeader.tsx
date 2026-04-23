"use client";

import { SortOption } from "@/libs/utils/campgroundSort";

interface CampgroundsHeaderProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function CampgroundsHeader({
  sort,
  onSortChange,
}: CampgroundsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campgrounds</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse campgrounds and book your next stay.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Sort by:</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default</option>
          <option value="name-az">Name: A → Z</option>
          <option value="name-za">Name: Z → A</option>
          <option value="rating-low-high">Rating: Low → High</option>
          <option value="rating-high-low">Rating: High → Low</option>
        </select>
      </div>
    </div>
  );
}
