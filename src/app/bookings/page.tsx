"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import BookingList from "@/components/bookings/BookingList";
import BookingsHeader from "@/components/bookings/BookingsHeader";
import RoleBanner from "@/components/bookings/RoleBanner";
import TimeframeFilterTabs from "@/components/bookings/TimeframeFilterTabs";
import StatusFilterBar from "@/components/bookings/StatusFilterBar";
import UserStatsPanel from "@/components/bookings/UserStatsPanel";
import BookingsPagination from "@/components/bookings/BookingsPagination";
import EditBookingModal from "@/components/bookings/EditBookingModal";
import GuestBookingModal from "@/components/bookings/GuestBookingModal";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import { ITEMS_PER_PAGE, Role, ROLE_CONFIG } from "@/components/bookings/constants";
import { useBookings } from "@/libs/hooks/useBookings";
import { useAuth } from "@/libs/hooks/useAuth";
import { useBookingFilters } from "@/libs/hooks/useBookingFilters";
import { useBookingActions } from "@/libs/hooks/useBookingActions";
import { useEditBookingModal } from "@/libs/hooks/useEditBookingModal";
import { useGuestBookingModal } from "@/libs/hooks/useGuestBookingModal";

export default function BookingsPage() {
  const router = useRouter();
  const { user, logout, isAdmin, loading: authLoading } = useAuth();

  const {
    bookings,
    getBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    createReview,
    exportBookingsCsv,
    loading,
    error,
  } = useBookings();

  const filters = useBookingFilters(bookings);
  const actions = useBookingActions({
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    createReview,
    refresh: getBookings,
  });
  const editModal = useEditBookingModal({
    updateBooking,
    refresh: getBookings,
  });
  const guestModal = useGuestBookingModal({
    createBooking,
    refresh: getBookings,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) getBookings();
  }, [user, getBookings]);

  const role = (user?.role ?? "user") as Role;
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.user;

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

  const hasBookings = !loading && bookings.length > 0;
  const isOwnerOrAdmin = role === "campOwner" || role === "admin";

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        <BookingsHeader
          config={config}
          role={role}
          onOpenGuestModal={guestModal.open}
          onExport={exportBookingsCsv}
        />

        <RoleBanner role={role} />

        {isOwnerOrAdmin && hasBookings && (
          <TimeframeFilterTabs
            bookings={bookings}
            active={filters.timeframeFilter}
            onChange={(next) => {
              filters.setTimeframeFilter(next);
              filters.setStatusFilter(null);
            }}
          />
        )}

        {role === "user" && hasBookings && <UserStatsPanel bookings={bookings} />}

        {hasBookings && (
          <StatusFilterBar
            timeframeFilteredBookings={filters.timeframeFilteredBookings}
            active={filters.statusFilter}
            onChange={filters.setStatusFilter}
          />
        )}

        {error ? (
          <ErrorState message={error} onRetry={getBookings} />
        ) : (
          <>
            <BookingList
              bookings={filters.pagedBookings}
              loading={loading && bookings.length === 0}
              onEdit={role !== "campOwner" ? editModal.open : undefined}
              onCancel={actions.handleCancel}
              onCheckIn={role === "campOwner" ? actions.handleCheckIn : undefined}
              onCheckOut={role === "campOwner" ? actions.handleCheckOut : undefined}
              onReview={role === "user" ? actions.handleReview : undefined}
              highlightToday={isOwnerOrAdmin}
            />

            <BookingsPagination
              total={filters.filteredBookings.length}
              pageSize={ITEMS_PER_PAGE}
              currentPage={filters.currentPage}
              onChange={filters.setCurrentPage}
            />
          </>
        )}
      </PageContainer>

      <EditBookingModal
        editingBooking={editModal.editingBooking}
        editSuccess={editModal.editSuccess}
        editError={editModal.editError}
        loading={loading}
        close={editModal.close}
        submit={editModal.submit}
      />

      <GuestBookingModal
        isOpen={guestModal.isOpen}
        close={guestModal.close}
        reset={guestModal.reset}
        campId={guestModal.campId}
        setCampId={guestModal.setCampId}
        name={guestModal.name}
        setName={guestModal.setName}
        tel={guestModal.tel}
        setTel={guestModal.setTel}
        loading={guestModal.loading}
        error={guestModal.error}
        success={guestModal.success}
        submit={guestModal.submit}
      />
    </>
  );
}
