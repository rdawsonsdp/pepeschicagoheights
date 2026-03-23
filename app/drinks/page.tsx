'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const COCKTAILS = [
  { name: 'Mezcal Pineapple & Jalapeño', description: 'Mezcal, triple sec, lime juice, pineapple juice', price: '$13' },
  { name: 'Mexican Mule', description: 'Mezcal, lime juice, ginger beer', price: '$13' },
  { name: 'Don Mojito', description: 'Rum, mint, fresh cucumber juice, lime juice, simple syrup, club soda', price: '$13' },
  { name: 'Jalisco Old Fashion', description: 'Mezcal, tequila, agave, apple, orange bitters, soda', price: '$13' },
  { name: 'Ranch Water', description: 'Maestro Dovel Blanco, lime juice, soda water', price: '$13' },
  { name: 'Dirty Horchata', description: 'Horchata, Tito\'s, Kahlua, coffee, cinnamon', price: '$13' },
  { name: 'Cantarito', description: 'Maestro Dovel Blanco, lime juice, lemon juice, grapefruit juice, squirt, rim', price: '$13' },
  { name: 'La Playa', description: 'Tito\'s, triple sec, lime, cranberry', price: '$13' },
  { name: 'Strawberry Paloma', description: 'Maestro Dovel Blanco, lime juice, strawberry', price: '$13' },
  { name: 'Michelada 27oz', description: 'Blanco, lime juice, squirt, salted rim', price: '$9' },
  { name: 'Paloma', description: 'Maestro Dovel Blanco, lime juice, squirt, salted rim', price: '$11' },
  { name: 'Sangria 16oz', price: '$11' },
  { name: 'Mimosas', price: '$6' },
];

const MARGARITAS = [
  {
    name: 'Flavored Margaritas',
    description: 'Mezcal, triple sec, lime juice — frozen or on the rocks. Strawberry, mango, passion fruit, cucumber/chamoy, banana, guava, peach, wildberry, pomegranate, blackberry, jalapeño, mamma melon, blue Hawaiian, blue curaçao.',
    price: '8oz $8 · 16oz $13 · Pitcher $26',
    note: 'Fresa +$2',
  },
  {
    name: 'Superman Margarita or Canchita Rita',
    price: '16oz $16 · 45oz $35',
  },
  {
    name: 'Corona Rita',
    price: '16oz $17',
    note: 'Add flavor +$3',
  },
  {
    name: 'Specialty Margaritas',
    description: 'Cadillac, Golden',
    price: '16oz $16 · 60oz $40 · Pitcher $36',
  },
  {
    name: 'Keto Skinny Margarita',
    description: 'Maestro Dovel Blanco',
    price: '16oz $12 · 45oz $27 · 60oz $36',
  },
  {
    name: 'Premium Margarita',
    price: '16oz $18 · 45oz $35 · 60oz $38',
  },
];

const TEQUILA_SPIRITS = [
  { name: 'Jose Cuervo Silver', price: '$8' },
  { name: 'Jose Cuervo', price: '$8' },
  { name: '1800', price: '$10' },
  { name: 'Gran Centenario', price: '$9' },
  { name: 'Patron Silver', price: '$9.50' },
  { name: 'Don Julio', price: '$9' },
  { name: 'Casamigos', price: '$13' },
];

const WINE = ['Sangria', 'Merlot', 'Chardonnay', 'Pinot Noir', 'White Zinfandel'];

const IMPORT_BEER = ['Corona', 'Modelo', 'Stella', 'Pacifico'];
const DOMESTIC_BEER = ['Bud Light', 'Coors Light', 'Miller Lite', 'MGD', 'Truly'];
const SELTZERS = ['White Claw', 'Truly'];

type DrinkItem = {
  name: string;
  description?: string;
  price?: string;
  note?: string;
};

function DrinkCard({ item }: { item: DrinkItem }) {
  return (
    <div className="py-4 border-b border-pepe-menu-cream/20 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <h4 className="font-lato font-bold text-pepe-menu-cream tracking-wide text-lg sm:text-xl">
          {item.name}
        </h4>
        {item.price && (
          <span className="font-lato font-bold text-pepe-menu-cream whitespace-nowrap flex-shrink-0 text-lg sm:text-xl">
            {item.price}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-pepe-menu-cream/70 text-sm sm:text-base mt-1 leading-relaxed">
          {item.description}
        </p>
      )}
      {item.note && (
        <p className="text-pepe-gold text-xs sm:text-sm mt-1 italic">
          {item.note}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, image }: { title: string; subtitle?: string; image?: string }) {
  return (
    <>
      <div className="bg-gradient-to-r from-pepe-maroon to-pepe-burnt-orange px-5 sm:px-8 py-6 sm:py-8">
        <h3 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-pepe-menu-cream tracking-wider">
          {title}
        </h3>
        {subtitle && (
          <p className="text-pepe-menu-cream/80 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {image && (
        <div className="relative w-full h-48 sm:h-64 md:h-72">
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        </div>
      )}
    </>
  );
}

export default function DrinksMenuPage() {
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
              DRINKS MENU
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Handcrafted cocktails, signature margaritas, and an ice-cold selection of beer and wine.
            </p>
          </div>

          {/* Specials badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-pepe-red/20 border border-pepe-red/40 rounded-full px-5 py-2">
              <span className="font-oswald text-pepe-orange tracking-wide text-sm sm:text-base">
                MON & WED:
              </span>{' '}
              <span className="text-white/80 text-sm">
                1/2 Price Margaritas
              </span>
            </div>
            <div className="bg-pepe-red/20 border border-pepe-red/40 rounded-full px-5 py-2">
              <span className="font-oswald text-pepe-orange tracking-wide text-sm sm:text-base">
                HAPPY HOUR:
              </span>{' '}
              <span className="text-white/80 text-sm">
                3–6pm Weekdays
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="w-full">
        {/* Cocktails */}
        <div>
          <SectionHeader
            title="COCKTAILS"
            subtitle="Handcrafted Mexican-inspired cocktails"
            image="/images/menu/tequila-real.jpg"
          />
          <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
            {COCKTAILS.map((item) => (
              <DrinkCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />
        <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
          <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        {/* Margaritas */}
        <div>
          <SectionHeader
            title="MARGARITAS"
            subtitle="Monday & Wednesday — half-price margaritas all day!"
            image="/images/menu/strawberry-marg-real.jpg"
          />
          <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
            {MARGARITAS.map((item) => (
              <DrinkCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />
        <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
          <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        {/* Tequila & Spirits */}
        <div>
          <SectionHeader title="TEQUILA & SPIRITS" />
          <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
            {TEQUILA_SPIRITS.map((item) => (
              <DrinkCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />
        <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
          <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        {/* Wine */}
        <div>
          <SectionHeader title="WINE" />
          <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
            <div className="py-4 border-b border-pepe-menu-cream/20">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-lato font-bold text-pepe-menu-cream tracking-wide text-lg sm:text-xl">
                  Glass of Wine
                </h4>
                <span className="font-lato font-bold text-pepe-menu-cream whitespace-nowrap text-lg sm:text-xl">$9</span>
              </div>
              <p className="text-pepe-menu-cream/70 text-sm sm:text-base mt-1">
                {WINE.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[30px] bg-gradient-to-b from-[#ff900d] via-[#de7d07] to-[#962e0c]" />
        <div className="relative w-full h-[60px] sm:h-[80px] overflow-hidden">
          <Image src="/images/pattern-banner.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        {/* Beer */}
        <div>
          <SectionHeader title="BEER" image="/images/menu/beer-real.jpg" />
          <div className="bg-pepe-burnt-orange px-5 sm:px-8 py-4 sm:py-6">
            <DrinkCard item={{ name: 'Draft Beer', description: '20oz or Pitcher', price: '20oz $4 · Pitcher $20' }} />
            <DrinkCard item={{ name: 'Import Bottles', description: IMPORT_BEER.join(', '), price: '$6' }} />
            <DrinkCard item={{ name: 'Domestic Bottles', description: DOMESTIC_BEER.join(', '), price: '$5' }} />
            <DrinkCard item={{ name: 'Seltzers', description: SELTZERS.join(', '), price: '$6.50' }} />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-pepe-maroon py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-3 tracking-wide">
            HUNGRY?
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Check out our dine-in food menu or catering options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dine-in"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Dine-In Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/desserts"
              className="inline-flex items-center gap-2 bg-pepe-burnt-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-[#D4820C] transition-all"
            >
              Desserts
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
