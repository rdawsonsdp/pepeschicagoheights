'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CateringProduct } from '@/lib/types';
import { useCatering } from '@/context/CateringContext';
import { getCartKey } from '@/lib/cart-utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getPricingTypeLabel, calculateProductOrder, formatCurrency } from '@/lib/pricing';

interface CateringProductCardProps {
  product: CateringProduct;
  size?: 'hero' | 'large' | 'default' | 'compact';
  showBadge?: boolean;
  badgeText?: string | null;
  descriptionOverride?: string;
}

export default function CateringProductCard({
  product,
  size = 'default',
  showBadge = false,
  badgeText,
  descriptionOverride,
}: CateringProductCardProps) {
  const { state, dispatch, isItemInCart, getItemQuantity } = useCatering();
  const inCart = isItemInCart(product.id);
  const itemQty = getItemQuantity(product.id);

  // Variant state
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeSplitOption, setActiveSplitOption] = useState<string | null>(null);
  const [splitValues, setSplitValues] = useState<Record<string, number>>(() => {
    if (product.variants?.selectionMode === 'split') {
      return Object.fromEntries(product.variants.options.map(o => [o.id, 0]));
    }
    return {};
  });

  const hasVariants = !!product.variants;
  const isSplitMode = product.variants?.selectionMode === 'split';

  // Split mode calculations
  const splitTotal = isSplitMode
    ? Object.values(splitValues).reduce((sum, v) => sum + v, 0)
    : 0;
  const splitTarget = product.variants?.splitTotal ?? 0;
  const splitComplete = isSplitMode && splitTotal === splitTarget;
  const splitRemaining = splitTarget - splitTotal;

  // Can add to cart?
  const canAdd = !hasVariants
    || (isSplitMode && splitComplete)
    || (!isSplitMode && selectedVariant !== null);

  // Pan/tray size selection
  const hasSizes = product.pricing.type === 'pan' || product.pricing.type === 'tray';
  const sizes = hasSizes ? (product.pricing as any).sizes as Array<{ size: string; price: number; servesMin: number; servesMax: number }> : [];

  // Auto-recommend size based on headcount
  const orderCalc = calculateProductOrder(product, state.headcount);
  const recommendedSize = orderCalc.selectedSize || (sizes.length > 0 ? sizes[0].size : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(1);

  // Use selected or recommended
  const activeSize = selectedSize || recommendedSize;
  const activeSizeData = sizes.find(s => s.size === activeSize);
  const displayPrice = activeSizeData ? activeSizeData.price * selectedQty : orderCalc.totalPrice;
  const displayTotal = displayPrice * (itemQty || 1);
  const displayServes = activeSizeData
    ? `${activeSize === 'half' ? 'Half' : activeSize === 'full' ? 'Full' : (activeSize ?? '').charAt(0).toUpperCase() + (activeSize ?? '').slice(1)} Pan (serves ${activeSizeData.servesMin * selectedQty}-${activeSizeData.servesMax * selectedQty})`
    : orderCalc.displayText;

  const handleAdd = () => {
    if (!canAdd) return;
    // For pan/tray items with size selection, adjust product to use selected size/qty
    const qty = hasSizes ? selectedQty : 1;
    for (let i = 0; i < qty; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          product,
          selectedVariant: selectedVariant ?? undefined,
          variantSplit: isSplitMode ? { ...splitValues } : undefined,
          selectedSize: activeSize ?? undefined,
        },
      });
    }
  };

  const handleRemove = () => {
    // Find the matching cart key for this product
    const cartItem = state.selectedItems.find(item => item.product.id === product.id);
    if (cartItem) {
      dispatch({ type: 'REMOVE_ITEM', payload: getCartKey(cartItem) });
    }
  };

  const handleUpdateQuantity = (newQty: number) => {
    const cartItem = state.selectedItems.find(item => item.product.id === product.id);
    if (!cartItem) return;
    const key = getCartKey(cartItem);
    if (newQty <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: key });
    } else {
      dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { cartKey: key, quantity: newQty } });
    }
  };

  const handleSplitChange = (optionId: string, delta: number) => {
    setSplitValues(prev => {
      const current = prev[optionId] ?? 0;
      const newVal = Math.max(0, current + delta);
      const otherTotal = Object.entries(prev)
        .filter(([k]) => k !== optionId)
        .reduce((sum, [, v]) => sum + v, 0);
      // Don't exceed the target
      const capped = Math.min(newVal, splitTarget - otherTotal);
      return { ...prev, [optionId]: capped };
    });
  };

  const handleSplitSet = (optionId: string, value: number) => {
    setSplitValues(prev => {
      const otherTotal = Object.entries(prev)
        .filter(([k]) => k !== optionId)
        .reduce((sum, [, v]) => sum + v, 0);
      const capped = Math.min(value, splitTarget - otherTotal);
      return { ...prev, [optionId]: Math.max(0, capped) };
    });
  };

  // Generate quantity options in increments of 10
  const splitIncrement = 10;
  const splitQuantityOptions = Array.from(
    { length: Math.floor(splitTarget / splitIncrement) + 1 },
    (_, i) => i * splitIncrement
  );

  return (
    <Card className={`group relative overflow-hidden ${
      size === 'hero' ? 'col-span-2' : ''
    } ${inCart ? 'ring-2 ring-[#E88A00] bg-[#E88A00]/5' : ''}`}>

      <div className="flex flex-col h-full">
        {/* Top row: Image + Info side by side */}
        <div className={`flex gap-3 ${size === 'compact' ? '' : 'mb-3'}`}>
          {/* Product Image */}
          {size !== 'compact' && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* In Cart badge */}
              {inCart && (
                <div className="absolute top-1 left-1">
                  <span className="bg-[#E88A00] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    In Cart{itemQty > 1 ? ` (${itemQty})` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Product Info - beside image on mobile, below on desktop */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-oswald font-semibold text-pepe-dark mb-0.5 tracking-wide ${
              size === 'hero' ? 'text-lg sm:text-xl line-clamp-2'
                : 'text-sm sm:text-base line-clamp-2'
            }`}>
              {product.title}
            </h3>

            <p className={`text-xs text-gray-500 mb-1 ${
              size === 'compact' ? 'line-clamp-1' : 'line-clamp-2'
            }`}>
              {descriptionOverride || product.description}
            </p>

            {/* Price preview inline on mobile */}
            <div className="text-sm font-oswald font-bold text-[#E88A00]">
              {formatCurrency(displayTotal)}
              <span className="text-[10px] text-gray-400 font-normal ml-1">{displayServes}</span>
            </div>
          </div>
        </div>


        {/* Variant Selector - Single Mode (visible chips) */}
        {hasVariants && !isSplitMode && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              {product.variants!.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.variants!.options.map(option => {
                const isSelected = selectedVariant === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedVariant(isSelected ? null : option.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#E88A00] text-white border-[#E88A00]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#E88A00] hover:text-[#E88A00]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Variant Selector - Split Mode (collapsible quantity cards) */}
        {hasVariants && isSplitMode && !inCart && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              {product.variants!.label}
            </p>

            {/* Filling buttons */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.variants!.options.map(option => {
                const currentVal = splitValues[option.id] ?? 0;
                const isActive = activeSplitOption === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveSplitOption(isActive ? null : option.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-pepe-dark text-white border-pepe-dark'
                        : currentVal > 0
                          ? 'bg-pepe-red text-white border-pepe-red'
                          : 'bg-pepe-warm-white text-pepe-charcoal border-pepe-sand hover:border-pepe-dark'
                    }`}
                  >
                    {option.label}{currentVal > 0 ? ` (${currentVal})` : ''}
                  </button>
                );
              })}
            </div>

            {/* Quantity cards - only show for active filling */}
            {activeSplitOption && (
              <div className="animate-scale-in">
                {(() => {
                  const option = product.variants!.options.find(o => o.id === activeSplitOption)!;
                  const currentVal = splitValues[option.id] ?? 0;
                  const otherTotal = Object.entries(splitValues)
                    .filter(([k]) => k !== option.id)
                    .reduce((sum, [, v]) => sum + v, 0);
                  const maxForThis = splitTarget - otherTotal;

                  return (
                    <div className="p-2 bg-pepe-sand/30 rounded-lg">
                      <p className="text-[10px] font-semibold text-muted uppercase mb-1.5">
                        How many {option.label}?
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {splitQuantityOptions.map(qty => {
                          const isSelected = currentVal === qty;
                          const isDisabled = qty > maxForThis;
                          return (
                            <button
                              key={qty}
                              onClick={() => {
                                handleSplitSet(option.id, qty);
                              }}
                              disabled={isDisabled}
                              className={`min-w-[2.5rem] px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-pepe-dark text-white shadow-warm scale-105'
                                  : isDisabled
                                    ? 'bg-pepe-sand/50 text-muted/40 cursor-not-allowed'
                                    : 'bg-pepe-warm-white text-pepe-charcoal border border-pepe-sand hover:border-pepe-red hover:text-pepe-red active:scale-95'
                              }`}
                            >
                              {qty}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className={`mt-2 text-xs font-semibold text-center py-1.5 rounded-lg ${
              splitComplete ? 'bg-pepe-orange/10 text-pepe-orange' : 'bg-pepe-sand/30 text-muted'
            }`}>
              Total: {splitTotal}/{splitTarget}
              {splitComplete ? ' \u2713' : ` (${splitRemaining} remaining)`}
            </div>
          </div>
        )}

        {/* Size Selector for pan/tray items */}
        {hasSizes && sizes.length > 0 && !inCart && (
          <div className="mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Size
            </p>
            <div className="flex gap-1.5 mb-2">
              {sizes.map(s => {
                const label = s.size === 'half' ? 'Half Pan' : s.size === 'full' ? 'Full Pan' : s.size.charAt(0).toUpperCase() + s.size.slice(1);
                const isActive = activeSize === s.size;
                return (
                  <button
                    key={s.size}
                    onClick={() => { setSelectedSize(s.size); setSelectedQty(1); }}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all border text-center ${
                      isActive
                        ? 'bg-[#E88A00] text-white border-[#E88A00]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#E88A00]'
                    }`}
                  >
                    <span className="block">{label}</span>
                    <span className="block text-[10px] font-normal opacity-75 mt-0.5">
                      {formatCurrency(s.price)} &middot; {s.servesMin}-{s.servesMax}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Quantity selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qty</span>
              <div className="flex items-center bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-l-lg text-sm font-bold"
                >−</button>
                <span className="w-8 text-center font-oswald font-bold text-sm">{selectedQty}</span>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-r-lg text-sm font-bold"
                >+</button>
              </div>
            </div>
          </div>
        )}


        {/* In-cart variants summary */}
        {inCart && hasVariants && !isSplitMode && (
          <div className="mb-2 space-y-1">
            {state.selectedItems
              .filter(item => item.product.id === product.id)
              .map((item, i) => {
                const varLabel = item.selectedVariant
                  ? product.variants?.options.find(o => o.id === item.selectedVariant)?.label
                  : null;
                return (
                  <div key={i} className="flex items-center justify-between text-xs bg-[#E88A00]/10 rounded-lg px-2 py-1.5">
                    <span className="font-semibold text-pepe-dark">
                      {item.quantity > 1 ? `${item.quantity}× ` : ''}{varLabel || product.title}
                    </span>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: getCartKey(item) })}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        )}

        {/* In-cart stepper for non-variant products */}
        {inCart && !hasVariants && (
          <div className="mb-2 space-y-2">
            <div className="flex items-center bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => handleUpdateQuantity(itemQty - 1)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors"
                aria-label="Decrease quantity"
              >
                {itemQty === 1 ? (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : <span className="font-bold text-lg">{'\u2212'}</span>}
              </button>
              <span className="flex-1 font-oswald font-bold text-center text-lg">{itemQty}</span>
              <button
                onClick={() => handleUpdateQuantity(Math.min(itemQty + 1, 4))}
                disabled={itemQty >= 4}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors font-bold text-lg disabled:opacity-30"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <button
              onClick={handleRemove}
              className="w-full py-2 rounded-lg font-oswald font-bold text-sm tracking-wide bg-[#1A1A1A] text-white hover:bg-red-600 transition-colors"
            >REMOVE</button>
          </div>
        )}

        {/* Add to Order button - always visible for variant products, or when not in cart */}
        <div className="mt-auto">
          {(!inCart || (hasVariants && !isSplitMode)) && (
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-oswald font-bold text-sm tracking-wide transition-all ${
                !canAdd
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#E88A00] text-white shadow-[0_4px_0_0_#b86e00] hover:shadow-[0_2px_0_0_#b86e00] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]'
              }`}
            >
              {hasVariants && !canAdd
                ? `SELECT ${product.variants!.label.toUpperCase()}`
                : inCart && hasVariants
                  ? `ADD ANOTHER ${product.variants!.label.toUpperCase()}`
                  : 'ADD TO ORDER'
              }
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
