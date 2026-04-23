export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "campOwner";
  tel: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  tel: string;
  role?: "user" | "admin" | "campOwner";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
}

export interface Campground {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  picture?: string; // Made optional
  capacity: number; // Added from backend model
  owner: string; // Added from backend model
  __v?: number;
  id?: string;
  averageRating?: number; // Added for sorting by rating
}

export interface Booking {
  _id: string;
  checkInDate: string; // Scheduled
  checkOutDate: string; // Scheduled

  // --- NEW FIELDS FOR THE TASK ---
  actualCheckIn?: string; // The time they actually arrived
  actualCheckOut?: string; // The time they actually left
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled"; // From backend enum
  // --------------------------------

  nightsCount: number;
  user?: User | null;
  guestName?: string | null;
  guestTel?: string | null;
  campground: Campground;
  createdAt: string;
}

export interface BookingInput {
  checkInDate: string;
  checkOutDate: string;
  guestName?: string;
  guestTel?: string;
  // If you want to update status during check-in/out
  status?: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
}
