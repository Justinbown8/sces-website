import { NextRequest, NextResponse } from 'next/server';

// Donation-funnel aliases. This runs before Next normalises trailing slashes, so
// it is the only reliable place to issue a real HTTP 308 for "/donate-now".
// Doing it in a page component produces a prerendered 200 with a client-side
// redirect payload that crawlers and link checkers cannot follow.
const DONATION_ALIASES: Record<string, string> = {
  '/donate-now': '/donate',
  '/donate-online': '/donate',
  '/donation': '/donate',
};

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const normalised = pathname.replace(/\/+$/, '') || '/';
  const target = DONATION_ALIASES[normalised];

  if (!target) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  url.search = search;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/donate-now/:path*', '/donate-online/:path*', '/donation/:path*'],
};
