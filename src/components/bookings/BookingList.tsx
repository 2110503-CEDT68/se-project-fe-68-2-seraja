"use client";

import { Booking } from "@/types";
import BookingCard from "./BookingCard";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";

interface BookingListProps {
  bookings: Booking[];
  loading?: boolean;
  onEdit?: (booking: Booking) => void;
  onDelete?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
  highlightToday?: boolean;
}

export default function BookingList({
  bookings,
  loading = false,
  onEdit,
  onDelete,
  onCancel,
  onCheckIn,
  onCheckOut,
  highlightToday = false,
}: BookingListProps) {
  if (loading) {
    return <LoadingState message="Loading bookings..." />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        title="No Bookings Yet"
        message="You have not made any bookings yet."
      />
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper to check if booking is checkout/checkin today
  const isCheckoutToday = (b: Booking) => {
    const checkOut = new Date(b.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
    return checkOut.getTime() === today.getTime();
  };
  const isCheckinToday = (b: Booking) => {
    const checkIn = new Date(b.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    return checkIn.getTime() === today.getTime();
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {bookings.map((booking) => {
        const checkoutToday = isCheckoutToday(booking);
        const checkinToday = isCheckinToday(booking);
        const showHighlight = highlightToday && (checkoutToday || checkinToday);

        return showHighlight ? (
          <div key={booking._id} className="relative">
            {/* Left border indicator: green for check-in, orange for check-out, blue for both */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg ${
                checkoutToday && checkinToday
                  ? "bg-blue-500"
                  : checkoutToday
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            ></div>
            <div className="ml-2">
              <BookingCard
                booking={booking}
                onEdit={onEdit}
                onDelete={onDelete}
                onCancel={onCancel}
                onCheckIn={onCheckIn}
                onCheckOut={onCheckOut}
              />
            </div>
          </div>
        ) : (
          <BookingCard
            key={booking._id}
            booking={booking}
            onEdit={onEdit}
            onDelete={onDelete}
            onCancel={onCancel}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
          />
        );
      })}
    </div>
  );
}
