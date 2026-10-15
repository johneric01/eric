import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { Customer } from '../../types';
import { Users, Plus, Search, Award, Mail, Phone, Calendar, X } from 'lucide-react';

export const CustomerManagerView: React.FC = () => {
  const { customers, addCustomer, updateCustomer } = useCinema();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addCustomer({
      name,
      email,
      phone,
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-400" />
            Customer Management (Customer & CustomerManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Store and manage customer accounts, reward loyalty points, and track reservations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Customer Account
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Loyalty Points</th>
                <th className="py-3 px-4">Total Bookings</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white text-sm">{cust.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Mail className="h-3 w-3 text-neutral-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                      <Phone className="h-3 w-3 text-neutral-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                      <Award className="h-3.5 w-3.5" />
                      <span>{cust.loyaltyPoints} pts</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {cust.totalBookings} reservation(s)
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {cust.memberSince}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
              <h3 className="text-base font-bold text-white">Register Customer Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Maria Santos"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="+63 917 000 0000"
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
