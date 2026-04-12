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

export default function TodayCheckPage() {
  const router = useRouter();
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const {
    bookings,
    getBookings,
    loading,
    error,
  } = useBookings();

  const [currentTime, setCurrentTime] = useState(new Date());

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
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [currentTime]);

  const arrivedToday = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.checkInDate) return false;
      const bDate = new Date(b.checkInDate).toISOString().split("T")[0];
      return bDate === todayStr && b.status === "checked-in";
    });
  }, [bookings, todayStr]);

  if (authLoading || (user && user.role !== "campOwner")) {
    return (
      <>
        <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />
        <PageContainer>
          <LoadingState message="Checking authorization..." />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />

      <PageContainer>
        <div className="mb-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Arrivals Monitor</h1>
              <p className="text-gray-500 mt-1">
                View guest check-ins for today.
              </p>
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
        ) : (
          <div className="flex flex-col gap-12">
            {/* ── Already Arrived Section ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                  Recently Checked-in Today
                  <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {arrivedToday.length}
                  </span>
                </h2>
              </div>

              {loading ? (
                <div className="py-8">
                  <LoadingState message="Fetching data..." />
                </div>
              ) : arrivedToday.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-500">
                  No guests have checked in yet today.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {arrivedToday.map((booking) => (
                    <div
                      key={booking._id}
                      className="group rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-500 text-lg">
                            {booking.guestName || booking.user?.name || "Guest"}
                          </p>
                          <p className="text-xs text-gray-400 mb-2">
                            {booking.guestTel || booking.user?.tel || "No phone"}
                          </p>
                          <div className="flex items-center gap-2">
                             <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                              Checked In
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {booking.actualCheckIn ? new Date(booking.actualCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                        </div>
                        <div className="text-green-500 text-xl">✓</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}