/**
 * Edit Property Page
 * 
 * Fetches existing property data and pre-fills the form.
 */
'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PropertyForm from '@/components/admin/PropertyForm';
import type { PropertyWithImages } from '@/types';

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [property, setProperty] = useState<PropertyWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProperty() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .order('display_order', { referencedTable: 'property_images', ascending: true })
        .single();

      if (fetchError || !data) {
        setError('Property not found.');
      } else {
        setProperty(data as PropertyWithImages);
      }
      setLoading(false);
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: '4rem', color: 'var(--text-muted)' }}>
        <Loader2 size={20} className="animate-spin" style={{ marginRight: '8px' }} />
        Loading property...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{error || 'Property not found.'}</p>
        <Link href="/admin/properties" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
          ← Back to Properties
        </Link>
      </div>
    );
  }

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
            Edit Property
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {property.title}
          </p>
        </div>
      </div>

      <PropertyForm mode="edit" initialData={property} />
    </div>
  );
}
