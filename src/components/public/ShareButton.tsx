/**
 * ShareButton Component
 * 
 * Reusable share button for property cards and detail pages.
 * Supports:
 * - Native Web Share API (mobile/supported browsers)
 * - WhatsApp share
 * - Copy to clipboard
 * 
 * Renders as a compact icon button on cards, 
 * or as a full button on detail pages.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, MessageCircle, Link2, Check, X } from 'lucide-react';

interface ShareButtonProps {
  /** Property title for share message */
  propertyTitle: string;
  /** Property slug for URL construction */
  propertySlug: string;
  /** Price string for share message */
  propertyPrice?: string;
  /** Variant: 'icon' for cards, 'button' for detail page */
  variant?: 'icon' | 'button';
}

export default function ShareButton({
  propertyTitle,
  propertySlug,
  propertyPrice,
  variant = 'icon',
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Build the property URL
  function getPropertyUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/properties/${propertySlug}`;
    }
    return `/properties/${propertySlug}`;
  }

  function getShareText(): string {
    const parts = [`Check out this property: ${propertyTitle}`];
    if (propertyPrice) parts.push(`Price: ${propertyPrice}`);
    parts.push(getPropertyUrl());
    return parts.join('\n');
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: propertyTitle,
        text: propertyPrice
          ? `${propertyTitle} - ${propertyPrice}`
          : propertyTitle,
        url: getPropertyUrl(),
      });
    } catch {
      // User cancelled or API not supported — fallback to menu
    }
    setShowMenu(false);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    setShowMenu(false);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getPropertyUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getPropertyUrl();
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 1500);
    }
  }

  function handleShareClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // If native share is supported on mobile, use it directly
    if (typeof navigator !== 'undefined' && (navigator as any).share && /Mobi|Android/i.test(navigator.userAgent)) {
      handleNativeShare();
      return;
    }

    setShowMenu(!showMenu);
  }

  const menuItems = [
    ...(typeof navigator !== 'undefined' && (navigator as any).share
      ? [
          {
            icon: Share2,
            label: 'Share via...',
            onClick: handleNativeShare,
            color: 'var(--primary)',
            bgColor: 'var(--primary-surface)',
          },
        ]
      : []),
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      onClick: handleWhatsApp,
      color: '#25D366',
      bgColor: '#ECFDF5',
    },
    {
      icon: copied ? Check : Link2,
      label: copied ? 'Link Copied!' : 'Copy Link',
      onClick: handleCopyLink,
      color: copied ? 'var(--success)' : 'var(--text-secondary)',
      bgColor: copied ? 'var(--success-bg)' : 'var(--bg-tertiary)',
    },
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleShareClick}
        title="Share property"
        aria-label="Share property"
        style={
          variant === 'icon'
            ? {
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'white',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
              }
            : {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.125rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border)',
                background: 'white',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }
        }
      >
        <Share2 size={variant === 'icon' ? 14 : 15} />
        {variant === 'button' && <span>Share</span>}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: variant === 'icon' ? 'calc(100% + 6px)' : 'calc(100% + 8px)',
            right: 0,
            width: '200px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            padding: '6px',
            zIndex: 100,
            animation: 'shareMenuIn 0.15s ease-out',
          }}
        >
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: item.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <item.icon size={14} style={{ color: item.color }} />
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Menu animation */}
      <style jsx global>{`
        @keyframes shareMenuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
