import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const VALID_STATUSES = ['pending', 'invoiced', 'paid', 'cancelled'];
const VALID_SORT_COLUMNS = ['created_at', 'order_number', 'customer_name', 'event_date', 'order_total', 'status'];

export async function GET(request: NextRequest) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'created_at';
    const dir = searchParams.get('dir') || 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    const sortColumn = VALID_SORT_COLUMNS.includes(sort) ? sort : 'created_at';

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    if (status !== 'all' && VALID_STATUSES.includes(status)) {
      query = query.eq('status', status);
    }

    if (search.trim()) {
      const s = `%${search.trim()}%`;
      query = query.or(`order_number.ilike.${s},customer_name.ilike.${s},customer_email.ilike.${s}`);
    }

    query = query
      .order(sortColumn, { ascending: dir === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: orders, count, error } = await query;

    if (error) {
      console.error('Failed to fetch orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Status counts for filter tabs
    const { data: allStatuses } = await supabase
      .from('orders')
      .select('status');

    const statusCounts: Record<string, number> = { all: 0, pending: 0, invoiced: 0, paid: 0, cancelled: 0 };
    if (allStatuses) {
      statusCounts.all = allStatuses.length;
      allStatuses.forEach((o) => {
        if (statusCounts[o.status] !== undefined) {
          statusCounts[o.status]++;
        }
      });
    }

    return NextResponse.json({
      orders: orders || [],
      totalCount: count || 0,
      page,
      limit,
      statusCounts,
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { requireAdminSession } = await import('@/lib/admin-auth');
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid request: id and valid status required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update order status:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
