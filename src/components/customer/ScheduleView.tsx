import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Calendar, Clock, Film, Ticket, Armchair } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { screenings, movies, halls, setSelectedMovieForBooking, setSelectedScreeningForBooking } =
    useCinema();

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');

  // Filter screenings for selected date
  const dateScreenings = screenings.filter((s) => s.date === selectedDate);

  const handleBook = (screeningId: string) => {
    const s = screenings.find((item) => item.id === screeningId);
    if (!s) return;
    const m = movies.find((movie) => movie.id === s.movieId);
    if (!m) return;
    setSelectedMovieForBooking(m);
    setSelectedScreeningForBooking(s);
  };

  return (
    <div className="space-y-6">
      {/* Title & Date Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            Cinema Screening Schedules
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Browse daily showtimes across Dolby Atmos, IMAX Laser, and Premier VIP Auditoriums.
          </p>
        </div>

        {/* Date Selector buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {['2026-10-14', '2026-10-15', '2026-10-16'].map((dateStr) => {
            const dateObj = new Date(dateStr);
            const label = dateStr === '2026-10-14' ? 'Today, Oct 14' : dateStr === '2026-10-15' ? 'Tomorrow, Oct 15' : 'Friday, Oct 16';

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedDate === dateStr
                    ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped by Cinema Hall */}
      <div className="space-y-6">
        {halls.map((hall) => {
          const hallShows = dateScreenings.filter((s) => s.hallId === hall.id);

          return (
            <div
              key={hall.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-white">{hall.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <span>{hall.soundSystem}</span>
                    <span aria-hidden="true">·</span>
                    <span>{hall.screenFormat}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{hall.totalSeats} seats capacity</span>
                  </div>
                </div>

                <div className="text-xs font-medium text-amber-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800 shrink-0 self-start sm:self-auto">
                  {hall.type}
                </div>
              </div>

              {hallShows.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-500">
                  No screenings scheduled in {hall.name} for this date.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hallShows.map((show) => {
                    const movie = movies.find((m) => m.id === show.movieId);
                    if (!movie) return null;

                    const bookedCount = show.reservedSeatCodes.length;
                    const availableCount = hall.totalSeats - bookedCount;
                    const occupancyPct = Math.round((bookedCount / hall.totalSeats) * 100);

                    return (
                      <div
                        key={show.id}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="h-20 w-14 rounded-md object-cover border border-neutral-800 shrink-0"
                          />

                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span className="text-amber-400 font-semibold">{movie.rating}</span>
                              <span aria-hidden="true">·</span>
                              <span>{movie.durationMinutes} mins</span>
                            </div>
                            <div className="text-xs font-bold text-white mt-2 flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-amber-400" />
                              <span>{show.startTime} – {show.endTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Occupancy bar */}
                        <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                          <div className="flex justify-between text-[11px] text-neutral-400">
                            <span>Available: <strong className="text-white font-mono">{availableCount}</strong></span>
                            <span className="font-mono tabular-nums">{occupancyPct}% booked</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all"
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="text-xs font-mono font-bold text-neutral-200">
                            ${show.ticketPrice.toFixed(2)}
                            <span className="text-[10px] text-neutral-500 font-normal ml-1">/ ticket</span>
                          </div>

                          <button
                            onClick={() => handleBook(show.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            Select Seats
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
