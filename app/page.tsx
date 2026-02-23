'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import { EVENT_TYPES } from '@/lib/event-types';
import StepIndicator from '@/components/catering/StepIndicator';
import HeadcountBudgetStep from '@/components/catering/HeadcountBudgetStep';
import OrderTypeStep from '@/components/catering/OrderTypeStep';
import ProductSelectionStep from '@/components/catering/ProductSelectionStep';
import PackageSelectionStep from '@/components/catering/PackageSelectionStep';
import ValueProposition from '@/components/marketing/ValueProposition';
import TrustSignals from '@/components/marketing/TrustSignals';
import ClientLogos from '@/components/marketing/ClientLogos';
import DietaryFilterBar from '@/components/catering/DietaryFilterBar';
import RecommendedItems from '@/components/catering/RecommendedItems';

export default function HomePage() {
  const { state, dispatch } = useCatering();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSelectEventType = (eventTypeId: string) => {
    dispatch({
      type: 'SET_EVENT_TYPE',
      payload: eventTypeId as 'appetizers' | 'entrees' | 'sides',
    });
  };

  const eventImages: Record<string, string> = {
    appetizers: '/images/appetizers.jpg',
    entrees: '/images/entrees.jpg',
    sides: '/images/sides.jpg',
  };

  const handleToggleFilter = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag)
        ? prev.filter(f => f !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#D4782F]">
      {/* Decorative Banner - Top */}
      <div className="w-full h-[60px] sm:h-[70px] relative overflow-hidden">
        <Image
          src="/images/mexican-food-banner.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <Image
            src="/images/hero-tacos.jpg"
            alt="Authentic Mexican Tacos by Pepe's"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/40 to-transparent" />
        </div>

        <div className="bg-[#8B2500] py-8 sm:py-10 text-center">
          <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#00BFFF] tracking-wider mb-1 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            PEPE&apos;S MEXICAN RESTAURANT
          </h1>
          <p className="font-oswald text-2xl sm:text-3xl md:text-4xl text-[#00BFFF] tracking-wider drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            CHICAGO HEIGHTS
          </p>
          <p className="font-oswald text-base sm:text-lg md:text-xl text-[#E8A317] tracking-wider mt-2">
            Chicago Heights, IL &bull; Since 1967
          </p>
        </div>

        <div className="bg-[#1C1C1C] py-3 text-center">
          <p className="font-oswald text-lg sm:text-xl md:text-2xl text-[#E8A317] tracking-[0.3em]">
            TAKE OUT / CATERING
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <ValueProposition />

      {/* How It Works */}
      <TrustSignals />

      {/* Client Logos */}
      <ClientLogos />

      {/* Step Indicator */}
      <section id="catering" className="bg-[#D4782F] pt-12 sm:pt-16">
        <div className="container mx-auto px-4">
          <StepIndicator currentStep={state.currentStep} />
        </div>
      </section>

      {/* Step 1: Event Type Selection */}
      <section className="bg-[#D4782F] pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-oswald text-3xl sm:text-4xl md:text-5xl text-[#1C1C1C] tracking-wider mb-4">
              WHAT ARE YOU CRAVING?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Select a category to start building your catering order
            </p>
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {EVENT_TYPES.map((eventType, index) => {
                  const isSelected = state.eventType === eventType.id;
                  const isUnselected = state.eventType && state.eventType !== eventType.id;

                  return (
                    <div
                      key={eventType.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        onClick={() => handleSelectEventType(eventType.id)}
                        className={`
                          relative overflow-hidden rounded-xl cursor-pointer
                          transition-all duration-300 shadow-md
                          h-[180px] sm:h-[240px] md:h-[320px]
                          ${isSelected
                            ? 'ring-4 ring-[#C8102E] scale-[1.02]'
                            : 'hover:scale-105'
                          }
                          ${isUnselected ? 'opacity-70' : ''}
                        `}
                      >
                        <Image
                          src={eventImages[eventType.id] || '/images/appetizers.jpg'}
                          alt={eventType.name}
                          fill
                          className="object-cover"
                        />
                        <div className={`absolute inset-0 ${isSelected ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'}`} />
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                          <h3 className="font-oswald text-2xl sm:text-3xl text-white mb-2 tracking-wide drop-shadow-lg">
                            {eventType.name.toUpperCase()}
                          </h3>
                          <p className="text-white/90 text-sm sm:text-base drop-shadow">
                            {eventType.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

      {/* Step 2: Headcount & Budget */}
      {state.currentStep >= 2 && (
        <HeadcountBudgetStep />
      )}

      {/* Step 3: Order Type */}
      {state.currentStep >= 3 && (
        <OrderTypeStep />
      )}

      {/* Step 4: Product or Package Selection */}
      {state.currentStep >= 4 && (
        state.orderType === 'packages' ? (
          <PackageSelectionStep />
        ) : (
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
        )
      )}

      {/* Browse Full Menu Link */}
      <section className="bg-[#8B2500] py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-[#00BFFF] mb-3 tracking-wide">
            LOOKING FOR SOMETHING ELSE?
          </h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Browse our complete catering menu featuring appetizers, main dishes, sides, toppings, and desserts.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#00BFFF] text-[#1C1C1C] font-oswald font-bold px-8 py-3 rounded-lg hover:bg-[#E8A317] transition-all group"
          >
            <span>Browse Full Menu</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Decorative Banner - Bottom */}
      <div className="w-full h-[60px] sm:h-[70px] relative overflow-hidden">
        <Image
          src="/images/mexican-food-banner.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
