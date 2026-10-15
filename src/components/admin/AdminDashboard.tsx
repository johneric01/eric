import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import {
  Film,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Armchair,
  Users,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    movies,
    screenings,
    bookings,
    transactions,
    customers,
    halls,
    setAdminSubTab,
    resetDemoData,
  } = useCinema();

  // Metrics computation with tabular figures
  const totalRevenue = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeMovies = movies.filter((m) => m.status === 'Now Showing').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const totalSeatsSold = confirmedBookings.reduce((sum, b) => sum + b.seats.length, 0);

  // Overall Occupancy Calculation across all active screenings
  const totalSeatsAcrossShows = screenings.reduce((sum, s) => {
    const hall = halls.find((h) => h.id === s.hallId);
    return sum + (hall?.totalSeats || 96);
  }, 0);
  const totalReservedSeats = screenings.reduce(
    (sum, s) => sum + s.reservedSeatCodes.length,
    0
  );
  const averageOccupancy =
    totalSeatsAcrossShows > 0
      ? Math.round((totalReservedSeats / totalSeatsAcrossShows) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>CINEMA OPERATIONS & ADMINISTRATIVE CONSOLE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Management Dashboard</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminSubTab('movies')}
            className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            + Add New Movie
          </button>
          <button
            onClick={() => setAdminSubTab('screenings')}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            + Schedule Show
          </button>
          <button
            onClick={resetDemoData}
            title="Reset system to initial proposal seed data"
            className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid with Tabular Numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Gross Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-neutral-400">
            Across {transactions.filter((t) => t.status === 'Completed').length} completed transactions
          </p>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Tickets & Seats Sold</span>
            <Ticket className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {totalSeatsSold}
          </div>
          <p className="text-[11px] text-neutral-400">
            {confirmedBookings.length} confirmed bookings
          </p>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Active Titles & Shows</span>
            <Film className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {activeMovies} / {screenings.length}
          </div>
          <p className="text-[11px] text-neutral-400">
            {movies.length} total titles in database
          </p>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Average Seat Occupancy</span>
            <Armchair className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {averageOccupancy}%
          </div>
          <p className="text-[11px] text-neutral-400">
            {totalReservedSeats} seats occupied across halls
          </p>
        </div>
      </div>

      {/* 2-Column Split: Today's Screenings vs Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Screenings Today */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                Active Screening Schedules (Today)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Live seating allocation and capacity metrics per hall.
              </p>
            </div>
            <button
              onClick={() => setAdminSubTab('screenings')}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Manage Schedules →
            </button>
          </div>

          <div className="space-y-3">
            {screenings.slice(0, 5).map((show) => {
              const movie = movies.find((m) => m.id === show.movieId);
              const hall = halls.find((h) => h.id === show.hallId);
              const booked = show.reservedSeatCodes.length;
              const total = hall?.totalSeats || 96;
              const pct = Math.round((booked / total) * 100);

              return (
                <div
                  key={show.id}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-950 p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{movie?.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                      <span className="text-amber-400">{hall?.name.split('–')[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-white font-medium">{show.startTime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">${show.ticketPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="w-36 shrink-0 space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>{booked}/{total} booked</span>
                      <span className="font-mono">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Reservations & Payments */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="h-4 w-4 text-emerald-400" />
                Latest Reservations
              </h3>
              <p className="text-[11px] text-neutral-400">
                Customer bookings synced with MySQL database.
              </p>
            </div>
            <button
              onClick={() => setAdminSubTab('bookings')}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-neutral-800/80 bg-neutral-950 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-400">{b.bookingRef}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-red-950 text-red-300 border border-red-800/60'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="text-xs text-white font-medium">{b.customerName}</div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-900">
                  <span className="truncate max-w-[160px]">{b.movieTitle}</span>
                  <span className="font-mono tabular-nums font-bold text-white">
                    ${b.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
