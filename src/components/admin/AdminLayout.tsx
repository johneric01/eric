import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { AdminDashboard } from './AdminDashboard';
import { MovieManagerView } from './MovieManagerView';
import { ScreeningManagerView } from './ScreeningManagerView';
import { SeatManagerView } from './SeatManagerView';
import { CustomerManagerView } from './CustomerManagerView';
import { BookingManagerView } from './BookingManagerView';
import { PaymentManagerView } from './PaymentManagerView';
import { ReportsView } from './ReportsView';
import {
  LayoutDashboard,
  Film,
  Calendar,
  Armchair,
  Users,
  Ticket,
  CreditCard,
  BarChart3,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminSubTab, setAdminSubTab } = useCinema();

  const subTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'movies', label: 'Movie Management', icon: Film },
    { id: 'screenings', label: 'Screening Schedules', icon: Calendar },
    { id: 'seats', label: 'Cinema Seats', icon: Armchair },
    { id: 'bookings', label: 'Booking Records', icon: Ticket },
    { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
    { id: 'customers', label: 'Customer Accounts', icon: Users },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-Navigation Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 rounded-xl border border-neutral-800 min-w-max">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = adminSubTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setAdminSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-View */}
      {adminSubTab === 'dashboard' && <AdminDashboard />}
      {adminSubTab === 'movies' && <MovieManagerView />}
      {adminSubTab === 'screenings' && <ScreeningManagerView />}
      {adminSubTab === 'seats' && <SeatManagerView />}
      {adminSubTab === 'bookings' && <BookingManagerView />}
      {adminSubTab === 'payments' && <PaymentManagerView />}
      {adminSubTab === 'customers' && <CustomerManagerView />}
      {adminSubTab === 'reports' && <ReportsView />}
    </div>
  );
};
