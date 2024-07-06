import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const userId = req.cookies.get('userid');

  if (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/register'
  ) {
    if (userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
