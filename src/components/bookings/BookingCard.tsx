"use client"

import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Booking } from "@/libs/types"

interface BookingCardProps {
  booking: Booking
  onEdit?: (booking: Booking) => void
  onDelete?: (bookingId: string) => void
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const { _id, checkInDate, checkOutDate, nightsCount, campground, createdAt, guestName, guestTel } = booking

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const isUpcoming  = new Date(checkInDate) >= new Date()
  const isGuestBook = !!guestName

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{campground.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{campground.district}, {campground.province}</p>
          </div>
          <div className="flex items-center gap-2">
            {isGuestBook && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                Guest booking
              </span>
            )}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isUpcoming ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
              {isUpcoming ? "Upcoming" : "Past"}
            </span>
          </div>
        </div>

        {/* Guest info (if guest booking) */}
        {isGuestBook && (
          <div className="rounded-lg border border-purple-100 bg-purple-50 px-4 py-3 flex flex-col gap-1">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Guest Info</p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Name:</span> {guestName}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tel:</span> {guestTel}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(checkInDate)}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(checkOutDate)}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-gray-600">
          {nightsCount && (
            <p><span className="font-medium text-gray-800">🌙 Nights:</span> {nightsCount}</p>
          )}
          <p><span className="font-medium text-gray-800">📍 Address:</span> {campground.address}</p>
          <p><span className="font-medium text-gray-800">📞 Tel:</span> {campground.tel}</p>
          <p><span className="font-medium text-gray-800">🗓️ Booked on:</span> {formatDate(createdAt)}</p>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && isUpcoming && (
          <div className="mt-2 flex gap-3">
            {onEdit && (
              <Button variant="outline" fullWidth onClick={() => onEdit(booking)}>Edit</Button>
            )}
            {onDelete && (
              <Button variant="danger" fullWidth onClick={() => onDelete(_id)}>Cancel</Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}