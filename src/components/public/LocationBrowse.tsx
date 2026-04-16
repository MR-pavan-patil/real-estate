'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Map } from 'lucide-react';

interface LocationInfo {
  location: string;
  count: number;
}

interface LocationBrowseProps {
  locations: LocationInfo[];
}

export default function LocationBrowse({ locations }: LocationBrowseProps) {
  const searchParams = useSearchParams();
  const currentLocation = searchParams.get('location') || '';

  const search = searchParams.get('search');
  const property_type = searchParams.get('property_type');
  const status = searchParams.get('status');

  const buildUrl = (loc?: string) => {
    const sp = new URLSearchParams();
    if (search) sp.set('search', search);
    if (property_type) sp.set('property_type', property_type);
    if (status) sp.set('status', status);
    if (loc) sp.set('location', loc);
    return `/properties?${sp.toString()}`;
  };

  if (!locations || locations.length === 0) return null;

  const chipBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.875rem',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.25s ease',
  };

  const activeChip: React.CSSProperties = {
    ...chipBase,
    border: '1.5px solid var(--primary)',
    background: 'var(--primary)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
  };

  const inactiveChip: React.CSSProperties = {
    ...chipBase,
    border: '1.5px solid var(--border)',
    background: '#FFFFFF',
    color: 'var(--text-secondary)',
    boxShadow: 'var(--shadow-xs)',
  };

  return (
    <div style={{ marginBottom: '2.5rem', width: '100%' }}>
      <style jsx>{`
        .location-chips {
          display: flex;
          flex-wrap: nowrap;
          gap: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .location-chips::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 768px) {
          .location-chips {
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MapPin size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          }}
        >
          Explore by Location
        </h2>
      </div>

      <div className="location-chips">
        {/* All Locations Chip */}
        <Link
          href={buildUrl()}
          style={!currentLocation ? activeChip : inactiveChip}
        >
          <Map
            size={16}
            style={{
              color: !currentLocation ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)',
            }}
          />
          <span>All Bidar</span>
        </Link>

        {/* Dynamic Location Chips */}
        {locations.map((loc) => {
          const isActive = currentLocation === loc.location;
          return (
            <Link
              key={loc.location}
              href={buildUrl(loc.location)}
              style={isActive ? activeChip : inactiveChip}
            >
              <span>{loc.location}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 6px',
                  borderRadius: '7px',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  lineHeight: 1,
                }}
              >
                {loc.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
