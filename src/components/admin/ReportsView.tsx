import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { BarChart3, Download, Printer, TrendingUp, DollarSign, Film, Armchair } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { movies, bookings, transactions, halls, screenings } = useCinema();

  // Metrics aggregation
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const totalRevenue = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group revenue by movie
  const moviePerformance = movies.map((m) => {
    const movieBookings = confirmedBookings.filter((b) => b.movieId === m.id);
    const ticketsCount = movieBookings.reduce((sum, b) => sum + b.seats.length, 0);
    const revenue = movieBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const showsCount = screenings.filter((s) => s.movieId === m.id).length;

    return {
      movie: m,
      ticketsCount,
      revenue,
      showsCount,
    };
  });

  // Group occupancy by hall
  const hallUtilization = halls.map((h) => {
    const hallScreenings = screenings.filter((s) => s.hallId === h.id);
    const totalPotentialCapacity = hallScreenings.length * h.totalSeats;
    const reservedSeatsCount = hallScreenings.reduce(
      (sum, s) => sum + s.reservedSeatCodes.length,
      0
    );
    const occupancyRate =
      totalPotentialCapacity > 0
        ? Math.round((reservedSeatsCount / totalPotentialCapacity) * 100)
        : 0;

    return {
      hall: h,
      screeningsCount: hallScreenings.length,
      reservedSeatsCount,
      totalPotentialCapacity,
      occupancyRate,
    };
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Booking Ref,Customer Name,Customer Email,Movie,Hall,Date,Time,Seats,Amount,Payment Method,Status\n';

    bookings.forEach((b) => {
      const seatsStr = b.seats.map((s) => s.seatCode).join(';');
      csvContent += `"${b.bookingRef}","${b.customerName}","${b.customerEmail}","${b.movieTitle}","${b.hallName}","${b.screeningDate}","${b.screeningTime}","${seatsStr}",${b.totalAmount},"${b.paymentMethod}","${b.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CineReserve_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            Reservation & Financial Reports Generator (ReportGenerator)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Aggregate transactional telemetry, hall occupancy indexes, and generate CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export Bookings (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* High Level KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[11px] text-neutral-400">Total Net Collections</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            ${totalRevenue.toFixed(2)}
          </div>
          <span className="text-[10px] text-neutral-400">All payment channels combined</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[11px] text-neutral-400">Total Reserved Tickets</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {confirmedBookings.reduce((sum, b) => sum + b.seats.length, 0)} Seats
          </div>
          <span className="text-[10px] text-neutral-400">Successfully locked in screening matrix</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[11px] text-neutral-400">Average Spend per Transaction</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
            ${confirmedBookings.length > 0 ? (totalRevenue / confirmedBookings.length).toFixed(2) : '0.00'}
          </div>
          <span className="text-[10px] text-neutral-400">Including concessions & seat multipliers</span>
        </div>
      </div>

      {/* Movie Performance Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Film className="h-4 w-4 text-amber-400" />
          Theatrical Performance Breakdown by Movie Title
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Scheduled Shows</th>
                <th className="py-2.5 px-3">Tickets Sold</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {moviePerformance.map((item) => (
                <tr key={item.movie.id} className="hover:bg-neutral-800/20">
                  <td className="py-2.5 px-3 font-semibold text-white">{item.movie.title}</td>
                  <td className="py-2.5 px-3 text-amber-400 font-mono">{item.movie.rating}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-300">{item.showsCount}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-300">{item.ticketsCount}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-white">
                    ${item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hall Utilization Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Armchair className="h-4 w-4 text-purple-400" />
          Cinema Hall Capacity & Utilization Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hallUtilization.map((item) => (
            <div
              key={item.hall.id}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.hall.name}</h4>
                  <span className="text-[11px] text-neutral-400">{item.hall.type}</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {item.occupancyRate}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Occupancy</span>
                  <span className="font-mono">
                    {item.reservedSeatsCount} / {item.totalPotentialCapacity || item.hall.totalSeats} seats
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${item.occupancyRate}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-900">
                Scheduled shows: <strong className="text-white">{item.screeningsCount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
