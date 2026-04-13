"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import BookingList from "@/components/bookings/BookingList";
import Modal from "@/components/ui/Modal";
import BookingForm from "@/components/bookings/BookingForm";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import { useBookings } from "@/libs/hooks/useBookings";
import { useAuth } from "@/libs/hooks/useAuth";
import { Booking } from "@/types";

const ROLE_CONFIG = {
  user: {
    title: "My Bookings",
    description: "View and manage your personal campground bookings.",
    badge: "User",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  admin: {
    title: "All Bookings",
    description:
      "Administrator view — manage all bookings across all campgrounds.",
    badge: "Admin",
    badgeColor: "bg-red-100 text-red-700",
  },
  campOwner: {
    title: "Campground Bookings",
    description: "View and manage bookings for your campgrounds.",
    badge: "Camp Owner",
    badgeColor: "bg-green-100 text-green-700",
  },
};

export default function BookingsPage() {
  const router = useRouter();
  const { user, logout, isAdmin, loading: authLoading } = useAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    bookings,
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    loading,
    error,
  } = useBookings();

  const [timeframeFilter, setTimeframeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");

  // Guest booking modal (campOwner / admin)
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestCampId, setGuestCampId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestTel, setGuestTel] = useState("");
  const [guestSuccess, setGuestSuccess] = useState(false);
  const [guestError, setGuestError] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);

  const role = (user?.role ?? "user") as keyof typeof ROLE_CONFIG;
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.user;

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) getBookings();
  }, [user]);

  // ── CSV Export ────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://cedt-be-for-fe-proj.vercel.app/api/v1"}/bookings/export`,
        {
          headers: {
            Authorization: `Bearer ${(user as any)?.token ?? ""}`,
          },
        },
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export bookings. Please try again.");
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────
  const handleEdit = (booking: Booking) => {
    setEditSuccess(false);
    setEditError("");
    setEditingBooking(booking);
  };

  const handleEditSubmit = async (
    campId: string,
    checkInDate: string,
    checkOutDate: string,
  ) => {
    if (!editingBooking) return;
    setEditError("");
    try {
      await updateBooking(editingBooking._id, checkInDate, checkOutDate);
      setEditSuccess(true);
      await getBookings();
    } catch (err: any) {
      setEditError(err.message || "Failed to update booking.");
      throw err;
    }
  };

  // ── Cancel ────────────────────────────────────────────────────────────
  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId);
      await getBookings();
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking.");
    }
  };

  // ── Check In / Check Out (campOwner) ──────────────────────────────────
  const handleCheckIn = async (bookingId: string) => {
    if (!confirm("Confirm check-in for this guest?")) return;
    try {
      await checkInBooking(bookingId);
      await getBookings();
    } catch (err: any) {
      alert(err.message || "Failed to check in.");
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    if (!confirm("Confirm check-out for this guest?")) return;
    try {
      await checkOutBooking(bookingId);
      await getBookings();
    } catch (err: any) {
      alert(err.message || "Failed to check out.");
    }
  };

  // ── Guest booking (campOwner / admin) ─────────────────────────────────
  const openGuestModal = () => {
    setGuestModalOpen(true);
    setGuestSuccess(false);
    setGuestError("");
    setGuestCampId("");
    setGuestName("");
    setGuestTel("");
  };

  const handleGuestSubmit = async (
    campId: string,
    checkInDate: string,
    checkOutDate: string,
  ) => {
    if (!guestName.trim() || !guestTel.trim()) {
      setGuestError("Guest name and telephone are required.");
      return;
    }
    if (!campId.trim()) {
      setGuestError("Campground ID is required.");
      return;
    }
    setGuestLoading(true);
    setGuestError("");
    try {
      await createBooking(
        campId,
        checkInDate,
        checkOutDate,
        guestName,
        guestTel,
      );
      setGuestSuccess(true);
      await getBookings();
    } catch (err: any) {
      setGuestError(err.message || "Failed to create guest booking.");
    } finally {
      setGuestLoading(false);
    }
  };

  const STATUS_FILTERS = [
    { key: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" },
    { key: "checked-in", label: "Checked In", color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" },
    { key: "checked-out", label: "Checked Out", color: "bg-gray-200 text-gray-600 border-gray-200 hover:bg-gray-200" },
    { key: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-600 border-red-200 hover:bg-red-200" },
  ] as const;

    
  const timeframeFilteredBookings = bookings.filter((b) => {
  if (!timeframeFilter) return true;
  if (timeframeFilter === "today") {
    return new Date(b.checkInDate).setHours(0, 0, 0, 0) === today.getTime() ||
           new Date(b.checkOutDate).setHours(0, 0, 0, 0) === today.getTime();
  }
  if (timeframeFilter === "thisWeek") {
    const checkIn = new Date(b.checkInDate).setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
    return checkIn > today.getTime() && checkIn <= weekFromNow;
  }
  if (timeframeFilter === "later") {
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
    return new Date(b.checkInDate).setHours(0, 0, 0, 0) > weekFromNow;
  }
  return true;
});

const filteredBookings = statusFilter
  ? timeframeFilteredBookings.filter((b) => b.status === statusFilter)
  : timeframeFilteredBookings;
  
  if (authLoading) {
    return (
      <>
        <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />
        <PageContainer>
          <LoadingState message="Loading..." />
        </PageContainer>
      </>
    );
  }

}