import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { CheckCircle, Printer, X, Film, Clock, MapPin, Calendar, QrCode } from 'lucide-react';

export const TicketConfirmationModal: React.FC = () => {
  const { latestConfirmedBooking, setLatestConfirmedBooking, setActiveTab, setAdminSubTab, setCurrentRole } =
    useCinema();

  if (!latestConfirmedBooking) return null;
  const booking = latestConfirmedBooking;

  const handlePrint = () => {
    window.print();
  };

  const handleViewInAdmin = () => {
    setCurrentRole('admin');
    setActiveTab('admin');
    setAdminSubTab('bookings');
    setLatestConfirmedBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Success Header banner */}
        <div className="bg-emerald-600 px-6 py-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/40 text-white mb-2">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Reservation Confirmed!</h2>
          <p className="text-xs text-emerald-100">
            Booking Reference:{' '}
            <span className="font-mono font-bold tracking-wider">{booking.bookingRef}</span>
          </p>
        </div>

        {/* Boarding Pass Ticket Body */}
        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-neutral-700/80 bg-neutral-950 p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  CineReserve Digital Ticket
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{booking.movieTitle}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Status</span>
                <span className="text-xs font-semibold text-emerald-400">Confirmed</span>
              </div>
            </div>

            {/* Hall, Date, Time */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-400 flex items-center gap-1 text-[11px]">
                  <MapPin className="h-3 w-3 text-amber-400" />
                  Cinema Hall
                </span>
                <span className="text-white font-medium block">{booking.hallName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3 text-amber-400" />
                  Date & Time
                </span>
                <span className="text-white font-medium block">
                  {booking.screeningDate} · {booking.screeningTime}
                </span>
              </div>
            </div>

            {/* Reserved Seats Highlight */}
            <div className="rounded-lg bg-neutral-900 p-3 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Reserved Seats
                </span>
                <div className="text-sm font-bold font-mono text-amber-400">
                  {booking.seats.map((s) => s.seatCode).join(', ')}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Total Paid
                </span>
                <div className="text-sm font-bold font-mono text-white">
                  ${booking.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* QR Code and Barcode simulation */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div className="space-y-0.5 text-[11px] text-neutral-400">
                <div>Attendee: <strong className="text-neutral-200">{booking.customerName}</strong></div>
                <div>Payment: <strong className="text-neutral-200">{booking.paymentMethod}</strong></div>
                <div className="font-mono text-[10px] text-neutral-500">
                  TX: {booking.paymentRef}
                </div>
              </div>

              {/* QR Code SVG Representation */}
              <div className="h-16 w-16 bg-white p-1 rounded-lg flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Top-left marker */}
                  <rect x="10" y="10" width="24" height="24" fill="#000000" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="18" width="8" height="8" fill="#000000" />
                  {/* Top-right marker */}
                  <rect x="66" y="10" width="24" height="24" fill="#000000" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="74" y="18" width="8" height="8" fill="#000000" />
                  {/* Bottom-left marker */}
                  <rect x="10" y="66" width="24" height="24" fill="#000000" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="74" width="8" height="8" fill="#000000" />
                  {/* Pattern data bits */}
                  <rect x="42" y="16" width="6" height="6" fill="#000000" />
                  <rect x="52" y="22" width="6" height="6" fill="#000000" />
                  <rect x="42" y="42" width="14" height="14" fill="#000000" />
                  <rect x="66" y="48" width="6" height="6" fill="#000000" />
                  <rect x="78" y="60" width="6" height="6" fill="#000000" />
                  <rect x="42" y="70" width="8" height="6" fill="#000000" />
                  <rect x="60" y="80" width="14" height="6" fill="#000000" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Pass / Receipt
            </button>
            <button
              onClick={() => setLatestConfirmedBooking(null)}
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              Done & Return
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleViewInAdmin}
              className="text-xs text-neutral-400 hover:text-amber-400 transition-colors"
            >
              View this record in Cinema Admin Bookings Manager →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
