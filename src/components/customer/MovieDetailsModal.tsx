import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { X, Clock, Calendar, Film, Star, User, Ticket } from 'lucide-react';

export const MovieDetailsModal: React.FC = () => {
  const {
    selectedMovieForBooking,
    setSelectedMovieForBooking,
    screenings,
    halls,
    setSelectedScreeningForBooking,
  } = useCinema();

  if (!selectedMovieForBooking) return null;
  const movie = selectedMovieForBooking;

  const movieScreenings = screenings.filter((s) => s.movieId === movie.id);

  const handleSelectScreening = (screeningId: string) => {
    const screening = screenings.find((s) => s.id === screeningId);
    if (screening) {
      setSelectedScreeningForBooking(screening);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Movie Overview & Screening Times</h2>
          </div>
          <button
            onClick={() => setSelectedMovieForBooking(null)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Poster */}
            <div className="md:col-span-4">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-md">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">{movie.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-neutral-400">
                  <span className="font-semibold text-amber-400">{movie.rating}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {movie.durationMinutes} mins
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.genre.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    4.8 / 5
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-neutral-300">Synopsis</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{movie.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-800/80">
                <div>
                  <span className="text-neutral-500 block">Director</span>
                  <span className="text-neutral-200 font-medium">{movie.director}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Release Date</span>
                  <span className="text-neutral-200 font-medium">{movie.releaseDate}</span>
                </div>
              </div>

              <div className="text-xs pt-2">
                <span className="text-neutral-500 block mb-1">Key Cast</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300 border border-neutral-700/50"
                    >
                      <User className="h-2.5 w-2.5 text-neutral-400" />
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Screening Times Selection */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                Available Screenings & Showtimes
              </h3>
              <span className="text-xs text-neutral-400">Click a time slot to select seats</span>
            </div>

            {movieScreenings.length === 0 ? (
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-6 text-center text-xs text-neutral-400">
                No active showtimes currently scheduled for this title. Check back soon!
              </div>
            ) : (
              <div className="space-y-3">
                {halls.map((hall) => {
                  const hallShows = movieScreenings.filter((s) => s.hallId === hall.id);
                  if (hallShows.length === 0) return null;

                  return (
                    <div
                      key={hall.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{hall.name}</span>
                        <span className="text-neutral-400">{hall.soundSystem}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {hallShows.map((show) => {
                          const bookedCount = show.reservedSeatCodes.length;
                          const availableCount = hall.totalSeats - bookedCount;

                          return (
                            <button
                              key={show.id}
                              onClick={() => handleSelectScreening(show.id)}
                              className="group flex flex-col items-start rounded-lg border border-neutral-700 bg-neutral-900 hover:border-amber-500 hover:bg-neutral-850 px-3 py-2 text-left transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-amber-400">
                                <Ticket className="h-3 w-3" />
                                {show.startTime}
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-2">
                                <span className="font-mono tabular-nums">${show.ticketPrice.toFixed(2)}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-neutral-400">{availableCount} seats left</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
