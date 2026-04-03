'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/menu-engineering', label: 'Menu' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-oswald font-bold text-[#E88A00] tracking-wider text-sm">
            PEPE&apos;S ADMIN
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  pathname?.startsWith(item.href)
                    ? 'bg-[#E88A00] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden md:inline-block px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
          >
            Back to Site
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 hover:bg-gray-700 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-700 px-4 py-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                pathname?.startsWith(item.href)
                  ? 'bg-[#E88A00] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            Back to Site
          </Link>
        </nav>
      )}
    </div>
  );
}
