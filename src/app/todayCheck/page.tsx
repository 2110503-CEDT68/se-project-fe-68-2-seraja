"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import { useBookings } from "@/libs/hooks/useBookings";
import { useAuth } from "@/libs/hooks/useAuth";
import { Booking } from "@/types";
import Button from "@/components/ui/Button";

const ITEMS_PER_PAGE = 6;

export default function TodayCheckPage() {
  const router = useRouter();
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const {
    bookings,
    getBookings,
    checkInBooking,
    checkOutBooking,
    loading,
    error,
  } = useBookings();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Pagination states
  const [pendingInPage, setPendingInPage] = useState(1);
  const [pendingOutPage, setPendingOutPage] = useState(1);
  const [recentInPage, setRecentInPage] = useState(1);
  const [recentOutPage, setRecentOutPage] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user && user.role !== "campOwner") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "campOwner") {
      getBookings();
    }
  }, [user]);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [currentTime]);

  // --- Data Filtering ---
  const allExpectedToday = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.checkInDate) return false;
      const bDate = new Date(b.checkInDate).toISOString().split("T")[0];
      return bDate === todayStr && b.status === "confirmed";
    });
  }, [bookings, todayStr]);

  const allUpcomingCheckout = useMemo(() => {
    return bookings.filter((b) => b.status === "checked-in");
  }, [bookings]);

  const allArrivedToday = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.checkInDate) return false;
      const bDate = new Date(b.checkInDate).toISOString().split("T")[0];
      return bDate === todayStr && b.status === "checked-in";
    });
  }, [bookings, todayStr]);

  const allCheckedOutToday = useMemo(() => {
    return bookings.filter((b) => {
      if (b.status !== "checked-out") return false;
      if (b.actualCheckOut) {
        const actualDate = new Date(b.actualCheckOut).toISOString().split("T")[0];
        return actualDate === todayStr;
      }
      if (b.checkOutDate) {
        const scheduledDate = new Date(b.checkOutDate).toISOString().split("T")[0];
        return scheduledDate === todayStr;
      }
      return false;
    });
  }, [bookings, todayStr]);

  // --- Paginated Data ---
  const expectedToday = useMemo(() => {
    const start = (pendingInPage - 1) * ITEMS_PER_PAGE;
    return allExpectedToday.slice(start, start + ITEMS_PER_PAGE);
  }, [allExpectedToday, pendingInPage]);

  const upcomingCheckout = useMemo(() => {
    const start = (pendingOutPage - 1) * ITEMS_PER_PAGE;
    return allUpcomingCheckout.slice(start, start + ITEMS_PER_PAGE);
  }, [allUpcomingCheckout, pendingOutPage]);

  const arrivedToday = useMemo(() => {
    const start = (recentInPage - 1) * (ITEMS_PER_PAGE * 2);
    return allArrivedToday.slice(start, start + (ITEMS_PER_PAGE * 2));
  }, [allArrivedToday, recentInPage]);

  const checkedOutToday = useMemo(() => {
    const start = (recentOutPage - 1) * (ITEMS_PER_PAGE * 2);
    return allCheckedOutToday.slice(start, start + (ITEMS_PER_PAGE * 2));
  }, [allCheckedOutToday, recentOutPage]);

  const handleCheckIn = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await checkInBooking(bookingId);
      await getBookings();
    } catch (err: any) {
      alert(err.message || "Failed to check in. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await checkOutBooking(bookingId);
      await getBookings();
    } catch (err: any) {
      alert(err.message || "Failed to check out. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (!isMounted) return null;

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const Pagination = ({ 
    currentPage, 
    totalItems, 
    pageSize,
    onPageChange 
  }: { 
    currentPage: number; 
    totalItems: number; 
    pageSize: number;
    onPageChange: (page: number) => void 
  }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </Button>
        <span className="text-[11px] text-gray-500 font-medium">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </Button>
      </div>
    );
  };

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        <div className="mb-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-3xl text-gray-900 font-bold">Arrivals Monitor</p>
              <p className="text-gray-500 font-sans mt-1">Manage guest arrivals and departures for today.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={getBookings} />
        ) : loading ? (
          <div className="py-24">
            <LoadingState message="Fetching data..." />
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Arrival */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-blue-500 font-sans"></span>
                    Pending Arrival
                    <span className="ml-2 text-l font-sans text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {allExpectedToday.length}
                    </span>
                  </p>
                </div>

                {allExpectedToday.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500 h-[300px] flex items-center justify-center">
                    No more arrivals expected.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {expectedToday.map((booking) => (
                        <div key={booking._id} className="group rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                          <div className="flex flex-col gap-3">
                            <div className="border-b border-gray-100 pb-3">
                              <p className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">
                                ⛺ {booking.campground?.name || "Unknown Camp"}
                              </p>
                              <p className="text-xs text-gray-500 bg-gray-50 p-1.5 rounded-md inline-block w-full text-center">
                                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                              </p>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg line-clamp-1">{booking.guestName || booking.user?.name || "Guest"}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                📞 {booking.guestTel || booking.user?.tel || "No phone"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-2">
                            <Button size="sm" fullWidth onClick={() => handleCheckIn(booking._id)} loading={actionLoading === booking._id}>
                              Check In Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination 
                      currentPage={pendingInPage} 
                      totalItems={allExpectedToday.length} 
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setPendingInPage} 
                    />
                  </>
                )}
              </div>

              {/* Pending Checkout */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-amber-400 font-sans"></span>
                    Upcoming Checkout
                    <span className="ml-2 text-l font-sans text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {allUpcomingCheckout.length}
                    </span>
                  </p>
                </div>

                {allUpcomingCheckout.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500 h-[300px] flex items-center justify-center">
                    No guests pending checkout today.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {upcomingCheckout.map((booking) => (
                        <div key={booking._id} className="group rounded-xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                          <div className="flex flex-col gap-3">
                            <div className="border-b border-amber-100 pb-3">
                              <p className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">
                                ⛺ {booking.campground?.name || "Unknown Camp"}
                              </p>
                              <p className="text-xs text-gray-500 bg-amber-50 p-1.5 rounded-md inline-block w-full text-center">
                                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                              </p>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg line-clamp-1">{booking.guestName || booking.user?.name || "Guest"}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                📞 {booking.guestTel || booking.user?.tel || "No phone"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-2">
                            <Button size="sm" variant="secondary" fullWidth onClick={() => handleCheckOut(booking._id)} loading={actionLoading === booking._id}>
                              Check Out Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination 
                      currentPage={pendingOutPage} 
                      totalItems={allUpcomingCheckout.length} 
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={setPendingOutPage} 
                    />
                  </>
                )}
              </div>
            </div>

            {/* Recently Checked-in Today */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center justify-between border-b pb-2">
                <p className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-green-500 font-sans"></span>
                  Recently Checked-in Today
                  <span className="ml-2 text-l font-sans text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {allArrivedToday.length}
                  </span>
                </p>
              </div>

              {allArrivedToday.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500 min-h-[150px] flex items-center justify-center">
                  No guests have checked in yet today.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {arrivedToday.map((booking) => (
                      <div key={booking._id} className="group rounded-xl border border-gray-100 bg-green-50/30 p-5 shadow-sm">
                        <div className="flex flex-col gap-3 h-full justify-between">
                          <div className="border-b border-gray-100 pb-3">
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">⛺ {booking.campground?.name || "Unknown Camp"}</p>
                            <p className="text-xs text-gray-500 bg-green-50 p-1.5 rounded-md inline-block w-full text-center">
                              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <p className="font-bold text-gray-800 text-lg line-clamp-1">{booking.guestName || booking.user?.name || "Guest"}</p>
                              <p className="text-xs text-gray-400 mb-2">📞 {booking.guestTel || booking.user?.tel || "No phone"}</p>
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800 ring-1 ring-inset ring-green-700/20">Arrived</div>
                                <span className="text-[10px] text-gray-500">{booking.actualCheckIn ? new Date(booking.actualCheckIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                              </div>
                            </div>
                            <div className="text-green-500 text-2xl font-bold">✓</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination 
                    currentPage={recentInPage} 
                    totalItems={allArrivedToday.length} 
                    pageSize={ITEMS_PER_PAGE * 2}
                    onPageChange={setRecentInPage} 
                  />
                </>
              )}
            </div>

            {/* Recently Checked-out Today */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <p className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-orange-400 font-sans"></span>
                  Recently Checked-out Today
                  <span className="ml-2 text-l font-sans text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {allCheckedOutToday.length}
                  </span>
                </p>
              </div>

              {allCheckedOutToday.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500 min-h-[150px] flex items-center justify-center">
                  No guests have checked out yet today.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {checkedOutToday.map((booking) => (
                      <div key={booking._id} className="group rounded-xl border border-orange-100 bg-orange-50/30 p-5 shadow-sm">
                        <div className="flex flex-col gap-3 h-full justify-between">
                          <div className="border-b border-orange-100 pb-3">
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">⛺ {booking.campground?.name || "Unknown Camp"}</p>
                            <p className="text-xs text-gray-500 bg-orange-50 p-1.5 rounded-md inline-block w-full text-center">
                              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <p className="font-bold text-gray-700 text-lg line-clamp-1">{booking.guestName || booking.user?.name || "Guest"}</p>
                              <p className="text-xs text-gray-400 mb-2">📞 {booking.guestTel || booking.user?.tel || "No phone"}</p>
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">Departed</div>
                                <span className="text-[10px] text-gray-500">{booking.actualCheckOut ? new Date(booking.actualCheckOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                              </div>
                            </div>
                            <div className="text-orange-400 text-2xl font-bold">✓</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination 
                    currentPage={recentOutPage} 
                    totalItems={allCheckedOutToday.length} 
                    pageSize={ITEMS_PER_PAGE * 2}
                    onPageChange={setRecentOutPage} 
                  />
                </>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}