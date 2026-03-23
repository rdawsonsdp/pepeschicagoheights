'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const DESSERTS = [
  {
    name: 'Churros (2)',
    description: 'Served with caramel',
    price: '$9',
    image: '/images/menu/mini-churros.jpg',
  },
  {
    name: 'Flan',
    description: 'Classic Mexican custard with caramel sauce',
    price: '$7',
  },
  {
    name: 'Fried Ice Cream',
    description: 'Crispy coated ice cream with whipped cream and chocolate',
    price: '$7',
  },
  {
    name: 'Mexican Tiramisu',
    description: 'Our twist on the classic Italian dessert',
    price: '$8',
  },
];

export default function DessertsPage() {
  return (
    <div className="min-h-screen bg-pepe-burnt-orange">
      {/* Hero */}
      <div className="bg-gradient-to-b from-pepe-maroon to-[#5A2010] py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-pepe-red to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-pepe-red tracking-wider mb-2">
              POSTRES
            </h1>
            <p className="font-oswald text-2xl sm:text-3xl text-pepe-gold tracking-wider mb-4">
              DESSERTS
            </p>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              The perfect sweet ending to your meal.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-48 sm:h-64 md:h-80">
        <Image
          src="/images/menu/desserts-real.jpg"
          alt="Pepe's Desserts"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Dessert Items */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
          {DESSERTS.map((item) => (
            <div key={item.name} className="py-6 border-b border-pepe-menu-cream/20 last:border-b-0">
              {item.image && (
                <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-4">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="menu-dish-name text-pepe-menu-cream">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-pepe-menu-cream/70 text-base sm:text-lg mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="font-lato font-bold text-pepe-menu-cream whitespace-nowrap text-2xl sm:text-3xl">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Churro Sundae Feature */}
        <div className="bg-gradient-to-r from-pepe-maroon to-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
          <h3 className="font-oswald text-3xl sm:text-4xl font-bold text-pepe-menu-cream tracking-wider mb-4">
            ASK ABOUT OUR CHURRO SUNDAE!
          </h3>
          <p className="text-pepe-menu-cream/80 text-sm sm:text-base mb-4">
            Vanilla ice cream topped with churros, whipped cream, and chocolate drizzle — the ultimate dessert experience.
          </p>
        </div>
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <Image
            src="/images/menu/churro-sundae.jpg"
            alt="Churro Sundae"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-pepe-maroon py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-3 tracking-wide">
            STILL THIRSTY?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Check out our drinks menu for cocktails, margaritas, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/drinks"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Drinks Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/dine-in"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Dine-In Menu
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
