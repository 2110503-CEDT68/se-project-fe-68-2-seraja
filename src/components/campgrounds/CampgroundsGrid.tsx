"use client";

import { Campground } from "@/types";
import CampgroundCard from "./CampgroundCard";

interface CampgroundsGridProps {
  campgrounds: Campground[];
  onView: (id: string) => void;
}

export default function CampgroundsGrid({
  campgrounds,
  onView,
}: CampgroundsGridProps) {
  return (
    <div
      data-testid="campgrounds-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {campgrounds.map((camp) => (
        <CampgroundCard
          key={camp._id}
          campground={camp}
          onView={onView}
        />
      ))}
    </div>
  );
}
