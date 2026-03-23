'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import HeadcountBudgetStep from '@/components/catering/HeadcountBudgetStep';
import ProductSelectionStep from '@/components/catering/ProductSelectionStep';
import DietaryFilterBar from '@/components/catering/DietaryFilterBar';
import RecommendedItems from '@/components/catering/RecommendedItems';
import { siteConfig } from '@/lib/site-config';

type CateringMode = 'choose' | 'plan' | 'menu';

export default function CateringPage() {
  const { state, dispatch } = useCatering();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [mode, setMode] = useState<CateringMode>('choose');

  // Auto-set event type so we skip that step
  useEffect(() => {
    if (!state.eventType) {
      dispatch({ type: 'SET_EVENT_TYPE', payload: 'entrees' });
    }
  }, [state.eventType, dispatch]);

  const handleToggleFilter = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag)
        ? prev.filter(f => f !== tag)
        : [...prev, tag]
    );
  };

  const handleLetUsPlan = () => {
    setMode('plan');
    // Reset to headcount step
    dispatch({ type: 'SET_STEP', payload: 2 as 1 | 2 | 3 | 4 });
    dispatch({ type: 'SET_ORDER_TYPE', payload: 'build-your-own' });
  };

  const handleOrderFromMenu = () => {
    setMode('menu');
    // Skip to product selection
    dispatch({ type: 'SET_ORDER_TYPE', payload: 'build-your-own' });
    dispatch({ type: 'SET_STEP', payload: 4 as 1 | 2 | 3 | 4 });
  };

  const handleBackToChoose = () => {
    setMode('choose');
    dispatch({ type: 'SET_STEP', payload: 2 as 1 | 2 | 3 | 4 });
  };

  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* Pattern Banner */}
      <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
        <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
      </div>

      {/* Hero */}
      <section className="bg-[#8f260c] py-12 sm:py-16 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl text-[deepskyblue] tracking-tight leading-tight font-black mb-4">
            Let Us Help You Plan Your Next Event
          </h1>
          <p className="font-crimson text-lg sm:text-xl text-white/80 italic mb-2">
            From intimate gatherings to large parties, we&apos;ll handle the food while you enjoy the moment.
          </p>
          <p className="font-oswald text-pepe-gold tracking-wider">
            {siteConfig.contact.phone}
          </p>
        </div>
      </section>

      {/* Bevel */}
      <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />

      {/* Mode Selection */}
      {mode === 'choose' && (
        <section className="bg-pepe-burnt-orange py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-oswald text-2xl sm:text-3xl text-white tracking-wider text-center mb-8">
              HOW WOULD YOU LIKE TO ORDER?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Option 1: Let Us Plan */}
              <button
                onClick={handleLetUsPlan}
                className="bg-white/10 border-2 border-pepe-gold/50 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-pepe-gold hover:scale-[1.02] transition-all group"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-oswald text-2xl text-white tracking-wider mb-3">
                  LET US PLAN
                </h3>
                <p className="font-crimson text-white/70 leading-relaxed">
                  Tell us how many guests and your budget &mdash; we&apos;ll help you build the perfect spread.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 py-2.5 rounded-full group-hover:bg-white transition-colors">
                  Get Started
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

              {/* Option 2: Order from Menu */}
              <button
                onClick={handleOrderFromMenu}
                className="bg-white/10 border-2 border-pepe-gold/50 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-pepe-gold hover:scale-[1.02] transition-all group"
              >
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-oswald text-2xl text-white tracking-wider mb-3">
                  ORDER FROM MENU
                </h3>
                <p className="font-crimson text-white/70 leading-relaxed">
                  Already know what you want? Browse our catering menu and build your own order.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 py-2.5 rounded-full group-hover:bg-white transition-colors">
                  Browse Menu
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* "Let Us Plan" Flow: Headcount → Products */}
      {mode === 'plan' && (
        <>
          {/* Back button */}
          <div className="bg-pepe-burnt-orange pt-4 px-4">
            <div className="container mx-auto max-w-4xl">
              <button
                onClick={handleBackToChoose}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-oswald tracking-wide transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          </div>

          {/* Headcount & Budget */}
          <HeadcountBudgetStep />

          {/* Product Selection */}
          {state.currentStep >= 4 && (
            <ProductSelectionStep
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              filterBar={
                <DietaryFilterBar
                  activeTags={activeFilters}
                  onToggleTag={handleToggleFilter}
                />
              }
              recommendedSection={
                <RecommendedItems />
              }
            />
          )}
        </>
      )}

      {/* "Order from Menu" Flow: Straight to products */}
      {mode === 'menu' && (
        <>
          {/* Back button */}
          <div className="bg-pepe-burnt-orange pt-4 px-4">
            <div className="container mx-auto max-w-4xl">
              <button
                onClick={handleBackToChoose}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-oswald tracking-wide transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          </div>

          <ProductSelectionStep
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            filterBar={
              <DietaryFilterBar
                activeTags={activeFilters}
                onToggleTag={handleToggleFilter}
              />
            }
            recommendedSection={
              <RecommendedItems />
            }
          />
        </>
      )}

      {/* Browse Full Menu Link */}
      <section className="bg-gradient-to-b from-pepe-maroon to-[#6B2A10] py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-white mb-3 tracking-wide">
            NEED HELP WITH YOUR ORDER?
          </h3>
          <p className="font-crimson text-white/80 mb-6 max-w-xl mx-auto italic">
            Give us a call and we&apos;ll help you plan the perfect menu for your event.
          </p>
          <a
            href={`tel:${siteConfig.contact.phoneRaw}`}
            className="inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-8 py-3 rounded-full hover:bg-white transition-all shadow-lg text-lg tracking-wide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call {siteConfig.contact.phone}
          </a>
        </div>
      </section>

      {/* Pattern Banner - Bottom */}
      <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
        <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}
