import { EventTypeConfig } from './types';

export const EVENT_TYPES: EventTypeConfig[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Kick off your fiesta with our crowd-favorite starters',
    icon: '🌮',
    suggestedItems: ['mini tacos', 'flautas', 'poppers', 'wings', 'chips'],
  },
  {
    id: 'entrees',
    name: 'Main Dishes',
    description: 'Tacos, fajitas, carnitas, and more authentic favorites',
    icon: '🔥',
    suggestedItems: ['taco filling', 'fajitas', 'carnitas', 'tamales', 'enchiladas'],
  },
  {
    id: 'sides',
    name: 'Sides & More',
    description: 'Rice, beans, toppings, chips, and sweet desserts',
    icon: '🍚',
    suggestedItems: ['spanish rice', 'refried beans', 'guacamole', 'churros', 'buñuelos'],
  },
];

export function getEventTypeConfig(id: string): EventTypeConfig | undefined {
  return EVENT_TYPES.find((et) => et.id === id);
}

export function getEventTypeName(id: string): string {
  return getEventTypeConfig(id)?.name || id;
}
