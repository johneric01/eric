import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { CreditCard, Search, DollarSign, CheckCircle2, RotateCcw, Wallet } from 'lucide-react';

export const PaymentManagerView: React.FC = () => {
  const { transactions } = useCinema();
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredTx = transactions.filter((t) => {
    const matchesMethod = methodFilter === 'all' ? true : t.method.toLowerCase().includes(methodFilter);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      t.transactionRef.toLowerCase().includes(query) ||
      t.bookingRef.toLowerCase().includes(query) ||
      t.customerName.toLowerCase().includes(query);
    return matchesMethod && matchesSearch;
  });

  const totalCollected = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === 'Refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-400" />
            Payment & Financial Transaction Ledger (Payment & PaymentManager)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Audit payment gateways, transaction IDs, settled funds, and customer refunds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            <span className="text-neutral-400">Total Settled: </span>
            <strong className="text-emerald-400 font-mono">${totalCollected.toFixed(2)}</strong>
          </div>
          {totalRefunded > 0 && (
            <div className="text-xs bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-neutral-400">Refunds: </span>
              <strong className="text-rose-400 font-mono">${totalRefunded.toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {['all', 'gcash', 'maya', 'card', 'cash'].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors uppercase whitespace-nowrap ${
                methodFilter === method
                  ? 'bg-neutral-800 text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search transaction ID, booking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No transactions matching filter.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {tx.transactionRef}
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-300">
                      {tx.bookingRef}
                    </td>

                    <td className="py-3 px-4 font-medium text-white">
                      {tx.customerName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-300">{tx.method}</span>
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-white">
                      ${tx.amount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-400">
                      {tx.timestamp}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
