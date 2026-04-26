import { Booking } from "../../src/types";

export const mockBookingsForReview: { success: boolean, count: number, data: Booking[] } = {
  success: true,
  count: 1,
  data: [
    {
      _id: "booking_id_123",
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date().toISOString(),
      nightsCount: 1,
      user: {
        _id: "user_id_456",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        tel: "0123456789",
        createdAt: new Date().toISOString()
      },
      campground: {
        _id: "camp_id_789",
        name: "Beautiful Camp",
        address: "123 Nature St",
        district: "Sriracha",
        province: "Chonburi",
        postalcode: "20110",
        tel: "0888888888",
        region: "East",
        picture: "https://example.com/camp.jpg",
        capacity: 10,
        owner: "owner_id_123",
        __v: 0,
        id: "camp_id_789"
      },
      status: "checked-out", // สถานะที่อนุญาตให้รีวิวได้
      createdAt: new Date().toISOString(),
      actualCheckIn: new Date().toISOString(),
      actualCheckOut: new Date().toISOString(),
    }
  ]
};
