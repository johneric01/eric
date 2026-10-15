import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Armchair, Wrench, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SeatTier } from '../../types';

export const SeatManagerView: React.FC = () => {
  const { halls, hallMaintenanceSeats, toggleSeatMaintenance } = useCinema();
  const [selectedHallId, setSelectedHallId] = useState<string>(halls[0]?.id || 'hall-1');

  const currentHall = halls.find((h) => h.id === selectedHallId) || halls[0];
  const maintenanceList = hallMaintenanceSeats[currentHall.id] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Armchair className="h-5 w-5 text-amber-400" />
            Cinema Seat Management (Seat & SeatManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Configure hall layout, seat tier pricing multipliers, and toggle seat maintenance flags.
          </p>
        </div>

        {/* Hall Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {halls.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHallId(h.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedHallId === h.id
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {h.name.split('–')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Hall Details Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
          <span className="text-[11px] text-neutral-400">Auditorium Name</span>
          <div className="text-sm font-bold text-white truncate">{currentHall.name}</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
          <span className="text-[11px] text-neutral-400">Total Physical Capacity</span>
          <div className="text-sm font-bold font-mono tabular-nums text-white">
            {currentHall.totalSeats} Seats
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
          <span className="text-[11px] text-neutral-400">Available For Reservation</span>
          <div className="text-sm font-bold font-mono tabular-nums text-emerald-400">
            {currentHall.totalSeats - maintenanceList.length} Operational
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
          <span className="text-[11px] text-neutral-400">Under Maintenance / Blocked</span>
          <div className="text-sm font-bold font-mono tabular-nums text-amber-400">
            {maintenanceList.length} Blocked
          </div>
        </div>
      </div>

      {/* Interactive Seat Maintenance Grid */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Auditorium Seating Layout</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any seat below to toggle <strong className="text-amber-400">Maintenance Mode</strong> (blocked seats cannot be booked by customers).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-neutral-800 border border-neutral-700" />
              <span>Operational Seat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-red-950/80 border border-red-800" />
              <span className="text-red-300">Under Maintenance (Blocked)</span>
            </div>
          </div>
        </div>

        {/* Screen graphic */}
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-t-full shadow-[0_-6px_15px_rgba(245,158,11,0.2)]" />
          <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 mt-1 block">
            Auditorium Curved Projection Screen
          </span>
        </div>

        {/* Matrix */}
        <div className="flex flex-col items-center justify-center min-w-max py-4">
          <div className="space-y-2">
            {currentHall.rows.map((rowLetter, rowIndex) => {
              let tier: SeatTier = 'Regular';
              if (rowIndex >= 2 && rowIndex < currentHall.rows.length - 2) {
                tier = 'Deluxe';
              } else if (rowIndex >= currentHall.rows.length - 2) {
                tier = 'VIP';
              }

              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-neutral-500 font-mono">
                    {rowLetter}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: currentHall.columns }, (_, i) => i + 1).map((col) => {
                      const seatCode = `${rowLetter}${col < 10 ? '0' + col : col}`;
                      const isMaintenance = maintenanceList.includes(seatCode);

                      return (
                        <button
                          key={seatCode}
                          onClick={() => toggleSeatMaintenance(currentHall.id, seatCode)}
                          title={`${seatCode} (${tier}) - Click to toggle maintenance`}
                          className={`h-8 w-8 rounded-md border text-xs font-mono font-medium flex items-center justify-center transition-all ${
                            isMaintenance
                              ? 'bg-red-950 border-red-800 text-red-300 font-bold shadow-sm'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-amber-400 hover:bg-neutral-750'
                          }`}
                        >
                          {isMaintenance ? '!' : col}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-6 text-center text-xs font-bold text-neutral-500 font-mono">
                    {rowLetter}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
