import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'pepes-admin';

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_AUTH_TOKEN;

  if (!cookie || !expected || cookie !== expected) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/((?!login).*)', '/api/admin/((?!auth).*)'],
};
