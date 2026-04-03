import { NextRequest, NextResponse } from 'next/server';
import { getBusinessRules, setBusinessRules } from '@/lib/settings';

// GET -- admin only, returns business rules
export async function GET() {
  const { requireAdminSession } = await import('@/lib/admin-auth');
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const rules = await getBusinessRules();
    return NextResponse.json({ rules });
  } catch {
    return NextResponse.json({ rules: [] });
  }
}

// PUT -- admin only, update business rules
export async function PUT(request: NextRequest) {
  const { requireAdminSession } = await import('@/lib/admin-auth');
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { rules } = body;

    if (!Array.isArray(rules)) {
      return NextResponse.json({ error: 'rules must be an array' }, { status: 400 });
    }

    await setBusinessRules(rules);
    return NextResponse.json({ success: true, rules });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update rules' },
      { status: 500 }
    );
  }
}
