"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import PageContainer from "@/components/layout/PageContainer"
import BookingList from "@/components/bookings/BookingList"
import Modal from "@/components/ui/Modal"
import BookingForm from "@/components/bookings/BookingForm"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ErrorState from "@/components/common/ErrorState"
import LoadingState from "@/components/common/LoadingState"
import { useBookings } from "@/libs/hooks/useBookings"
import { useAuth } from "@/libs/hooks/useAuth"
import { Booking } from "@/libs/types"
import { apiClient } from "@/libs/api/apiClient"

const ROLE_CONFIG = {
  user: {
    title: "My Bookings",
    description: "View and manage your personal campground bookings.",
    badge: "User",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  admin: {
    title: "All Bookings",
    description: "Administrator view — manage all bookings across all campgrounds.",
    badge: "Admin",
    badgeColor: "bg-red-100 text-red-700",
  },
  campOwner: {
    title: "Campground Bookings",
    description: "View and manage bookings for your campgrounds.",
    badge: "Camp Owner",
    badgeColor: "bg-green-100 text-green-700",
  },
}

export default function BookingsPage() {
  const router = useRouter()
  const { user, logout, isAdmin, loading: authLoading } = useAuth()
  const { bookings, getBookings, updateBooking, deleteBooking, loading, error } = useBookings()

  const [editingBooking, setEditingBooking]   = useState<Booking | null>(null)
  const [editSuccess, setEditSuccess]         = useState(false)
  const [editError, setEditError]             = useState("")

  // Guest booking modal (campOwner / admin)
  const [guestModalOpen, setGuestModalOpen]   = useState(false)
  const [guestCampId, setGuestCampId]         = useState("")
  const [guestName, setGuestName]             = useState("")
  const [guestTel, setGuestTel]               = useState("")
  const [guestSuccess, setGuestSuccess]       = useState(false)
  const [guestError, setGuestError]           = useState("")
  const [guestLoading, setGuestLoading]       = useState(false)

  const role   = (user?.role ?? "user") as keyof typeof ROLE_CONFIG
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.user

  useEffect(() => {
    if (!authLoading && !user) router.push("/login")
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) getBookings()
  }, [user])

  // ── CSV Export ────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://cedt-be-for-fe-proj.vercel.app/api/v1"}/bookings/export`,
        {
          headers: {
            Authorization: `Bearer ${(user as any)?.token ?? ""}`,
          },
        }
      )
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Failed to export bookings. Please try again.")
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────
  const handleEdit = (booking: Booking) => {
    setEditSuccess(false)
    setEditError("")
    setEditingBooking(booking)
  }

  const handleEditSubmit = async (campId: string, checkInDate: string, checkOutDate: string) => {
    if (!editingBooking) return
    setEditError("")
    try {
      await updateBooking(editingBooking._id, checkInDate, checkOutDate)
      setEditSuccess(true)
      await getBookings()
    } catch (err: any) {
      setEditError(err.message || "Failed to update booking.")
      throw err
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    try {
      await deleteBooking(bookingId)
      await getBookings()
    } catch (err: any) {
      alert(err.message || "Failed to delete booking.")
    }
  }

  // ── Guest booking (campOwner / admin) ─────────────────────────────────
  const openGuestModal = () => {
    setGuestModalOpen(true)
    setGuestSuccess(false)
    setGuestError("")
    setGuestCampId("")
    setGuestName("")
    setGuestTel("")
  }

  const handleGuestSubmit = async (campId: string, checkInDate: string, checkOutDate: string) => {
    if (!guestName.trim() || !guestTel.trim()) {
      setGuestError("Guest name and telephone are required.")
      return
    }
    if (!campId.trim()) {
      setGuestError("Campground ID is required.")
      return
    }
    setGuestLoading(true)
    setGuestError("")
    try {
      await apiClient(`/campgrounds/${campId}/bookings`, {
        method: "POST",
        body: JSON.stringify({ checkInDate, checkOutDate, guestName, guestTel }),
      })
      setGuestSuccess(true)
      await getBookings()
    } catch (err: any) {
      setGuestError(err.message || "Failed to create guest booking.")
    } finally {
      setGuestLoading(false)
    }
  }

  if (authLoading) {
    return (
      <>
        <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />
        <PageContainer><LoadingState message="Loading..." /></PageContainer>
      </>
    )
  }

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        {/* ── Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeColor}`}>
                {config.badge}
              </span>
            </div>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Guest booking button (campOwner + admin) */}
            {(role === "campOwner" || role === "admin") && (
              <Button variant="outline" onClick={openGuestModal}>
                + Guest Booking
              </Button>
            )}
            {/* CSV Export (campOwner + admin) */}
            {(role === "campOwner" || role === "admin") && (
              <Button variant="secondary" onClick={handleExport}>
                ↓ Export CSV
              </Button>
            )}
          </div>
        </div>

        {/* ── Role banners ── */}
        {role === "admin" && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ You are viewing <strong>all bookings</strong> across the platform as an administrator.
          </div>
        )}
        {role === "campOwner" && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            🏕️ Showing bookings for your campgrounds. Use <strong>Guest Booking</strong> to add walk-in customers. Use <strong>Export CSV</strong> to sync with your own records.
          </div>
        )}

        {/* ── Stats ── */}
        {!loading && bookings.length > 0 && (
          <div className="mb-6 flex gap-4 flex-wrap">
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => new Date(b.checkInDate) >= new Date()).length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">Past</p>
              <p className="text-2xl font-bold text-gray-400">
                {bookings.filter(b => new Date(b.checkInDate) < new Date()).length}
              </p>
            </div>
            {(role === "campOwner" || role === "admin") && (
              <div className="rounded-xl border border-purple-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-500">Guest bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bookings.filter(b => b.guestName).length}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Booking list ── */}
        {error ? (
          <ErrorState message={error} onRetry={getBookings} />
        ) : (
          <BookingList
            bookings={bookings}
            loading={loading}
            onEdit={role !== "campOwner" ? handleEdit : undefined}
            onDelete={handleDelete}
          />
        )}
      </PageContainer>

      {/* ── Edit Modal ── */}
      <Modal
        open={!!editingBooking}
        title={`Edit Booking — ${editingBooking?.campground?.name ?? ""}`}
        onClose={() => { setEditingBooking(null); setEditError("") }}
      >
        {editSuccess ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="text-4xl">✅</div>
            <h3 className="text-lg font-semibold text-gray-900">Booking Updated!</h3>
            <p className="text-sm text-gray-500">Your booking dates have been updated.</p>
            <Button onClick={() => setEditingBooking(null)} className="mt-2">Done</Button>
          </div>
        ) : (
          <BookingForm
            campId={editingBooking?.campground?._id ?? ""}
            onSubmit={handleEditSubmit}
            loading={loading}
            error={editError || undefined}
          />
        )}
      </Modal>

      {/* ── Guest Booking Modal (campOwner / admin) ── */}
      <Modal
        open={guestModalOpen}
        title="New Guest Booking"
        onClose={() => setGuestModalOpen(false)}
      >
        {guestSuccess ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900">Guest Booking Created!</h3>
            <p className="text-sm text-gray-500">The booking has been recorded successfully.</p>
            <div className="flex gap-3 mt-2">
              <Button onClick={() => { setGuestModalOpen(false) }}>Done</Button>
              <Button variant="outline" onClick={() => { setGuestSuccess(false); setGuestName(""); setGuestTel(""); setGuestCampId("") }}>
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Guest info */}
            <div className="rounded-lg border border-purple-100 bg-purple-50 px-4 py-3">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Guest Info</p>
              <div className="flex flex-col gap-3">
                <Input
                  label="Guest Name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  required
                />
                <Input
                  label="Guest Telephone"
                  type="tel"
                  placeholder="e.g. 0812345678"
                  value={guestTel}
                  onChange={e => setGuestTel(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Campground ID */}
            <Input
              label="Campground ID"
              type="text"
              placeholder="Paste campground _id here"
              value={guestCampId}
              onChange={e => setGuestCampId(e.target.value)}
              required
            />

            {/* Dates via BookingForm */}
            <BookingForm
              campId={guestCampId}
              onSubmit={handleGuestSubmit}
              loading={guestLoading}
              error={guestError || undefined}
            />
          </div>
        )}
      </Modal>
    </>
  )
}