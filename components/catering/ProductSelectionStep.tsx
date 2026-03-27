'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCatering } from '@/context/CateringContext';
import { getEventTypeName } from '@/lib/event-types';
import { formatCurrency } from '@/lib/pricing';
import { getProductsByEventType } from '@/lib/products';
import { getBudgetStatus } from '@/lib/budgets';
import CateringProductCard from './CateringProductCard';
import CateringCart from './CateringCart';
import Card from '@/components/ui/Card';

// Section definitions with hero images
const MENU_SECTIONS = [
  { id: 'appetizers', label: 'Appetizers', tag: 'appetizer', image: '/images/menu/carousel-lunch-1.jpg' },
  { id: 'entrees', label: 'Entrees', tag: 'entrees', image: '/images/menu/carousel-dinner-1.jpg' },
  { id: 'sides', label: 'Sides', tag: 'sides', image: '/images/menu/carousel-lunch-2.jpg' },
  { id: 'desserts', label: 'Desserts', tag: 'dessert', image: '/images/menu/carousel-drinks-3.jpg' },
];

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
  const [activeSection, setActiveSection] = useState(MENU_SECTIONS[0].id);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  // Scroll spy to highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    for (const section of MENU_SECTIONS) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Get ALL products (not filtered by event type) so all sections show
  const products = getProductsByEventType(null);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    if (activeFilters.length > 0) {
      result = result.filter(p => activeFilters.every(f => p.tags?.includes(f)));
    }
    return result;
  }, [products, searchTerm, activeFilters]);

  // Group products by section
  const productsBySection = useMemo(() => {
    const grouped: Record<string, typeof filteredProducts> = {};
    for (const section of MENU_SECTIONS) {
      const tags = section.tag.split('|');
      grouped[section.id] = filteredProducts.filter(p =>
        p.categories.includes(section.id as any) ||
        p.tags?.some(t => tags.includes(t))
      );
    }
    // Collect any uncategorized
    const categorized = new Set(Object.values(grouped).flat().map(p => p.id));
    const uncategorized = filteredProducts.filter(p => !categorized.has(p.id));
    if (uncategorized.length > 0) {
      // Add to first section that has items, or entrees
      const target = grouped['entrees'] || grouped[MENU_SECTIONS[0].id];
      target.push(...uncategorized);
    }
    return grouped;
  }, [filteredProducts]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <div ref={sectionRef} className="bg-[#ff900d] min-h-screen scroll-mt-4">
      {/* Sticky Section Nav */}
      <div className="sticky top-[72px] sm:top-[80px] z-20 bg-[#ff900d] border-b border-[#e07e0b] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {MENU_SECTIONS.map(section => {
              const count = productsBySection[section.id]?.length || 0;
              if (count === 0 && searchTerm) return null;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 rounded-full text-sm font-oswald font-bold tracking-wide whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? 'bg-[#8f260c] text-white shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {section.label}
                  {count > 0 && (
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-white/30 rounded-xl bg-white/90 text-sm focus:border-[#8f260c] focus:outline-none focus:ring-2 focus:ring-[#8f260c]/30 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Menu Content */}
          <div className="lg:col-span-2 space-y-8">
            {MENU_SECTIONS.map(section => {
              const sectionProducts = productsBySection[section.id] || [];
              if (sectionProducts.length === 0 && searchTerm) return null;

              return (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className="scroll-mt-[160px]"
                >
                  {/* Section Header with Hero Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Hero Image */}
                    {section.image && (
                      <div className="relative aspect-[3/2] md:aspect-[3/4] rounded-xl overflow-hidden">
                        <Image
                          src={section.image}
                          alt={section.label}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
                            {section.label}
                          </h2>
                          <div className="w-12 h-1 bg-[#E88A00] mt-2 rounded-full" />
                        </div>
                      </div>
                    )}

                    {/* First product card alongside hero */}
                    {sectionProducts.length > 0 && (
                      <div className="space-y-3">
                        {sectionProducts.slice(0, 2).map(product => (
                          <CateringProductCard key={product.id} product={product} size="compact" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Remaining products in grid */}
                  {sectionProducts.length > 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {sectionProducts.slice(2).map(product => (
                        <CateringProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}

                  {sectionProducts.length === 0 && (
                    <div className="text-center py-8 bg-white/10 rounded-xl">
                      <p className="text-white/70 text-sm">No items in this section yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cart Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-[160px] max-h-[calc(100vh-10rem)] overflow-y-auto rounded-xl">
              <CateringCart onCheckout={handleCheckout} />
            </div>
          </div>
        </div>

        {/* Mobile Cart Button - Fixed at bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-[#ff900d] via-[#ff900d] to-transparent">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#8f260c] text-white rounded-xl py-4 px-6 flex items-center justify-between shadow-lg hover:bg-[#7a2009] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {state.selectedItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E88A00] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {state.selectedItems.length}
                  </span>
                )}
              </div>
              <span className="font-oswald font-semibold">
                {state.selectedItems.length === 0 ? 'View Cart' : `${state.selectedItems.length} item${state.selectedItems.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            {state.selectedItems.length > 0 && (
              <span className="font-oswald font-bold text-[#E88A00]">
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
              <div className="sticky top-0 bg-[#8f260c] text-white px-4 py-4 flex items-center justify-between z-10">
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
      </div>
    </div>
  );
}
