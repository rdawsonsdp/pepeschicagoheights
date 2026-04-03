import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface NewProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  pricingType: 'pan' | 'per-each';
  halfPrice?: number;
  fullPrice?: number;
  halfServesMin?: number;
  halfServesMax?: number;
  fullServesMin?: number;
  fullServesMax?: number;
  priceEach?: number;
}

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const product: NewProduct = await request.json();

    // Check for duplicate ID
    const { data: existing } = await supabase
      .from('catering_products')
      .select('id')
      .eq('id', product.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${product.id}' already exists` },
        { status: 400 },
      );
    }

    // Get the max sort_order to append at end
    const { data: maxRow } = await supabase
      .from('catering_products')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxRow?.sort_order ?? 0) + 1;

    // Build pricing JSONB
    const pricing = product.pricingType === 'pan'
      ? {
          type: 'pan',
          sizes: [
            { size: 'half', price: product.halfPrice ?? 0, servesMin: product.halfServesMin ?? 10, servesMax: product.halfServesMax ?? 15 },
            { size: 'full', price: product.fullPrice ?? 0, servesMin: product.fullServesMin ?? 20, servesMax: product.fullServesMax ?? 30 },
          ],
        }
      : { type: 'per-each', priceEach: product.priceEach ?? 0 };

    const { error } = await supabase
      .from('catering_products')
      .insert({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image || '/images/menu/placeholder.jpg',
        categories: product.categories,
        tags: [],
        sort_order: nextOrder,
        pricing,
        classification: 'PLOWHORSE',
        visual_weight: 'medium',
        description_strategy: 'maintain',
      });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
