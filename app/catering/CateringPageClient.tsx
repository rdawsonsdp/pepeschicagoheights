'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import HeadcountBudgetStep from '@/components/catering/HeadcountBudgetStep';
import ProductSelectionStep from '@/components/catering/ProductSelectionStep';
import RecommendedItems from '@/components/catering/RecommendedItems';
import { CateringProduct } from '@/lib/types';
import { siteConfig } from '@/lib/site-config';

type CateringMode = 'choose' | 'plan' | 'menu';

export default function CateringPageClient({ products }: { products: CateringProduct[] }) {
  const { state, dispatch } = useCatering();
  const [mode, setMode] = useState<CateringMode>('choose');

  // Auto-set event type so we skip that step
  useEffect(() => {
    if (!state.eventType) {
      dispatch({ type: 'SET_EVENT_TYPE', payload: 'entrees' });
    }
  }, [state.eventType, dispatch]);

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
    <div className="min-h-screen bg-[#ff900d]">
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
          <p className="menu-text text-white/80 italic mb-2">
            From intimate gatherings to large parties, we&apos;ll handle the food while you enjoy the moment.
          </p>
          <p className="font-oswald text-pepe-gold tracking-wider">
            {siteConfig.contact.phone}
          </p>
        </div>
      </section>

      {/* Order Steps Graphic */}
      <section className="bg-[#8f260c] pb-10 sm:pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-[#7a2009] to-[#a0350f] border-2 border-pepe-gold/60 rounded-2xl px-4 py-8 sm:px-10 sm:py-10 shadow-2xl">
            <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-gold tracking-[0.2em] text-center mb-8 sm:mb-10">
              HOW IT WORKS
            </h2>

            <svg
              viewBox="0 0 900 240"
              role="img"
              aria-label="Order steps: 1. Order. 2. We confirm. 3. We call for payment."
              className="w-full h-auto max-w-4xl mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f5cf5b" />
                  <stop offset="100%" stopColor="#d9a528" />
                </linearGradient>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Connector line */}
              <line
                x1="150"
                y1="100"
                x2="750"
                y2="100"
                stroke="url(#goldGrad)"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />

              {/* Step 1 — Order (clipboard icon) */}
              <g transform="translate(150 100)" filter="url(#softShadow)">
                <circle r="60" fill="url(#goldGrad)" stroke="#fff" strokeWidth="3" />
                <g transform="translate(-22 -26)" stroke="#7a2009" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="36" height="44" rx="4" fill="#fff8e1" />
                  <rect x="14" y="0" width="16" height="10" rx="2" fill="#7a2009" />
                  <line x1="12" y1="22" x2="32" y2="22" />
                  <line x1="12" y1="30" x2="32" y2="30" />
                  <line x1="12" y1="38" x2="26" y2="38" />
                </g>
              </g>
              <text x="150" y="195" textAnchor="middle" fill="#f5cf5b" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="20" letterSpacing="2">
                STEP 1
              </text>
              <text x="150" y="222" textAnchor="middle" fill="#fff" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="26">
                Order
              </text>

              {/* Step 2 — We confirm (checkmark) */}
              <g transform="translate(450 100)" filter="url(#softShadow)">
                <circle r="60" fill="url(#goldGrad)" stroke="#fff" strokeWidth="3" />
                <path
                  d="M -22 0 L -6 18 L 24 -16"
                  stroke="#7a2009"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
              <text x="450" y="195" textAnchor="middle" fill="#f5cf5b" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="20" letterSpacing="2">
                STEP 2
              </text>
              <text x="450" y="222" textAnchor="middle" fill="#fff" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="26">
                We Confirm
              </text>

              {/* Step 3 — We call for payment (phone icon) */}
              <g transform="translate(750 100)" filter="url(#softShadow)">
                <circle r="60" fill="url(#goldGrad)" stroke="#fff" strokeWidth="3" />
                <path
                  d="M -22 -18
                     a 6 6 0 0 1 6 -6 h 8 a 4 4 0 0 1 4 3 l 2 9 a 4 4 0 0 1 -1.2 4 l -5 4
                     a 28 28 0 0 0 14 14 l 4 -5 a 4 4 0 0 1 4 -1.2 l 9 2 a 4 4 0 0 1 3 4 v 8
                     a 6 6 0 0 1 -6 6 C -6 23 -22 7 -22 -18 z"
                  fill="#7a2009"
                />
              </g>
              <text x="750" y="195" textAnchor="middle" fill="#f5cf5b" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="20" letterSpacing="2">
                STEP 3
              </text>
              <text x="750" y="222" textAnchor="middle" fill="#fff" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="26">
                We Call for Payment
              </text>

              {/* Step number badges */}
              <g fontFamily="Oswald, sans-serif" fontWeight="900" fontSize="22" fill="#7a2009">
                <circle cx="195" cy="55" r="18" fill="#fff" stroke="#7a2009" strokeWidth="2.5" />
                <text x="195" y="63" textAnchor="middle">1</text>
                <circle cx="495" cy="55" r="18" fill="#fff" stroke="#7a2009" strokeWidth="2.5" />
                <text x="495" y="63" textAnchor="middle">2</text>
                <circle cx="795" cy="55" r="18" fill="#fff" stroke="#7a2009" strokeWidth="2.5" />
                <text x="795" y="63" textAnchor="middle">3</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Bevel */}
      <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />

      {/* Mode Selection */}
      {mode === 'choose' && (
        <section className="bg-[#8f260c] py-12 sm:py-16">
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
                <p className="menu-text text-white/70">
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
                <p className="menu-text text-white/70">
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
          <div className="bg-[#8f260c] pt-4 px-4">
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
            <ProductSelectionStep allProducts={products}
              recommendedSection={
                <RecommendedItems allProducts={products} />
              }
            />
          )}
        </>
      )}

      {/* "Order from Menu" Flow: Straight to products */}
      {mode === 'menu' && (
        <>
          {/* Back button */}
          <div className="bg-[#8f260c] pt-4 px-4">
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

          <ProductSelectionStep allProducts={products}
            recommendedSection={
              <RecommendedItems allProducts={products} />
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
          <p className="menu-text text-white/80 mb-6 max-w-xl mx-auto italic">
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
