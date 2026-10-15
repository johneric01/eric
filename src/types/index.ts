export type Role = 'customer' | 'admin';

export type MovieStatus = 'Now Showing' | 'Coming Soon' | 'Ended';
export type MovieRating = 'G' | 'PG' | 'PG-13' | 'R-16' | 'R-18';

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  durationMinutes: number;
  rating: MovieRating;
  releaseDate: string;
  posterUrl: string;
  backdropUrl?: string;
  director: string;
  cast: string[];
  status: MovieStatus;
  ticketPriceBase: number;
}

export type HallType = 'Standard' | 'IMAX Laser' | 'VIP Recliner' | 'Dolby Atmos';

export interface CinemaHall {
  id: string;
  name: string;
  type: HallType;
  totalSeats: number;
  rows: string[]; // e.g. ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  columns: number; // e.g. 12
  soundSystem: string;
  screenFormat: string;
}

export type SeatTier = 'Regular' | 'Deluxe' | 'VIP';
export type SeatStatus = 'available' | 'reserved' | 'maintenance';

export interface Seat {
  id: string; // e.g. "H1-A-01"
  hallId: string;
  row: string;
  number: number;
  code: string; // e.g. "A1"
  tier: SeatTier;
  status: SeatStatus;
  priceMultiplier: number; // Regular = 1.0, Deluxe = 1.25, VIP = 1.5
}

export interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  endTime: string; // "17:00"
  ticketPrice: number;
  reservedSeatCodes: string[]; // seat codes booked for this specific screening
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  memberSince: string;
  totalBookings: number;
}

export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Credit/Debit Card' | 'GCash' | 'Maya';
export type PaymentStatus = 'Completed' | 'Pending' | 'Refunded';

export interface SelectedSeatInfo {
  seatCode: string;
  tier: SeatTier;
  price: number;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "CR-2026-8491"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  screeningId: string;
  movieId: string;
  movieTitle: string;
  hallId: string;
  hallName: string;
  screeningDate: string;
  screeningTime: string;
  seats: SelectedSeatInfo[];
  concessionsTotal: number;
  concessionsList?: { name: string; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  bookingDate: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  bookingRef: string;
  customerName: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
}

export interface ConcessionItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Beverage' | 'Snacks' | 'Combo';
  price: number;
  description: string;
}
