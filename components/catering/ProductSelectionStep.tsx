'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCatering } from '@/context/CateringContext';
import { getEventTypeName } from '@/lib/event-types';
import { formatCurrency } from '@/lib/pricing';
import { getProductsByEventType } from '@/lib/products';
import { getBudgetStatus } from '@/lib/budgets';
import CateringProductCard from './CateringProductCard';
import CateringCart from './CateringCart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { sortByClassification, getCardSize, shouldShowBadge, getBadgeText, getEffectiveDescription } from '@/lib/menu-engineering';

interface ProductSelectionStepProps {
  activeFilters?: string[];
  onToggleFilter?: (tag: string) => void;
  filterBar?: React.ReactNode;
  recommendedSection?: React.ReactNode;
}

export default function ProductSelectionStep({
  activeFilters = [],
  onToggleFilter,
  filterBar,
  recommendedSection,
}: ProductSelectionStepProps) {
  const router = useRouter();
  const { state, dispatch, perPersonCost, totalCost } = useCatering();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Calculate delivery and total for mobile cart button
  const getDeliveryFee = (headcount: number): number => {
    if (headcount <= 25) return 75;
    if (headcount <= 50) return 125;
    return 200;
  };
  const deliveryFee = getDeliveryFee(state.headcount);
  const orderTotal = totalCost + (state.selectedItems.length > 0 ? deliveryFee : 0);

  // Budget status
  const budgetStatus = getBudgetStatus(perPersonCost, state.budgetRange, state.customBudget);
  const budgetColor = budgetStatus === 'on-track' ? 'text-pepe-green' : budgetStatus === 'under' ? 'text-pepe-orange' : 'text-error-red';
  const budgetBg = budgetStatus === 'on-track' ? 'bg-pepe-green/5 border-pepe-green/20' : budgetStatus === 'under' ? 'bg-pepe-orange/5 border-pepe-orange/20' : 'bg-pepe-red/5 border-pepe-red/20';

  // Close cart when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when cart is open on mobile
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Get products filtered by event type from local data
  const products = getProductsByEventType(state.eventType);

  // Filter products based on search term and dietary filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags?.some(tag => tag.toLowerCase().includes(term));
      if (!matchesSearch) return false;
    }
    // Dietary filters (must match ALL active filters)
    if (activeFilters.length > 0) {
      const matchesFilters = activeFilters.every(f => product.tags?.includes(f));
      if (!matchesFilters) return false;
    }
    return true;
  });

  // Sort by menu engineering classification
  const sortedProducts = sortByClassification(filteredProducts);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <div ref={sectionRef} className="bg-pepe-cream py-12 sm:py-16 scroll-mt-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {state.eventType && (
              <Badge variant={state.eventType as 'appetizers' | 'entrees' | 'sides'}>
                {getEventTypeName(state.eventType)}
              </Badge>
            )}
          </div>
          <h2 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-pepe-dark tracking-wider mb-4">
            BUILD YOUR {state.eventType?.toUpperCase() || 'EVENT'}
          </h2>
          <p className="font-crimson text-pepe-charcoal/70 text-base sm:text-lg max-w-2xl mx-auto mb-6 italic">
            Select items for your {state.eventType || ''} - sizes auto-adjust to your {state.headcount} guest count
          </p>
        </div>

        {/* Per-Person Cost Bar */}
        {state.selectedItems.length > 0 && (
          <div className={`sticky top-0 z-30 mb-6 p-4 rounded-xl border-2 ${budgetBg} flex flex-wrap items-center justify-between gap-4`}>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-muted uppercase tracking-wide block">Per Person</span>
                <span className="font-oswald text-2xl sm:text-3xl font-bold text-pepe-dark">
                  {formatCurrency(orderTotal / state.headcount)}
                </span>
              </div>
              <div className="h-10 w-px bg-pepe-sand hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-xs text-muted uppercase tracking-wide block">
                  {state.headcount} guests
                </span>
                <span className="font-oswald text-xl font-bold text-pepe-red">
                  {formatCurrency(orderTotal)} total
                </span>
              </div>
            </div>
            {state.budgetRange && (
              <div className={`text-sm font-semibold ${budgetColor}`}>
                {budgetStatus === 'on-track' && 'Within budget range'}
                {budgetStatus === 'under' && 'Below budget range'}
                {budgetStatus === 'over' && 'Over budget range'}
                <span className="text-xs text-muted ml-1">({state.budgetRange.label})</span>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="max-w-md mx-auto mb-4">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-pepe-sand rounded-xl bg-pepe-warm-white focus:border-pepe-orange focus:outline-none focus:ring-2 focus:ring-pepe-orange/30"
          />
        </div>

        {/* Dietary Filter Bar (injected from parent) */}
        {filterBar && <div className="mb-6">{filterBar}</div>}

        {/* Recommended Items (injected from parent) */}
        {recommendedSection && <div className="mb-8">{recommendedSection}</div>}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            {sortedProducts.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-muted">
                  {searchTerm || activeFilters.length > 0
                    ? 'No products match your filters.'
                    : 'No products available for this event type.'}
                </p>
                {(searchTerm || activeFilters.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      if (onToggleFilter) activeFilters.forEach(f => onToggleFilter(f));
                    }}
                    className="mt-3 text-pepe-red hover:underline text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.map((product, index) => {
                  const cardSize = getCardSize(product);
                  const showBadge_ = shouldShowBadge(product);
                  const badgeText_ = getBadgeText(product);
                  const description = getEffectiveDescription(product);
                  return (
                    <div
                      key={product.id}
                      className={`animate-scale-in ${cardSize === 'hero' ? 'col-span-2' : ''}`}
                      style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
                    >
                      <CateringProductCard
                        product={product}
                        size={cardSize}
                        showBadge={showBadge_}
                        badgeText={badgeText_}
                        descriptionOverride={description !== product.description ? description : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl">
              <CateringCart onCheckout={handleCheckout} />
            </div>
          </div>
        </div>

        {/* Mobile Cart Button - Fixed at bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-pepe-dark text-white rounded-2xl py-4 px-6 flex items-center justify-between shadow-warm-lg hover:bg-pepe-charcoal transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {state.selectedItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pepe-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {state.selectedItems.length}
                  </span>
                )}
              </div>
              <span className="font-oswald font-semibold">
                {state.selectedItems.length === 0 ? 'View Cart' : `${state.selectedItems.length} item${state.selectedItems.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            {state.selectedItems.length > 0 && (
              <span className="font-oswald font-bold text-pepe-red">
                {formatCurrency(orderTotal)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Cart Drawer */}
        {isCartOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsCartOpen(false)}
            />
            {/* Drawer */}
            <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-md bg-pepe-cream z-50 shadow-2xl animate-slide-in-right overflow-y-auto">
              {/* Drawer Header */}
              <div className="sticky top-0 bg-pepe-dark text-white px-4 py-4 flex items-center justify-between z-10">
                <h2 className="font-oswald text-xl font-bold tracking-wide">Your Order</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Cart Content */}
              <div className="p-4 pb-24">
                <CateringCart onCheckout={() => { setIsCartOpen(false); handleCheckout(); }} />
              </div>
            </div>
          </>
        )}

        {/* Back button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleBack}
            className="font-oswald text-muted hover:text-pepe-dark transition-colors tracking-wide"
          >
            ← BACK TO ORDER TYPE
          </button>
        </div>
      </div>
    </div>
  );
}
