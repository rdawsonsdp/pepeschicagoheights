import { CateringProduct } from './types';

// Helper to create pan pricing with custom serving sizes per item
function panPricing(
  halfPrice: number,
  fullPrice: number,
  halfServesMin: number,
  halfServesMax: number,
  fullServesMin: number,
  fullServesMax: number,
) {
  return {
    type: 'pan' as const,
    sizes: [
      { size: 'half' as const, price: halfPrice, servesMin: halfServesMin, servesMax: halfServesMax },
      { size: 'full' as const, price: fullPrice, servesMin: fullServesMin, servesMax: fullServesMax },
    ],
  };
}

export const CATERING_PRODUCTS: CateringProduct[] = [
  // ==================== APPETIZERS ====================
  {
    id: 'mini-tacos',
    title: 'Mini Tacos',
    description: 'Choice of beef, chicken, or cheese. Bite-sized tacos perfect for any gathering.',
    image: '/images/menu/mini-tacos.jpg',
    categories: ['appetizers'],
    pricing: panPricing(30, 60, 24, 24, 48, 48),
    tags: ['appetizer', 'popular', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'cheese', label: 'Cheese' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'mini-flautas',
    title: 'Mini Flautas',
    description: 'Choice of beef or chicken. Crispy rolled tortillas filled with seasoned meat.',
    image: '/images/menu/mini-flautas.jpg',
    categories: ['appetizers'],
    pricing: panPricing(39, 66, 24, 24, 48, 48),
    tags: ['appetizer', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'jalapeno-poppers',
    title: 'Jalape\u00f1o Poppers',
    description: 'Choice of cheddar or cream cheese. Stuffed jalape\u00f1os with a crispy coating.',
    image: '/images/menu/jalapeno-poppers.jpg',
    categories: ['appetizers'],
    pricing: panPricing(41, 69, 24, 24, 48, 48),
    tags: ['appetizer', 'spicy', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'cheddar', label: 'Cheddar' },
        { id: 'cream-cheese', label: 'Cream Cheese' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'mexican-buffalo-wings',
    title: 'Mexican Buffalo Wings',
    description: 'Choice of blue cheese or ranch dipping sauce. Wings with a Mexican-inspired buffalo kick.',
    image: '/images/menu/mexican-buffalo-wings.jpg',
    categories: ['appetizers'],
    pricing: panPricing(45, 90, 24, 24, 48, 48),
    tags: ['appetizer', 'spicy', 'popular', 'mexican'],
    variants: {
      label: 'Dipping Sauce',
      options: [
        { id: 'blue-cheese', label: 'Blue Cheese' },
        { id: 'ranch', label: 'Ranch' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'taco-salad',
    title: 'Taco Salad',
    description: 'Lettuce, shredded carrots, tomatoes, and green peppers. Choice of beef, chicken, or cheese served on the side.',
    image: '/images/menu/taco-salad.jpg',
    categories: ['appetizers'],
    pricing: panPricing(39, 60, 10, 15, 20, 30),
    tags: ['appetizer', 'salad', 'healthy', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'cheese', label: 'Cheese' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'chips-medium',
    title: 'Chips - Medium Bag',
    description: 'Fresh tortilla chips, medium bag. Perfect for dipping with salsa or guacamole.',
    image: '/images/menu/chips-medium.jpg',
    categories: ['appetizers'],
    pricing: { type: 'per-each' as const, priceEach: 5.25 },
    tags: ['appetizer', 'chips', 'mexican'],
  },
  {
    id: 'chips-large',
    title: 'Chips - Large Bag',
    description: 'Fresh tortilla chips, large bag. Great for medium-sized parties.',
    image: '/images/menu/chips-large.jpg',
    categories: ['appetizers'],
    pricing: { type: 'per-each' as const, priceEach: 7.25 },
    tags: ['appetizer', 'chips', 'mexican'],
  },
  {
    id: 'chips-xlarge',
    title: 'Chips - X-Large Bag',
    description: 'Fresh tortilla chips, extra-large bag. Ideal for large events and gatherings.',
    image: '/images/menu/chips-xlarge.jpg',
    categories: ['appetizers'],
    pricing: { type: 'per-each' as const, priceEach: 15.25 },
    tags: ['appetizer', 'chips', 'mexican'],
  },

  // ==================== ENTREES - TACO FILLING ====================
  {
    id: 'beef-taco-filling',
    title: 'Beef Taco Filling',
    description: 'Seasoned beef taco filling. Half pan makes about 30-35 tacos, full pan about 60-70 tacos. Includes 3 warm tortillas per taco.',
    image: '/images/menu/beef-taco-filling.jpg',
    categories: ['entrees'],
    pricing: panPricing(75, 140, 30, 35, 60, 70),
    tags: ['entree', 'beef', 'taco', 'taco-filling', 'popular', 'mexican'],
  },
  {
    id: 'chicken-taco-filling',
    title: 'Chicken Taco Filling',
    description: 'Seasoned chicken taco filling. Half pan makes about 30-35 tacos, full pan about 60-70 tacos. Includes 3 warm tortillas per taco.',
    image: '/images/menu/chicken-taco-filling.jpg',
    categories: ['entrees'],
    pricing: panPricing(75, 140, 30, 35, 60, 70),
    tags: ['entree', 'chicken', 'taco', 'taco-filling', 'popular', 'mexican'],
  },
  {
    id: 'pork-taco-filling',
    title: 'Pork Taco Filling',
    description: 'Seasoned pork taco filling. Half pan makes about 30-35 tacos, full pan about 60-70 tacos. Includes 3 warm tortillas per taco.',
    image: '/images/menu/pork-taco-filling.jpg',
    categories: ['entrees'],
    pricing: panPricing(75, 140, 30, 35, 60, 70),
    tags: ['entree', 'pork', 'taco', 'taco-filling', 'mexican'],
  },

  // ==================== ENTREES - FAJITAS ====================
  {
    id: 'chicken-fajitas',
    title: 'Chicken Fajitas',
    description: 'Grilled chicken fajitas with saut\u00e9ed peppers and onions. Half pan includes 30 tortillas plus 16oz sour cream, pico de gallo, and guacamole. Full pan includes 60 tortillas plus 32oz each. Choice of corn or flour tortillas.',
    image: '/images/menu/chicken-fajitas.jpg',
    categories: ['entrees'],
    pricing: panPricing(85, 125, 10, 15, 20, 30),
    tags: ['entree', 'chicken', 'fajita', 'popular', 'mexican'],
    variants: {
      label: 'Tortilla',
      options: [
        { id: 'corn', label: 'Corn' },
        { id: 'flour', label: 'Flour' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'steak-fajitas',
    title: 'Steak Fajitas',
    description: 'Grilled steak fajitas with saut\u00e9ed peppers and onions. Half pan includes 30 tortillas plus 16oz sour cream, pico de gallo, and guacamole. Full pan includes 60 tortillas plus 32oz each. Choice of corn or flour tortillas.',
    image: '/images/menu/steak-fajitas.jpg',
    categories: ['entrees'],
    pricing: panPricing(85, 125, 10, 15, 20, 30),
    tags: ['entree', 'beef', 'fajita', 'premium', 'mexican'],
    variants: {
      label: 'Tortilla',
      options: [
        { id: 'corn', label: 'Corn' },
        { id: 'flour', label: 'Flour' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'combo-fajitas',
    title: 'Combo Fajitas',
    description: 'A combination of grilled chicken and steak fajitas with saut\u00e9ed peppers and onions. Half pan includes 30 tortillas plus 16oz sour cream, pico de gallo, and guacamole. Full pan includes 60 tortillas plus 32oz each. Choice of corn or flour tortillas.',
    image: '/images/menu/combo-fajitas.jpg',
    categories: ['entrees'],
    pricing: panPricing(85, 125, 10, 15, 20, 30),
    tags: ['entree', 'combo', 'fajita', 'popular', 'mexican'],
    variants: {
      label: 'Tortilla',
      options: [
        { id: 'corn', label: 'Corn' },
        { id: 'flour', label: 'Flour' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'vegetable-fajitas',
    title: 'Vegetable Fajitas',
    description: 'Grilled vegetable fajitas with saut\u00e9ed peppers and onions. Half pan includes 30 tortillas plus 16oz sour cream, pico de gallo, and guacamole. Full pan includes 60 tortillas plus 32oz each. Choice of corn or flour tortillas.',
    image: '/images/menu/vegetable-fajitas.jpg',
    categories: ['entrees'],
    pricing: panPricing(85, 125, 10, 15, 20, 30),
    tags: ['entree', 'vegetarian', 'fajita', 'mexican'],
    variants: {
      label: 'Tortilla',
      options: [
        { id: 'corn', label: 'Corn' },
        { id: 'flour', label: 'Flour' },
      ],
      selectionMode: 'single',
    },
  },

  // ==================== ENTREES - CARNITAS ====================
  {
    id: 'carnitas-regular',
    title: 'Carnitas Regular',
    description: 'Slow-cooked, tender pork carnitas. Includes 2 dozen tortillas per half pan.',
    image: '/images/menu/carnitas-regular.jpg',
    categories: ['entrees'],
    pricing: panPricing(70, 140, 8, 12, 18, 25),
    tags: ['entree', 'pork', 'carnitas', 'popular', 'mexican'],
  },
  {
    id: 'carnitas-mild-salsa',
    title: 'Carnitas with Mild Salsa',
    description: 'Slow-cooked, tender pork carnitas topped with mild salsa. Includes 2 dozen tortillas per half pan.',
    image: '/images/menu/carnitas-mild.jpg',
    categories: ['entrees'],
    pricing: panPricing(70, 110, 8, 12, 18, 25),
    tags: ['entree', 'pork', 'carnitas', 'mexican'],
  },
  {
    id: 'carnitas-hot-green-salsa',
    title: 'Carnitas with Hot Green Salsa',
    description: 'Slow-cooked, tender pork carnitas topped with hot green salsa. Includes 2 dozen tortillas per half pan.',
    image: '/images/menu/carnitas-hot.jpg',
    categories: ['entrees'],
    pricing: panPricing(70, 110, 8, 12, 18, 25),
    tags: ['entree', 'pork', 'carnitas', 'spicy', 'mexican'],
  },

  // ==================== ENTREES - A LA CART ====================
  {
    id: 'tamales',
    title: 'Tamales',
    description: 'Choice of chicken or pork. Traditional Mexican tamales wrapped in corn husks. 20 pieces per half pan.',
    image: '/images/menu/tamales.jpg',
    categories: ['entrees'],
    pricing: panPricing(35, 70, 10, 15, 20, 30),
    tags: ['entree', 'tamale', 'traditional', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'chicken', label: 'Chicken' },
        { id: 'pork', label: 'Pork' },
      ],
      selectionMode: 'single',
    },
  },
  {
    id: 'enchiladas',
    title: 'Enchiladas',
    description: 'Traditional enchiladas with choice of filling and sauce. 20 pieces per half pan.',
    image: '/images/menu/enchiladas.jpg',
    categories: ['entrees'],
    pricing: panPricing(40, 70, 10, 15, 20, 30),
    tags: ['entree', 'enchilada', 'popular', 'mexican'],
  },

  // ==================== ENTREES - TACO TRAYS ====================
  {
    id: 'taco-tray-25',
    title: 'Taco Tray - 25 Tacos',
    description: 'Tray of 25 tacos with choice of beef, chicken, or pork filling. Ready to serve.',
    image: '/images/menu/taco-tray-25.jpg',
    categories: ['entrees'],
    pricing: { type: 'per-each' as const, priceEach: 75 },
    tags: ['entree', 'taco', 'taco-tray', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'pork', label: 'Pork' },
      ],
      selectionMode: 'split',
      splitTotal: 25,
    },
  },
  {
    id: 'taco-tray-50',
    title: 'Taco Tray - 50 Tacos',
    description: 'Tray of 50 tacos with choice of beef, chicken, or pork filling. Ready to serve.',
    image: '/images/menu/taco-tray-50.jpg',
    categories: ['entrees'],
    pricing: { type: 'per-each' as const, priceEach: 140 },
    tags: ['entree', 'taco', 'taco-tray', 'popular', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'pork', label: 'Pork' },
      ],
      selectionMode: 'split',
      splitTotal: 50,
    },
  },
  {
    id: 'taco-tray-75',
    title: 'Taco Tray - 75 Tacos',
    description: 'Tray of 75 tacos with choice of beef, chicken, or pork filling. Ready to serve.',
    image: '/images/menu/taco-tray-75.jpg',
    categories: ['entrees'],
    pricing: { type: 'per-each' as const, priceEach: 200 },
    tags: ['entree', 'taco', 'taco-tray', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'pork', label: 'Pork' },
      ],
      selectionMode: 'split',
      splitTotal: 75,
    },
  },
  {
    id: 'taco-tray-100',
    title: 'Taco Tray - 100 Tacos',
    description: 'Tray of 100 tacos with choice of beef, chicken, or pork filling. Ready to serve. Best value for large events.',
    image: '/images/menu/taco-tray-100.jpg',
    categories: ['entrees'],
    pricing: { type: 'per-each' as const, priceEach: 250 },
    tags: ['entree', 'taco', 'taco-tray', 'popular', 'mexican'],
    variants: {
      label: 'Filling',
      options: [
        { id: 'beef', label: 'Beef' },
        { id: 'chicken', label: 'Chicken' },
        { id: 'pork', label: 'Pork' },
      ],
      selectionMode: 'split',
      splitTotal: 100,
    },
  },

  // ==================== SIDES ====================
  {
    id: 'spanish-rice',
    title: 'Spanish Rice',
    description: 'Traditional Spanish rice seasoned with tomatoes, onions, and spices.',
    image: '/images/menu/spanish-rice.jpg',
    categories: ['sides'],
    pricing: panPricing(30, 50, 15, 20, 30, 35),
    tags: ['side', 'rice', 'popular', 'vegetarian', 'mexican'],
  },
  {
    id: 'refried-beans',
    title: 'Refried Beans',
    description: 'Creamy refried beans prepared in the traditional Mexican style.',
    image: '/images/menu/refried-beans.jpg',
    categories: ['sides'],
    pricing: panPricing(30, 50, 15, 20, 30, 35),
    tags: ['side', 'beans', 'popular', 'vegetarian', 'mexican'],
  },

  // ==================== SIDES - TOPPINGS/EXTRAS ====================
  {
    id: 'topping-cheese',
    title: 'Cheese (per lb)',
    description: 'Shredded cheese, sold per pound. Perfect topping for tacos, fajitas, and more.',
    image: '/images/menu/cheese.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 12 },
    tags: ['side', 'topping', 'mexican'],
  },
  {
    id: 'topping-lettuce',
    title: 'Lettuce (small)',
    description: 'Shredded lettuce, small container. A fresh topping for any Mexican dish.',
    image: '/images/menu/lettuce.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 12 },
    tags: ['side', 'topping', 'vegetarian', 'mexican'],
  },
  {
    id: 'topping-tomato-slices',
    title: 'Tomato Slices (small)',
    description: 'Fresh tomato slices, small container.',
    image: '/images/menu/tomato-slices.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 12 },
    tags: ['side', 'topping', 'vegetarian', 'mexican'],
  },
  {
    id: 'topping-jalapeno-carrots',
    title: 'Jalape\u00f1o & Carrots (pint)',
    description: 'Pickled jalape\u00f1os and carrots, one pint. Adds a spicy kick to any dish.',
    image: '/images/menu/jalapeno-carrots.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 9 },
    tags: ['side', 'topping', 'spicy', 'mexican'],
  },
  {
    id: 'topping-pico-de-gallo',
    title: 'Pico de Gallo (pint)',
    description: 'Fresh pico de gallo made with diced tomatoes, onions, cilantro, and lime juice. One pint.',
    image: '/images/menu/pico-de-gallo.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 9 },
    tags: ['side', 'topping', 'fresh', 'mexican'],
  },
  {
    id: 'topping-sour-cream',
    title: 'Sour Cream (16 oz)',
    description: 'Sour cream topping, 16 oz container. A cool complement to spicy dishes.',
    image: '/images/menu/sour-cream.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 9 },
    tags: ['side', 'topping', 'mexican'],
  },
  {
    id: 'topping-guacamole-chips',
    title: 'Guacamole w/ Chips (pint)',
    description: 'Fresh guacamole served with tortilla chips. One pint, serves 6-10 people.',
    image: '/images/menu/guacamole-chips.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 9.75 },
    tags: ['side', 'topping', 'popular', 'mexican'],
  },
  {
    id: 'topping-house-salsa',
    title: 'House Salsa (liter)',
    description: 'Pepe\'s signature house salsa, one liter. A must-have for chips and more.',
    image: '/images/menu/house-salsa.jpg',
    categories: ['sides'],
    pricing: { type: 'per-each' as const, priceEach: 9.75 },
    tags: ['side', 'topping', 'popular', 'mexican'],
  },

  // ==================== SIDES - DESSERTS ====================
  {
    id: 'bunuelos',
    title: 'Bu\u00f1uelos',
    description: 'Traditional Mexican fried dough dusted with cinnamon and sugar. Available in 30-piece or 60-piece trays.',
    image: '/images/menu/bunuelos.jpg',
    categories: ['sides'],
    pricing: panPricing(18, 35, 15, 20, 30, 40),
    tags: ['side', 'dessert', 'traditional', 'mexican'],
  },
  {
    id: 'mini-churros',
    title: 'Mini Churros',
    description: 'Crispy mini churros available in Bavarian Cream, Strawberry, or Plain. 24 pieces per half pan, 48 pieces per full pan.',
    image: '/images/menu/mini-churros.jpg',
    categories: ['sides'],
    pricing: panPricing(25, 45, 12, 18, 24, 36),
    tags: ['side', 'dessert', 'popular', 'mexican'],
    variants: {
      label: 'Flavor',
      options: [
        { id: 'bavarian-cream', label: 'Bavarian Cream' },
        { id: 'strawberry', label: 'Strawberry' },
        { id: 'plain', label: 'Plain' },
      ],
      selectionMode: 'single',
    },
  },
];

// Get products by event type
export function getProductsByEventType(eventType: string | null): CateringProduct[] {
  if (!eventType) return CATERING_PRODUCTS;
  return CATERING_PRODUCTS.filter(product => product.categories.includes(eventType as any));
}

// Get product by ID
export function getProductById(id: string): CateringProduct | undefined {
  return CATERING_PRODUCTS.find(product => product.id === id);
}

// Get recommended products based on event type, budget, and what's already in the cart
export function getRecommendedProducts(
  eventType: string | null,
  cartItemIds: string[],
  budgetRange?: { min: number; max: number } | null,
  limit: number = 6,
): CateringProduct[] {
  let candidates = CATERING_PRODUCTS.filter(p => !cartItemIds.includes(p.id));

  // Filter by event type if set
  if (eventType) {
    candidates = candidates.filter(p => p.categories.includes(eventType as any));
  }

  // Exclude toppings and chips for recommendations (they are add-ons)
  candidates = candidates.filter(p =>
    !p.tags?.includes('topping') &&
    !p.tags?.includes('chips')
  );

  // Prioritize popular items
  candidates.sort((a, b) => {
    const aPopular = a.tags?.includes('popular') ? 1 : 0;
    const bPopular = b.tags?.includes('popular') ? 1 : 0;
    return bPopular - aPopular;
  });

  return candidates.slice(0, limit);
}

// Build a suggested menu for a given event type and headcount
export function getSuggestedMenu(
  eventType: string | null,
  headcount: number,
  budgetRange?: { min: number; max: number } | null,
): CateringProduct[] {
  const category = eventType || 'entrees';
  const available = CATERING_PRODUCTS.filter(p =>
    p.categories.includes(category as any) &&
    !p.tags?.includes('topping') &&
    !p.tags?.includes('chips')
  );

  const pick = (tags: string[], count: number): CateringProduct[] => {
    const matches = available.filter(p => tags.some(t => p.tags?.includes(t)));
    return matches.slice(0, count);
  };

  const menu: CateringProduct[] = [];

  if (category === 'appetizers') {
    menu.push(...pick(['appetizer', 'popular'], 2));
    menu.push(...pick(['salad'], 1));
  } else if (category === 'entrees') {
    menu.push(...pick(['fajita', 'popular'], 1));
    menu.push(...pick(['taco', 'popular'], 1));
    menu.push(...pick(['carnitas'], 1));
  } else if (category === 'sides') {
    menu.push(...pick(['rice'], 1));
    menu.push(...pick(['beans'], 1));
    menu.push(...pick(['dessert', 'popular'], 1));
  }

  // Deduplicate
  const seen = new Set<string>();
  return menu.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
