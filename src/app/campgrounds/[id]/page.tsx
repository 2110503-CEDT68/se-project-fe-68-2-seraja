"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import PageContainer from "@/components/layout/PageContainer"
import CampgroundDetailCard from "@/components/campgrounds/CampgroundDetailCard"
import BookingForm from "@/components/bookings/BookingForm"
import Modal from "@/components/ui/Modal"
import ErrorState from "@/components/common/ErrorState"
import { useCampgrounds } from "@/libs/hooks/useCampgrounds"
import { useBookings } from "@/libs/hooks/useBookings"
import { useAuth } from "@/libs/hooks/useAuth"

export default function CampgroundDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()
  const { singleCampground, getCampgroundById, loading, error } = useCampgrounds()
  const { createBooking, loading: bookingLoading, error: bookingError } = useBookings()

  const campgroundId = params?.id as string
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (campgroundId) getCampgroundById(campgroundId)
  }, [campgroundId])

  const handleBook = (id: string) => {
    if (!user) {
      router.push("/login")
      return
    }
    setBookingSuccess(false)
    setModalOpen(true)
  }

  const handleBookingSubmit = async (campId: string, checkInDate: string, checkOutDate: string) => {
    try {
      await createBooking(campId, checkInDate, checkOutDate)
      setBookingSuccess(true)
    } catch {
      // error is handled by useBookings
    }
  }

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        {error ? (
          <ErrorState
            message={error}
            onRetry={() => getCampgroundById(campgroundId)}
          />
        ) : (
          <CampgroundDetailCard
            campground={singleCampground}
            loading={loading}
            onBack={() => router.back()}
            onBook={handleBook}
          />
        )}
      </PageContainer>

      {/* Booking Modal */}
      <Modal
        open={modalOpen}
        title={`Book — ${singleCampground?.name ?? "Campground"}`}
        onClose={() => setModalOpen(false)}
      >
        {bookingSuccess ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900">Booking Confirmed!</h3>
            <p className="text-sm text-gray-500">
              Your booking at{" "}
              <span className="font-medium">{singleCampground?.name}</span> has been placed.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => router.push("/bookings")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                View My Bookings
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <BookingForm
            campId={campgroundId}
            onSubmit={handleBookingSubmit}
            loading={bookingLoading}
            error={bookingError ?? undefined}
          />
        )}
      </Modal>
    </>
  )
}