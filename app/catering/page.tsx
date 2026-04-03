import { getCateringProducts } from '@/lib/menu-data';
import CateringPageClient from './CateringPageClient';

export const dynamic = 'force-dynamic';

export default async function CateringPage() {
  const products = await getCateringProducts();
  return <CateringPageClient products={products} />;
}
