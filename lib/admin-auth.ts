import { NextResponse } from 'next/server';

type AuthResult =
  | { authorized: true; session: { user: { email: string } } }
  | { authorized: false; response: NextResponse };

/**
 * Guard for admin API routes.
 * Auth is currently disabled for development – always returns authorized.
 */
export async function requireAdminSession(): Promise<AuthResult> {
  // TODO: Re-enable auth when NextAuth / Google OAuth is configured.
  return { authorized: true, session: { user: { email: 'dev@localhost' } } };
}
