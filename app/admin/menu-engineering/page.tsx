import { getCateringProducts, getDineInMenu } from '@/lib/menu-data';
import MenuManagement from './MenuEngineeringClient';

export const dynamic = 'force-dynamic';

export default async function MenuEngineeringPage() {
  const [products, dineInMenu] = await Promise.all([
    getCateringProducts(),
    getDineInMenu(),
  ]);

  return <MenuManagement initialProducts={products} initialDineInMenu={dineInMenu} />;
}
