/**
 * Featured Properties Grid
 * 
 * 3-column responsive grid displaying featured properties.
 * Extracts image thumbnail appropriately from relations.
 */
'use client';

import { motion } from 'framer-motion';
import { MapPin, Maximize2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionWrapper } from '@/components/ui';
import { formatPrice, formatArea, getStatusInfo, getPropertyTypeLabel } from '@/utils/helpers';
import type { PropertyWithImages } from '@/types';

// Fallback image if a property somehow has none mapped
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0, 0, 0.2, 1] as const } },
};

export default function FeaturedGrid({
  properties
}: {
  properties: PropertyWithImages[];
}) {
  return (
    <SectionWrapper
      id="featured-properties"
      title="Featured Properties"
      subtitle="Handpicked premium properties that match your aspirations"
      alternate
    >
      {properties.length === 0 ? (
        <div className="text-center" style={{ padding: 'clamp(2rem, 5vw, 4rem) 1rem', color: 'var(--text-muted)' }}>
          <p>No featured properties available at the moment.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(0.875rem, 2vw, 1.25rem)' }}
        >
          {properties.map((property) => {
            const statusInfo = getStatusInfo(property.status);
            // Grab the primary cover image, fallback to placeholder
            const coverImage = property.property_images?.[0]?.image_url || FALLBACK_IMAGE;

            return (
              <motion.div key={property.id} variants={cardVariants}>
                <Link href={`/properties/${property.slug}`} className="block group">
                  <div
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <img
                        src={coverImage}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Price Badge */}
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
                      {/* Status Badge */}
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
                      {/* Type Label */}
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

                      {/* Title */}
                      <h3
                        className="group-hover:text-blue-600 transition-colors"
                        style={{
                          fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
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

                      {/* Location & Area */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          <span
                            className="truncate"
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {property.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Maximize2 size={13} style={{ color: 'var(--text-muted)' }} />
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {formatArea(property.area_sqft)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* View All CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="text-center"
        style={{ marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}
      >
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all"
          style={{
            padding: '12px 28px',
            fontSize: '0.875rem',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-full)',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--primary)';
          }}
        >
          View All Properties
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}
