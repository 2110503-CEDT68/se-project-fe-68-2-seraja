"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import CampgroundsHeader from "@/components/campgrounds/CampgroundsHeader";
import CampgroundsGrid from "@/components/campgrounds/CampgroundsGrid";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { useCampgrounds } from "@/libs/hooks/useCampgrounds";
import { useAuth } from "@/libs/hooks/useAuth";
import {
  RatingFilter,
  SortOption,
  filterCampgroundsByRating,
  sortCampgrounds,
} from "@/libs/utils/campgroundSort";

export default function CampgroundsPage() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { campgrounds, getCampgrounds, loading, error } = useCampgrounds();
  const [sort, setSort] = useState<SortOption>("default");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  useEffect(() => {
    getCampgrounds();
  }, [getCampgrounds]);

  const sorted = useMemo(() => {
    const filtered = filterCampgroundsByRating(campgrounds, ratingFilter);
    return sortCampgrounds(filtered, sort);
  }, [campgrounds, sort, ratingFilter]);

  const handleView = (id: string) => router.push(`/campgrounds/${id}`);

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        <CampgroundsHeader
          sort={sort}
          onSortChange={setSort}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
        />

        {loading ? (
          <LoadingState message="Loading campgrounds..." />
        ) : error ? (
          <ErrorState message={error} onRetry={getCampgrounds} />
        ) : sorted.length === 0 ? (
          ratingFilter !== "all" && campgrounds.length > 0 ? (
            <EmptyState
              title="No Matches"
              message="No reviews match your selected filter."
            />
          ) : (
            <EmptyState
              title="No Campgrounds"
              message="There are no campgrounds available right now."
            />
          )
        ) : (
          <CampgroundsGrid
            campgrounds={sorted}
            onView={handleView}
          />
        )}
      </PageContainer>
    </>
  );
}
