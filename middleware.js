import { NextResponse } from 'next/server';
import { COOKIE_NAME, verifyToken } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/admin');
  const isPublic = pathname === '/admin/login' || pathname === '/api/admin/login';
  if (isPublic) return NextResponse.next();

  const session = await verifyToken(request.cookies.get(COOKIE_NAME)?.value);
  if (session) return NextResponse.next();

  if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
