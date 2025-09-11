/**
 * Google Analytics component for Next.js
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView, GA_MEASUREMENT_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Initialize GA on first load
    initGA();
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Track page views on route changes
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  // Don't render anything in development or if no measurement ID
  if (process.env.NODE_ENV === 'development' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag script */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}