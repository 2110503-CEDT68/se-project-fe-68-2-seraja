"use client"

import { useEffect, useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import PageContainer from "@/components/layout/PageContainer"
import CampgroundCard from "@/components/campgrounds/CampgroundCard"
import LoadingState from "@/components/common/LoadingState"
import ErrorState from "@/components/common/ErrorState"
import EmptyState from "@/components/common/EmptyState"
import { useCampgrounds } from "@/libs/hooks/useCampgrounds"
import { useAuth } from "@/libs/hooks/useAuth"
import { Campground } from "@/libs/types"

// ── Star rating reducer (same pattern as reference CardPanel) ──────────────
type RatingMap = Map<string, number>
type RatingAction =
  | { type: "SET"; id: string; value: number }
  | { type: "CLEAR"; id: string }

function ratingReducer(state: RatingMap, action: RatingAction): RatingMap {
  const next = new Map(state)
  if (action.type === "SET") next.set(action.id, action.value)
  if (action.type === "CLEAR") next.delete(action.id)
  return next
}

// ── Sort options ──────────────────────────────────────────────────────────
type SortOption = "default" | "rating-high" | "rating-low" | "name-az" | "name-za"

function sortCampgrounds(
  campgrounds: Campground[],
  ratings: RatingMap,
  sort: SortOption
): Campground[] {
  const list = [...campgrounds]
  switch (sort) {
    case "rating-high":
      return list.sort((a, b) => (ratings.get(b._id) ?? 0) - (ratings.get(a._id) ?? 0))
    case "rating-low":
      return list.sort((a, b) => (ratings.get(a._id) ?? 0) - (ratings.get(b._id) ?? 0))
    case "name-az":
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case "name-za":
      return list.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return list
  }
}

// ── Star component ────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-0.5" onClick={(e) => e.preventDefault()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(star) }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-xl leading-none transition-transform hover:scale-110 focus:outline-none"
        >
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
      {value > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(0) }}
          className="ml-1 text-xs text-gray-400 hover:text-red-400"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function CampgroundsPage() {
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()
  const { campgrounds, getCampgrounds, loading, error } = useCampgrounds()
  const [ratings, dispatch] = useReducer(ratingReducer, new Map())
  const [sort, setSort] = useState<SortOption>("default")

  useEffect(() => { getCampgrounds() }, [])

  const sorted = sortCampgrounds(campgrounds, ratings, sort)

  const handleView = (id: string) => router.push(`/campgrounds/${id}`)
  const handleBook = (id: string) => router.push(`/campgrounds/${id}`)

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        {/* Header + Sort controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campgrounds</h1>
            <p className="mt-1 text-sm text-gray-500">
              Rate campgrounds with ★ then sort by your ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="rating-high">⭐ Rating: High → Low</option>
              <option value="rating-low">⭐ Rating: Low → High</option>
              <option value="name-az">Name: A → Z</option>
              <option value="name-za">Name: Z → A</option>
            </select>
          </div>
        </div>

        {/* Rated summary bar */}
        {ratings.size > 0 && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-sm font-medium text-yellow-800">
              You rated {ratings.size} campground{ratings.size > 1 ? "s" : ""}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {Array.from(ratings.entries()).map(([id, rating]) => {
                const camp = campgrounds.find((c) => c._id === id)
                return camp ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
                  >
                    {camp.name}: {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading campgrounds..." />
        ) : error ? (
          <ErrorState message={error} onRetry={getCampgrounds} />
        ) : sorted.length === 0 ? (
          <EmptyState title="No Campgrounds" message="There are no campgrounds available right now." />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {sorted.map((camp) => (
              <div key={camp._id} className="flex flex-col">
                <CampgroundCard
                  campground={camp}
                  onView={handleView}
                  onBook={handleBook}
                />
                {/* Star rating below each card */}
                <div className="mt-2 flex items-center justify-between rounded-b-xl border border-t-0 border-gray-100 bg-white px-4 py-2 shadow-sm">
                  <span className="text-xs text-gray-500">Your rating:</span>
                  <StarRating
                    value={ratings.get(camp._id) ?? 0}
                    onChange={(v) =>
                      v === 0
                        ? dispatch({ type: "CLEAR", id: camp._id })
                        : dispatch({ type: "SET", id: camp._id, value: v })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}