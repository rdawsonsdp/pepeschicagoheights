'use client';

import Link from 'next/link';
import { CATERING_PRODUCTS } from '@/lib/products';
import { exportCateringMenuPDF, exportDineInMenuPDF, exportMenuXLS } from '@/lib/menu-export';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <div className="grid gap-4">
          <Link
            href="/admin/menu-engineering"
            className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-pepe-orange hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Menu Engineering</h2>
            <p className="text-gray-500 text-sm">Edit menu items, pricing, and visibility</p>
          </Link>

          {/* Menu Downloads */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Download Menus</h2>
            <p className="text-gray-500 text-sm mb-4">Export menus as PDF or Excel for printing or sharing</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => exportCateringMenuPDF(CATERING_PRODUCTS)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-[#E88A00] hover:bg-[#E88A00]/5 transition-all text-left"
              >
                <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM9.998 14.768c.282 0 .508-.048.68-.144a.457.457 0 00.258-.416c0-.192-.078-.332-.234-.42-.156-.088-.39-.132-.702-.132h-.66v1.112h.658zm4.386-1.112h-.684v3.344h.684c.536 0 .934-.142 1.194-.426.26-.284.39-.698.39-1.242 0-.548-.13-.966-.39-1.254-.26-.288-.658-.422-1.194-.422zM6 12h1.2v4.8H6V12zm2.798 0h1.858c.508 0 .892.12 1.152.36.26.24.39.588.39 1.044 0 .46-.136.812-.408 1.056-.272.244-.66.366-1.164.366H9.998V16.8H8.798V12zm4.186 0h1.884c.736 0 1.298.2 1.686.6.388.4.582.972.582 1.716 0 .74-.194 1.31-.582 1.71-.388.4-.95.6-1.686.6h-1.884V12z"/>
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Catering Menu PDF</p>
                  <p className="text-xs text-gray-400">All catering items with pricing</p>
                </div>
              </button>

              <button
                onClick={() => exportDineInMenuPDF()}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-[#E88A00] hover:bg-[#E88A00]/5 transition-all text-left"
              >
                <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM9.998 14.768c.282 0 .508-.048.68-.144a.457.457 0 00.258-.416c0-.192-.078-.332-.234-.42-.156-.088-.39-.132-.702-.132h-.66v1.112h.658zm4.386-1.112h-.684v3.344h.684c.536 0 .934-.142 1.194-.426.26-.284.39-.698.39-1.242 0-.548-.13-.966-.39-1.254-.26-.288-.658-.422-1.194-.422zM6 12h1.2v4.8H6V12zm2.798 0h1.858c.508 0 .892.12 1.152.36.26.24.39.588.39 1.044 0 .46-.136.812-.408 1.056-.272.244-.66.366-1.164.366H9.998V16.8H8.798V12zm4.186 0h1.884c.736 0 1.298.2 1.686.6.388.4.582.972.582 1.716 0 .74-.194 1.31-.582 1.71-.388.4-.95.6-1.686.6h-1.884V12z"/>
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Dine-In Menu PDF</p>
                  <p className="text-xs text-gray-400">Full dine-in menu by section</p>
                </div>
              </button>

              <button
                onClick={() => exportMenuXLS(CATERING_PRODUCTS)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                <svg className="w-8 h-8 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 13h2l1.5 2.5L12 13h2l-2.5 3.5L14 20h-2l-1.5-2.5L9 20H7l2.5-3.5L7 13z"/>
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Full Menu Excel</p>
                  <p className="text-xs text-gray-400">Catering + Dine-In spreadsheet</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
