'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import ImageCarousel from '@/components/ui/ImageCarousel';

const LUNCH_CAROUSEL = [
  { src: '/images/menu/carousel-lunch-1.jpg', alt: 'Lunch buffet spread' },
  { src: '/images/menu/carousel-lunch-2.jpg', alt: 'Mexican food buffet' },
  { src: '/images/menu/carousel-lunch-3.jpg', alt: 'All-you-can-eat buffet' },
];

const DINNER_CAROUSEL = [
  { src: '/images/menu/carousel-dinner-1.jpg', alt: 'Red Snapper' },
  { src: '/images/menu/carousel-dinner-2.jpg', alt: 'Authentic Mexican dinner' },
  { src: '/images/menu/carousel-dinner-3.jpg', alt: 'Carne Asada dinner' },
  { src: '/images/menu/carousel-dinner-4.jpg', alt: 'Mexican entree' },
  { src: '/images/menu/carousel-dinner-5.jpg', alt: 'Steak nachos' },
];

const DRINKS_CAROUSEL = [
  { src: '/images/menu/carousel-drinks-1.jpg', alt: 'Cocktails' },
  { src: '/images/menu/carousel-drinks-2.jpg', alt: 'Margaritas' },
  { src: '/images/menu/carousel-drinks-3.jpg', alt: 'Tropical colada' },
  { src: '/images/menu/carousel-drinks-4.jpg', alt: 'Bar drinks' },
  { src: '/images/menu/carousel-drinks-5.jpg', alt: 'Strawberry margarita' },
];

const DAILY_SPECIALS = [
  { day: 'Monday', items: ['1/2 Price Margaritas', 'Candy Shots $5.00'] },
  { day: 'Tuesday', items: ["Pepe's Fajita Combo $4 Off", 'Margarita Flights $4 Off'] },
  { day: 'Wednesday', items: ['1/2 Price Margaritas', 'Candy Shots $5.00'] },
  { day: 'Thursday', items: ['Chicken Fajitas $4 Off', 'Candy Shots $5.00'] },
  { day: 'Friday', items: ['Steak Fajitas $4 Off', '27 oz. Margarita $11.95'] },
  { day: 'Saturday', items: ['Tierra y mar $4 off', '27 oz. Margarita $11.95 (Strawberry or Reg)'] },
  { day: 'Sunday', items: ['Carne Tampiqueria $4 Off', '27 oz. Margarita One Flavor $11.95'] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* ─── HERO ─── */}
      <section>
        {/* Hero images: stacked on mobile, side-by-side on desktop */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-[300px] sm:h-[400px] md:h-auto md:aspect-video">
              <Image
                src="/images/hero-margarita.jpg"
                alt="Superman Margarita"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-[300px] sm:h-[400px] md:h-auto md:aspect-video">
              <Image
                src="/images/hero-slots.jpg"
                alt="Slot Machines at Pepe's"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        {/* Restaurant name on rust background */}
        <div className="bg-gradient-to-b from-[#8f260c] to-[#7a2009] border-b-[3px] border-black py-5 sm:py-8 text-center px-4">
          <h1 className="font-oswald text-3xl sm:text-5xl md:text-6xl lg:text-[4.7rem] text-[deepskyblue] tracking-tight leading-tight font-black">
            Pepe&apos;s Mexican Restaurant<br />Chicago Heights
          </h1>
          <p className="font-lato text-base sm:text-xl text-[deepskyblue] mt-1 sm:mt-2">
            Chicago Heights, IL
          </p>
        </div>
      </section>

      {/* ─── ADDRESS & CONTACT ─── */}
      <section className="bg-gradient-to-b from-[#8f260c] to-[#7a2009] py-5 sm:py-10 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-oswald text-base sm:text-2xl text-white tracking-wider mb-0.5 sm:mb-1">
            470 W Lincoln Hwy, Chicago Heights, IL
          </h2>
          <a href="tel:+17087482400" className="font-oswald text-base sm:text-2xl text-pepe-orange tracking-wider hover:text-pepe-gold transition-colors">
            (708) 748-2400
          </a>
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-6">
            <a
              href="tel:+17087482400"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-pepe-orange text-white font-oswald font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call To Order
            </a>
            <a
              href="https://www.toasttab.com/local/order/pepesmexicanrestaurantchicagoheights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-pepe-orange text-white font-oswald font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              Order Online
            </a>
            <a
              href="https://www.doordash.com/store/pepe's-mexican-restaurant-chicago-heights-190401/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-pepe-orange text-white font-oswald font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              Door Dash
            </a>
            <a
              href="https://www.ubereats.com/store/pepes-chicago-heights/J7SihHifR1qowWaXfVq5EA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-pepe-orange text-white font-oswald font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              Uber Eats
            </a>
          </div>
        </div>
      </section>

      {/* ─── LUNCH BUFFET ─── */}
      <section>
        <ImageCarousel images={LUNCH_CAROUSEL} height="h-[200px] sm:h-[350px] md:h-[500px]" />
        <div className="bg-gradient-to-b from-[#8f260c] to-[#7a2009] py-6 sm:py-14">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-3 sm:mb-4">
              The best lunch deal in town! Endless tacos, enchiladas, and more.
            </h3>
            <div className="flex justify-center mb-3 sm:mb-4">
              <Link
                href="/lunch"
                className="inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-gold/80 transition-all shadow-md tracking-wide text-sm sm:text-base"
              >
                Our Buffet
              </Link>
            </div>
            <p className="menu-text text-white/80 text-sm sm:text-base">
              Experience the ultimate Mexican feast! Our all-you-can-eat buffet features traditional
              favorites and fresh ingredients daily. From chips and guac to enchiladas and churros
              &mdash; come hungry, leave happy!
            </p>
          </div>
        </div>
      </section>

      {/* ─── DINNER MENU ─── */}
      <section>
        <ImageCarousel images={DINNER_CAROUSEL} height="h-[200px] sm:h-[350px] md:h-[500px]" />
        <div className="bg-gradient-to-b from-[#ff900d] to-[#e07e0b] py-6 sm:py-14">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-3 sm:mb-4">
              Join Us for Authentic Mexican Food
            </h3>
            <div className="flex justify-center mb-3 sm:mb-4">
              <Link
                href="/dine-in"
                className="inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-gold/80 transition-all shadow-md tracking-wide text-sm sm:text-base"
              >
                Our Menu
              </Link>
            </div>
            <p className="menu-text text-white/80 text-sm sm:text-base">
              Discover classic Mexican cooking the way we have made it for 50 years. From
              slow-braised carnitas to rich mole poblano, our dinner menu celebrates authentic
              regional recipes crafted with care and served with pride.
            </p>
          </div>
        </div>
      </section>

      {/* ─── HAPPY HOUR / DRINKS ─── */}
      <section>
        <ImageCarousel images={DRINKS_CAROUSEL} height="h-[200px] sm:h-[350px] md:h-[500px]" />
        <div className="bg-gradient-to-b from-[#ff900d] to-[#e07e0b] py-6 sm:py-14">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-3 sm:mb-4">
              Happy Hour Cocktails &amp; more!
            </h3>
            <div className="flex justify-center mb-3 sm:mb-4">
              <Link
                href="/drinks"
                className="inline-flex items-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-gold/80 transition-all shadow-md tracking-wide text-sm sm:text-base"
              >
                Drinks Menu
              </Link>
            </div>
            <p className="menu-text text-white/80 text-sm sm:text-base">
              Happy Hour just got happier! Score amazing deals on your favorite drinks and apps
              every weekday from 3&ndash;6pm. Craft cocktails, cold beers, savory bites &mdash;
              all at prices that&apos;ll make you smile.
            </p>
          </div>
        </div>
      </section>

      {/* ─── GAMING / SLOTS ─── */}
      <section>
        <div className="relative w-full h-[200px] sm:h-[350px] md:h-[500px]">
          <Image
            src="/images/hero-slots.jpg"
            alt="Slot Machines"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="bg-gradient-to-b from-[#ff900d] to-[#e07e0b] py-6 sm:py-14">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-3 sm:mb-4">
              Get Lucky at Our Slots!
            </h3>
            <p className="menu-text text-white/80 text-sm sm:text-base">
              Hit the jackpot on our state-of-the-art slot machines! With the latest games,
              progressive jackpots, and non-stop action, every spin brings you closer to your big win.
            </p>
          </div>
        </div>
      </section>

      {/* ─── DAILY SPECIALS ─── */}
      <section className="py-8 sm:py-20 bg-gradient-to-b from-[#ff900d] to-[#e07e0b]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-10">
            <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-2">
              Our Daily Specials
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-5xl mx-auto">
            {DAILY_SPECIALS.map((special) => (
              <div
                key={special.day}
                className="bg-pepe-maroon/80 rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-pepe-gold/30"
              >
                <div className="bg-pepe-gold px-2 sm:px-4 py-1.5 sm:py-2.5">
                  <h4 className="font-oswald text-xs sm:text-lg font-bold text-pepe-dark tracking-wider text-center">
                    {special.day.toUpperCase()}
                  </h4>
                </div>
                <ul className="px-2 sm:px-4 py-2 sm:py-4 space-y-1 sm:space-y-2">
                  {special.items.map((item, i) => (
                    <li key={i} className="font-lato font-normal text-white leading-snug flex items-start gap-1 sm:gap-2 text-xs sm:text-[17px]">
                      <span className="text-pepe-gold mt-0.5 shrink-0 text-[8px] sm:text-base">&#9679;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATERING CTA ─── */}
      <section className="py-8 sm:py-20 bg-gradient-to-b from-[#8f260c] to-[#a0350f]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h3 className="font-oswald text-xl sm:text-3xl md:text-4xl text-white tracking-wider mb-3 sm:mb-4">
            Let Us Cater Your Next Event!
          </h3>
          <p className="menu-text text-white/80 mb-5 sm:mb-8 text-sm sm:text-base">
            Let us cater your next celebration! From intimate gatherings to large parties,
            we&apos;ll handle the food while you enjoy the moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/catering"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              Order Catering
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/catering"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              View Catering Menu
            </Link>
            <a
              href="tel:+17087482400"
              className="inline-flex items-center justify-center gap-2 bg-pepe-dark text-white font-oswald font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pepe-charcoal transition-all shadow-lg text-sm sm:text-lg tracking-wide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call for Catering
            </a>
          </div>
        </div>
      </section>

      {/* ─── LOGO FOOTER ─── */}
      <section className="py-6 sm:py-10 bg-gradient-to-b from-[#7a2009] to-[#8f260c] text-center">
        <Image
          src={siteConfig.branding.logoPath}
          alt={siteConfig.restaurant.name}
          width={200}
          height={200}
          className="h-16 sm:h-24 w-auto mx-auto"
        />
      </section>
    </div>
  );
}
