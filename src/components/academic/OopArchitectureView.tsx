import React, { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  GraduationCap,
  Copy,
  Check,
  FileText,
  BookOpen,
} from 'lucide-react';

export const OopArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposal' | 'oop-classes' | 'mysql-erd' | 'python-code'>('proposal');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (codeKey: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeKey);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const PYTHON_OOP_SNIPPET = `"""
CineReserve – Cinema Ticket Reservation System
Academic Implementation: SDF04 – Object-Oriented Programming (Python & Database)
Author: Lumasac, John Eric V. (LFCA311M178)
Instructor: Ms. Jessa Evangelista
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional

# ==============================================================================
# 1. ABSTRACTION & INHERITANCE: Base User & Role Models
# ==============================================================================

class User(ABC):
    """Abstract Base Class demonstrating OOP Abstraction and Encapsulation."""
    def __init__(self, user_id: str, username: str, email: str, role: str):
        self._user_id = user_id           # Protected attribute
        self._username = username
        self._email = email
        self._role = role
        self._created_at = datetime.now()

    @property
    def email(self) -> str:
        return self._email

    @abstractmethod
    def get_dashboard_permissions(self) -> List[str]:
        """Polymorphic interface for role-based system access."""
        pass


class Customer(User):
    """Inherits from User; encapsulates customer loyalty points and reservations."""
    def __init__(self, user_id: str, username: str, email: str, phone: str):
        super().__init__(user_id, username, email, role="customer")
        self.phone = phone
        self.__loyalty_points: int = 0    # Private attribute (Encapsulation)

    def add_loyalty_points(self, points: int) -> None:
        if points > 0:
            self.__loyalty_points += points

    @property
    def loyalty_points(self) -> int:
        return self.__loyalty_points

    def get_dashboard_permissions(self) -> List[str]:
        return ["browse_movies", "select_seats", "reserve_ticket", "view_receipt"]


class Admin(User):
    """Inherits from User; handles administrative movie & screening management."""
    def __init__(self, user_id: str, username: str, email: str, staff_code: str):
        super().__init__(user_id, username, email, role="admin")
        self.staff_code = staff_code

    def get_dashboard_permissions(self) -> List[str]:
        return ["manage_movies", "manage_screenings", "manage_seats", "view_reports", "cancel_booking"]


# ==============================================================================
# 2. POLYMORPHISM & COMPOSITION: Seat Hierarchy & Price Multipliers
# ==============================================================================

class Seat:
    """Base Seat class representing auditorium seating."""
    def __init__(self, seat_code: str, row: str, number: int):
        self.seat_code = seat_code
        self.row = row
        self.number = number
        self.is_maintenance: bool = False

    def calculate_price(self, base_price: float) -> float:
        """Polymorphic price calculation method (Standard 1.0x)."""
        return round(base_price * 1.0, 2)


class DeluxeSeat(Seat):
    def calculate_price(self, base_price: float) -> float:
        """Polymorphic override: 1.25x for Deluxe Recliners."""
        return round(base_price * 1.25, 2)


class VIPSeat(Seat):
    def calculate_price(self, base_price: float) -> float:
        """Polymorphic override: 1.50x for Luxury VIP Loungers."""
        return round(base_price * 1.50, 2)


# ==============================================================================
# 3. DOMAIN COMPOSITION: Screening & Booking
# ==============================================================================

class Movie:
    def __init__(self, movie_id: str, title: str, duration_mins: int, rating: str, base_price: float):
        self.movie_id = movie_id
        self.title = title
        self.duration_mins = duration_mins
        self.rating = rating
        self.base_price = base_price


class Screening:
    """Composes Movie and tracks reserved seats with collision detection."""
    def __init__(self, screening_id: str, movie: Movie, hall_name: str, showtime: str, price: float):
        self.screening_id = screening_id
        self.movie = movie                       # Composition
        self.hall_name = hall_name
        self.showtime = showtime
        self.price = price
        self.__reserved_seats: set[str] = set() # Encapsulated reserved set

    def reserve_seat(self, seat_code: str) -> bool:
        """Atomic reservation checking to prevent duplicate bookings."""
        if seat_code in self.__reserved_seats:
            raise ValueError(f"Seat {seat_code} is already reserved!")
        self.__reserved_seats.add(seat_code)
        return True

    def release_seat(self, seat_code: str) -> None:
        self.__reserved_seats.discard(seat_code)

    def is_seat_available(self, seat_code: str) -> bool:
        return seat_code not in self.__reserved_seats


class Booking:
    """Encapsulates a confirmed reservation with Customer and Seats composition."""
    def __init__(self, booking_ref: str, customer: Customer, screening: Screening, seats: List[Seat]):
        self.booking_ref = booking_ref
        self.customer = customer                 # Composition
        self.screening = screening               # Composition
        self.seats = seats                       # Composition
        self.booking_date = datetime.now()
        self.status = "Confirmed"
        self.total_amount = self._compute_total()

    def _compute_total(self) -> float:
        seat_sum = sum(s.calculate_price(self.screening.price) for s in self.seats)
        tax = seat_sum * 0.10
        return round(seat_sum + tax, 2)
`;

  const MYSQL_DDL_SNIPPET = `-- =============================================================================
-- CineReserve Relational MySQL Database Schema (SDF04 Submission)
-- Target RDBMS: MySQL 8.0+ / MariaDB
-- =============================================================================

CREATE DATABASE IF NOT EXISTS cinereserve_db;
USE cinereserve_db;

-- 1. Movies Table
CREATE TABLE movies (
    movie_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    genre VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    rating ENUM('G', 'PG', 'PG-13', 'R-16', 'R-18') NOT NULL,
    release_date DATE NOT NULL,
    poster_url VARCHAR(500),
    director VARCHAR(150),
    ticket_price_base DECIMAL(10, 2) NOT NULL,
    status ENUM('Now Showing', 'Coming Soon', 'Ended') DEFAULT 'Now Showing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cinema Halls Table
CREATE TABLE cinema_halls (
    hall_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hall_type ENUM('Standard', 'IMAX Laser', 'VIP Recliner', 'Dolby Atmos') NOT NULL,
    total_seats INT NOT NULL,
    sound_system VARCHAR(150),
    screen_format VARCHAR(150)
);

-- 3. Screenings Table
CREATE TABLE screenings (
    screening_id VARCHAR(36) PRIMARY KEY,
    movie_id VARCHAR(36) NOT NULL,
    hall_id VARCHAR(36) NOT NULL,
    screening_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (hall_id) REFERENCES cinema_halls(hall_id) ON DELETE CASCADE,
    INDEX idx_screening_date_hall (screening_date, hall_id)
);

-- 4. Customer Accounts Table
CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    loyalty_points INT DEFAULT 0,
    member_since DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bookings & Reservations Table
CREATE TABLE bookings (
    booking_id VARCHAR(36) PRIMARY KEY,
    booking_ref VARCHAR(30) UNIQUE NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    screening_id VARCHAR(36) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Confirmed', 'Pending', 'Cancelled') DEFAULT 'Confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (screening_id) REFERENCES screenings(screening_id) ON DELETE RESTRICT
);

-- 6. Booking Seats Bridge Table (Prevents Duplicate Seat Bookings)
CREATE TABLE booking_seats (
    booking_seat_id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    screening_id VARCHAR(36) NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    seat_tier ENUM('Regular', 'Deluxe', 'VIP') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES screenings(screening_id) ON DELETE CASCADE,
    UNIQUE KEY uq_screening_seat (screening_id, seat_code) -- Prevents duplicate reservations!
);

-- 7. Payment Ledger Table
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    transaction_ref VARCHAR(50) UNIQUE NOT NULL,
    booking_id VARCHAR(36) NOT NULL,
    payment_method ENUM('Cash', 'Credit/Debit Card', 'GCash', 'Maya') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Completed', 'Pending', 'Refunded') DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);`;

  return (
    <div className="space-y-6">
      {/* Header & Academic Info Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <GraduationCap className="h-4 w-4" />
              <span>ACADEMIC PROJECT PROPOSAL & SYSTEM SPECIFICATION</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              CineReserve – Cinema Ticket Reservation System
            </h2>
          </div>

          <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-4">
            <span className="text-[11px] text-neutral-400 block">Course / Section</span>
            <span className="text-xs font-mono font-bold text-white">SDF04 · LFCA311M178</span>
          </div>
        </div>

        {/* Proposal Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-neutral-500 block text-[11px]">Subject Title</span>
            <span className="font-medium text-neutral-200">
              Object-Oriented Programming (Python & Database)
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Prepared By</span>
            <span className="font-medium text-white">Lumasac, John Eric V.</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Instructor</span>
            <span className="font-medium text-amber-400">Ms. Jessa Evangelista</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Submission Date</span>
            <span className="font-medium text-neutral-300 font-mono">09/18/2026</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800 w-fit">
        <button
          onClick={() => setActiveTab('proposal')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'proposal'
              ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Project Proposal Summary
        </button>
        <button
          onClick={() => setActiveTab('oop-classes')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'oop-classes'
              ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          OOP Class Modules
        </button>
        <button
          onClick={() => setActiveTab('python-code')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'python-code'
              ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Python Backend Classes
        </button>
        <button
          onClick={() => setActiveTab('mysql-erd')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'mysql-erd'
              ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          MySQL Database Schema
        </button>
      </div>

      {/* Tab 1: Proposal Overview */}
      {activeTab === 'proposal' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">1. Project Background & Objective</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Cinema ticket reservations are often handled through physical ticket booths or manual processes, requiring customers to wait in line to check movie schedules and available seats. Manual reservation processes can result in duplicate seat bookings, inaccurate records, and tracking issues. 
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>CineReserve</strong> provides an organized software solution with a modern Graphical User Interface allowing customers to browse movies, view screening schedules, select seats, and reserve tickets, while cinema administrators manage movies, screenings, seats, customers, bookings, and payments backed by a relational MySQL database.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <h3 className="text-base font-bold text-white">2. Applied OOP Principles (Specific Objective 2)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Encapsulation</span>
                <p className="text-neutral-400 leading-relaxed">
                  Data hiding using private/protected attributes (<code className="text-neutral-200">__reserved_seats</code>, <code className="text-neutral-200">__loyalty_points</code>) with public getter properties and strict mutation methods.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Inheritance</span>
                <p className="text-neutral-400 leading-relaxed">
                  Base <code className="text-neutral-200">User</code> inherited by <code className="text-neutral-200">Customer</code> and <code className="text-neutral-200">Admin</code>. Base <code className="text-neutral-200">Seat</code> inherited by <code className="text-neutral-200">DeluxeSeat</code> and <code className="text-neutral-200">VIPSeat</code>.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Polymorphism</span>
                <p className="text-neutral-400 leading-relaxed">
                  Dynamic method overriding where <code className="text-neutral-200">calculate_price()</code> and <code className="text-neutral-200">get_dashboard_permissions()</code> provide tier-specific implementations.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Abstraction</span>
                <p className="text-neutral-400 leading-relaxed">
                  Using Python's <code className="text-neutral-200">abc.ABC</code> and <code className="text-neutral-200">@abstractmethod</code> to define strict behavioral contracts for managers and entities.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Composition</span>
                <p className="text-neutral-400 leading-relaxed">
                  <code className="text-neutral-200">Screening</code> composes a <code className="text-neutral-200">Movie</code>; <code className="text-neutral-200">Booking</code> aggregates multiple <code className="text-neutral-200">Seat</code> instances and a <code className="text-neutral-200">Customer</code>.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <span className="font-bold text-amber-400">Concurrency & Integrity</span>
                <p className="text-neutral-400 leading-relaxed">
                  Seat collision prevention ensuring no duplicate reservations occur across concurrent customer booking transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: OOP Class Modules Mapping */}
      {activeTab === 'oop-classes' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">System Features & OOP Class Mapping (Proposal Section 5)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Module / Feature</th>
                  <th className="py-3 px-4">System Description</th>
                  <th className="py-3 px-4">Key OOP Class(es)</th>
                  <th className="py-3 px-4">Implementation State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {[
                  { mod: 'Login / Authentication', desc: 'Allows users to securely log in with role-based access for customers & admins', cls: 'User, Auth, Customer, Admin' },
                  { mod: 'Dashboard', desc: 'Displays summary metrics of movies, screenings, bookings, and revenue', cls: 'Dashboard' },
                  { mod: 'Movie Management', desc: 'Allows administrators to add, view, update, and delete movie records', cls: 'Movie, MovieManager' },
                  { mod: 'Screening Management', desc: 'Manages movie schedules, cinema rooms, dates, and screening times', cls: 'Screening, ScreeningManager' },
                  { mod: 'Seat Management', desc: 'Displays and manages cinema seats and availability to prevent duplicate seats', cls: 'Seat, SeatManager' },
                  { mod: 'Customer Management', desc: 'Stores and manages customer profile accounts and loyalty tracking', cls: 'Customer, CustomerManager' },
                  { mod: 'Ticket Reservation', desc: 'Allows customers to select available seats and reserve cinema tickets', cls: 'Booking, Reservation' },
                  { mod: 'Booking Management', desc: 'Allows administrators to view, update, and cancel customer reservations', cls: 'Booking, BookingManager' },
                  { mod: 'Payment Management', desc: 'Records ticket payment information, payment channels, and settlement status', cls: 'Payment, PaymentManager' },
                  { mod: 'Reports Generator', desc: 'Generates basic summaries of movies, bookings, payments, and CSV export', cls: 'ReportGenerator' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/20">
                    <td className="py-3 px-4 font-bold text-white">{row.mod}</td>
                    <td className="py-3 px-4 text-neutral-300">{row.desc}</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-semibold">{row.cls}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-semibold">Active & Interactive</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Python Backend Classes Code */}
      {activeTab === 'python-code' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-amber-400" />
                Python OOP Source Architecture (<code className="text-neutral-300 font-mono">cinereserve_oop.py</code>)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Implements Encapsulation, Abstract Base Classes, Polymorphic Seating, and Composition.
              </p>
            </div>

            <button
              onClick={() => handleCopy('python', PYTHON_OOP_SNIPPET)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {copiedCode === 'python' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCode === 'python' ? 'Copied' : 'Copy Python Code'}
            </button>
          </div>

          <pre className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {PYTHON_OOP_SNIPPET}
          </pre>
        </div>
      )}

      {/* Tab 4: MySQL ERD & DDL Schema */}
      {activeTab === 'mysql-erd' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-sky-400" />
                Relational MySQL Database DDL & Schema (<code className="text-neutral-300 font-mono">schema.sql</code>)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Normalized tables, foreign key constraints, and UNIQUE composite indices preventing duplicate seat reservations.
              </p>
            </div>

            <button
              onClick={() => handleCopy('sql', MYSQL_DDL_SNIPPET)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {copiedCode === 'sql' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCode === 'sql' ? 'Copied' : 'Copy MySQL DDL'}
            </button>
          </div>

          <pre className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {MYSQL_DDL_SNIPPET}
          </pre>
        </div>
      )}
    </div>
  );
};
