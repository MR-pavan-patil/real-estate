/**
 * Homepage — Estate Reserve
 * 
 * Premium landing page with Hero, Featured Properties,
 * Stats, About, and Contact CTA sections.
 *
 * Design: Stitch MCP "Architectural Curatorship" system.
 */
import type { Metadata } from 'next';
import HeroSection from './sections/HeroSection';
import FeaturedGrid from './sections/FeaturedGrid';
import StatsSection from './sections/StatsSection';
import AboutSection from './sections/AboutSection';
import CTASection from './sections/CTASection';
import { getFeaturedProperties } from '@/services/properties';

export const metadata: Metadata = {
  title: 'Estate Reserve — Premium Real Estate & Plots',
  description:
    'Discover premium plots, houses, villas, and commercial properties. Trusted real estate services with complete transparency.',
};

// Revalidate the homepage every 60 seconds so new featured properties appear
export const revalidate = 60;

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties(6);

  return (
    <>
      <HeroSection />
      <FeaturedGrid properties={featuredProperties} />
      <StatsSection />
      <AboutSection />
      <CTASection />
    </>
  );
}
