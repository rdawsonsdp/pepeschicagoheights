'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const DAILY_SPECIALS = [
  { day: 'Monday', items: ['1/2 Price Margaritas', 'Candy Shots $5.00'] },
  { day: 'Tuesday', items: ["Pepe's Fajita Combo $4 Off", 'Margarita Flights $4 Off'] },
  { day: 'Wednesday', items: ['1/2 Price Margaritas', 'Candy Shots $5.00'] },
  { day: 'Thursday', items: ['Chicken Fajitas $4 Off', 'Candy Shots $5.00'] },
  { day: 'Friday', items: ['Steak Fajitas $4 Off', '27 oz. Margarita $11.95'] },
  { day: 'Saturday', items: ['Tierra y Mar $4 Off', '27 oz. Margarita $11.95 (Strawberry or Reg)'] },
  { day: 'Sunday', items: ['Carne Tampiquefia $4 Off', '27 oz. Margarita One Flavor $11.95'] },
];

const TUESDAY_SPECIALS = [
  '$1.99 Tacos',
  '$1.99 Enchiladas',
  '$1.99 Tostadas',
  '$1.99 Tostadas Suiza',
  '(Beef, Chicken or Pork) Steak +$1',
  '$1.99 French Fries',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* ─── HERO ─── */}
      <section className="relative">
        <div className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden">
          <Image
            src={siteConfig.branding.heroImagePath}
            alt={`${siteConfig.restaurant.name} - Authentic Mexican Food`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pepe-dark via-pepe-dark/50 to-pepe-dark/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <Image
              src={siteConfig.branding.logoPath}
              alt={siteConfig.restaurant.name}
              width={180}
              height={180}
              className="h-24 sm:h-32 md:h-40 w-auto mb-4 drop-shadow-2xl"
            />
            <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-1 drop-shadow-lg">
              Pepe&apos;s Mexican Restaurant
            </h1>
            <h2 className="font-oswald text-2xl sm:text-3xl md:text-4xl text-white tracking-wider mb-2 drop-shadow-lg">
              Chicago Heights
            </h2>
            <p className="font-crimson text-lg sm:text-xl text-pepe-sand italic mb-6 drop-shadow">
              Chicago Heights, IL
            </p>
          </div>
        </div>
      </section>

      {/* ─── ADDRESS & CONTACT BAR ─── */}
      <section className="bg-pepe-dark py-8 sm:py-10 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-oswald text-xl sm:text-2xl text-white tracking-wider mb-1">
            470 W Lincoln Hwy
          </h2>
          <h2 className="font-oswald text-xl sm:text-2xl text-white tracking-wider mb-2">
            Chicago Heights, IL
          </h2>
          <a href="tel:+17087482400" className="font-oswald text-xl sm:text-2xl text-pepe-orange tracking-wider hover:text-pepe-gold transition-colors">
            (708) 748-2400
          </a>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
        </div>
      </section>

      {/* ─── ORDER ONLINE BAR ─── */}
      <section className="bg-gradient-to-b from-pepe-maroon to-[#6B2A10] py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://www.toasttab.com/local/order/pepesmexicanrestaurantchicagoheights" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg tracking-wide">
              Order Online
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="https://www.doordash.com/store/pepe's-mexican-restaurant-chicago-heights-190401/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg tracking-wide">
              DoorDash
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="https://www.ubereats.com/store/pepes-chicago-heights/J7SihHifR1qowWaXfVq5EA" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg tracking-wide">
              Uber Eats
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── DINNER MENU ─── */}
      <section className="py-16 sm:py-20 bg-pepe-burnt-orange">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1">
              <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-4">
                JOIN US FOR AUTHENTIC MEXICAN FOOD
              </h3>
              <p className="font-crimson text-base sm:text-lg text-white/80 leading-relaxed mb-6">
                Discover classic Mexican cooking the way we have made it for 50 years. From
                slow-braised carnitas to rich mole poblano, our dinner menu celebrates authentic
                regional recipes crafted with care and served with pride.
              </p>
              <Link
                href="/dine-in"
                className="inline-flex items-center gap-2 bg-pepe-maroon text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-maroon/80 transition-all shadow-md tracking-wide"
              >
                Our Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="order-1 md:order-2 relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/menu/enchiladas-cheese.jpg"
                alt="Authentic Mexican Dinner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-maroon via-pepe-orange to-pepe-gold" />

      {/* ─── LUNCH BUFFET ─── */}
      <section className="py-16 sm:py-20 bg-pepe-green">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/entrees.jpg"
                alt="Lunch Buffet"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-4">
                THE BEST LUNCH DEAL IN TOWN!
              </h3>
              <p className="font-crimson text-base sm:text-lg text-white/80 leading-relaxed mb-4">
                Endless tacos, enchiladas, and more.
              </p>
              <p className="font-crimson text-white/70 leading-relaxed mb-6">
                Experience the ultimate Mexican feast! Our all-you-can-eat buffet features traditional
                favorites and fresh ingredients daily. From chips and guac to enchiladas and churros
                &mdash; come hungry, leave happy!
              </p>
              <Link
                href="/dine-in"
                className="inline-flex items-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-md tracking-wide"
              >
                Our Buffet
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-gold via-pepe-orange to-pepe-maroon" />

      {/* ─── HAPPY HOUR / DRINKS ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-pepe-maroon to-pepe-burnt-orange">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/menu/margarita.jpg"
                alt="Happy Hour Margaritas"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-4">
                HAPPY HOUR COCKTAILS & MORE!
              </h3>
              <p className="font-crimson text-base sm:text-lg text-white/80 leading-relaxed mb-6">
                Happy Hour just got happier! Score amazing deals on your favorite drinks and apps
                every weekday from 3&ndash;6pm. Craft cocktails, cold beers, savory bites &mdash;
                all at prices that&apos;ll make you smile.
              </p>
              <Link
                href="/drinks"
                className="inline-flex items-center gap-2 bg-pepe-green text-white font-oswald font-bold px-6 py-3 rounded-full hover:bg-pepe-teal transition-all shadow-md tracking-wide"
              >
                Drinks Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-maroon via-pepe-orange to-pepe-gold" />

      {/* ─── GAMING / SLOTS ─── */}
      <section className="py-16 sm:py-20 bg-pepe-green">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-4">
              GET LUCKY AT OUR SLOTS!
            </h3>
            <p className="font-crimson text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Hit the jackpot on our state-of-the-art slot machines! With the latest games,
              progressive jackpots, and non-stop action, every spin brings you closer to your big win.
            </p>
          </div>
          <div className="relative h-[280px] sm:h-[380px] rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto">
            <Image
              src="/images/menu/slots.jpg"
              alt="Slot Machines"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-gold via-pepe-orange to-pepe-maroon" />

      {/* ─── DAILY SPECIALS ─── */}
      <section className="py-16 sm:py-20 bg-pepe-burnt-orange">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-2">
              OUR DAILY SPECIALS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {DAILY_SPECIALS.map((special) => (
              <div
                key={special.day}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="bg-pepe-maroon px-4 py-2.5">
                  <h4 className="font-oswald text-lg text-white tracking-wider text-center">
                    {special.day.toUpperCase()}
                  </h4>
                </div>
                <ul className="px-4 py-4 space-y-2">
                  {special.items.map((item, i) => (
                    <li key={i} className="font-crimson text-pepe-charcoal/80 leading-snug flex items-start gap-2" style={{ fontSize: '17px' }}>
                      <span className="text-pepe-orange mt-0.5 shrink-0">&#9679;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-maroon via-pepe-orange to-pepe-gold" />

      {/* ─── TUESDAY $1.99 SPECIALS ─── */}
      <section className="py-12 sm:py-16 bg-pepe-green">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h3 className="font-oswald text-2xl sm:text-3xl text-white tracking-wider mb-2">
            TUESDAY SPECIAL
          </h3>
          <p className="font-oswald text-lg sm:text-xl text-pepe-gold tracking-wider mb-6">
            OUR $1.99 MENU
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {TUESDAY_SPECIALS.map((item, i) => (
              <span key={i} className="font-crimson text-sm sm:text-base text-white/90 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                {item}
              </span>
            ))}
          </div>
          <p className="font-oswald text-sm text-pepe-gold/80 tracking-wider mt-4">
            CARRY OUT ONLY
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-gold via-pepe-orange to-pepe-maroon" />

      {/* ─── CATERING CTA ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-pepe-maroon to-pepe-burnt-orange">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-4">
            LET US CATER YOUR NEXT EVENT!
          </h3>
          <p className="font-crimson text-base sm:text-lg text-white/80 leading-relaxed mb-8">
            Let us cater your next celebration! From intimate gatherings to large parties,
            we&apos;ll handle the food while you enjoy the moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catering"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-lg tracking-wide"
            >
              Order Catering
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/menus"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-oswald font-bold px-8 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all shadow-lg text-lg tracking-wide"
            >
              View Catering Menu
            </Link>
            <a
              href="tel:+17087482400"
              className="inline-flex items-center justify-center gap-2 bg-pepe-dark text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-charcoal transition-all shadow-lg text-lg tracking-wide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call for Catering
            </a>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-2 bg-gradient-to-r from-pepe-maroon via-pepe-orange to-pepe-gold" />

      {/* ─── FIND US / MAP ─── */}
      <section className="py-16 sm:py-20 bg-pepe-green">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h3 className="font-oswald text-3xl sm:text-4xl text-white tracking-wider mb-2">
              FIND US
            </h3>
            <p className="font-crimson text-base sm:text-lg text-white/80">
              470 W Lincoln Hwy, Chicago Heights, IL 60411
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2981.2!2d-87.6358!3d41.5061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e1b0c1d2e5a3b%3A0x4a7c6e5f8d9b0c1e!2s470%20W%20Lincoln%20Hwy%2C%20Chicago%20Heights%2C%20IL%2060411!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pepe's Mexican Restaurant Location"
            />
          </div>
          <div className="text-center mt-6">
            <a
              href="https://www.google.com/maps/dir//470+W+Lincoln+Hwy,+Chicago+Heights,+IL+60411"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-lg tracking-wide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* ─── LOGO FOOTER ─── */}
      <section className="py-10 bg-pepe-dark text-center">
        <Image
          src={siteConfig.branding.logoPath}
          alt={siteConfig.restaurant.name}
          width={200}
          height={200}
          className="h-20 sm:h-24 w-auto mx-auto"
        />
      </section>
    </div>
  );
}
