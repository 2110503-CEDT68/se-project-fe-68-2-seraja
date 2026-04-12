"use client";

import { useEffect } from "react";
import { useBookings } from "@/libs/hooks/useBookings";

export default function TodayCheckoutsSummary() {
  const {
    todayCheckouts,
    getTodayCheckouts,
    checkOutBooking,
    loading,
    error,
  } = useBookings();

  useEffect(() => {
    getTodayCheckouts();
  }, []);

  const handleCheckOut = async (bookingId: string) => {
    try {
      await checkOutBooking(bookingId);
      await getTodayCheckouts();
    } catch (err) {
      console.error("Check-out failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Today&apos;s Check-outs
          </h2>
          <p className="text-sm text-gray-500">
            Guests expected to check out today
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
          {todayCheckouts.length} booking{todayCheckouts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500 py-4">Loading today&apos;s check-outs...</div>
      )}

      {error && (
        <div className="text-sm text-red-500 py-4">{error}</div>
      )}

      {!loading && !error && todayCheckouts.length === 0 && (
        <div className="text-sm text-gray-500 py-4">
          No check-outs scheduled for today.
        </div>
      )}

      {!loading && !error && todayCheckouts.length > 0 && (
        <div className="space-y-4">
          {todayCheckouts.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-800">
                  {booking.guestName || booking.user?.name || "Guest"}
                </p>

                <p className="text-sm text-gray-600">
                  Campground: {booking.campground?.name || "-"}
                </p>

                <p className="text-sm text-gray-600">
                  Check-out Date:{" "}
                  {booking.checkOutDate
                    ? new Date(booking.checkOutDate).toLocaleDateString("en-GB")
                    : "-"}
                </p>

                <p className="text-sm text-gray-600">
                  Tel: {booking.guestTel || booking.user?.tel || "-"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  {booking.status}
                </span>

                <button
                  onClick={() => handleCheckOut(booking._id)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                >
                  Check-out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}