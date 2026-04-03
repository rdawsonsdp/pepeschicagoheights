import { getCateringProducts } from '@/lib/menu-data';
import AdminPageClient from './AdminPageClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await getCateringProducts();
  return <AdminPageClient products={products} />;
}
