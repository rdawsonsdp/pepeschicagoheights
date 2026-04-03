import { getCateringProducts } from '@/lib/menu-data';
import ProductsPageClient from './ProductsPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getCateringProducts();
  return <ProductsPageClient products={products} />;
}
