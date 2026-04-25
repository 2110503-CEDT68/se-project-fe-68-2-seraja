import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "../api/apiClient";
import { ApiError } from "../api/ApiError";
import { Booking } from "../../types";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [todayCheckouts, setTodayCheckouts] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.token;

  const getBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<{ data: Booking[] }>("/bookings", {}, token);
      console.log("API response:", data);
      setBookings(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getTodayCheckouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<{ data: Booking[] }>(
        "/bookings/today-checkouts",
        {},
        token,
      );
      setTodayCheckouts(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load today's checkouts");
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (
    campId: string,
    checkInDate: string,
    checkOutDate: string,
    guestName?: string,
    guestTel?: string,
  ) => {
    setError(null);
    try {
      const body: Record<string, string> = { checkInDate, checkOutDate };
      if (guestName) body.guestName = guestName;
      if (guestTel) body.guestTel = guestTel;
      return await apiClient(
        `/campgrounds/${campId}/bookings`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to create booking",
      );
      throw err;
    }
  };

  const updateBooking = async (
    bookingId: string,
    checkInDate: string,
    checkOutDate: string,
  ) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}`,
        {
          method: "PUT",
          body: JSON.stringify({ checkInDate, checkOutDate }),
        },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update booking",
      );
      throw err;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}`,
        { method: "DELETE" },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to delete booking",
      );
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
        },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to cancel booking",
      );
      throw err;
    }
  };

  const checkInBooking = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/checkin`,
        {
          method: "PUT",
        },
        token,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to check in");
      throw err;
    }
  };

  const checkOutBooking = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/checkout`,
        {
          method: "PUT",
        },
        token,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to check out");
      throw err;
    }
  };

  const createReview = async (
    bookingId: string,
    rating: number,
    comment?: string,
  ) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/review`,
        {
          method: "PUT",
          body: JSON.stringify({
            review_rating: rating,
            review_comment: comment,
          }),
        },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to create review",
      );
      throw err;
    }
  };

  const updateReview = async (
    bookingId: string,
    rating: number,
    comment?: string,
  ) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/review/update`,
        {
          method: "PUT",
          body: JSON.stringify({
            review_rating: rating,
            review_comment: comment,
          }),
        },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update review",
      );
      throw err;
    }
  };

  const deleteReview = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(
        `/bookings/${bookingId}/review`,
        { method: "DELETE" },
        token,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to delete review",
      );
      throw err;
    }
  };

  const exportBookingsCsv = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://cedt-be-for-fe-proj.vercel.app/api/v1";
      const res = await fetch(`${apiUrl}/bookings/export`, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });
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

  return {
    bookings,
    todayCheckouts,
    getBookings,
    getTodayCheckouts,
    createBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    createReview,
    updateReview,
    deleteReview,
    exportBookingsCsv,
    loading,
    error,
  };
};