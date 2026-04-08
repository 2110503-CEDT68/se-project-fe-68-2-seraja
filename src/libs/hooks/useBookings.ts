import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Booking } from '../types';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient('/bookings');
      setBookings(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Backend requires checkInDate + checkOutDate (not bookingDate)
  const createBooking = async (campId: string, checkInDate: string, checkOutDate: string) => {
    setError(null);
    try {
      return await apiClient(`/campgrounds/${campId}/bookings`, {
        method: "POST",
        body: JSON.stringify({ checkInDate, checkOutDate }),
      });
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      throw err;
    }
  };

  const updateBooking = async (bookingId: string, checkInDate: string, checkOutDate: string) => {
    setError(null);
    try {
      return await apiClient(`/bookings/${bookingId}`, {
        method: "PUT",
        body: JSON.stringify({ checkInDate, checkOutDate }),
      });
    } catch (err: any) {
      setError(err.message || "Failed to update booking");
      throw err;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setError(null);
    try {
      return await apiClient(`/bookings/${bookingId}`, { method: "DELETE" });
    } catch (err: any) {
      setError(err.message || "Failed to delete booking");
      throw err;
    }
  };

  return { bookings, getBookings, createBooking, updateBooking, deleteBooking, loading, error };
};