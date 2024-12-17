import { NextRequest, NextResponse } from 'next/server';
import { availableLanguages } from 'lib/locale/locale';

function getLocale() {
  // Bruker default nb dersom locale ikke er satt
  return 'nb';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = availableLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale();
  request.nextUrl.pathname = `${locale}/${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next).*)',
  ],
};
