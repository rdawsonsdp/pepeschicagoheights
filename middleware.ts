import { NextResponse } from 'next/server';

// Auth middleware disabled for now – admin is open access during development.
// To re-enable, replace this with the withAuth middleware from next-auth.

export function middleware() {
  return NextResponse.next();
}

// Only match admin routes so the rest of the app is unaffected.
export const config = {
  matcher: ['/admin/((?!login).*)', '/api/admin/:path*'],
};
