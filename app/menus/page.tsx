'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATERING_PRODUCTS } from '@/lib/products';
import { CateringProduct } from '@/lib/types';
import { getDisplayPrice, getPricingTypeLabel } from '@/lib/pricing';

// Menu sections organized by the catering menu structure
const MENU_SECTIONS = [
  {
    id: 'appetizers',
    title: 'APPETIZERS',
    subtitle: 'Start Your Fiesta Right',
    image: '/images/appetizers.jpg',
    subsections: [
      { id: 'apps', title: 'Appetizers', description: 'Crowd-favorite starters' },
      { id: 'salads', title: 'Salads', description: 'Fresh and flavorful' },
      { id: 'chips', title: 'Chips', description: 'Perfect for dipping' },
    ],
  },
  {
    id: 'entrees',
    title: 'MAIN DISHES',
    subtitle: 'Authentic Mexican Favorites',
    image: '/images/entrees.jpg',
    subsections: [
      { id: 'taco-filling', title: 'Taco Filling', description: 'Build your own taco bar' },
      { id: 'fajitas', title: 'Fajitas', description: 'Sizzling and served hot' },
      { id: 'carnitas', title: 'Carnitas', description: 'Slow-cooked perfection' },
      { id: 'a-la-cart', title: 'A La Cart', description: 'Tamales, enchiladas, and taco trays' },
    ],
  },
  {
    id: 'sides',
    title: 'SIDES & MORE',
    subtitle: 'Complete Your Spread',
    image: '/images/sides.jpg',
    subsections: [
      { id: 'sides-main', title: 'Sides', description: 'Rice, beans, and more' },
      { id: 'toppings', title: 'Toppings & Extras', description: 'All the fixings' },
      { id: 'desserts', title: 'Desserts', description: 'Sweet endings' },
    ],
  },
];

// Map products to menu subsections
function getProductsForSubsection(subsectionId: string): CateringProduct[] {
  const mappings: Record<string, (p: CateringProduct) => boolean> = {
    'apps': (p) => p.categories.includes('appetizers') && (p.tags?.includes('appetizer') ?? false),
    'salads': (p) => p.categories.includes('appetizers') && (p.tags?.includes('salad') ?? false),
    'chips': (p) => p.categories.includes('appetizers') && (p.tags?.includes('chips') ?? false),
    'taco-filling': (p) => p.categories.includes('entrees') && (p.tags?.includes('taco-filling') ?? false),
    'fajitas': (p) => p.categories.includes('entrees') && (p.tags?.includes('fajita') ?? false),
    'carnitas': (p) => p.categories.includes('entrees') && (p.tags?.includes('carnitas') ?? false),
    'a-la-cart': (p) => p.categories.includes('entrees') && (
      (p.tags?.includes('tamale') ?? false) ||
      (p.tags?.includes('enchilada') ?? false) ||
      (p.tags?.includes('taco-tray') ?? false)
    ),
    'sides-main': (p) => p.categories.includes('sides') && (p.tags?.includes('side') ?? false),
    'toppings': (p) => p.categories.includes('sides') && (p.tags?.includes('topping') ?? false),
    'desserts': (p) => p.categories.includes('sides') && (p.tags?.includes('dessert') ?? false),
  };

  const filter = mappings[subsectionId];
  if (!filter) return [];
  return CATERING_PRODUCTS.filter(filter);
}

function MenuItemCard({ product }: { product: CateringProduct }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-32 sm:h-40">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-oswald text-[#1C1C1C] text-sm sm:text-base mb-1 line-clamp-1">
          {product.title}
        </h4>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 font-merriweather">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-oswald text-[#C8102E]">
            {getDisplayPrice(product)}
          </span>
          <span className="text-[10px] text-gray-400 uppercase">
            {getPricingTypeLabel(product)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MenusPage() {
  const [activeSection, setActiveSection] = useState<string | null>('appetizers');

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = MENU_SECTIONS.map(s => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4782F]">
      {/* Hero Header */}
      <div className="bg-[#1C1C1C] py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E] to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#E8A317] tracking-wider mb-4">
              CATERING MENU
            </h1>
            <p className="text-[#C8102E] text-lg sm:text-xl max-w-2xl mx-auto font-merriweather">
              Have a Fiesta! Browse our full service catering menu featuring authentic Mexican favorites.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {MENU_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-full font-oswald font-semibold text-sm whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-[#1C1C1C] text-white'
                    : 'bg-[#D4782F] text-[#1C1C1C] hover:bg-[#C8102E]/10'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {MENU_SECTIONS.map((section, sectionIndex) => (
          <section
            key={section.id}
            id={section.id}
            className={`mb-16 sm:mb-20 scroll-mt-20 ${sectionIndex > 0 ? 'pt-8' : ''}`}
          >
            {/* Section Header */}
            <div className="relative mb-8 sm:mb-12 rounded-2xl overflow-hidden">
              <div className="relative h-48 sm:h-64">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/90 via-[#1C1C1C]/70 to-transparent" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
                <h2 className="font-oswald text-3xl sm:text-4xl md:text-5xl text-[#E8A317] tracking-wider mb-2">
                  {section.title}
                </h2>
                <p className="text-[#C8102E] text-base sm:text-lg">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Subsections */}
            <div className="space-y-12">
              {section.subsections.map((subsection) => {
                const products = getProductsForSubsection(subsection.id);
                if (products.length === 0) return null;

                return (
                  <div key={subsection.id}>
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <h3 className="font-crimson text-xl sm:text-2xl font-bold text-[#006847]">
                          {subsection.title}
                        </h3>
                        <p className="text-sm text-gray-500">{subsection.description}</p>
                      </div>
                      <div className="flex-1 h-px bg-[#006847]/30" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {products.map((product) => (
                        <MenuItemCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-[#1C1C1C] py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl md:text-4xl text-[#E8A317] mb-4 tracking-wide">
            READY TO ORDER?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Build your custom catering order with our easy-to-use ordering system. Prices auto-adjust based on your guest count.
          </p>
          <Link
            href="/#catering"
            className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-oswald px-8 py-3 rounded-lg hover:bg-[#E8A317] hover:text-[#1C1C1C] transition-all"
          >
            <span>Start Your Order</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Pricing Note */}
      <div className="bg-[#D4782F] py-8 border-t border-[#006847]/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h4 className="font-oswald text-lg text-[#1C1C1C] mb-2">IMPORTANT INFORMATION</h4>
            <p className="text-sm text-gray-600 font-merriweather">
              Delivery is available for an additional fee. Pre-payment is required for most orders.
              We require at least 2 day notice on most orders.
              All prices are subject to sales tax and may change without notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
