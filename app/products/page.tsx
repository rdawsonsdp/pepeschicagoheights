'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCatering } from '@/context/CateringContext';
import { CATERING_PRODUCTS } from '@/lib/products';
import { CateringProduct } from '@/lib/types';
import { getDisplayPrice, getPricingTypeLabel } from '@/lib/pricing';
import Card from '@/components/ui/Card';
import DietaryFilterBar from '@/components/catering/DietaryFilterBar';

type Category = 'all' | 'appetizers' | 'entrees' | 'sides';

const CATEGORIES: { id: Category; name: string; description: string }[] = [
  { id: 'all', name: 'All Products', description: 'Browse our complete catering menu' },
  { id: 'appetizers', name: 'Appetizers', description: 'Starters and crowd favorites' },
  { id: 'entrees', name: 'Main Dishes', description: 'Tacos, fajitas, carnitas, and more' },
  { id: 'sides', name: 'Sides & More', description: 'Rice, beans, toppings, and desserts' },
];

function ProductCard({ product }: { product: CateringProduct }) {
  const { dispatch, isItemInCart } = useCatering();
  const inCart = isItemInCart(product.id);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  };

  return (
    <Card className="overflow-hidden" hover>
      <div className="relative h-40 -mx-4 -mt-4 mb-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        {inCart && (
          <div className="absolute top-2 right-2 bg-pepe-red text-white text-xs font-bold px-2 py-1 rounded-full">
            In Cart
          </div>
        )}
      </div>
      <h3 className="font-oswald text-pepe-dark text-lg mb-1 line-clamp-1">
        {product.title}
      </h3>
      <p className="text-sm text-pepe-charcoal/70 mb-3 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div>
          <p className="font-oswald text-pepe-red text-lg">
            {getDisplayPrice(product)}
          </p>
          <p className="text-xs text-muted">
            {getPricingTypeLabel(product)}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            inCart
              ? 'bg-pepe-sand text-pepe-charcoal hover:bg-pepe-sand/80'
              : 'bg-pepe-red text-white hover:bg-pepe-red-hover'
          }`}
        >
          {inCart ? 'Add More' : 'Add'}
        </button>
      </div>
    </Card>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { state } = useCatering();

  const handleToggleFilter = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag)
        ? prev.filter(f => f !== tag)
        : [...prev, tag]
    );
  };

  // Filter products by category, search, and dietary filters
  const filteredProducts = CATERING_PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.categories.includes(activeCategory as any);
    const matchesSearch =
      searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDietary = activeFilters.length === 0 ||
      activeFilters.every(f => product.tags?.includes(f));
    return matchesCategory && matchesSearch && matchesDietary;
  });

  // Group products by their primary category for "all" view
  const groupedProducts = {
    appetizers: filteredProducts.filter((p) => p.categories.includes('appetizers')),
    entrees: filteredProducts.filter((p) => p.categories.includes('entrees') && !p.categories.includes('appetizers')),
    sides: filteredProducts.filter((p) => p.categories.includes('sides') && !p.categories.includes('appetizers') && !p.categories.includes('entrees')),
  };

  return (
    <div className="min-h-screen bg-pepe-cream">
      {/* Header */}
      <div className="bg-pepe-dark py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Order Builder
          </Link>
          <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl text-pepe-red tracking-wider mb-2">
            FULL CATERING MENU
          </h1>
          <p className="text-pepe-sand text-lg font-crimson italic">
            Browse all {CATERING_PRODUCTS.length} items from our catering menu
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-pepe-warm-white shadow-warm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-pepe-sand rounded-xl bg-pepe-warm-white focus:outline-none focus:ring-2 focus:ring-pepe-orange/40 focus:border-pepe-orange"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-oswald font-semibold text-sm whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-pepe-dark text-white shadow-warm'
                      : 'bg-pepe-sand text-pepe-charcoal hover:bg-pepe-red/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="mt-3">
            <DietaryFilterBar activeTags={activeFilters} onToggleTag={handleToggleFilter} />
          </div>
        </div>
      </div>

      {/* Cart Summary Bar */}
      {state.selectedItems.length > 0 && (
        <div className="bg-pepe-red py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p className="font-oswald font-semibold text-white">
              {state.selectedItems.length} item{state.selectedItems.length !== 1 ? 's' : ''} in cart
            </p>
            <Link
              href="/#catering"
              className="bg-white text-pepe-dark px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pepe-orange hover:text-white transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {activeCategory === 'all' ? (
          // Grouped view for "All Products"
          <div className="space-y-12">
            {/* Appetizers Section */}
            {groupedProducts.appetizers.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-dark">
                    Appetizers
                  </h2>
                  <div className="flex-1 h-px bg-pepe-red" />
                  <span className="text-sm text-muted">
                    {groupedProducts.appetizers.length} items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedProducts.appetizers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Main Dishes Section */}
            {groupedProducts.entrees.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-dark">
                    Main Dishes
                  </h2>
                  <div className="flex-1 h-px bg-pepe-green" />
                  <span className="text-sm text-muted">
                    {groupedProducts.entrees.length} items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedProducts.entrees.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Sides & More Section */}
            {groupedProducts.sides.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-dark">
                    Sides & More
                  </h2>
                  <div className="flex-1 h-px bg-pepe-orange" />
                  <span className="text-sm text-muted">
                    {groupedProducts.sides.length} items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedProducts.sides.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          // Flat view for specific category
          <>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-dark">
                {CATEGORIES.find((c) => c.id === activeCategory)?.name}
              </h2>
              <div className="flex-1 h-px bg-pepe-red" />
              <span className="text-sm text-muted">
                {filteredProducts.length} items
              </span>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted text-lg">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 text-pepe-red hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Back to Order Builder CTA */}
      <div className="bg-pepe-dark py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-oswald text-2xl sm:text-3xl text-pepe-red mb-4">
            Ready to finalize your order?
          </h3>
          <Link
            href="/#catering"
            className="inline-block bg-pepe-orange text-white font-oswald px-8 py-3 rounded-full hover:bg-white hover:text-pepe-dark transition-colors shadow-warm"
          >
            Return to Order Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
