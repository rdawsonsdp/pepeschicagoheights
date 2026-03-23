'use client';

import Image from 'next/image';

export default function LunchPage() {
  return (
    <div className="min-h-screen bg-pepe-burnt-orange">
      {/* Centered Flyer */}
      <div className="bg-pepe-burnt-orange py-8 sm:py-12 flex justify-center px-4">
        <img
          src="/images/buffet-1.jpg"
          alt="Pepe's Lunch Buffet - Everyday from 10:30 to 3:00pm - $13.99 per person"
          className="w-full max-w-[450px] h-auto"
        />
      </div>

      {/* Title + Description */}
      <div className="bg-pepe-burnt-orange px-5 sm:px-8 pb-8 sm:pb-10">
        <h1 className="font-oswald text-4xl sm:text-5xl md:text-6xl text-white font-black mb-4">
          Our Lunch Buffet
        </h1>
        <p className="font-merriweather text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
          Choose from freshly prepared enchiladas, sizzling fajitas, crispy tacos, and savory rice
          and beans, alongside our signature house-made salsas and warm tortillas. Our buffet includes
          unlimited trips plus fresh tortilla chips, zesty guacamole, and our seasonal agua fresca
          selection. Available Monday through Friday from 10:30 am to 3pm for just $13.99 per person.
        </p>
      </div>

      {/* Food photos */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="/images/buffet-2.jpg"
          alt="Lunch buffet spread"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="/images/buffet-3.jpg"
          alt="Mexican food display"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="/images/buffet-4.jpg"
          alt="Buffet dishes"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

    </div>
  );
}
