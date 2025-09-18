import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { siteConfig } from "@/config/site";
import PayPalWrapper from "@/components/payment/PayPalWrapper";
import { defaultMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/structured-data";
import PerformanceProvider from "@/components/providers/PerformanceProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PerformanceMonitor from "@/components/analytics/PerformanceMonitor";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#FFD700",
    "theme-color": "#FFD700",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationData = generateOrganizationStructuredData();
  const websiteData = generateWebsiteStructuredData();

  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        <StructuredData data={organizationData} />
        <StructuredData data={websiteData} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {/* Skip Links */}
        <div className="skip-links">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <a href="#main-navigation" className="skip-link">
            Skip to navigation
          </a>
        </div>
        
        <PerformanceProvider>
          <PayPalWrapper>
            <Header />
            <main 
              id="main-content" 
              className="flex-1 pt-16 lg:pt-20"
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
            <Footer />
          </PayPalWrapper>
          <Suspense fallback={null}>
            <PerformanceMonitor />
            <AnalyticsDashboard />
          </Suspense>
        </PerformanceProvider>
        
        {/* Screen reader live region for announcements */}
        <div 
          id="sr-live-region"
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
      </body>
    </html>
  );
}
