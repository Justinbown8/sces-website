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
  const preview = normalised === '/demo/literacy-rate-in-india' || normalised.startsWith('/demo/literacy-rate-in-india/');

  // Reject drafts before rendering: streamed notFound() responses can otherwise be HTTP 200.
  if (preview && (process.env.NODE_ENV !== 'development' || !['localhost', '127.0.0.1', '[::1]'].includes(request.nextUrl.hostname))) {
    return new NextResponse(null, {
      status: 404,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex,noimageindex' },
    });
  }

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
  matcher: [
    '/donate-now/:path*', '/donate-online/:path*', '/donation/:path*',
    '/demo/literacy-rate-in-india/:path*',
  ],
};
