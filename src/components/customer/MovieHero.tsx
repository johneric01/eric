import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Ticket, Info, Clock, Star, Sparkles } from 'lucide-react';

export const MovieHero: React.FC = () => {
  const { movies, setSelectedMovieForBooking, screenings, setSelectedScreeningForBooking } = useCinema();
  const featuredMovie = movies[0]; // Interstellar Odyssey

  if (!featuredMovie) return null;

  const handleQuickBook = () => {
    setSelectedMovieForBooking(featuredMovie);
    const firstScreening = screenings.find((s) => s.movieId === featuredMovie.id);
    if (firstScreening) {
      setSelectedScreeningForBooking(firstScreening);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 mb-12 shadow-2xl">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cinema_hall_1791970195338.jpg"
          alt="Cinema auditorium with ambient lighting"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left column: Content */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NOW SHOWING IN IMAX LASER</span>
            <span aria-hidden="true">·</span>
            <span>HALL 2</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            {featuredMovie.title}
          </h1>

          {/* Clean unboxed metadata with separators */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-300">
            <span className="font-semibold text-white">{featuredMovie.rating}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              {featuredMovie.durationMinutes} mins
            </span>
            <span aria-hidden="true">·</span>
            <span>{featuredMovie.genre.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              4.9/5 Rating
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-neutral-300">
              From ${featuredMovie.ticketPriceBase.toFixed(2)}
            </span>
          </div>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            {featuredMovie.synopsis}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleQuickBook}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <Ticket className="h-4 w-4" />
              Book Tickets & Reserve Seats
            </button>
            <button
              onClick={() => setSelectedMovieForBooking(featuredMovie)}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900/80 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap"
            >
              <Info className="h-4 w-4" />
              View Details & Cast
            </button>
          </div>
        </div>

        {/* Right column: Poster Thumbnail */}
        <div className="hidden lg:flex lg:col-span-4 justify-end">
          <div className="relative group w-52 overflow-hidden rounded-xl border border-neutral-700/80 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={featuredMovie.posterUrl}
              alt={featuredMovie.title}
              referrerPolicy="no-referrer"
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-medium text-amber-400">Directed by {featuredMovie.director}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
