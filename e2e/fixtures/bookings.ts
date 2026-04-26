import { Booking } from "../../src/types";

export const mockBookingsForReview: { success: boolean, count: number, data: Booking[] } = {
  success: true,
  count: 1,
  data: [
    {
      _id: "booking_id_123",
      bookingDate: new Date().toISOString(),
      user: {
        _id: "user_id_456",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        tel: "0123456789",
        token: "fake_token"
      },
      campground: {
        _id: "camp_id_789",
        name: "Beautiful Camp",
        address: "123 Nature St",
        tel: "0888888888",
        description: "A very nice place",
        picture: "https://example.com/camp.jpg",
        __v: 0,
        id: "camp_id_789"
      },
      status: "checked-out", // สถานะที่อนุญาตให้รีวิวได้
      createdAt: new Date().toISOString(),
      __v: 0,
      actualCheckIn: new Date().toISOString(),
      actualCheckOut: new Date().toISOString(),
    }
  ]
};
