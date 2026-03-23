'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#8f260c]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#a0503a] to-[#8f260c] py-12 sm:py-16">
        <div className="container mx-auto px-5 sm:px-8">
          <Image
            src="/images/pepes-logo.png"
            alt="Pepe's Mexican Restaurant"
            width={256}
            height={256}
            className="h-32 sm:h-40 w-auto mb-6"
          />
        </div>
      </section>

      {/* About Content */}
      <section className="bg-[#8f260c] py-10 sm:py-14">
        <div className="container mx-auto px-5 sm:px-8 max-w-3xl">
          <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl text-white font-black mb-6 leading-tight">
            Celebrating Over 50 Years of Authentic Mexican Cuisine
          </h1>

          <p className="menu-text text-white/90 mb-8" style={{ fontSize: '20px' }}>
            Since 1967. We haven&apos;t Changed a thing.
          </p>

          <p className="menu-text text-white/90 mb-8" style={{ fontSize: '20px' }}>
            Established in 1967, by Mario Dovalina and Edwin Ptak, Pepe&apos;s has grown from
            humble beginnings to become a famous Chicago original.
          </p>

          <p className="menu-text text-white/90 mb-8" style={{ fontSize: '20px' }}>
            Pepe&apos;s Menu offers a broad selection of authentic Mexican style food made
            with great care and attention to detail. From our signature tacos and enchiladas
            to our sizzling fajitas and fresh-made guacamole, every dish is prepared using
            traditional family recipes passed down through generations.
          </p>

          <p className="menu-text text-white/90 mb-8" style={{ fontSize: '20px' }}>
            Whether you&apos;re joining us for our famous all-you-can-eat lunch buffet,
            celebrating a special occasion with our full-service catering, or just stopping
            in for happy hour margaritas and slots &mdash; Pepe&apos;s is the place where
            families and friends come together to enjoy great food and even better memories.
          </p>

          <p className="menu-text text-pepe-gold mb-10" style={{ fontSize: '20px' }}>
            470 W Lincoln Hwy, Chicago Heights, IL 60411<br />
            (708) 748-2400
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dine-in"
              className="inline-flex items-center justify-center gap-2 bg-pepe-gold text-pepe-dark font-oswald font-bold px-8 py-3 rounded-full hover:bg-white transition-all shadow-lg text-lg tracking-wide"
            >
              View Our Menu
            </Link>
            <a
              href="tel:+17087482400"
              className="inline-flex items-center justify-center gap-2 bg-pepe-orange text-white font-oswald font-bold px-8 py-3 rounded-full hover:bg-pepe-burnt-orange transition-all shadow-lg text-lg tracking-wide"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
