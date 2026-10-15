import React, { useState, useMemo } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Movie } from '../../types';
import {
  Search,
  Film,
  Clock,
  Calendar,
  Ticket,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Shield,
} from 'lucide-react';

const AGE_RATING_HIERARCHY: Record<string, number> = {
  G: 1,
  PG: 2,
  'PG-13': 3,
  'R-16': 4,
  'R-18': 5,
  R: 4,
};

export const MovieCatalog: React.FC = () => {
  const { movies, screenings, setSelectedMovieForBooking, setSelectedScreeningForBooking } = useCinema();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('rating-asc');

  // Extract all unique genres across catalog
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genre.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [movies]);

  const filteredMovies = useMemo(() => {
    // 1. Filtering
    const result = movies.filter((movie) => {
      // Status Filter
      const matchesStatus =
        filterStatus === 'all'
          ? true
          : movie.status.toLowerCase().replace(' ', '-') === filterStatus;

      // Genre Filter
      const matchesGenre =
        selectedGenre === 'all'
          ? true
          : movie.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      // Age Rating Filter (G, PG, PG-13, R)
      let matchesRating = true;
      if (selectedRating !== 'all') {
        if (selectedRating === 'R') {
          matchesRating = movie.rating.startsWith('R');
        } else {
          matchesRating = movie.rating === selectedRating;
        }
      }

      // Search Query Filter (Title, Genre, Director, Cast)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.some((g) => g.toLowerCase().includes(query)) ||
        movie.cast.some((c) => c.toLowerCase().includes(query));

      return matchesStatus && matchesGenre && matchesRating && matchesSearch;
    });

    // 2. Sorting (including age rating sorting)
    return [...result].sort((a, b) => {
      if (sortOption === 'rating-asc') {
        // G -> PG -> PG-13 -> R-16 -> R-18
        const rankA = AGE_RATING_HIERARCHY[a.rating] || 99;
        const rankB = AGE_RATING_HIERARCHY[b.rating] || 99;
        return rankA - rankB;
      }
      if (sortOption === 'rating-desc') {
        // R-18 -> R-16 -> PG-13 -> PG -> G
        const rankA = AGE_RATING_HIERARCHY[a.rating] || 0;
        const rankB = AGE_RATING_HIERARCHY[b.rating] || 0;
        return rankB - rankA;
      }
      if (sortOption === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'price-asc') {
        return a.ticketPriceBase - b.ticketPriceBase;
      }
      if (sortOption === 'duration-desc') {
        return b.durationMinutes - a.durationMinutes;
      }
      return 0;
    });
  }, [movies, filterStatus, selectedGenre, selectedRating, searchQuery, sortOption]);

  const handleBookMovie = (movie: Movie) => {
    setSelectedMovieForBooking(movie);
    const movieScreening = screenings.find((s) => s.movieId === movie.id);
    if (movieScreening) {
      setSelectedScreeningForBooking(movieScreening);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSelectedGenre('all');
    setSelectedRating('all');
    setSortOption('rating-asc');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    filterStatus !== 'all' ||
    selectedGenre !== 'all' ||
    selectedRating !== 'all' ||
    sortOption !== 'rating-asc';

  return (
    <section className="space-y-6">
      {/* Search & Filter Header Box */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 space-y-4 shadow-sm">
        {/* Main Search Input Field */}
        <div className="space-y-1.5">
          <label htmlFor="movie-catalog-search" className="block text-xs font-semibold text-neutral-300">
            Search Theatrical Titles
          </label>
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 pointer-events-none" />
            <input
              id="movie-catalog-search"
              type="text"
              placeholder="Search movies by title, genre, or director (e.g., 'Interstellar', 'Christopher Nolan', 'Sci-Fi')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors"
                title="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row: Age Rating Filter Dropdown + Sort Dropdown + Status Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-neutral-800/80 text-xs items-center">
          {/* Status Segmented Buttons (col-span-5) */}
          <div className="md:col-span-5 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-neutral-400 shrink-0">Status:</span>
            <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All ({movies.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('now-showing')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'now-showing'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Now Showing
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('coming-soon')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'coming-soon'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Age Rating Dropdown Filter (col-span-3) */}
          <div className="md:col-span-3 flex items-center gap-2">
            <label htmlFor="rating-filter-select" className="text-[11px] font-medium text-neutral-400 flex items-center gap-1 shrink-0">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              Rating:
            </label>
            <div className="relative w-full">
              <select
                id="rating-filter-select"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 pr-8 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Age Ratings (G, PG, PG-13, R)</option>
                <option value="G">G – General Audiences (All Ages)</option>
                <option value="PG">PG – Parental Guidance</option>
                <option value="PG-13">PG-13 – Parents Strongly Cautioned</option>
                <option value="R">R / R-16 / R-18 – Restricted (Mature)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
                ▼
              </div>
            </div>
          </div>

          {/* Sort Dropdown including Age Rating Sort (col-span-4) */}
          <div className="md:col-span-4 flex items-center gap-2 justify-end">
            <label htmlFor="sort-movies-select" className="text-[11px] font-medium text-neutral-400 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5 text-amber-400" />
              Sort:
            </label>
            <div className="relative w-full max-w-[240px]">
              <select
                id="sort-movies-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 pr-8 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="rating-asc">Age Rating: Family First (G → R)</option>
                <option value="rating-desc">Age Rating: Mature First (R → G)</option>
                <option value="title-asc">Title: Alphabetical (A → Z)</option>
                <option value="price-asc">Price: Lowest to Highest</option>
                <option value="duration-desc">Runtime: Longest First</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
                ▼
              </div>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[11px] text-amber-400 hover:underline font-medium shrink-0 flex items-center gap-1 ml-1"
                title="Reset all filters and sorting"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Genre Chips Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/80 text-xs">
          <span className="text-[11px] font-medium text-neutral-400 mr-1">Filter by Genre:</span>
          <button
            type="button"
            onClick={() => setSelectedGenre('all')}
            className={`px-2.5 py-0.5 text-[11px] rounded-md transition-colors border ${
              selectedGenre === 'all'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All Genres
          </button>
          {allGenres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre === selectedGenre ? 'all' : genre)}
              className={`px-2.5 py-0.5 text-[11px] rounded-md transition-colors border ${
                selectedGenre === genre
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Real-time Match Indicator */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-1">
          <div>
            Showing <strong className="text-white font-mono">{filteredMovies.length}</strong> of{' '}
            <span className="font-mono">{movies.length}</span> titles
            {selectedRating !== 'all' && (
              <span>
                {' '}
                · Rated <strong className="text-amber-400">{selectedRating}</strong>
              </span>
            )}
            {searchQuery.trim() && (
              <span>
                {' '}
                · Query &ldquo;<span className="text-amber-400 font-medium">{searchQuery}</span>&rdquo;
              </span>
            )}
            {selectedGenre !== 'all' && (
              <span>
                {' '}
                · Genre <span className="text-amber-400 font-medium">{selectedGenre}</span>
              </span>
            )}
          </div>

          <div className="font-mono text-neutral-400">
            Sorted by:{' '}
            <span className="text-neutral-200">
              {sortOption === 'rating-asc' && 'Age Rating (G → R)'}
              {sortOption === 'rating-desc' && 'Age Rating (R → G)'}
              {sortOption === 'title-asc' && 'Title (A → Z)'}
              {sortOption === 'price-asc' && 'Price ($)'}
              {sortOption === 'duration-desc' && 'Duration (mins)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Movies */}
      {filteredMovies.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
            <Film className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No matching movies found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            No titles match the selected age rating &ldquo;{selectedRating}&rdquo; or filter criteria. Try picking &ldquo;All Age Ratings&rdquo; or resetting your search.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
          >
            Clear All Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            const movieScreenings = screenings.filter((s) => s.movieId === movie.id);

            return (
              <div
                key={movie.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900 hover:border-neutral-700 transition-all duration-200"
              >
                {/* Poster Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Subtle status badge indicator */}
                  <div className="absolute top-3 left-3 text-[11px] font-medium text-neutral-300 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-700/50">
                    {movie.status}
                  </div>

                  {/* Top-right age rating badge */}
                  <div className="absolute top-3 right-3 text-[11px] font-bold text-amber-400 bg-neutral-950/90 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-500/40">
                    {movie.rating}
                  </div>
                </div>

                {/* Card Content with zero-pill metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Clean unboxed metadata with separators */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
                      <span className="font-semibold text-amber-400">{movie.rating}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {movie.durationMinutes}m
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-neutral-300">
                        ${movie.ticketPriceBase.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>

                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Dir. <strong className="text-neutral-300 font-medium">{movie.director}</strong>
                    </div>

                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {movie.synopsis}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-neutral-800/70">
                    <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                      <span className="truncate">{movie.genre.join(', ')}</span>
                      <span className="font-mono text-neutral-400 shrink-0">
                        {movieScreenings.length} {movieScreenings.length === 1 ? 'show' : 'shows'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedMovieForBooking(movie)}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800/70 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        Info & Cast
                      </button>

                      {movie.status === 'Now Showing' ? (
                        <button
                          onClick={() => handleBookMovie(movie)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
                        >
                          <Ticket className="h-3.5 w-3.5" />
                          Reserve
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Oct 2026
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
