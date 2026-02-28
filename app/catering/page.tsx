'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import HeadcountBudgetStep from '@/components/catering/HeadcountBudgetStep';
import OrderTypeStep from '@/components/catering/OrderTypeStep';
import ProductSelectionStep from '@/components/catering/ProductSelectionStep';
import PackageSelectionStep from '@/components/catering/PackageSelectionStep';
import TrustSignals from '@/components/marketing/TrustSignals';
import ClientLogos from '@/components/marketing/ClientLogos';
import DietaryFilterBar from '@/components/catering/DietaryFilterBar';
import RecommendedItems from '@/components/catering/RecommendedItems';
import { siteConfig } from '@/lib/site-config';

export default function HomePage() {
  const { state, dispatch } = useCatering();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Auto-set event type to entrees so we skip the selection step
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

  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* Decorative Banner - Top */}
      <div className="w-full h-[60px] sm:h-[70px] relative overflow-hidden">
        <Image
          src={siteConfig.branding.bannerImagePath}
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
            src={siteConfig.branding.heroImagePath}
            alt={`Authentic ${siteConfig.restaurant.cuisineType} food by ${siteConfig.restaurant.name}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pepe-dark via-pepe-dark/40 to-transparent" />
        </div>

        <div className="bg-gradient-to-b from-pepe-maroon to-[#6B2A10] py-8 sm:py-10 text-center">
          <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-pepe-red tracking-wider mb-1 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {siteConfig.content.heroTitle}
          </h1>
          <p className="font-oswald text-2xl sm:text-3xl md:text-4xl text-pepe-red tracking-wider drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {siteConfig.content.heroSubtitle}
          </p>
          <p className="font-crimson text-base sm:text-lg md:text-xl text-pepe-sand tracking-wider mt-2 italic">
            {siteConfig.content.heroSubline}
          </p>
        </div>

        {/* Orange-white stripe divider */}
        <div className="flex">
          <div className="flex-1 h-2 bg-pepe-orange"></div>
          <div className="w-1 h-2 bg-white"></div>
          <div className="flex-1 h-2 bg-pepe-orange"></div>
        </div>
        <div className="bg-pepe-dark py-3 text-center">
          <p className="font-crimson text-lg sm:text-xl md:text-2xl text-pepe-orange tracking-[0.2em] italic">
            {siteConfig.content.serviceType}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <TrustSignals />

      {/* Client Logos */}
      <ClientLogos />

      {/* Headcount & Budget */}
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
      <section className="bg-gradient-to-b from-pepe-maroon to-[#6B2A10] py-12 sm:py-16 relative texture-tile">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-3 tracking-wide">
            LOOKING FOR SOMETHING ELSE?
          </h3>
          <p className="font-crimson text-white/80 mb-6 max-w-xl mx-auto italic">
            Browse our complete catering menu featuring appetizers, main dishes, sides, toppings, and desserts.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-warm-white hover:text-pepe-dark transition-all group shadow-warm"
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
          src={siteConfig.branding.bannerImagePath}
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
