/**
 * ImageUploader Component
 * 
 * Drag-and-drop multi-image upload component.
 * Uploads to /api/upload → Cloudinary.
 * Shows upload progress, preview thumbnails, and delete.
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';

export interface UploadedImage {
  url: string;
  public_id: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  folder = 'estate-reserve/properties',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        return { url: data.url, public_id: data.public_id };
      } catch (err) {
        console.error('Upload error:', err);
        return null;
      }
    },
    [folder]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      setError('');
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images allowed.`);
        return;
      }

      const validFiles = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remaining);

      if (validFiles.length === 0) {
        setError('No valid image files selected.');
        return;
      }

      setUploading(true);
      const results = await Promise.all(validFiles.map(uploadFile));
      const successfulUploads = results.filter(Boolean) as UploadedImage[];

      if (successfulUploads.length < validFiles.length) {
        setError(`${validFiles.length - successfulUploads.length} image(s) failed to upload.`);
      }

      onChange([...images, ...successfulUploads]);
      setUploading(false);
    },
    [images, maxImages, onChange, uploadFile]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
        style={{
          padding: '2rem 1rem',
          border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-xl)',
          background: dragActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
          transition: 'all 0.2s ease',
        }}
      >
        {uploading ? (
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
        ) : (
          <ImagePlus size={28} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
        )}
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          JPEG, PNG, WebP — Max 10MB each · {images.length}/{maxImages} uploaded
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
          style={{ gap: '0.75rem', marginTop: '1rem' }}
        >
          {images.map((img, idx) => (
            <div
              key={img.public_id || idx}
              className="relative group"
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <img
                src={img.url}
                alt={`Upload ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute flex items-center justify-center transition-opacity"
                style={{
                  top: '4px',
                  right: '4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <span
                  className="absolute"
                  style={{
                    bottom: '4px',
                    left: '4px',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary)',
                    color: 'white',
                  }}
                >
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
