'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DINE_IN_MENU, DINE_IN_PROMOS, FOOD_SECTIONS, DRINK_SECTIONS, DineInMenuSection } from '@/lib/dine-in-menu';
import { siteConfig } from '@/lib/site-config';

function MenuItemRow({ name, description, price }: {
  name: string;
  description?: string;
  price?: string;
}) {
  return (
    <div className="py-3 border-b border-pepe-menu-cream/20 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <h4 className="font-roboto-condensed font-bold text-pepe-menu-cream" style={{ fontSize: '20px', lineHeight: 1.5 }}>
          {name}
        </h4>
        {price && (
          <span className="font-roboto-condensed font-bold text-pepe-menu-cream whitespace-nowrap flex-shrink-0" style={{ fontSize: '20px', lineHeight: 1.5 }}>
            {price.startsWith('$') || price.startsWith('+') || price.includes('/') || price === 'Market Price'
              ? price
              : `${price}`}
          </span>
        )}
      </div>
      {description && (
        <p className="font-merriweather font-light text-pepe-menu-cream/70 mt-1" style={{ fontSize: '17px', lineHeight: 1.5 }}>
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
      <div className="bg-gradient-to-r from-pepe-maroon to-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
        <h3 className="font-crimson text-3xl sm:text-4xl md:text-5xl font-bold text-pepe-menu-cream tracking-wider">
          {section.title}
        </h3>
        {section.subtitle && (
          <p className="font-merriweather font-light text-pepe-menu-cream/80 mt-2 max-w-2xl" style={{ fontSize: '17px', lineHeight: 1.5 }}>
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
      <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
        {section.items.map((item, idx) => (
          <MenuItemRow key={idx} name={item.name} description={item.description} price={item.price} />
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
    <div className="min-h-screen bg-pepe-burnt-orange">
      {/* Hero */}
      <div className="bg-gradient-to-b from-pepe-maroon to-[#5A2010] py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-pepe-red to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-pepe-red tracking-wider mb-4">
              DINE-IN MENU
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              {siteConfig.content.dineInSubtitle}
            </p>
          </div>

          {/* Promos */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {DINE_IN_PROMOS.map((promo) => (
              <div key={promo.title} className="bg-pepe-red/20 border border-pepe-red/40 rounded-full px-5 py-2">
                <span className="font-oswald text-pepe-orange tracking-wide text-sm sm:text-base">
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
      <div className="sticky top-0 z-40 bg-pepe-dark border-b border-pepe-orange/20 shadow-lg">
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
                  ? 'bg-pepe-burnt-orange text-white'
                  : 'bg-transparent text-muted/70 hover:text-white border border-pepe-charcoal/50'
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
                  ? 'bg-pepe-burnt-orange text-white'
                  : 'bg-transparent text-muted/70 hover:text-white border border-pepe-charcoal/50'
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
                    ? 'bg-pepe-orange text-white'
                    : 'bg-pepe-charcoal text-muted/70 hover:text-white hover:bg-pepe-charcoal/80'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="w-full">
        {currentSections.map((section, idx) => (
          <div key={section.id}>
            {idx > 0 && (
              <>
                <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />
                <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
                  <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
                </div>
              </>
            )}
            <MenuSection section={section} />
          </div>
        ))}
      </div>

      {/* Order CTAs */}
      <div className="bg-[#8f260c] py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-[deepskyblue] mb-6 tracking-wide">
            READY TO ORDER?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://www.toasttab.com/local/order/pepesmexicanrestaurantchicagoheights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-8 py-3 rounded-full hover:bg-white transition-all shadow-lg text-lg tracking-wide"
            >
              Order Online
            </a>
            <a
              href="tel:+17087482400"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-lg tracking-wide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call To Order
            </a>
          </div>
          <h3 className="font-oswald text-xl sm:text-2xl text-white mb-3 tracking-wide">
            PLANNING A PARTY?
          </h3>
          <a
            href="/catering"
            className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
          >
            <span>Order Catering</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <div className="mt-6">
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="text-pepe-orange font-oswald text-lg hover:text-white transition-colors"
            >
              Call {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
