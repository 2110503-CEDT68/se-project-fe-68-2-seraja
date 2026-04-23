"use client";

import { useEffect } from "react";
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
              reviews={reviews}
              averageRating={averageRating}
              loading={loading && reviews.length === 0}
            />
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
