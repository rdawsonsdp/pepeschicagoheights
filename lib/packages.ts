import { CateringPackage, EventType } from './types';

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'taco-party',
    title: 'Pepe\'s Taco Party',
    description: '$9.95 per person — 2 tacos per person. Includes choice of beef, chicken or pork. Chips & salsa, fried beans, Spanish rice, lettuce, tomatoes, Mexican cheese with choice of corn or flour tortillas.',
    pricePerPerson: 9.95,
    image: '/images/menu/placeholder.svg',
    items: [
      '2 Tacos per person (beef, chicken, or pork)',
      'Chips & Salsa',
      'Fried Beans',
      'Spanish Rice',
      'Lettuce, Tomatoes & Mexican Cheese',
      'Choice of Corn or Flour Tortillas',
    ],
    categories: ['entrees'],
    minHeadcount: 10,
  },
  {
    id: 'fajita-party',
    title: 'Pepe\'s Fajita Party',
    description: '$13.99 per person — 2 fajitas per person. Includes choice of steak or chicken with sautéed Spanish onions, tomatoes & bell peppers. Chips & salsa, fried beans, Spanish rice, and choice of corn or flour tortillas.',
    pricePerPerson: 13.99,
    image: '/images/menu/placeholder.svg',
    items: [
      '2 Fajitas per person (steak or chicken)',
      'Sautéed Spanish Onions, Tomatoes & Bell Peppers',
      'Chips & Salsa',
      'Fried Beans',
      'Spanish Rice',
      'Choice of Corn or Flour Tortillas',
    ],
    categories: ['entrees'],
    minHeadcount: 10,
  },
];

export function getPackagesByEventType(eventType: EventType): CateringPackage[] {
  return CATERING_PACKAGES.filter((pkg) => pkg.categories.includes(eventType));
}

export function getPackagesByBudget(
  packages: CateringPackage[],
  minBudget: number,
  maxBudget: number
): CateringPackage[] {
  return packages.filter(
    (pkg) => pkg.pricePerPerson >= minBudget && pkg.pricePerPerson <= maxBudget
  );
}
