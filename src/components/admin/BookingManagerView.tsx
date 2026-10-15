import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Booking, BookingStatus } from '../../types';
import { Ticket, Search, CheckCircle, Ban, Eye, X, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

export const BookingManagerView: React.FC = () => {
  const { bookings, cancelBooking } = useCinema();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' ? true : b.status.toLowerCase() === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      b.bookingRef.toLowerCase().includes(query) ||
      b.customerName.toLowerCase().includes(query) ||
      b.customerEmail.toLowerCase().includes(query) ||
      b.movieTitle.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="h-5 w-5 text-amber-400" />
            Booking & Reservation Management (Booking & BookingManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Search, inspect, and cancel customer ticket reservations with automatic seat release.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
          Total Bookings: <strong className="text-white">{bookings.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'confirmed'
                ? 'bg-neutral-800 text-emerald-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Confirmed ({bookings.filter((b) => b.status === 'Confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'cancelled'
                ? 'bg-neutral-800 text-rose-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === 'Cancelled').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reference, customer, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Movie & Hall</th>
                <th className="py-3 px-4">Showtime</th>
                <th className="py-3 px-4">Reserved Seats</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No reservations matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {b.bookingRef}
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{b.customerName}</span>
                        <span className="text-[11px] text-neutral-400">{b.customerEmail}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{b.movieTitle}</span>
                        <span className="text-[11px] text-neutral-400">{b.hallName.split('–')[0]}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-300">
                      <div>{b.screeningDate}</div>
                      <div className="text-[11px] text-neutral-400">{b.screeningTime}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-amber-300">
                      {b.seats.map((s) => s.seatCode).join(', ')}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-white">
                      ${b.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBookingDetails(b)}
                          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="View Reservation Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Cancel reservation ${b.bookingRef}? Seats will be released back into the screening pool.`
                                )
                              ) {
                                cancelBooking(b.id);
                              }
                            }}
                            className="p-1.5 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                            title="Cancel Booking & Refund"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Inspection Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
              <h3 className="text-base font-bold text-white">
                Reservation Record: {selectedBookingDetails.bookingRef}
              </h3>
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-neutral-500 block">Customer Name</span>
                  <span className="text-white font-medium">{selectedBookingDetails.customerName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Contact Phone</span>
                  <span className="text-white font-medium">{selectedBookingDetails.customerPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Movie Title</span>
                  <span className="text-white font-medium">{selectedBookingDetails.movieTitle}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Cinema Auditorium</span>
                  <span className="text-white font-medium">{selectedBookingDetails.hallName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Date & Showtime</span>
                  <span className="text-white font-medium">
                    {selectedBookingDetails.screeningDate} · {selectedBookingDetails.screeningTime}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Booking Status</span>
                  <span className="text-emerald-400 font-bold">{selectedBookingDetails.status}</span>
                </div>
              </div>

              {/* Seats list */}
              <div>
                <span className="text-neutral-400 font-semibold block mb-2">Reserved Seats</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBookingDetails.seats.map((s) => (
                    <span
                      key={s.seatCode}
                      className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 font-mono text-amber-300 font-bold"
                    >
                      {s.seatCode} (${s.price.toFixed(2)} {s.tier})
                    </span>
                  ))}
                </div>
              </div>

              {/* Financial Ledger details */}
              <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Payment Gateway</span>
                  <span className="text-white font-medium">{selectedBookingDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Transaction Reference</span>
                  <span className="text-white font-mono">{selectedBookingDetails.paymentRef}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Total Amount Settled</span>
                  <span className="text-white font-bold font-mono">
                    ${selectedBookingDetails.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
