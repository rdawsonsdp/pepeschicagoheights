import { getCateringProducts } from '@/lib/menu-data';
import MenusPageClient from './MenusPageClient';

export const dynamic = 'force-dynamic';

export default async function MenusPage() {
  const products = await getCateringProducts();
  return <MenusPageClient products={products} />;
}
