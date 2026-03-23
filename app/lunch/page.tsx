'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const BUFFET_ITEMS = [
  'Enchiladas',
  'Sizzling Fajitas',
  'Crispy Tacos',
  'Rice and Beans',
  'House-Made Salsas',
  'Warm Tortillas',
  'Fresh Tortilla Chips',
  'Guacamole',
  'Seasonal Agua Fresca',
];

export default function LunchPage() {
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
              OUR LUNCH BUFFET
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Experience the ultimate Mexican feast! Our all-you-can-eat buffet features
              freshly prepared enchiladas, fajitas, tacos, rice and beans, plus unlimited
              trips plus fresh tortilla chips, zesty guacamole, and our seasonal agua fresca selection.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-48 sm:h-64 md:h-80">
        <Image
          src="/images/buffet-2.jpg"
          alt="Lunch Buffet"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Buffet Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        <div className="relative h-40 sm:h-52">
          <Image src="/images/buffet-1.jpg" alt="Buffet spread" fill className="object-cover" sizes="33vw" />
        </div>
        <div className="relative h-40 sm:h-52">
          <Image src="/images/buffet-3.jpg" alt="Mexican food display" fill className="object-cover" sizes="33vw" />
        </div>
        <div className="relative h-40 sm:h-52 col-span-2 sm:col-span-1">
          <Image src="/images/buffet-4.jpg" alt="Buffet food" fill className="object-cover" sizes="33vw" />
        </div>
      </div>

      {/* Pricing & Details */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-pepe-maroon to-pepe-burnt-orange px-5 sm:px-8 py-8 sm:py-10 text-center">
          <h2 className="font-oswald text-5xl sm:text-6xl text-pepe-gold tracking-wider mb-4">
            $13.99
          </h2>
          <p className="font-oswald text-xl sm:text-2xl text-white tracking-wider mb-2">
            PER PERSON
          </p>
          <p className="font-oswald text-lg text-white/80 tracking-wider">
            MONDAY &ndash; FRIDAY &bull; 10:30 AM &ndash; 3:00 PM
          </p>
        </div>

        {/* Buffet Items */}
        <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
          <h3 className="font-oswald text-2xl sm:text-3xl text-white tracking-wider mb-6 text-center">
            WHAT&apos;S INCLUDED
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {BUFFET_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3 py-2">
                <span className="text-pepe-gold text-lg">&#9679;</span>
                <span className="font-oswald text-lg text-white tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-pepe-maroon py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-3 tracking-wide">
            WANT TO SEE OUR FULL MENU?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Check out our dine-in dinner menu or drinks menu.
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
