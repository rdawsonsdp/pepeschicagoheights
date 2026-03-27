'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCatering } from '@/context/CateringContext';
import { formatCurrency, hasEnoughServings, calculateServingCoverage } from '@/lib/pricing';
import { getVariantLabel } from '@/lib/cart-utils';
import { getBudgetStatus } from '@/lib/budgets';
import { getEventTypeName } from '@/lib/event-types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import Alert from '@/components/ui/Alert';
import HaveEnoughFoodModal from './HaveEnoughFoodModal';

interface CateringCartProps {
  onCheckout: () => void;
}

export default function CateringCart({ onCheckout }: CateringCartProps) {
  const {
    state,
    dispatch,
    totalCost,
    perPersonCost,
    calculatedItems,
    totalServings,
    canProceedToCheckout,
  } = useCatering();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  const handleHeadcountChange = (value: number) => {
    dispatch({ type: 'SET_HEADCOUNT', payload: Math.max(1, value) });
  };

  const handleRemoveItem = (cartKey: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartKey });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ITEMS' });
  };

  const handleResetOrder = () => {
    dispatch({ type: 'RESET' });
    setShowResetConfirm(false);
  };

  const handleCheckoutClick = () => {
    // Check if there's enough food for the headcount
    if (state.selectedItems.length > 0 && !hasEnoughServings(state.selectedItems, state.headcount)) {
      setShowFoodModal(true);
      return;
    }
    onCheckout();
  };

  const quickHeadcounts = [10, 25, 50, 100, 150, 200];

  // Calculate delivery fee based on order size
  const getDeliveryFee = (headcount: number): number => {
    if (headcount <= 25) return 75;
    if (headcount <= 50) return 125;
    return 200;
  };

  const getOrderSizeLabel = (headcount: number): string => {
    if (headcount <= 25) return 'Small';
    if (headcount <= 50) return 'Medium';
    return 'Large';
  };

  const deliveryFee = getDeliveryFee(state.headcount);
  const tax = calculatedItems.length > 0 ? (totalCost + deliveryFee) * 0.10 : 0;
  const orderTotal = totalCost + (calculatedItems.length > 0 ? deliveryFee : 0) + tax;
  const totalPerPerson = calculatedItems.length > 0 ? orderTotal / state.headcount : 0;

  // Budget status
  const budgetStatus = getBudgetStatus(totalPerPerson, state.budgetRange, state.customBudget);
  const budgetVariant = budgetStatus === 'on-track' ? 'success' : budgetStatus === 'under' ? 'warning' : 'error';

  // Serving coverage
  const coverage = calculateServingCoverage(state.selectedItems, state.headcount);
  const hasEnough = hasEnoughServings(state.selectedItems, state.headcount);

  return (
    <>
      <Card className="animate-scale-in delay-200" hover={false}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-oswald font-bold text-pepe-dark tracking-wide">
            Your Order
          </h2>
        </div>

        {/* Large Stats Display */}
        {state.selectedItems.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-pepe-sand/30 rounded-xl border-l-4 border-pepe-red">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Per Person</p>
              <p className="font-oswald text-2xl sm:text-3xl font-bold text-pepe-dark">
                {formatCurrency(totalPerPerson)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Total</p>
              <p className="font-oswald text-2xl sm:text-3xl font-bold text-pepe-red">
                {formatCurrency(orderTotal)}
              </p>
            </div>
          </div>
        )}

        {/* Budget Tracker */}
        {state.budgetRange && state.selectedItems.length > 0 && (
          <div className="mb-4 p-3 bg-pepe-sand/30 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-muted uppercase">Budget: {state.budgetRange.label}/person</span>
              <span className={`text-xs font-bold ${
                budgetStatus === 'on-track' ? 'text-pepe-green' : budgetStatus === 'under' ? 'text-pepe-orange' : 'text-error-red'
              }`}>
                {budgetStatus === 'on-track' ? 'On Track' : budgetStatus === 'under' ? 'Under Budget' : 'Over Budget'}
              </span>
            </div>
            <ProgressBar
              value={Math.min(totalPerPerson, state.budgetRange.max)}
              max={state.budgetRange.max}
              variant={budgetVariant}
            />
          </div>
        )}

        {/* Serving Coverage Alert */}
        {state.selectedItems.length > 0 && !hasEnough && (
          <Alert variant="warning" className="mb-4">
            <p className="text-xs">
              <strong>Low coverage:</strong> Your order covers {coverage}% of {state.headcount} guests.
              Consider adding more items.
            </p>
          </Alert>
        )}

        {/* Event Type Summary */}
        {state.eventType && (
          <div className="mb-4 p-3 bg-pepe-sand/20 rounded-xl text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Event Type:</span>
              <span className="font-medium text-pepe-dark">
                {getEventTypeName(state.eventType)}
              </span>
            </div>
          </div>
        )}

        {/* Headcount Input */}
        <div className="mb-4 sm:mb-6">
          <label className="text-xs font-semibold text-pepe-dark uppercase tracking-wide mb-2 block font-oswald">
            Number of Guests
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleHeadcountChange(state.headcount - 5)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-pepe-sand text-pepe-charcoal hover:bg-pepe-sand/50 transition-colors text-lg font-medium"
              aria-label="Decrease guests"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={state.headcount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) handleHeadcountChange(val);
              }}
              className="flex-1 text-center font-bold text-pepe-dark text-lg border border-pepe-sand bg-pepe-warm-white rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-pepe-orange/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => handleHeadcountChange(state.headcount + 5)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-pepe-sand text-pepe-charcoal hover:bg-pepe-sand/50 transition-colors text-lg font-medium"
              aria-label="Increase guests"
            >
              +
            </button>
          </div>

          {/* Quick-select presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickHeadcounts.map((n) => (
              <button
                key={n}
                onClick={() => handleHeadcountChange(n)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  state.headcount === n
                    ? 'bg-pepe-dark text-white'
                    : 'bg-pepe-sand/50 text-pepe-charcoal hover:bg-pepe-red/20 hover:text-pepe-dark'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Items */}
        {calculatedItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-sm text-muted">Add items to build your order</p>
            <p className="text-xs text-muted/70 mt-1">Sizes auto-adjust to your guest count</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[300px] sm:max-h-[350px] overflow-y-auto">
              {calculatedItems.map((item) => {
                // Build variant label for display
                const variantLabel = item.selectedVariant
                  ? item.product.variants?.options.find(o => o.id === item.selectedVariant)?.label
                  : null;
                const splitLabel = item.variantSplit
                  ? Object.entries(item.variantSplit)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => {
                        const opt = item.product.variants?.options.find(o => o.id === k);
                        return `${v} ${opt?.label ?? k}`;
                      })
                      .join(', ')
                  : null;

                return (
                  <div
                    key={item.cartKey || item.product.id}
                    className="flex justify-between items-start border-b border-pepe-sand pb-3"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-oswald font-semibold text-pepe-dark text-sm truncate">
                        {item.itemQuantity > 1 ? `${item.itemQuantity} \u00d7 ` : ''}
                        {item.product.title}
                        {variantLabel ? ` (${variantLabel})` : ''}
                      </p>
                      {splitLabel && (
                        <p className="text-xs text-pepe-red mt-0.5 font-medium">
                          {splitLabel}
                        </p>
                      )}
                      <p className="text-xs text-pepe-green mt-0.5">
                        {item.displayText}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-oswald font-bold text-pepe-dark text-sm whitespace-nowrap">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.cartKey || item.product.id)}
                        className="text-error-red/70 hover:text-error-red p-1"
                        aria-label={`Remove ${item.product.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="w-full text-sm text-muted hover:text-pepe-red mb-4 transition-colors"
            >
              Clear All Items
            </button>

            {/* Totals */}
            <div className="border-t-2 border-[#E88A00] pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-pepe-charcoal/70">Subtotal</span>
                <span className="font-semibold text-pepe-dark">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-pepe-charcoal/70">Delivery</span>
                  <span className="text-xs text-muted/70">({getOrderSizeLabel(state.headcount)})</span>
                </div>
                <span className="font-semibold text-pepe-dark">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pepe-charcoal/70">Tax (10%)</span>
                <span className="font-semibold text-pepe-dark">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-pepe-sand">
                <span className="text-pepe-charcoal/70">Per Person ({state.headcount} guests)</span>
                <span className="font-semibold text-pepe-dark">
                  {formatCurrency(totalPerPerson)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-oswald font-bold pt-2 border-t border-pepe-sand">
                <span className="text-[#E88A00]">Order Total</span>
                <span className="text-[#E88A00]">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckoutClick}
              disabled={!canProceedToCheckout()}
              className="w-full mt-4"
            >
              Proceed to Checkout
            </Button>
          </>
        )}

        {/* Reset Order Bar */}
        <div className="mt-6 pt-4 border-t border-pepe-sand">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted/70 hover:text-muted transition-colors py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </button>
          ) : (
            <div className="bg-pepe-red/5 rounded-xl p-3 animate-scale-in">
              <p className="text-sm text-pepe-charcoal text-center mb-3">
                Reset your entire order?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-pepe-charcoal bg-pepe-warm-white border border-pepe-sand rounded-xl hover:bg-pepe-sand/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetOrder}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-pepe-red rounded-xl hover:bg-pepe-maroon transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Have Enough Food Modal */}
      <HaveEnoughFoodModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        onAddMore={() => setShowFoodModal(false)}
        onReduceGuests={() => {
          setShowFoodModal(false);
          // Reduce headcount to match servings
          const newHeadcount = Math.max(1, totalServings);
          dispatch({ type: 'SET_HEADCOUNT', payload: newHeadcount });
        }}
        onContinue={() => {
          setShowFoodModal(false);
          onCheckout();
        }}
      />
    </>
  );
}
