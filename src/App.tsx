/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CinemaProvider, useCinema } from './context/CinemaContext';
import { Header } from './components/Header';
import { MovieHero } from './components/customer/MovieHero';
import { MovieCatalog } from './components/customer/MovieCatalog';
import { MovieDetailsModal } from './components/customer/MovieDetailsModal';
import { SeatBookingModal } from './components/customer/SeatBookingModal';
import { TicketConfirmationModal } from './components/customer/TicketConfirmationModal';
import { ScheduleView } from './components/customer/ScheduleView';
import { AdminLayout } from './components/admin/AdminLayout';
import { OopArchitectureView } from './components/academic/OopArchitectureView';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedMovieForBooking, selectedScreeningForBooking } = useCinema();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'movies' && (
          <div>
            <MovieHero />
            <div className="pt-2">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Theatrical Releases</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Browse active box office titles, check schedules, and reserve seats in real time.
                  </p>
                </div>
              </div>
              <MovieCatalog />
            </div>
          </div>
        )}

        {activeTab === 'schedules' && <ScheduleView />}

        {activeTab === 'admin' && <AdminLayout />}

        {activeTab === 'architecture' && <OopArchitectureView />}
      </main>

      {/* Modals */}
      {selectedMovieForBooking && !selectedScreeningForBooking && <MovieDetailsModal />}
      {selectedScreeningForBooking && <SeatBookingModal />}
      <TicketConfirmationModal />

      {/* Quiet Academic / Production Footer */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/90 py-8 text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-semibold text-neutral-200">
              CineReserve – Cinema Ticket Reservation System
            </div>
            <div className="text-[11px] text-neutral-500">
              SDF04 Object-Oriented Programming (Python & Database) · LFCA311M178 · Instructor: Ms. Jessa Evangelista
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-neutral-500">
            <button onClick={() => setActiveTab('movies')} className="hover:text-neutral-300">
              Movies
            </button>
            <button onClick={() => setActiveTab('schedules')} className="hover:text-neutral-300">
              Schedules
            </button>
            <button onClick={() => setActiveTab('architecture')} className="hover:text-neutral-300">
              OOP & MySQL Specs
            </button>
            <span>Prepared by John Eric V. Lumasac</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CinemaProvider>
      <MainContent />
    </CinemaProvider>
  );
}
