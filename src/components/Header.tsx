import React from 'react';
import { useCinema } from '../context/CinemaContext';
import { Film, User, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, activeTab, setActiveTab, activeCustomer } = useCinema();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('movies')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 shadow-sm">
            <Film className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            CineReserve
          </span>
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('movies')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'movies'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'schedules'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Schedules
          </button>
          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveTab('admin');
            }}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Operations
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'architecture'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            OOP & Database Specs
          </button>
        </nav>

        {/* Zone 3: Primary Action / Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (currentRole === 'customer') {
                setCurrentRole('admin');
                setActiveTab('admin');
              } else {
                setCurrentRole('customer');
                setActiveTab('movies');
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap shadow-sm"
            title="Toggle between Customer Portal and Admin Mode"
          >
            <ArrowRightLeft className="h-3 w-3 text-amber-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold text-amber-400">
              {currentRole === 'admin' ? 'Cinema Admin' : 'Customer'}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs text-neutral-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 font-medium">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="truncate max-w-[120px]">
              {currentRole === 'admin' ? 'Admin Portal' : activeCustomer.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
