/**
 * PropertyForm Component
 * 
 * Shared form for creating and editing properties.
 * Handles validation, slug generation, amenity selection,
 * and image upload via ImageUploader.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/utils/helpers';
import { PROPERTY_TYPES, PROPERTY_STATUSES, AMENITIES } from '@/utils/constants';
import ImageUploader, { type UploadedImage } from './ImageUploader';
import type { PropertyWithImages } from '@/types';

interface PropertyFormProps {
  /** Pass existing property for edit mode */
  initialData?: PropertyWithImages;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [landmark, setLandmark] = useState(initialData?.landmark || '');
  const [areaSqft, setAreaSqft] = useState(initialData?.area_sqft?.toString() || '');
  const [propertyType, setPropertyType] = useState(initialData?.property_type || 'plot');
  const [status, setStatus] = useState(initialData?.status || 'available');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [mapLink, setMapLink] = useState(initialData?.map_link || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );
  const [extraDetails, setExtraDetails] = useState<Record<string, any>>(
    initialData?.extra_details || {}
  );

  // Images
  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.property_images?.map((img) => ({
      url: img.image_url,
      public_id: img.id,
    })) || []
  );

  // Auto-generate slug from title (only in create mode)
  useEffect(() => {
    if (mode === 'create' && title) {
      setSlug(generateSlug(title));
    }
  }, [title, mode]);

  const updateExtraDetail = (key: string, value: any) => {
    setExtraDetails((prev) => ({ ...prev, [key]: value }));
  };

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    if (!price || Number(price) <= 0) { setError('Valid price is required.'); return; }
    if (!location.trim()) { setError('Location is required.'); return; }
    if (!areaSqft || Number(areaSqft) <= 0) { setError('Valid area is required.'); return; }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: Number(price),
      location: location.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      area_sqft: Number(areaSqft),
      property_type: propertyType,
      status,
      featured,
      amenities: selectedAmenities,
      map_link: mapLink.trim() || null,
      extra_details: extraDetails,
      images: images.map((img, idx) => ({ url: img.url, display_order: idx })),
    };

    try {
      const url =
        mode === 'create'
          ? '/api/properties'
          : `/api/properties/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save property');
      }

      setSuccess(mode === 'create' ? 'Property created successfully!' : 'Property updated successfully!');
      if (mode === 'create') {
        setTimeout(() => router.push('/admin/properties'), 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.875rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600 as const,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Messages */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            background: 'var(--error-bg)',
            color: 'var(--error)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          {success}
        </div>
      )}

      {/* Basic Details Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Basic Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
          {/* Title */}
          <div>
            <label style={labelStyle} htmlFor="prop-title">Title *</label>
            <input
              id="prop-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Premium Corner Plot"
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle} htmlFor="prop-slug">Slug *</label>
            <input
              id="prop-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              required
              style={{ ...inputStyle, color: 'var(--text-secondary)' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle} htmlFor="prop-price">Price (₹) *</label>
            <input
              id="prop-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 4500000"
              required
              min="0"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Area */}
          <div>
            <label style={labelStyle} htmlFor="prop-area">Area (sq.ft) *</label>
            <input
              id="prop-area"
              type="number"
              value={areaSqft}
              onChange={(e) => setAreaSqft(e.target.value)}
              placeholder="e.g. 2400"
              required
              min="0"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Property Type */}
          <div>
            <label style={labelStyle} htmlFor="prop-type">Property Type *</label>
            <select
              id="prop-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle} htmlFor="prop-status">Status *</label>
            <select
              id="prop-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle} htmlFor="prop-desc">Description</label>
          <textarea
            id="prop-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Property details, features, specifications..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '100px' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            style={{
              width: '40px',
              height: '22px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              background: featured ? 'var(--primary)' : 'var(--border)',
              transition: 'background 0.2s ease',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: featured ? '20px' : '2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          </button>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Featured Property
          </span>
        </div>
      </div>

      {/* Location Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label style={labelStyle} htmlFor="prop-location">Location *</label>
            <input
              id="prop-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Whitefield, Bangalore"
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="prop-address">Address</label>
            <input
              id="prop-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="prop-landmark">Landmark</label>
            <input
              id="prop-landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="prop-map">Google Map Link</label>
            <input
              id="prop-map"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="https://maps.google.com/..."
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
        </div>
      </div>

      {/* Amenities Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Amenities
        </h3>

        <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
          {AMENITIES.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Specific Details Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Property Specific Details
        </h3>
        
        {propertyType === 'plot' && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Facing Direction</label>
              <input value={extraDetails.facing_direction || ''} onChange={(e) => updateExtraDetail('facing_direction', e.target.value)} placeholder="e.g. East" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Road Width</label>
              <input value={extraDetails.road_width || ''} onChange={(e) => updateExtraDetail('road_width', e.target.value)} placeholder="e.g. 40 ft" style={inputStyle} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="plot-corner" checked={extraDetails.corner_plot || false} onChange={(e) => updateExtraDetail('corner_plot', e.target.checked)} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="plot-corner" className="cursor-pointer mb-0" style={{ ...labelStyle, marginBottom: 0 }}>Corner Plot</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="plot-wall" checked={extraDetails.boundary_wall || false} onChange={(e) => updateExtraDetail('boundary_wall', e.target.checked)} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="plot-wall" className="cursor-pointer mb-0" style={{ ...labelStyle, marginBottom: 0 }}>Boundary Wall</label>
            </div>
          </div>
        )}

        {['house', 'villa', 'apartment'].includes(propertyType) && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label style={labelStyle}>BHK</label>
              <input value={extraDetails.bhk || ''} onChange={(e) => updateExtraDetail('bhk', e.target.value)} placeholder="e.g. 3" type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <input value={extraDetails.bathrooms || ''} onChange={(e) => updateExtraDetail('bathrooms', e.target.value)} placeholder="e.g. 2" type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Parking</label>
              <input value={extraDetails.parking || ''} onChange={(e) => updateExtraDetail('parking', e.target.value)} placeholder="e.g. 1 Covered" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Furnishing</label>
              <input value={extraDetails.furnishing || ''} onChange={(e) => updateExtraDetail('furnishing', e.target.value)} placeholder="e.g. Semi-Furnished" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Floors</label>
              <input value={extraDetails.floors || ''} onChange={(e) => updateExtraDetail('floors', e.target.value)} placeholder="e.g. 2" type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Property Age</label>
              <input value={extraDetails.property_age || ''} onChange={(e) => updateExtraDetail('property_age', e.target.value)} placeholder="e.g. 5 Years" style={inputStyle} />
            </div>
          </div>
        )}

        {propertyType === 'farmland' && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
             <div>
              <label style={labelStyle}>Trees Count</label>
              <input value={extraDetails.trees_count || ''} onChange={(e) => updateExtraDetail('trees_count', e.target.value)} placeholder="e.g. 150" type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tree Types</label>
              <input value={extraDetails.tree_types || ''} onChange={(e) => updateExtraDetail('tree_types', e.target.value)} placeholder="e.g. Mango, Teak" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Water Source</label>
              <input value={extraDetails.water_source || ''} onChange={(e) => updateExtraDetail('water_source', e.target.value)} placeholder="e.g. Canal" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fencing</label>
              <input value={extraDetails.fencing || ''} onChange={(e) => updateExtraDetail('fencing', e.target.value)} placeholder="e.g. Wire Fencing" style={inputStyle} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="farm-borewell" checked={extraDetails.borewell || false} onChange={(e) => updateExtraDetail('borewell', e.target.checked)} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="farm-borewell" className="cursor-pointer mb-0" style={{ ...labelStyle, marginBottom: 0 }}>Borewell Present</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="farm-electricity" checked={extraDetails.electricity || false} onChange={(e) => updateExtraDetail('electricity', e.target.checked)} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="farm-electricity" className="cursor-pointer mb-0" style={{ ...labelStyle, marginBottom: 0 }}>Electricity Present</label>
            </div>
          </div>
        )}

        {propertyType === 'commercial' && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Floor Number</label>
              <input value={extraDetails.floor_number || ''} onChange={(e) => updateExtraDetail('floor_number', e.target.value)} placeholder="e.g. 2nd Floor" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Parking</label>
              <input value={extraDetails.parking || ''} onChange={(e) => updateExtraDetail('parking', e.target.value)} placeholder="e.g. Shared / 5 slots" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Washrooms</label>
              <input value={extraDetails.washrooms || ''} onChange={(e) => updateExtraDetail('washrooms', e.target.value)} placeholder="e.g. 2" type="number" style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      {/* Images Card */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Property Images
        </h3>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3" style={{ marginTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 font-semibold transition-all"
          style={{
            padding: '10px 24px',
            fontSize: '0.875rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
          }}
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
