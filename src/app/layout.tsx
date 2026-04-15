/**
 * Root Layout — Estate Reserve
 * 
 * Global layout with Inter font, metadata, and
 * shared Navbar/Footer components.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar, Footer, MobileBottomNav } from '@/components/layout';
import WhatsAppWidget from '@/components/public/WhatsAppWidget';
import './globals.css';
import './components.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Estate Reserve — Premium Real Estate & Plots',
    template: '%s | Estate Reserve',
  },
  description:
    'Find your dream property with Estate Reserve. Premium plots, houses, villas, and commercial spaces with complete transparency and trust.',
  keywords: [
    'real estate',
    'property',
    'plots',
    'houses',
    'villas',
    'land',
    'buy property',
    'property listing',
  ],
  authors: [{ name: 'Estate Reserve' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Estate Reserve',
    title: 'Estate Reserve — Premium Real Estate & Plots',
    description:
      'Find your dream property with Estate Reserve. Premium plots, houses, and commercial spaces.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileBottomNav />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
