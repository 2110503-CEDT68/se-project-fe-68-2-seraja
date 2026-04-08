export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
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
  role?: 'user' | 'admin';
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
  picture: string;
  __v?: number;
  id?: string;
}

export interface Booking {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount?: number;
  user?: string | null;
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
}