import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "../api/apiClient";
import { ApiError } from "../api/ApiError";
import { Booking } from "../../types";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.token;

  const getBookings = async () => {
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

  return {
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
  };
};
