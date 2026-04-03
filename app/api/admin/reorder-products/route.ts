import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const { order }: { order: string[] } = await request.json();
    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid order array' }, { status: 400 });
    }

    // Update sort_order for each product
    const updates = order.map((id, index) =>
      supabase
        .from('catering_products')
        .update({ sort_order: index + 1 })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);

    if (errors.length > 0) {
      console.error('Some reorder updates failed:', errors.map(e => e.error));
    }

    return NextResponse.json({ success: true, reorderedCount: order.length - errors.length });
  } catch (error) {
    console.error('Failed to reorder products:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
