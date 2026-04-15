/**
 * Property Details Page
 * 
 * Shows full property details fetched by slug.
 * Includes image gallery, amenities, and inquiry form.
 */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPropertyBySlug } from '@/services/properties';
import { SectionWrapper } from '@/components/ui';
import PropertyGallery from '@/components/public/PropertyGallery';
import InquiryForm from '@/components/public/InquiryForm';
import { formatPrice, formatArea, getStatusInfo, getPropertyTypeLabel } from '@/utils/helpers';
import { MapPin, Maximize2, Tag, Check, Calendar, Map } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) return { title: 'Property Not Found' };

  return {
    title: `${property.title} | Estate Reserve`,
    description: property.description.substring(0, 160) + '...',
    openGraph: {
      images: property.property_images?.[0]?.image_url ? [property.property_images[0].image_url] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const statusInfo = getStatusInfo(property.status);
  const images = property.property_images || [];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      {/* Property Header Bar */}
      <div className="bg-white border-b border-gray-200" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="container-main flex flex-col md:flex-row md:items-center justify-between" style={{ gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest rounded-full border border-blue-100 shadow-sm antialiased">
                {getPropertyTypeLabel(property.property_type)}
              </span>
              <span
                className="inline-flex items-center justify-center px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest rounded-full shadow-sm antialiased"
                style={{
                  backgroundColor: statusInfo.bgColor,
                  color: statusInfo.color,
                }}
              >
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-slate-900 leading-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium" style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)' }}>
              <MapPin size={18} className="text-blue-500 flex-shrink-0" />
              <span className="break-words">{property.location}</span>
            </div>
          </div>
          
          <div className="flex-shrink-0 md:text-right flex flex-col justify-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1.5">
              Asking Price
            </p>
            <p className="text-primary font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>

      <SectionWrapper id="property-details" alternate={false}>
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'clamp(1.5rem, 3vw, 2rem)' }}>
          
          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 flex flex-col" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
            
            {/* Gallery */}
            <PropertyGallery images={images} />

            {/* Quick Summary Grid */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
              style={{
                padding: 'clamp(1rem, 2vw, 1.5rem)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div className="flex flex-col gap-1 text-center md:text-left">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Area</p>
                <div className="flex items-center justify-center md:justify-start gap-2 font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)' }}>
                  <Maximize2 size={14} className="text-gray-400 flex-shrink-0" />
                  {formatArea(property.area_sqft)}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center md:text-left">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Type</p>
                <div className="flex items-center justify-center md:justify-start gap-2 font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)' }}>
                  <Tag size={14} className="text-gray-400 flex-shrink-0" />
                  {getPropertyTypeLabel(property.property_type)}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center md:text-left">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Listed On</p>
                <div className="flex items-center justify-center md:justify-start gap-2 font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)' }}>
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{new Date(property.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center md:text-left">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Status</p>
                <div className="flex items-center justify-center md:justify-start gap-2 font-semibold capitalize" style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusInfo.color, flexShrink: 0 }} />
                  {property.status}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 style={{ fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Overview</h2>
              <div 
                style={{ fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
              >
                {property.description}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 style={{ fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="flex items-center justify-center flex-shrink-0" style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)', color: 'var(--text-secondary)' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exact Location & Map Info */}
            <div style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)', fontWeight: 700, color: 'var(--text-primary)' }}>Location Details</h3>
                  <p style={{ fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)', color: 'var(--text-secondary)', marginTop: '4px', wordBreak: 'break-word' }}>{property.address}</p>
                  {property.landmark && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <strong style={{ fontWeight: 600 }}>Landmark:</strong> {property.landmark}
                    </p>
                  )}
                </div>
                {property.map_link && (
                  <a 
                    href={property.map_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 text-center p-2 hover:bg-gray-50 transition-colors rounded-lg text-blue-600 flex-shrink-0"
                  >
                    <Map size={24} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>View Map</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Area (Right 1/3) */}
          <div className="lg:col-span-1">
            <div style={{ position: 'sticky', top: 'clamp(70px, 10vw, 100px)' }}>
              <InquiryForm 
                propertyId={property.id} 
                defaultMessage={`Hi, I'm interested in the property "${property.title}" listed at ${formatPrice(property.price)}. Please contact me with more information.`}
              />
              
              {/* Optional Sidebar Promo Widget */}
              <div 
                className="mt-6 text-center" 
                style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', background: '#F8FAFC', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)' }}
              >
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Need help finding the right property?<br/>
                  Call our experts at<br/>
                  <a href="tel:+919876543210" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginTop: '6px' }}>
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
}
