"use client"

import { Campground } from "@/libs/types"
import CampgroundCard from "./CampgroundCard"
import LoadingState from "@/components/common/LoadingState"
import EmptyState from "@/components/common/EmptyState"

interface CampgroundListProps {
  campgrounds: Campground[]
  loading?: boolean
  onView?: (id: string) => void
  onBook?: (id: string) => void
}

export default function CampgroundList({
  campgrounds,
  loading = false,
  onView,
  onBook,
}: CampgroundListProps) {
  if (loading) {
    return <LoadingState message="Loading campgrounds..." />
  }

  if (!campgrounds || campgrounds.length === 0) {
    return (
      <EmptyState
        title="No Campgrounds"
        message="There are no campgrounds to display right now."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campgrounds.map((camp) => (
        <CampgroundCard
          key={camp._id}
          campground={camp}
          onView={onView}
          onBook={onBook}
        />
      ))}
    </div>
  )
}