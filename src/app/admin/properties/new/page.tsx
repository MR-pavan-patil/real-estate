/**
 * Add Property Page
 * 
 * Create a new property listing with full form and image upload.
 */
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PropertyForm from '@/components/admin/PropertyForm';

export default function AddPropertyPage() {
  return (
    <div style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem)', maxWidth: '880px' }}>
      {/* Header */}
      <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin/properties"
          className="flex items-center justify-center transition-colors"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'white',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Add New Property
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Fill in the details to create a new listing
          </p>
        </div>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
