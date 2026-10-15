import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Movie, MovieRating, MovieStatus } from '../../types';
import { Film, Plus, Edit, Trash2, X, Check, Clock } from 'lucide-react';

export const MovieManagerView: React.FC = () => {
  const { movies, addMovie, updateMovie, deleteMovie } = useCinema();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [rating, setRating] = useState<MovieRating>('PG-13');
  const [releaseDate, setReleaseDate] = useState('2026-10-14');
  const [posterUrl, setPosterUrl] = useState('/src/assets/images/movie_interstellar_odyssey_1791970195038.jpg');
  const [director, setDirector] = useState('');
  const [castInput, setCastInput] = useState('');
  const [status, setStatus] = useState<MovieStatus>('Now Showing');
  const [ticketPriceBase, setTicketPriceBase] = useState(13.5);

  const openAddModal = () => {
    setEditingMovie(null);
    setTitle('');
    setSynopsis('');
    setGenreInput('Action, Sci-Fi');
    setDurationMinutes(125);
    setRating('PG-13');
    setReleaseDate('2026-10-20');
    setPosterUrl('/src/assets/images/movie_cyber_nexus_1791970197292.jpg');
    setDirector('');
    setCastInput('');
    setStatus('Now Showing');
    setTicketPriceBase(13.0);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Movie) => {
    setEditingMovie(m);
    setTitle(m.title);
    setSynopsis(m.synopsis);
    setGenreInput(m.genre.join(', '));
    setDurationMinutes(m.durationMinutes);
    setRating(m.rating);
    setReleaseDate(m.releaseDate);
    setPosterUrl(m.posterUrl);
    setDirector(m.director);
    setCastInput(m.cast.join(', '));
    setStatus(m.status);
    setTicketPriceBase(m.ticketPriceBase);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const genres = genreInput.split(',').map((g) => g.trim()).filter(Boolean);
    const parsedCast = castInput.split(',').map((c) => c.trim()).filter(Boolean);
    const cast = parsedCast.length > 0 ? parsedCast : ['Lead Actor', 'Supporting Actor'];

    if (editingMovie) {
      updateMovie(editingMovie.id, {
        title,
        synopsis,
        genre: genres,
        durationMinutes: Number(durationMinutes),
        rating,
        releaseDate,
        posterUrl,
        director,
        cast,
        status,
        ticketPriceBase: Number(ticketPriceBase),
      });
    } else {
      addMovie({
        title,
        synopsis,
        genre: genres,
        durationMinutes: Number(durationMinutes),
        rating,
        releaseDate,
        posterUrl,
        director,
        cast,
        status,
        ticketPriceBase: Number(ticketPriceBase),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-400" />
            Movie Records Management (Movie & MovieManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Perform CRUD operations on theatrical titles stored in MySQL database.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add New Movie
        </button>
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Title & Poster</th>
                <th className="py-3 px-4">Rating / Genre</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {movies.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        referrerPolicy="no-referrer"
                        className="h-14 w-10 rounded object-cover border border-neutral-800 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block text-sm">{m.title}</span>
                        <span className="text-[11px] text-neutral-400">Dir. {m.director}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-amber-400">{m.rating}</span>
                      <div className="text-[11px] text-neutral-400">{m.genre.join(', ')}</div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-300">
                    {m.durationMinutes} mins
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums font-bold text-white">
                    ${m.ticketPriceBase.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        m.status === 'Now Showing'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : m.status === 'Coming Soon'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Edit Movie"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${m.title}"?`)) {
                            deleteMovie(m.id);
                          }
                        }}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        title="Delete Movie"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
              <h3 className="text-base font-bold text-white">
                {editingMovie ? 'Edit Movie Record' : 'Add New Movie Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Interstellar Odyssey"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Movie plot overview..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Sci-Fi, Adventure"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value as MovieRating)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R-16">R-16</option>
                    <option value="R-18">R-18</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MovieStatus)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Now Showing">Now Showing</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Ended">Ended</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Base Ticket ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ticketPriceBase}
                    onChange={(e) => setTicketPriceBase(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Director</label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Key Cast</label>
                  <input
                    type="text"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Actor 1, Actor 2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Poster Asset Path</label>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                />
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
                  {editingMovie ? 'Update Movie' : 'Save Movie to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
