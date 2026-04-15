/**
 * Public Properties Listing Page
 * 
 * Fetches all active properties matching URL search parameter filters.
 * Uses the FeaturedGrid card layout style for consistency.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProperties } from '@/services/properties';
import PropertyFilters from '@/components/public/PropertyFilters';
import { MapPin, Maximize2 } from 'lucide-react';
import { formatPrice, formatArea, getStatusInfo, getPropertyTypeLabel } from '@/utils/helpers';
import type { PropertyType, PropertyStatus } from '@/types';

export const metadata: Metadata = {
  title: 'All Properties | Estate Reserve',
  description: 'Browse our complete catalog of premium real estate properties.',
};

export const revalidate = 60; // SSR with 60 sec ISR

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    property_type?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const page = params.page ? parseInt(params.page) : 1;
  const property_type = params.property_type as PropertyType | undefined;
  const status = params.status as PropertyStatus | undefined;
  const search = params.search;

  const { data: properties, totalPages } = await getProperties(
    { property_type, status, search },
    page,
    12
  );

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100" style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
        <div className="container-main">
          <h1 className="text-slate-900" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Find Your Property
          </h1>
          <p className="text-slate-500" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', maxWidth: '600px', fontWeight: 500 }}>
            Browse through our curated list of exclusive properties. Use filters to narrow down your search.
          </p>
        </div>
      </div>

      <div className="container-main" style={{ padding: 'clamp(1.25rem, 4vw, 3rem) var(--container-padding)' }}>
        {/* Filters Top Bar */}
        <PropertyFilters />

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center" style={{ padding: 'clamp(3rem, 8vw, 6rem) 1rem', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>No properties match your exact filters.</p>
            <Link 
              href="/properties" 
              className="inline-block mt-4" 
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
              {properties.map((property) => {
                const statusInfo = getStatusInfo(property.status);
                const coverImage = property.property_images?.[0]?.image_url || FALLBACK_IMAGE;

                return (
                  <Link key={property.id} href={`/properties/${property.slug}`} className="block group">
                    <div
                      className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                      style={{
                        borderRadius: 'var(--radius-xl)',
                        background: 'white',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <img
                          src={coverImage}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          className="absolute top-3 left-3 text-xs font-bold"
                          style={{
                            padding: '5px 10px',
                            background: 'rgba(0, 0, 0, 0.72)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {formatPrice(property.price)}
                        </div>
                        <div
                          className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest antialiased flex items-center justify-center shadow-sm"
                          style={{
                            padding: '4px 10px',
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            borderRadius: 'var(--radius-full)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {statusInfo.label}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px)' }}>
                        <p
                          className="inline-flex items-center justify-center px-2.5 py-1 mb-2 antialiased"
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--primary)',
                            background: 'var(--primary-surface)',
                            borderRadius: '4px',
                          }}
                        >
                          {getPropertyTypeLabel(property.property_type)}
                        </p>
                        <h3
                          className="group-hover:text-blue-600 transition-colors"
                          style={{
                            fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '10px',
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {property.title}
                        </h3>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 truncate min-w-0">
                            <MapPin size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <span className="truncate" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              {property.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Maximize2 size={13} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              {formatArea(property.area_sqft)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2" style={{ marginTop: 'clamp(1.5rem, 4vw, 3rem)' }}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isActive = pNum === page;
                  // Build query params for paginator
                  const tempParams = new URLSearchParams();
                  if (search) tempParams.set('search', search);
                  if (property_type) tempParams.set('property_type', property_type);
                  if (status) tempParams.set('status', status);
                  tempParams.set('page', pNum.toString());

                  return (
                    <Link
                      key={pNum}
                      href={`/properties?${tempParams.toString()}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: isActive ? 'var(--primary)' : 'white',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        border: isActive ? 'none' : '1.5px solid var(--border)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {pNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
