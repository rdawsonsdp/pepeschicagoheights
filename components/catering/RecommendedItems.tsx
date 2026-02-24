'use client';

import { useCatering } from '@/context/CateringContext';
import { getProductsByEventType } from '@/lib/products';
import { getEventTypeName } from '@/lib/event-types';
import { formatCurrency, calculateProductOrder } from '@/lib/pricing';
import { CateringProduct } from '@/lib/types';
import Image from 'next/image';

export default function RecommendedItems() {
  const { state, dispatch, isItemInCart } = useCatering();

  if (!state.eventType) return null;

  const allProducts = getProductsByEventType(state.eventType);

  // Filter: popular items not already in cart, respecting budget if set
  const recommended = allProducts
    .filter(p => p.tags?.includes('popular') && !isItemInCart(p.id))
    .filter(p => {
      if (!state.budgetRange) return true;
      const calc = calculateProductOrder(p, state.headcount);
      const perPerson = calc.totalPrice / state.headcount;
      return perPerson <= state.budgetRange.max;
    })
    .slice(0, 6);

  if (recommended.length === 0) return null;

  const handleAdd = (product: CateringProduct) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  };

  return (
    <div className="border-2 border-pepe-red/50 rounded-xl p-4 sm:p-6 bg-pepe-red/5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-pepe-red text-lg">&#9733;</span>
        <h3 className="font-oswald text-lg font-bold text-pepe-dark tracking-wide">
          RECOMMENDED FOR YOUR {getEventTypeName(state.eventType).toUpperCase()}
        </h3>
        <span className="text-xs text-muted">
          ({state.headcount} guests{state.budgetRange ? `, ${state.budgetRange.label} budget` : ''})
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {recommended.map((product) => {
          const calc = calculateProductOrder(product, state.headcount);
          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-[180px] sm:w-[200px] bg-pepe-warm-white rounded-xl border border-pepe-sand overflow-hidden hover:shadow-warm transition-shadow"
            >
              <div className="relative h-24">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="p-3">
                <h4 className="font-oswald font-semibold text-pepe-dark text-sm line-clamp-1 mb-1">
                  {product.title}
                </h4>
                <p className="text-xs text-muted mb-2">
                  {formatCurrency(calc.totalPrice / state.headcount)}/person
                </p>
                <button
                  onClick={() => handleAdd(product)}
                  className="w-full text-xs font-semibold bg-pepe-dark text-white py-1.5 rounded-lg hover:bg-pepe-red transition-colors"
                >
                  Add to Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
