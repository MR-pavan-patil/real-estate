/**
 * Delete Confirmation Modal
 * 
 * Premium modal that appears when admin clicks delete.
 * Offers three options:
 * 1. Download Backup & Delete — exports full property JSON then deletes
 * 2. Delete Without Backup — immediate permanent delete
 * 3. Cancel
 * 
 * Maintains existing permanent deletion + Cloudinary cleanup logic.
 */
'use client';

import { useState } from 'react';
import {
  X,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  FileJson,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatArea, getPropertyTypeLabel, formatDate } from '@/utils/helpers';

interface PropertyForBackup {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  address: string;
  landmark: string;
  area_sqft: number;
  property_type: string;
  status: string;
  featured: boolean;
  amenities: string[];
  map_link: string | null;
  extra_details: any;
  created_at: string;
  updated_at: string;
  property_images: { image_url: string; display_order: number }[];
}

interface DeleteConfirmModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export default function DeleteConfirmModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [step, setStep] = useState<'confirm' | 'deleting' | 'downloading'>('confirm');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function fetchFullProperty(): Promise<PropertyForBackup | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(image_url, display_order)')
      .eq('id', propertyId)
      .single();

    if (error || !data) return null;
    return data as PropertyForBackup;
  }

  function generateBackupJSON(property: PropertyForBackup): string {
    const backup = {
      _backup_metadata: {
        exported_at: new Date().toISOString(),
        source: 'Estate Reserve Admin',
        version: '1.0',
      },
      property: {
        title: property.title,
        slug: property.slug,
        description: property.description,
        price: property.price,
        price_formatted: formatPrice(property.price),
        location: property.location,
        address: property.address,
        landmark: property.landmark,
        area_sqft: property.area_sqft,
        area_formatted: formatArea(property.area_sqft),
        property_type: property.property_type,
        property_type_label: getPropertyTypeLabel(property.property_type),
        status: property.status,
        featured: property.featured,
        amenities: property.amenities,
        map_link: property.map_link,
        extra_details: property.extra_details,
        created_at: property.created_at,
        created_date_formatted: formatDate(property.created_at),
        updated_at: property.updated_at,
        image_urls: property.property_images
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => img.image_url),
      },
    };
    return JSON.stringify(backup, null, 2);
  }

  function downloadJSON(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function performDelete() {
    const res = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to delete property.');
    }
  }

  async function handleBackupAndDelete() {
    setError(null);
    setStep('downloading');

    try {
      // 1. Fetch full property data
      const property = await fetchFullProperty();
      if (!property) {
        throw new Error('Could not fetch property data for backup.');
      }

      // 2. Generate and download backup
      const json = generateBackupJSON(property);
      const safeName = property.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      downloadJSON(json, `property-backup-${safeName}-${Date.now()}.json`);

      // 3. Small delay to ensure download starts
      await new Promise((r) => setTimeout(r, 500));

      // 4. Perform permanent delete
      setStep('deleting');
      await performDelete();

      onDeleted(propertyId);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStep('confirm');
    }
  }

  async function handleDeleteOnly() {
    setError(null);
    setStep('deleting');

    try {
      await performDelete();
      onDeleted(propertyId);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStep('confirm');
    }
  }

  function handleClose() {
    setStep('confirm');
    setError(null);
    onClose();
  }

  const isProcessing = step === 'deleting' || step === 'downloading';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={!isProcessing ? handleClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'modalFadeIn 0.2s ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            animation: 'modalScaleIn 0.25s ease-out',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--error-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} style={{ color: 'var(--error)' }} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Delete Property
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  This action is permanent
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={handleClose}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '0 1.5rem 1.25rem' }}>
            {/* Property name card */}
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                &ldquo;{propertyTitle}&rdquo;
              </p>
            </div>

            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              This property and all associated images will be{' '}
              <strong style={{ color: 'var(--error)', fontWeight: 600 }}>permanently deleted</strong>{' '}
              from the database and cloud storage. You may download a backup before proceeding.
            </p>

            {error && (
              <div
                style={{
                  padding: '0.625rem 0.875rem',
                  background: 'var(--error-bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.8125rem',
                  color: 'var(--error)',
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Processing State */}
            {isProcessing ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1.5rem 0',
                }}
              >
                <Loader2
                  size={28}
                  className="animate-spin"
                  style={{ color: step === 'downloading' ? 'var(--primary)' : 'var(--error)' }}
                />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {step === 'downloading' ? 'Preparing backup...' : 'Deleting property...'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {step === 'downloading'
                      ? 'Generating JSON backup file'
                      : 'Removing property and cleaning up storage'}
                  </p>
                </div>
              </div>
            ) : (
              /* Action Buttons */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Download & Delete */}
                <button
                  onClick={handleBackupAndDelete}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Download size={15} />
                  Download Backup & Delete
                </button>

                {/* Delete Only */}
                <button
                  onClick={handleDeleteOnly}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Trash2 size={15} />
                  Delete Without Backup
                </button>

                {/* Cancel */}
                <button
                  onClick={handleClose}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {!isProcessing && (
            <div
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FileJson size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Backup includes all property details, images URLs, and metadata as JSON
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal animations */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
