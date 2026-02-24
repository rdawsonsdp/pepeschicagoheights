'use client';

import { useEffect, useRef } from 'react';
import { useCatering } from '@/context/CateringContext';
import { OrderType } from '@/lib/types';
import { getPackagesByEventType } from '@/lib/packages';
import { formatCurrency } from '@/lib/pricing';

export default function OrderTypeStep() {
  const { state, dispatch } = useCatering();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSelect = (orderType: OrderType) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: orderType });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  // Get package price range for preview
  const packages = state.eventType ? getPackagesByEventType(state.eventType) : [];
  const minPrice = packages.length > 0 ? Math.min(...packages.map(p => p.pricePerPerson)) : 0;
  const maxPrice = packages.length > 0 ? Math.max(...packages.map(p => p.pricePerPerson)) : 0;

  const options = [
    {
      id: 'build-your-own' as OrderType,
      icon: '🛠️',
      title: 'BUILD YOUR OWN',
      description: 'Customize your menu with individual items',
      detail: 'Choose exactly what you want, item by item',
    },
    {
      id: 'packages' as OrderType,
      icon: '📦',
      title: 'CHOOSE A PACKAGE',
      description: 'Pre-built menus ready to order',
      detail: packages.length > 0
        ? `Packages from ${formatCurrency(minPrice)}-${formatCurrency(maxPrice)}/person for ${state.headcount} guests`
        : 'Curated menu packages',
    },
  ];

  return (
    <div ref={sectionRef} className="bg-pepe-sand py-12 sm:py-16 scroll-mt-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-pepe-dark tracking-wider mb-4">
            HOW WOULD YOU LIKE TO ORDER?
          </h2>
          <p className="font-crimson text-pepe-charcoal/70 text-base sm:text-lg max-w-2xl mx-auto italic">
            Build a custom menu or choose from our curated packages
          </p>
        </div>

        {/* Order Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                onClick={() => handleSelect(option.id)}
                className={`
                  bg-pepe-warm-white border-2 rounded-2xl p-8 sm:p-10 text-center cursor-pointer
                  transition-all duration-300 hover:scale-[1.03] shadow-warm
                  ${state.orderType === option.id
                    ? 'border-pepe-red bg-pepe-red/5 shadow-warm-lg'
                    : 'border-pepe-sand hover:border-pepe-red/50'
                  }
                `}
              >
                <div className="text-6xl sm:text-7xl mb-4">{option.icon}</div>
                <h3 className="font-oswald text-2xl sm:text-3xl font-bold text-pepe-dark mb-3 tracking-wide">
                  {option.title}
                </h3>
                <p className="text-pepe-charcoal/70 text-sm sm:text-base mb-2 font-crimson">
                  {option.description}
                </p>
                <p className="text-xs text-pepe-red font-semibold">
                  {option.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleBack}
            className="font-oswald text-muted hover:text-pepe-dark transition-colors tracking-wide"
          >
            ← BACK TO GUESTS & BUDGET
          </button>
        </div>
      </div>
    </div>
  );
}
