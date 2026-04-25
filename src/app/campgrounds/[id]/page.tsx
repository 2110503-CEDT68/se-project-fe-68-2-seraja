"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import CampgroundDetailCard from "@/components/campgrounds/CampgroundDetailCard";
import ReviewList from "@/components/campgrounds/ReviewList";
import BookingForm from "@/components/bookings/BookingForm";
import BookingSuccessPanel from "@/components/bookings/BookingSuccessPanel";
import Modal from "@/components/ui/Modal";
import ErrorState from "@/components/common/ErrorState";
import { useCampgrounds } from "@/libs/hooks/useCampgrounds";
import { useBookings } from "@/libs/hooks/useBookings";
import { useBookingModal } from "@/libs/hooks/useBookingModal";
import { useAuth } from "@/libs/hooks/useAuth";

const REVIEWS_PER_PAGE = 6;

export default function CampgroundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { 
    singleCampground, 
    getCampgroundById, 
    reviews,
    averageRating,
    getCampgroundReviews,
    loading, 
    error 
  } = useCampgrounds();
  const {
    createBooking,
    loading: bookingLoading,
    error: bookingError,
  } = useBookings();
  const bookingModal = useBookingModal({ createBooking });

  const campgroundId = params?.id as string;

  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the reviews array changes (e.g. new campground)
  useEffect(() => {
    setCurrentPage(1);
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  useEffect(() => {
    if (campgroundId) {
      getCampgroundById(campgroundId);
      getCampgroundReviews(campgroundId);
    }
  }, [campgroundId, getCampgroundById, getCampgroundReviews]);

  const handleBook = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    bookingModal.open();
  };

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        {error ? (
          <ErrorState
            message={error}
            onRetry={() => {
              getCampgroundById(campgroundId);
              getCampgroundReviews(campgroundId);
            }}
          />
        ) : (
          <>
            <CampgroundDetailCard
              campground={singleCampground}
              loading={loading && !singleCampground}
              onBack={() => router.back()}
              onBook={handleBook}
            />
            
            <ReviewList
              reviews={paginatedReviews}
              averageRating={averageRating}
              loading={loading && reviews.length === 0}
            />
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 mb-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md border text-sm font-medium
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors
                      ${
                        page === currentPage
                          ? "bg-green-600 text-white border-green-600"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md border text-sm font-medium
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-gray-100 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </PageContainer>

      <Modal
        open={bookingModal.isOpen}
        title={`Book — ${singleCampground?.name ?? "Campground"}`}
        onClose={bookingModal.close}
      >
        {bookingModal.success ? (
          <BookingSuccessPanel
            campgroundName={singleCampground?.name}
            onViewBookings={() => router.push("/bookings")}
            onClose={bookingModal.close}
          />
        ) : (
          <BookingForm
            campId={campgroundId}
            onSubmit={bookingModal.submit}
            loading={bookingLoading}
            error={bookingError ?? undefined}
          />
        )}
      </Modal>
    </>
  );
}
