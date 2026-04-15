/**
 * Property Gallery (Client Component)
 * 
 * Renders the main cover image, and a grid of thumbnails below it.
 * Clicking a thumbnail changes the main image.
 */
'use client';

import { useState } from 'react';
import type { PropertyImage } from '@/types';

interface PropertyGalleryProps {
  images: PropertyImage[];
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
  const startingImage = sortedImages.length > 0 ? sortedImages[0].image_url : FALLBACK_IMAGE;

  const [activeImage, setActiveImage] = useState(startingImage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Main Feature Image */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}
      >
        <img
          src={activeImage}
          alt="Property View"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Thumbnail Grid */}
      {sortedImages.length > 1 && (
        <div
          className="flex overflow-x-auto pb-2"
          style={{
            gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {sortedImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className="flex-shrink-0 relative overflow-hidden transition-all"
              style={{
                width: 'clamp(64px, 12vw, 100px)',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-md)',
                border: activeImage === img.image_url ? '2px solid var(--primary)' : '1px solid var(--border)',
                opacity: activeImage === img.image_url ? 1 : 0.6,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <img
                src={img.image_url}
                alt="Thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
