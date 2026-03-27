'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menusOpen, setMenusOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const router = useRouter();

  // Prevent body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const menuLinks = [
    { href: '/dine-in', label: 'Our Menu' },
    { href: '/lunch', label: 'Lunch' },
    { href: '/drinks', label: 'Drinks' },
    { href: '/catering', label: 'Catering' },
    { href: '/admin', label: 'Admin' },
  ];

  const deliveryLinks = [
    { href: 'https://www.ubereats.com/store/pepes-chicago-heights/J7SihHifR1qowWaXfVq5EA', label: 'Uber Eats' },
    { href: 'https://www.doordash.com/store/pepe\'s-mexican-restaurant-chicago-heights-190401/', label: 'Door Dash' },
    { href: 'https://www.grubhub.com/restaurant/pepes-mexican-restaurant-470-w-lincoln-hwy-chicago-heights/3399498', label: 'Grub Hub' },
  ];

  return (
    <>
      <header className="bg-pepe-orange text-white sticky top-0 z-50 border-b-4 border-[#8f260c]">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={siteConfig.branding.logoPath}
                alt={siteConfig.restaurant.name}
                width={130}
                height={130}
                className="h-20 sm:h-24 lg:h-28 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                href="/"
                className="font-oswald text-sm xl:text-base tracking-wide text-white hover:text-pepe-dark transition-colors"
              >
                HOME
              </Link>

              {/* Our Menus Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setMenusOpen(!menusOpen); setDeliveryOpen(false); }}
                  onBlur={() => setTimeout(() => setMenusOpen(false), 150)}
                  className="font-oswald text-sm xl:text-base tracking-wide text-white hover:text-pepe-dark transition-colors flex items-center gap-1"
                >
                  OUR MENUS
                  <svg className={`w-3 h-3 transition-transform ${menusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menusOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pepe-dark rounded-lg shadow-xl py-2 min-w-[160px] z-50">
                    {menuLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-2 font-oswald text-sm text-white hover:bg-pepe-orange/20 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setDeliveryOpen(!deliveryOpen); setMenusOpen(false); }}
                  onBlur={() => setTimeout(() => setDeliveryOpen(false), 150)}
                  className="font-oswald text-sm xl:text-base tracking-wide text-white hover:text-pepe-dark transition-colors flex items-center gap-1"
                >
                  DELIVERY
                  <svg className={`w-3 h-3 transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {deliveryOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-pepe-dark rounded-lg shadow-xl py-2 min-w-[160px] z-50">
                    {deliveryLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 font-oswald text-sm text-white hover:bg-pepe-orange/20 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ORDER NOW Button */}
              <a
                href="https://www.ubereats.com/store/pepes-chicago-heights/J7SihHifR1qowWaXfVq5EA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pepe-dark text-white font-oswald font-bold px-6 py-2 rounded-full hover:bg-pepe-charcoal transition-all shadow-md tracking-wide text-sm xl:text-base"
              >
                ORDER NOW
              </a>
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu - portal outside header to avoid z-index issues */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          {/* Menu panel */}
          <div className="absolute top-0 right-0 w-[280px] h-full bg-pepe-orange shadow-2xl overflow-y-auto">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="px-6 pb-8">
              <button
                className="block w-full text-left py-3 font-oswald tracking-wide text-white hover:text-pepe-dark transition-colors text-lg border-b border-white/10"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/');
                }}
              >
                HOME
              </button>

              <div className="mt-2 pt-2">
                <p className="py-2 font-oswald tracking-wide text-white/60 text-sm">OUR MENUS</p>
                {menuLinks.map((link) => (
                  <button
                    key={link.label}
                    className="block w-full text-left py-2 pl-4 font-oswald tracking-wide text-white hover:text-pepe-dark transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(link.href);
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-2">
                <p className="py-2 font-oswald tracking-wide text-white/60 text-sm">DELIVERY</p>
                {deliveryLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 pl-4 font-oswald tracking-wide text-white hover:text-pepe-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="block py-3 font-oswald tracking-wide text-pepe-dark font-bold text-xl"
                >
                  {siteConfig.contact.phone}
                </a>
                <a
                  href="https://www.ubereats.com/store/pepes-chicago-heights/J7SihHifR1qowWaXfVq5EA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-center bg-pepe-gold text-pepe-dark font-oswald font-bold px-6 py-3 rounded-full"
                >
                  ORDER NOW
                </a>
                <button
                  className="block w-full mt-3 text-center bg-pepe-dark text-white font-oswald font-bold px-6 py-3 rounded-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/catering');
                  }}
                >
                  ORDER CATERING
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
