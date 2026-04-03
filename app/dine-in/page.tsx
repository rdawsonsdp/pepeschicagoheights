import { getDineInMenu, getDineInFoodSections, getDineInDrinkSections, getDineInPromos } from '@/lib/menu-data';
import DineInPageClient from './DineInPageClient';

export const dynamic = 'force-dynamic';

export default async function DineInMenuPage() {
  const [menu, foodSections, drinkSections, promos] = await Promise.all([
    getDineInMenu(),
    getDineInFoodSections(),
    getDineInDrinkSections(),
    getDineInPromos(),
  ]);

  return (
    <DineInPageClient
      menu={menu}
      foodSections={foodSections}
      drinkSections={drinkSections}
      promos={promos}
    />
  );
}
