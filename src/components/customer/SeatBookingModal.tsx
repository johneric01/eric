import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { SeatTier, PaymentMethod } from '../../types';
import {
  X,
  Armchair,
  ShoppingBag,
  CreditCard,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const SeatBookingModal: React.FC = () => {
  const {
    selectedScreeningForBooking,
    setSelectedScreeningForBooking,
    getScreeningSeats,
    concessions,
    createBooking,
    activeCustomer,
  } = useCinema();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedSeats, setSelectedSeats] = useState<
    { seatCode: string; tier: SeatTier; price: number }[]
  >([]);
  const [concessionQuantities, setConcessionQuantities] = useState<Record<string, number>>({});

  // Customer Contact Info
  const [customerName, setCustomerName] = useState(activeCustomer?.name || 'John Eric Lumasac');
  const [customerEmail, setCustomerEmail] = useState(
    activeCustomer?.email || 'lumasac.johneric@student.edu.ph'
  );
  const [customerPhone, setCustomerPhone] = useState(activeCustomer?.phone || '+63 917 555 0192');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCash');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedScreeningForBooking) return null;

  const screeningData = getScreeningSeats(selectedScreeningForBooking.id);
  if (!screeningData) return null;

  const { hall, screening, movie, seatMatrix } = screeningData;

  const toggleSeatSelection = (seat: (typeof seatMatrix)[0]) => {
    if (seat.status === 'reserved' || seat.status === 'maintenance') {
      return;
    }
    const alreadySelected = selectedSeats.find((s) => s.seatCode === seat.code);
    if (alreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.seatCode !== seat.code));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMsg('Maximum 8 seats per single reservation transaction.');
        return;
      }
      setErrorMsg(null);
      setSelectedSeats((prev) => [
        ...prev,
        { seatCode: seat.code, tier: seat.tier, price: seat.price },
      ]);
    }
  };

  const updateConcessionQty = (id: string, delta: number) => {
    setConcessionQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Pricing calculations
  const seatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const concessionsTotal = concessions.reduce((sum, item) => {
    const qty = concessionQuantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);
  const subtotal = seatsTotal + concessionsTotal;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const totalAmount = Number((subtotal + tax).toFixed(2));

  const handleProceedToConcessions = () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least one seat to proceed.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  const handleFinalBooking = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const selectedConcessionsList = concessions
        .filter((c) => (concessionQuantities[c.id] || 0) > 0)
        .map((c) => ({ item: c, quantity: concessionQuantities[c.id] || 0 }));

      createBooking({
        customerId: activeCustomer?.id,
        customerName,
        customerEmail,
        customerPhone,
        screeningId: screening.id,
        seats: selectedSeats,
        concessions: selectedConcessionsList,
        paymentMethod,
      });

      // Close this modal - the CinemaContext now has latestConfirmedBooking which opens TicketConfirmationModal!
      setSelectedScreeningForBooking(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete reservation.');
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedScreeningForBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-3.5 bg-neutral-950/60 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>{movie.title}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300">{hall.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-300">
                {screening.date} at {screening.startTime}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">
              {currentStep === 1 && 'Step 1: Select Cinema Seats'}
              {currentStep === 2 && 'Step 2: Add Cinema Concessions (Optional)'}
              {currentStep === 3 && 'Step 3: Customer Details & Payment'}
            </h2>
          </div>

          <button
            onClick={closeModal}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Flow Tracker */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/30 text-xs font-medium text-center shrink-0">
          <div
            className={`py-2 px-3 border-b-2 transition-colors ${
              currentStep === 1
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400'
            }`}
          >
            1. Seat Selection
          </div>
          <div
            className={`py-2 px-3 border-b-2 transition-colors ${
              currentStep === 2
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400'
            }`}
          >
            2. Concessions
          </div>
          <div
            className={`py-2 px-3 border-b-2 transition-colors ${
              currentStep === 3
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400'
            }`}
          >
            3. Checkout & Payment
          </div>
        </div>

        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="flex items-center gap-2 bg-rose-950/80 border-b border-rose-800/80 px-6 py-2 text-xs text-rose-200 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Interactive Seat Layout View */}
        {currentStep === 1 && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Seat Map Area */}
            <div className="lg:col-span-8 flex flex-col p-4 sm:p-6 overflow-y-auto">
              {/* Screen curved banner */}
              <div className="w-full max-w-xl mx-auto mb-6 text-center">
                <div className="h-2.5 w-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent rounded-t-full shadow-[0_-8px_20px_rgba(245,158,11,0.25)]" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 mt-1 block">
                  Curved Cinema Screen This Way
                </span>
              </div>

              {/* Seat Matrix Grid */}
              <div className="flex-1 flex flex-col items-center justify-center min-w-max py-2">
                <div className="space-y-2">
                  {hall.rows.map((rowLetter) => {
                    const rowSeats = seatMatrix.filter((s) => s.row === rowLetter);

                    return (
                      <div key={rowLetter} className="flex items-center gap-1.5 sm:gap-2">
                        {/* Row letter label */}
                        <span className="w-5 text-center text-xs font-bold text-neutral-500 font-mono">
                          {rowLetter}
                        </span>

                        {/* Row Seats */}
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          {rowSeats.map((seat) => {
                            const isSelected = selectedSeats.some(
                              (s) => s.seatCode === seat.code
                            );
                            const isReserved = seat.status === 'reserved';
                            const isMaintenance = seat.status === 'maintenance';

                            let seatStyle =
                              'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-amber-400 hover:bg-neutral-750 cursor-pointer';

                            if (isSelected) {
                              seatStyle =
                                'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md shadow-amber-500/30 scale-105';
                            } else if (isReserved) {
                              seatStyle =
                                'bg-neutral-950/70 text-neutral-600 border-neutral-900 cursor-not-allowed opacity-50';
                            } else if (isMaintenance) {
                              seatStyle =
                                'bg-red-950/40 text-red-500/60 border-red-900/50 cursor-not-allowed';
                            } else if (seat.tier === 'VIP') {
                              seatStyle =
                                'bg-neutral-800 text-amber-200 border-amber-500/50 hover:border-amber-400 hover:bg-neutral-750 cursor-pointer';
                            }

                            return (
                              <button
                                key={seat.code}
                                onClick={() => toggleSeatSelection(seat)}
                                disabled={isReserved || isMaintenance}
                                title={`${seat.code} · ${seat.tier} · $${seat.price.toFixed(2)}${
                                  isReserved ? ' (Reserved)' : isMaintenance ? ' (Maintenance)' : ''
                                }`}
                                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md border text-[10px] sm:text-xs flex items-center justify-center transition-all ${seatStyle}`}
                              >
                                {isReserved ? '✕' : seat.col}
                              </button>
                            );
                          })}
                        </div>

                        {/* Right Row letter label */}
                        <span className="w-5 text-center text-xs font-bold text-neutral-500 font-mono">
                          {rowLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seat Legend */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-neutral-700 bg-neutral-800" />
                  <span>Regular (${screening.ticketPrice.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-amber-500/50 bg-neutral-800" />
                  <span>VIP Lounge (${(screening.ticketPrice * 1.5).toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-amber-400 bg-amber-500" />
                  <span className="text-white font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-neutral-900 bg-neutral-950/70 text-[9px] flex items-center justify-center text-neutral-600">
                    ✕
                  </div>
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-red-900 bg-red-950/40 text-[9px] flex items-center justify-center text-red-500">
                    !
                  </div>
                  <span>Blocked</span>
                </div>
              </div>
            </div>

            {/* Sidebar Summary Area */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-800 bg-neutral-950/40 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Reservation Summary</h3>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Cinema Auditorium</span>
                    <span className="text-white font-medium">{hall.name}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Sound & Projection</span>
                    <span className="text-white font-medium">{hall.soundSystem}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Date & Showtime</span>
                    <span className="text-white font-medium">
                      {screening.date} · {screening.startTime}
                    </span>
                  </div>
                </div>

                {/* Selected Seats List */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-neutral-300">
                      Selected Seats ({selectedSeats.length})
                    </span>
                    {selectedSeats.length > 0 && (
                      <button
                        onClick={() => setSelectedSeats([])}
                        className="text-[11px] text-neutral-400 hover:text-amber-400"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {selectedSeats.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-neutral-800 p-4 text-center text-xs text-neutral-500">
                      No seats picked yet. Click on any available chair in the seating matrix.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {selectedSeats.map((s) => (
                        <div
                          key={s.seatCode}
                          className="flex items-center justify-between rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs border border-neutral-800"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">{s.seatCode}</span>
                            <span className="text-neutral-400 text-[11px]">{s.tier}</span>
                          </div>
                          <span className="font-mono tabular-nums text-white">
                            ${s.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-400">Seats Subtotal</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-white">
                    ${seatsTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToConcessions}
                  disabled={selectedSeats.length === 0}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                    selectedSeats.length === 0
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  }`}
                >
                  Continue to Concessions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Concessions Add-on View */}
        {currentStep === 2 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amber-400" />
                  Cinema Refreshments & Snack Combos
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Pre-order hot popcorn, snacks, and chilled beverages with zero line waiting.
                </p>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {selectedSeats.length} ticket(s) chosen
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concessions.map((item) => {
                const qty = concessionQuantities[item.id] || 0;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                        <span className="text-xs font-bold font-mono text-amber-400 shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-800/80">
                      <span className="text-[11px] text-neutral-400">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateConcessionQty(item.id, -1)}
                          disabled={qty === 0}
                          className="h-7 w-7 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-200 disabled:opacity-40 flex items-center justify-center hover:bg-neutral-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateConcessionQty(item.id, 1)}
                          className="h-7 w-7 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-200 flex items-center justify-center hover:bg-neutral-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Nav for Step 2 */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700"
              >
                Back to Seat Map
              </button>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Current Subtotal</span>
                  <span className="font-mono text-base font-bold text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 shadow-sm"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Checkout, Customer Details, Payment */}
        {currentStep === 3 && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Contact Info & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Customer Contact Information</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Your cinema ticket QR pass and reservation receipt will be delivered here.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-400" />
                  Select Payment Method
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Transactions are logged to the CineReserve SQL payment ledger.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {(['GCash', 'Maya', 'Credit/Debit Card', 'Cash'] as PaymentMethod[]).map(
                    (method) => {
                      const isSelected = paymentMethod === method;

                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 text-white'
                              : 'border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <span className="text-xs font-semibold">{method}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order Summary Breakdown */}
            <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white">Payment Summary</h4>

                <div className="space-y-2 text-xs border-b border-neutral-800 pb-3">
                  <div className="flex justify-between text-neutral-300">
                    <span>
                      Seats ({selectedSeats.map((s) => s.seatCode).join(', ')})
                    </span>
                    <span className="font-mono tabular-nums text-white">
                      ${seatsTotal.toFixed(2)}
                    </span>
                  </div>

                  {concessionsTotal > 0 && (
                    <div className="flex justify-between text-neutral-300">
                      <span>Concessions & Snacks</span>
                      <span className="font-mono tabular-nums text-white">
                        ${concessionsTotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Cinema Sales Tax (10%)</span>
                    <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-bold text-white">Total Amount Due</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="rounded-lg bg-neutral-900 p-3 text-[11px] text-neutral-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Instant Digital Pass Generation</span>
                  </div>
                  <p>
                    Seats will be locked in MySQL database immediately upon confirmation.
                  </p>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={handleFinalBooking}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? 'Confirming Reservation...' : `Confirm & Pay $${totalAmount.toFixed(2)}`}
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full rounded-lg py-2 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Back to Concessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
