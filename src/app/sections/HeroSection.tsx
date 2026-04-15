/**
 * Hero Section
 * 
 * Full-width hero with headline, subtitle, and search interface.
 * Uses Framer Motion for entrance animations.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Building } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (location.trim()) {
      params.set('search', location.trim());
    }
    if (propertyType) {
      params.set('property_type', propertyType);
    }
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: 'min(88vh, 680px)',
        background: '#FFFFFF',
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37, 99, 235, 0.04) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: 'clamp(2rem, 5vw, 3rem)',
          paddingBottom: 'clamp(2rem, 6vw, 4rem)',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: '9999px',
                marginBottom: '1.25rem',
              }}
            >
              <Building size={12} strokeWidth={2.5} />
              Trusted Real Estate Partner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              marginBottom: '1rem',
              maxWidth: '700px',
            }}
          >
            Find Your Dream{' '}
            <span style={{ color: 'var(--primary)' }}>Property</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: 1.7,
            }}
          >
            Premium plots and properties with complete transparency and
            trust. Your journey to the perfect property starts here.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            style={{
              width: '100%',
              maxWidth: '680px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
              padding: '6px',
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Location Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, padding: '0 14px', minWidth: 0 }}>
                <MapPin size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Location or area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    padding: '14px 0',
                    lineHeight: '1.5',
                    minWidth: 0,
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '24px', background: 'var(--border)', flexShrink: 0 }} />

              {/* Property Type Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, padding: '0 14px', minWidth: 0 }}>
                <Building size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: propertyType ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    padding: '14px 0',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    lineHeight: '1.5',
                    minWidth: 0,
                  }}
                >
                  <option value="" disabled>Property Type</option>
                  <option value="plot">Plot</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="farmland">Farm Land</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  margin: '2px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Search size={16} strokeWidth={2.5} />
                <span>Search</span>
              </button>
            </form>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
              marginTop: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            {[
              { value: '500+', label: 'Properties' },
              { value: '200+', label: 'Happy Clients' },
              { value: '50+', label: 'Locations' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {i > 0 && (
                  <div style={{ width: '1px', height: '28px', background: 'var(--border)', marginLeft: '-16px', marginRight: '-4px' }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '3px',
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
      </div>
    </section>
  );
}
