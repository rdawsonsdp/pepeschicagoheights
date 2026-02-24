import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pepe-dark text-white py-12 border-t-4 border-pepe-orange">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand */}
          <div className="md:col-span-1">
            <span className="font-oswald text-3xl text-pepe-orange tracking-wide">
              PEPE&apos;S
            </span>
            <p className="text-sm text-white/50 mt-1 font-oswald tracking-wider">
              MEXICAN RESTAURANT
            </p>
            <p className="text-white/50 text-sm mt-3">
              Have a Fiesta! Full Service Catering for all your events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-oswald text-lg font-semibold text-pepe-orange mb-4 tracking-wide">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/50 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dine-in" className="text-white/50 hover:text-white transition-colors">
                  Dine-In Menu
                </Link>
              </li>
              <li>
                <Link href="/menus" className="text-white/50 hover:text-white transition-colors">
                  Catering Menu
                </Link>
              </li>
              <li>
                <Link href="/#catering" className="text-white/50 hover:text-white transition-colors">
                  Order Catering
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/50 hover:text-white transition-colors">
                  Browse All Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-lg font-semibold text-pepe-orange mb-4 tracking-wide">
              CONTACT US
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+17087482400" className="hover:text-white transition-colors">
                  (708) 748-2400
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>470 W Lincoln Hwy, Chicago Heights, IL</span>
              </li>
            </ul>
          </div>

          {/* Social & Info */}
          <div>
            <h4 className="font-oswald text-lg font-semibold text-pepe-orange mb-4 tracking-wide">
              FOLLOW US
            </h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-white/40">
              Delivery available for additional fee.<br />
              Pre-payment required for most orders.<br />
              We require at least 2 day notice.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-pepe-orange/10 mt-8 pt-8 text-center text-sm text-white/40">
          <p>&copy; {currentYear} Pepe&apos;s Mexican Restaurant. All rights reserved. All prices subject to sales tax and change without notice.</p>
          <p className="mt-4 text-xs text-white/30">
            Powered by{' '}
            <a href="https://caterprosoftware.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              CaterPro
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
