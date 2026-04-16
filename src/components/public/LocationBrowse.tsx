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

  // Get current search params to preserve other filters when clicking
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

  return (
    <div className="mb-10 w-full">
      <div className="flex items-center gap-3 mb-5 tracking-tight">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <MapPin size={16} className="text-[var(--primary)]" />
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          Explore by Location
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {/* All Locations Chip */}
        <Link
          href={buildUrl()}
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
            !currentLocation
              ? 'bg-gradient-to-r from-[var(--primary)] to-blue-700 text-white shadow-lg shadow-blue-500/25 -translate-y-0.5'
              : 'bg-white text-slate-600 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 hover:text-blue-600'
          }`}
        >
          <Map size={18} className={!currentLocation ? 'text-white/90' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
          <span>All Bidar</span>
        </Link>

        {/* Dynamic Location Chips */}
        {locations.map(loc => {
          const isActive = currentLocation === loc.location;
          return (
            <Link
              key={loc.location}
              href={buildUrl(loc.location)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--primary)] to-blue-700 text-white shadow-lg shadow-blue-500/25 -translate-y-0.5'
                  : 'bg-white text-slate-600 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 hover:text-blue-600'
              }`}
            >
              <span>{loc.location}</span>
              <span 
                className={`flex items-center justify-center min-w-[24px] h-[24px] px-1.5 rounded-full text-xs font-black transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-inner' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                }`}
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
