/**
 * Property Filters (Client Component)
 * 
 * Interacts with Next.js URL Search Params to update filters
 * for the property grid without full page reloads.
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/utils/constants';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('property_type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  // Update URL function
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) params.set('search', search); else params.delete('search');
    if (type) params.set('property_type', type); else params.delete('property_type');
    if (status) params.set('status', status); else params.delete('status');
    
    // reset to page 1 on filter change
    params.delete('page');

    router.push(`/properties?${params.toString()}`);
  }, [search, type, status, router, searchParams]);

  // Handle form submission (for search input)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const hasActiveFilters = !!searchParams.toString() && searchParams.toString() !== 'page=1';

  return (
    <div
      style={{
        background: 'white',
        padding: 'clamp(0.875rem, 2vw, 1.25rem)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
      }}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
        {/* Search */}
        <div className="w-full">
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Search
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                fontSize: '0.875rem',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="w-full">
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              fontSize: '0.875rem',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="w-full">
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              fontSize: '0.875rem',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            {PROPERTY_STATUSES.map((ps) => (
              <option key={ps.value} value={ps.value}>
                {ps.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply/Reset Buttons */}
        <div className="flex gap-2 w-full">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 flex-1"
            style={{
              padding: '9px 16px',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Filter size={15} /> Apply
          </button>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => router.push('/properties')}
              className="flex items-center justify-center transition-colors"
              title="Clear filters"
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--error-bg)',
                color: 'var(--error)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
