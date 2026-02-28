import { NextResponse } from 'next/server';

/**
 * Guard for admin API routes.
 * Auth is currently disabled for development – always returns authorized.
 */
export async function requireAdminSession() {
  // TODO: Re-enable auth when NextAuth / Google OAuth is configured.
  return { authorized: true as const, session: { user: { email: 'dev@localhost' } } };
}
