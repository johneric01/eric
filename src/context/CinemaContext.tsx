import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Movie,
  CinemaHall,
  Screening,
  Customer,
  Booking,
  PaymentTransaction,
  ConcessionItem,
  Role,
  SeatTier,
  SeatStatus,
  PaymentMethod,
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_HALLS,
  INITIAL_SCREENINGS,
  INITIAL_CUSTOMERS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_CONCESSIONS,
} from '../data/initialData';

interface BookingPayload {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  screeningId: string;
  seats: { seatCode: string; tier: SeatTier; price: number }[];
  concessions: { item: ConcessionItem; quantity: number }[];
  paymentMethod: PaymentMethod;
}

interface CinemaContextType {
  // Current user & role
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeCustomer: Customer;
  setActiveCustomer: (customer: Customer) => void;

  // Active view tab in navigation
  activeTab: 'movies' | 'schedules' | 'admin' | 'architecture';
  setActiveTab: (tab: 'movies' | 'schedules' | 'admin' | 'architecture') => void;
  adminSubTab: 'dashboard' | 'movies' | 'screenings' | 'seats' | 'customers' | 'bookings' | 'payments' | 'reports';
  setAdminSubTab: (subTab: 'dashboard' | 'movies' | 'screenings' | 'seats' | 'customers' | 'bookings' | 'payments' | 'reports') => void;

  // Entities
  movies: Movie[];
  halls: CinemaHall[];
  screenings: Screening[];
  customers: Customer[];
  bookings: Booking[];
  transactions: PaymentTransaction[];
  concessions: ConcessionItem[];

  // MovieManager actions
  addMovie: (movie: Omit<Movie, 'id'>) => Movie;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;

  // ScreeningManager actions
  addScreening: (screening: Omit<Screening, 'id' | 'reservedSeatCodes'>) => Screening;
  updateScreening: (id: string, screening: Partial<Screening>) => void;
  deleteScreening: (id: string) => void;

  // SeatManager actions
  hallMaintenanceSeats: Record<string, string[]>; // hallId -> array of seat codes under maintenance
  toggleSeatMaintenance: (hallId: string, seatCode: string) => void;
  getScreeningSeats: (screeningId: string) => {
    hall: CinemaHall;
    screening: Screening;
    movie: Movie;
    seatMatrix: {
      code: string;
      row: string;
      col: number;
      tier: SeatTier;
      status: SeatStatus;
      price: number;
    }[];
  } | null;

  // CustomerManager actions
  addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'memberSince' | 'totalBookings'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;

  // BookingManager & PaymentManager actions
  createBooking: (payload: BookingPayload) => Booking;
  cancelBooking: (bookingId: string) => void;

  // Selected Booking modal state
  selectedMovieForBooking: Movie | null;
  setSelectedMovieForBooking: (movie: Movie | null) => void;
  selectedScreeningForBooking: Screening | null;
  setSelectedScreeningForBooking: (screening: Screening | null) => void;
  latestConfirmedBooking: Booking | null;
  setLatestConfirmedBooking: (booking: Booking | null) => void;

  // Reset demo data
  resetDemoData: () => void;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<'movies' | 'schedules' | 'admin' | 'architecture'>('movies');
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'movies' | 'screenings' | 'seats' | 'customers' | 'bookings' | 'payments' | 'reports'>('dashboard');

  // Stored state with localStorage hydration
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinereserve_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [halls] = useState<CinemaHall[]>(INITIAL_HALLS);

  const [screenings, setScreenings] = useState<Screening[]>(() => {
    const saved = localStorage.getItem('cinereserve_screenings');
    return saved ? JSON.parse(saved) : INITIAL_SCREENINGS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('cinereserve_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cinereserve_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('cinereserve_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [concessions] = useState<ConcessionItem[]>(INITIAL_CONCESSIONS);

  const [hallMaintenanceSeats, setHallMaintenanceSeats] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('cinereserve_maintenance');
    return saved ? JSON.parse(saved) : { 'hall-1': ['A01', 'H12'], 'hall-2': ['H01'] };
  });

  // Active booking flow state
  const [activeCustomer, setActiveCustomer] = useState<Customer>(customers[0]);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [selectedScreeningForBooking, setSelectedScreeningForBooking] = useState<Screening | null>(null);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<Booking | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cinereserve_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('cinereserve_screenings', JSON.stringify(screenings));
  }, [screenings]);

  useEffect(() => {
    localStorage.setItem('cinereserve_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('cinereserve_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cinereserve_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cinereserve_maintenance', JSON.stringify(hallMaintenanceSeats));
  }, [hallMaintenanceSeats]);

  // MovieManager Implementation
  const addMovie = (movieData: Omit<Movie, 'id'>): Movie => {
    const newMovie: Movie = {
      ...movieData,
      id: `mov-${Date.now()}`,
    };
    setMovies((prev) => [newMovie, ...prev]);
    return newMovie;
  };

  const updateMovie = (id: string, updatedFields: Partial<Movie>) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    // also cascade delete screenings for this movie
    setScreenings((prev) => prev.filter((s) => s.movieId !== id));
  };

  // ScreeningManager Implementation
  const addScreening = (screeningData: Omit<Screening, 'id' | 'reservedSeatCodes'>): Screening => {
    const newScreening: Screening = {
      ...screeningData,
      id: `scr-${Date.now()}`,
      reservedSeatCodes: [],
    };
    setScreenings((prev) => [...prev, newScreening]);
    return newScreening;
  };

  const updateScreening = (id: string, updatedFields: Partial<Screening>) => {
    setScreenings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteScreening = (id: string) => {
    setScreenings((prev) => prev.filter((s) => s.id !== id));
  };

  // SeatManager Implementation
  const toggleSeatMaintenance = (hallId: string, seatCode: string) => {
    setHallMaintenanceSeats((prev) => {
      const current = prev[hallId] || [];
      const exists = current.includes(seatCode);
      const updated = exists ? current.filter((c) => c !== seatCode) : [...current, seatCode];
      return { ...prev, [hallId]: updated };
    });
  };

  const getScreeningSeats = (screeningId: string) => {
    const screening = screenings.find((s) => s.id === screeningId);
    if (!screening) return null;
    const movie = movies.find((m) => m.id === screening.movieId);
    const hall = halls.find((h) => h.id === screening.hallId);
    if (!movie || !hall) return null;

    const maintenanceList = hallMaintenanceSeats[hall.id] || [];
    const reservedList = screening.reservedSeatCodes || [];

    const seatMatrix: {
      code: string;
      row: string;
      col: number;
      tier: SeatTier;
      status: SeatStatus;
      price: number;
    }[] = [];

    hall.rows.forEach((row, rowIndex) => {
      for (let col = 1; col <= hall.columns; col++) {
        const code = `${row}${col < 10 ? '0' + col : col}`;

        // Determine tier based on row
        let tier: SeatTier = 'Regular';
        let multiplier = 1.0;
        if (rowIndex < 2) {
          tier = 'Regular';
          multiplier = 1.0;
        } else if (rowIndex < hall.rows.length - 2) {
          tier = 'Deluxe';
          multiplier = 1.25;
        } else {
          tier = 'VIP';
          multiplier = 1.5;
        }

        let status: SeatStatus = 'available';
        if (maintenanceList.includes(code)) {
          status = 'maintenance';
        } else if (reservedList.includes(code)) {
          status = 'reserved';
        }

        const calculatedPrice = Number((screening.ticketPrice * multiplier).toFixed(2));

        seatMatrix.push({
          code,
          row,
          col,
          tier,
          status,
          price: calculatedPrice,
        });
      }
    });

    return { hall, screening, movie, seatMatrix };
  };

  // CustomerManager Implementation
  const addCustomer = (customerData: Omit<Customer, 'id' | 'loyaltyPoints' | 'memberSince' | 'totalBookings'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      loyaltyPoints: 50,
      memberSince: new Date().toISOString().split('T')[0],
      totalBookings: 1,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  // BookingManager & PaymentManager Implementation
  const createBooking = (payload: BookingPayload): Booking => {
    const screening = screenings.find((s) => s.id === payload.screeningId);
    if (!screening) throw new Error('Screening not found');
    const movie = movies.find((m) => m.id === screening.movieId);
    const hall = halls.find((h) => h.id === screening.hallId);
    if (!movie || !hall) throw new Error('Cinema details incomplete');

    const selectedCodes = payload.seats.map((s) => s.seatCode);

    // Concessions calculation
    let concessionsTotal = 0;
    const concessionsList: { name: string; quantity: number; price: number }[] = [];
    payload.concessions.forEach((c) => {
      if (c.quantity > 0) {
        concessionsTotal += c.item.price * c.quantity;
        concessionsList.push({
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
        });
      }
    });

    // Seat subtotal
    const seatsSubtotal = payload.seats.reduce((sum, s) => sum + s.price, 0);
    const rawSubtotal = seatsSubtotal + concessionsTotal;
    const tax = Number((rawSubtotal * 0.1).toFixed(2));
    const totalAmount = Number((rawSubtotal + tax).toFixed(2));

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `CR-2026-${randomSuffix}`;
    const paymentRef = `${payload.paymentMethod.toUpperCase().replace(/[^A-Z]/g, '')}-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingRef,
      customerId: payload.customerId || `cust-${Date.now()}`,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      screeningId: screening.id,
      movieId: movie.id,
      movieTitle: movie.title,
      hallId: hall.id,
      hallName: hall.name,
      screeningDate: screening.date,
      screeningTime: screening.startTime,
      seats: payload.seats,
      concessionsTotal: Number(concessionsTotal.toFixed(2)),
      concessionsList,
      subtotal: Number(rawSubtotal.toFixed(2)),
      tax,
      totalAmount,
      bookingDate: timestamp,
      status: 'Confirmed',
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'Completed',
      paymentRef,
    };

    // 1. Lock reserved seats in the screening
    setScreenings((prev) =>
      prev.map((s) => {
        if (s.id === screening.id) {
          return {
            ...s,
            reservedSeatCodes: [...s.reservedSeatCodes, ...selectedCodes],
          };
        }
        return s;
      })
    );

    // 2. Add booking to state
    setBookings((prev) => [newBooking, ...prev]);

    // 3. Record Payment transaction
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionRef: paymentRef,
      bookingRef: newBooking.bookingRef,
      customerName: newBooking.customerName,
      method: payload.paymentMethod,
      amount: totalAmount,
      status: 'Completed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 4. Update customer stats or add customer if new
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === payload.customerEmail.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalBookings: c.totalBookings + 1,
                loyaltyPoints: c.loyaltyPoints + Math.floor(totalAmount * 2),
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: payload.customerName,
          email: payload.customerEmail,
          phone: payload.customerPhone,
          loyaltyPoints: Math.floor(totalAmount * 2),
          memberSince: new Date().toISOString().split('T')[0],
          totalBookings: 1,
        };
        return [newCust, ...prev];
      }
    });

    setLatestConfirmedBooking(newBooking);
    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const seatCodesToRelease = booking.seats.map((s) => s.seatCode);

    // 1. Release reserved seats in screening
    setScreenings((prev) =>
      prev.map((s) => {
        if (s.id === booking.screeningId) {
          return {
            ...s,
            reservedSeatCodes: s.reservedSeatCodes.filter((code) => !seatCodesToRelease.includes(code)),
          };
        }
        return s;
      })
    );

    // 2. Mark booking as Cancelled
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled', paymentStatus: 'Refunded' } : b))
    );

    // 3. Mark transaction as Refunded
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.bookingRef === booking.bookingRef ? { ...tx, status: 'Refunded' } : tx
      )
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem('cinereserve_movies');
    localStorage.removeItem('cinereserve_screenings');
    localStorage.removeItem('cinereserve_customers');
    localStorage.removeItem('cinereserve_bookings');
    localStorage.removeItem('cinereserve_transactions');
    localStorage.removeItem('cinereserve_maintenance');
    setMovies(INITIAL_MOVIES);
    setScreenings(INITIAL_SCREENINGS);
    setCustomers(INITIAL_CUSTOMERS);
    setBookings(INITIAL_BOOKINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setHallMaintenanceSeats({ 'hall-1': ['A01', 'H12'], 'hall-2': ['H01'] });
  };

  return (
    <CinemaContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeCustomer,
        setActiveCustomer,
        activeTab,
        setActiveTab,
        adminSubTab,
        setAdminSubTab,
        movies,
        halls,
        screenings,
        customers,
        bookings,
        transactions,
        concessions,
        addMovie,
        updateMovie,
        deleteMovie,
        addScreening,
        updateScreening,
        deleteScreening,
        hallMaintenanceSeats,
        toggleSeatMaintenance,
        getScreeningSeats,
        addCustomer,
        updateCustomer,
        createBooking,
        cancelBooking,
        selectedMovieForBooking,
        setSelectedMovieForBooking,
        selectedScreeningForBooking,
        setSelectedScreeningForBooking,
        latestConfirmedBooking,
        setLatestConfirmedBooking,
        resetDemoData,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = (): CinemaContextType => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
