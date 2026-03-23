'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const APPETIZERS = [
  {
    name: 'Stuffed Nachos',
    description: 'Queso Blanco or melted Chihuahua and cheddar cheese. Comes with beans, guacamole and sour cream',
    price: '$13',
  },
  {
    name: 'Botana Grande',
    description: 'Flautas (6) and Garnachas. Served with guacamole and sour cream',
    price: '$15',
  },
  {
    name: 'Chile con Queso',
    description: 'Delicious tangy sauce & melted cheese w/ chips. Spicy jalapeño, corn or flour tortilla. Extra Cheese $2',
    price: '$11',
  },
  {
    name: 'Queso Blanco',
    description: 'Add Ground Beef +$2.35',
    price: '$7',
  },
  {
    name: 'Guacamole',
    description: 'Half or Full order',
    price: 'Market Price',
  },
  {
    name: 'Queso Blanco Burrito',
    description: 'Beef, chicken, pork, or steak topped with queso blanco and pico de gallo',
    price: '$15',
    isNew: true,
  },
  {
    name: 'Jalapeño Poppers',
    price: '$9',
  },
];

export default function AppetizersPage() {
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
              APPETIZERS
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Start your fiesta right with our delicious appetizers.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-48 sm:h-64 md:h-80">
        <Image
          src="/images/menu/steak-nachos.jpg"
          alt="Appetizers"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Appetizer Items */}
      <div className="w-full">
        <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
          {APPETIZERS.map((item) => (
            <div key={item.name} className="py-5 border-b border-pepe-menu-cream/20 last:border-b-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="menu-dish-name text-pepe-menu-cream">
                    {item.name}
                  </h3>
                  {'isNew' in item && item.isNew && (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-pepe-gold text-pepe-dark whitespace-nowrap shadow-md tracking-wide uppercase">
                      New
                    </span>
                  )}
                </div>
                <span className="font-roboto-condensed font-bold text-pepe-menu-cream whitespace-nowrap" style={{ fontSize: '20px', lineHeight: 1.5 }}>
                  {item.price}
                </span>
              </div>
              {item.description && (
                <p className="font-merriweather font-light text-pepe-menu-cream/70 mt-1" style={{ fontSize: '17px', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-pepe-maroon py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-3 tracking-wide">
            READY FOR THE MAIN COURSE?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Check out our full dine-in menu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dine-in"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Our Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/drinks"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Drinks Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
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
