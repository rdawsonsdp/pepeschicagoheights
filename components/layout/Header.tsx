'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/dine-in', label: 'DINE-IN MENU' },
    { href: '/drinks', label: 'DRINKS' },
    { href: '/desserts', label: 'DESSERTS' },
    { href: '/catering', label: 'ORDER CATERING' },
    { href: '/admin/menu-engineering', label: 'ADMIN' },
  ];

  return (
    <header className="bg-pepe-orange text-white sticky top-0 z-50 border-b-4 border-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={siteConfig.branding.logoPath}
              alt={siteConfig.restaurant.name}
              width={130}
              height={130}
              className="h-12 sm:h-14 lg:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-oswald text-sm xl:text-base tracking-wide text-white hover:text-pepe-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="font-oswald text-sm xl:text-base tracking-wide text-pepe-dark font-bold hover:text-white transition-colors"
            >
              {siteConfig.contact.phone}
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/30 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-3 font-oswald tracking-wide text-white hover:text-pepe-dark transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="block py-3 font-oswald tracking-wide text-pepe-dark font-bold hover:text-white transition-colors"
            >
              {siteConfig.contact.phone}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
