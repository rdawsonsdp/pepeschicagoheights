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
}

export default function CateringProductCard({ product }: CateringProductCardProps) {
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

  // Calculate what the customer will get based on current headcount
  const orderCalc = calculateProductOrder(product, state.headcount);
  const displayTotal = orderCalc.totalPrice * (itemQty || 1);

  const handleAdd = () => {
    if (!canAdd) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        selectedVariant: selectedVariant ?? undefined,
        variantSplit: isSplitMode ? { ...splitValues } : undefined,
      },
    });
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
    <Card className="flex flex-col h-full hover-lift group relative overflow-hidden">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-pepe-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Product Image */}
        <div className="aspect-square bg-pepe-sand/30 rounded-xl mb-3 sm:mb-4 overflow-hidden relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover img-zoom"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted bg-gradient-to-br from-pepe-burnt-orange/20 to-pepe-red/30">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* In Cart indicator */}
          {inCart && (
            <div className="absolute top-2 left-2">
              <Badge variant="success">
                In Cart{itemQty > 1 ? ` (${itemQty})` : ''}
              </Badge>
            </div>
          )}

          {/* Pricing type badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-xs">
              {getPricingTypeLabel(product)}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <h3 className="font-oswald font-semibold text-pepe-dark mb-1 text-sm sm:text-base line-clamp-2 tracking-wide">
          {product.title}
        </h3>

        {/* Dietary Badges */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags.includes('vegan') && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pepe-green/10 text-pepe-green font-semibold">Vegan</span>
            )}
            {product.tags.includes('vegetarian') && !product.tags.includes('vegan') && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pepe-teal/10 text-pepe-teal font-semibold">Vegetarian</span>
            )}
            {product.tags.includes('gluten-free') && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pepe-orange/10 text-pepe-burnt-orange font-semibold">GF</span>
            )}
            {product.tags.includes('dairy-free') && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pepe-teal/10 text-pepe-teal font-semibold">DF</span>
            )}
            {product.tags.includes('halal') && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pepe-terracotta/10 text-pepe-terracotta font-semibold">Halal</span>
            )}
          </div>
        )}

        <p className="text-xs sm:text-sm text-pepe-charcoal/70 mb-3 flex-grow line-clamp-2">
          {product.description}
        </p>

        {/* Variant Selector - Single Mode (chips) */}
        {hasVariants && !isSplitMode && !inCart && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
              {product.variants!.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.variants!.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedVariant(
                    selectedVariant === option.id ? null : option.id
                  )}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                    selectedVariant === option.id
                      ? 'bg-pepe-dark text-white border-pepe-dark'
                      : 'bg-pepe-warm-white text-pepe-charcoal border-pepe-sand hover:border-pepe-red hover:text-pepe-red'
                  }`}
                >
                  {option.label}
                </button>
              ))}
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

        {/* Calculated Total Price */}
        <div className="mb-3">
          <div className="text-lg sm:text-xl font-oswald font-bold text-pepe-dark">
            {formatCurrency(displayTotal)}
          </div>
          <div className="text-xs text-pepe-green mt-1">
            {itemQty > 1 ? `${itemQty} \u00d7 ` : ''}{orderCalc.displayText}
          </div>
        </div>

        {/* Add/Remove Button or Quantity Stepper */}
        <div className="mt-auto">
          {inCart ? (
            <div className="space-y-2">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between bg-pepe-warm-white rounded-xl border border-pepe-sand">
                <button
                  onClick={() => handleUpdateQuantity(itemQty - 1)}
                  className="w-10 h-10 flex items-center justify-center text-pepe-dark hover:bg-pepe-sand/50 rounded-l-xl transition-colors font-bold text-lg"
                  aria-label="Decrease quantity"
                >
                  {itemQty === 1 ? (
                    <svg className="w-4 h-4 text-error-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : '\u2212'}
                </button>
                <span className="font-oswald font-bold text-pepe-dark text-lg min-w-[2rem] text-center">
                  {itemQty}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(Math.min(itemQty + 1, 4))}
                  disabled={itemQty >= 4}
                  className="w-10 h-10 flex items-center justify-center text-pepe-dark hover:bg-pepe-sand/50 rounded-r-xl transition-colors font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              className="w-full"
              disabled={!canAdd}
            >
              {hasVariants && !canAdd
                ? isSplitMode
                  ? `Select ${product.variants!.label}s (${splitRemaining} left)`
                  : `Select ${product.variants!.label}`
                : 'Add to Order'
              }
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
