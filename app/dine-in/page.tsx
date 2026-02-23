'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DINE_IN_MENU, DINE_IN_PROMOS, FOOD_SECTIONS, DRINK_SECTIONS, DineInMenuSection } from '@/lib/dine-in-menu';

function MenuItemRow({ name, description, price }: { name: string; description?: string; price?: string }) {
  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <h4 className="font-oswald text-lg sm:text-xl font-bold text-[#1C1C1C] tracking-wide">
          {name}
        </h4>
        {price && (
          <span className="font-oswald text-lg sm:text-xl font-bold text-[#1C1C1C] whitespace-nowrap flex-shrink-0">
            {price.startsWith('$') || price.startsWith('+') || price.includes('/') || price === 'Market Price'
              ? price
              : `${price}`}
          </span>
        )}
      </div>
      {description && (
        <p className="text-gray-600 text-sm sm:text-base mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function MenuSection({ section }: { section: DineInMenuSection }) {
  return (
    <div id={section.id} className="scroll-mt-28 mb-0">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-[#8B2500] to-[#D4782F] px-5 sm:px-8 py-6 sm:py-8">
        <h3 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider">
          {section.title}
        </h3>
        {section.subtitle && (
          <p className="text-white/90 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
            {section.subtitle}
          </p>
        )}
      </div>

      {/* Section Image */}
      {section.image && (
        <div className="relative w-full h-48 sm:h-64 md:h-72">
          <Image
            src={section.image}
            alt={section.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-white px-5 sm:px-8 py-4 sm:py-6">
        {section.items.map((item, idx) => (
          <MenuItemRow key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function DineInMenuPage() {
  const [activeSection, setActiveSection] = useState<string>('appetizers');
  const [activeTab, setActiveTab] = useState<'food' | 'drinks'>('food');

  const currentSections = activeTab === 'food'
    ? DINE_IN_MENU.filter(s => FOOD_SECTIONS.includes(s.id))
    : DINE_IN_MENU.filter(s => DRINK_SECTIONS.includes(s.id));

  useEffect(() => {
    const handleScroll = () => {
      for (const section of currentSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSections]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 140;
      const pos = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: pos - offset, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#8B2500] to-[#5a1800] py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E] to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#E8A317] tracking-wider mb-4">
              DINE-IN MENU
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Authentic Mexican cuisine since 1967. All prices subject to sales tax and change without notice.
            </p>
          </div>

          {/* Promos */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {DINE_IN_PROMOS.map((promo) => (
              <div key={promo.title} className="bg-[#C8102E]/20 border border-[#C8102E]/40 rounded-full px-5 py-2">
                <span className="font-oswald text-[#E8A317] tracking-wide text-sm sm:text-base">
                  {promo.title}:
                </span>{' '}
                <span className="text-white/80 text-sm">
                  {promo.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food / Drinks Toggle + Section Nav */}
      <div className="sticky top-0 z-40 bg-[#1C1C1C] border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          {/* Toggle */}
          <div className="flex justify-center py-3 gap-2">
            <button
              onClick={() => {
                setActiveTab('food');
                setActiveSection(FOOD_SECTIONS[0]);
              }}
              className={`px-6 py-2 rounded-full font-oswald text-sm sm:text-base tracking-wider transition-all ${
                activeTab === 'food'
                  ? 'bg-[#D4782F] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              FOOD
            </button>
            <button
              onClick={() => {
                setActiveTab('drinks');
                setActiveSection(DRINK_SECTIONS[0]);
              }}
              className={`px-6 py-2 rounded-full font-oswald text-sm sm:text-base tracking-wider transition-all ${
                activeTab === 'drinks'
                  ? 'bg-[#D4782F] text-white'
                  : 'bg-transparent text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              DRINKS
            </button>
          </div>

          {/* Section Pills */}
          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide">
            {currentSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-3 py-1.5 rounded-full font-oswald text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-[#E8A317] text-[#1C1C1C]'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-3xl mx-auto">
        {currentSections.map((section) => (
          <MenuSection key={section.id} section={section} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#8B2500] py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-[#E8A317] mb-3 tracking-wide">
            PLANNING A PARTY?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Check out our full-service catering menu for events of all sizes.
          </p>
          <a
            href="/menus"
            className="inline-flex items-center gap-2 bg-[#D4782F] text-white font-oswald px-8 py-3 rounded-full hover:bg-[#c06a25] transition-all"
          >
            <span>View Catering Menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <div className="mt-6">
            <a
              href="tel:+17087482400"
              className="text-[#E8A317] font-oswald text-lg hover:text-white transition-colors"
            >
              Call (708) 748-2400
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
