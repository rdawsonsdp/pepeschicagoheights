import { NextRequest, NextResponse } from 'next/server';
import { getEmailSettings, setEmailSettings } from '@/lib/email-settings';

export async function GET() {
  const settings = await getEmailSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { requireAdminSession } = await import('@/lib/admin-auth');
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    await setEmailSettings(body);
    const updated = await getEmailSettings();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
