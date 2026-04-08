"use client"

import { useState } from "react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

interface BookingFormProps {
  campId: string
  onSubmit: (campId: string, checkInDate: string, checkOutDate: string) => Promise<void> | void
  loading?: boolean
  error?: string
}

export default function BookingForm({
  campId,
  onSubmit,
  loading = false,
  error,
}: BookingFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError("")

    if (!checkInDate || !checkOutDate) {
      setLocalError("Please select both check-in and check-out dates.")
      return
    }
    if (checkOutDate <= checkInDate) {
      setLocalError("Check-out date must be after check-in date.")
      return
    }

    // Validate max 3 nights
    const msPerDay = 24 * 60 * 60 * 1000
    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / msPerDay)
    if (nights > 3) {
      setLocalError("Maximum stay is 3 nights.")
      return
    }

    await onSubmit(campId, checkInDate, checkOutDate)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Check-in Date"
        type="date"
        min={today}
        value={checkInDate}
        onChange={(e) => {
          setCheckInDate(e.target.value)
          if (checkOutDate && e.target.value >= checkOutDate) setCheckOutDate("")
        }}
        required
      />
      <Input
        label="Check-out Date"
        type="date"
        min={checkInDate || today}
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
        required
      />

      {/* Nights summary */}
      {checkInDate && checkOutDate && checkOutDate > checkInDate && (
        <p className="text-sm text-gray-500">
          🌙 {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)} night(s)
        </p>
      )}

      {(localError || error) && (
        <p className="text-sm text-red-500">{localError || error}</p>
      )}

      <Button type="submit" loading={loading} fullWidth>
        Confirm Booking
      </Button>
    </form>
  )
}