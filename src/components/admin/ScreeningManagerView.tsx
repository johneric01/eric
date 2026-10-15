import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Screening } from '../../types';
import { Calendar, Plus, Trash2, Clock, MapPin, X } from 'lucide-react';

export const ScreeningManagerView: React.FC = () => {
  const { screenings, movies, halls, addScreening, deleteScreening } = useCinema();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [movieId, setMovieId] = useState(movies[0]?.id || '');
  const [hallId, setHallId] = useState(halls[0]?.id || '');
  const [date, setDate] = useState('2026-10-14');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:30');
  const [ticketPrice, setTicketPrice] = useState(14.0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId || !hallId) return;

    addScreening({
      movieId,
      hallId,
      date,
      startTime,
      endTime,
      ticketPrice: Number(ticketPrice),
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            Screening Schedule Management (Screening & ScreeningManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Assign theatrical movies to cinema halls, showtime slots, and ticket pricing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Schedule New Screening
        </button>
      </div>

      {/* Screenings Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Movie</th>
                <th className="py-3 px-4">Cinema Hall</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Showtime</th>
                <th className="py-3 px-4">Base Ticket</th>
                <th className="py-3 px-4">Reserved Seats</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {screenings.map((show) => {
                const movie = movies.find((m) => m.id === show.movieId);
                const hall = halls.find((h) => h.id === show.hallId);
                const bookedCount = show.reservedSeatCodes.length;
                const totalSeats = hall?.totalSeats || 96;

                return (
                  <tr key={show.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={movie?.posterUrl}
                          alt={movie?.title}
                          referrerPolicy="no-referrer"
                          className="h-10 w-7 rounded object-cover border border-neutral-800"
                        />
                        <span className="font-bold text-white text-sm">{movie?.title}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-amber-400">{hall?.name}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-300">{show.date}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono font-medium text-white">
                        <Clock className="h-3 w-3 text-neutral-400" />
                        {show.startTime} – {show.endTime}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-white">
                      ${show.ticketPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-300">
                          {bookedCount} / {totalSeats}
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.round((bookedCount / totalSeats) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Delete this screening schedule?')) {
                            deleteScreening(show.id);
                          }
                        }}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        title="Delete Screening"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Screening Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
              <h3 className="text-base font-bold text-white">Schedule New Screening</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Select Movie</label>
                <select
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.rating} · {m.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Cinema Hall Room</label>
                <select
                  value={hallId}
                  onChange={(e) => setHallId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  {halls.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.totalSeats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Screening Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Ticket Base Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 shadow-sm"
                >
                  Add Screening Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
