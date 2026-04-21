"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  onEdit?: (booking: Booking) => void;
  onDelete?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  "checked-in": "bg-green-100 text-green-700",
  "checked-out": "bg-gray-200 text-gray-500",
  cancelled: "bg-red-100 text-red-600",
  "late-checkout": "bg-orange-100 text-orange-700 border border-orange-300 font-bold animate-pulse",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  "checked-in": "Checked In",
  "checked-out": "Checked Out",
  cancelled: "Cancelled",
  "late-checkout": "Late Checked Out",
};

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  onCancel,
  onCheckIn,
  onCheckOut,
}: BookingCardProps) {
  const {
    _id,
    checkInDate,
    checkOutDate,
    nightsCount,
    campground,
    createdAt,
    guestName,
    guestTel,
    user,
    status,
    actualCheckIn,
    actualCheckOut,
  } = booking;

  const now = new Date();
  let isOverdue = false;
  let isLateCheckedOut = false;

  if (checkOutDate) {
    const checkoutLimit = new Date(checkOutDate);
    checkoutLimit.setHours(13, 0, 0, 0);

    isOverdue = status === "checked-in" && now > checkoutLimit;

    if (status === "checked-out" && actualCheckOut) {
      isLateCheckedOut = new Date(actualCheckOut) > checkoutLimit;
    }
  }
  const displayStatus = isLateCheckedOut ? "late-checked-out" : status;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const isUpcoming = new Date(checkInDate) >= new Date();
  const isGuestBook = !!guestName;

  const showActions = onEdit || onDelete || onCancel || onCheckIn || onCheckOut;
  const canEdit = onEdit && status === "confirmed";
  const canCancel = onCancel && status === "confirmed";
  const canCheckIn = onCheckIn && status === "confirmed";
  const canCheckOut = onCheckOut && status === "checked-in";
  const canDelete = onDelete && status === "cancelled";

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {campground.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {campground.district}, {campground.province}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isGuestBook ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                Guest booking
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                Registered user
              </span>
            )}
            {status && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}
              >
                {STATUS_LABELS[status] ?? status}
              </span>
            )}

            {isOverdue && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse">
                Late Checkout
              </span>
            )}

            {isLateCheckedOut && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Late Check Out
              </span>
            )}
          </div>
        </div>

        {/* Info Box (Guest or User) */}
        {(isGuestBook || user) && (
          <div
            className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${
              isGuestBook
                ? "border-purple-100 bg-purple-50"
                : "border-blue-100 bg-blue-50"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                isGuestBook ? "text-purple-600" : "text-blue-600"
              }`}
            >
              {isGuestBook ? "Guest Info" : "User Info"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Name:</span>{" "}
              {isGuestBook ? guestName : user?.name}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tel:</span>{" "}
              {isGuestBook ? guestTel : user?.tel}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Check-in
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDate(checkInDate)} - 12.00 PM
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Check-out
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDate(checkOutDate)} - 1.00 PM
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-gray-600">
          {nightsCount && (
            <p>
              <span className="font-medium text-gray-800">🌙 Nights:</span>{" "}
              {nightsCount}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-800">📍 Address:</span>{" "}
            {campground.address}
          </p>
          <p>
            <span className="font-medium text-gray-800">📞 Tel:</span>{" "}
            {campground.tel}
          </p>
          <p>
            <span className="font-medium text-gray-800">🗓️ Booked on:</span>{" "}
            {formatDate(createdAt)}
          </p>
          {actualCheckIn && (
            <p>
              <span className="font-medium text-gray-800">✅ Checked in:</span>{" "}
              {formatDateTime(actualCheckIn)}
            </p>
          )}
          {actualCheckOut && (
            <p>
              <span className="font-medium text-gray-800">🚪 Checked out:</span>{" "}
              {formatDateTime(actualCheckOut)}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-2 flex gap-3 flex-wrap">
            {canEdit && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => onEdit!(booking)}
              >
                Edit
              </Button>
            )}
            {canCancel && (
              <Button variant="danger" fullWidth onClick={() => onCancel!(_id)}>
                Cancel
              </Button>
            )}
            {canCheckIn && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => onCheckIn!(_id)}
              >
                Check In
              </Button>
            )}
            {canCheckOut && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => onCheckOut!(_id)}
              >
                {isOverdue ? "Check Out (Late)" : "Check Out"}
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" fullWidth onClick={() => onDelete!(_id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
