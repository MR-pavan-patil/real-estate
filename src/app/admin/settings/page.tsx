/**
 * Admin Settings Page
 * 
 * Editable form for site-wide settings.
 * Includes logo upload via Cloudinary.
 */
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Loader2,
  Upload,
  Save,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const { data } = await supabase.from('settings').select('*').limit(1).single();
      if (data) setSettings(data as SiteSettings);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  function handleChange(field: keyof SiteSettings, value: string) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'estate-reserve/logos');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setSettings((prev) => prev ? { ...prev, logo_url: data.url } : prev);
    } catch {
      setError('Failed to upload logo.');
    }
    setUploadingLogo(false);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: '4rem', color: 'var(--text-muted)' }}>
        <Loader2 size={20} className="animate-spin" style={{ marginRight: '8px' }} />
        Loading settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center" style={{ padding: '4rem', color: 'var(--text-muted)' }}>
        No settings found. Please run the database migration first.
      </div>
    );
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
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: '740px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ marginBottom: '1.5rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Site Settings
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Configure your website content and contact information
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
          style={{
            padding: '8px 18px',
            fontSize: '0.8125rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', fontSize: '0.8125rem', background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', fontSize: '0.8125rem', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          {success}
        </div>
      )}

      {/* Logo Section */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Logo</h3>
        <div className="flex flex-wrap items-center gap-4">
          {settings.logo_url ? (
            <div className="relative" style={{ width: '80px', height: '80px' }}>
              <img
                src={settings.logo_url}
                alt="Site Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                }}
              />
              <button
                onClick={() => setSettings({ ...settings, logo_url: null })}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'var(--error)', color: 'white', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={10} />
              </button>
            </div>
          ) : null}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingLogo}
            className="flex items-center gap-2"
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              background: 'white',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {uploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
            }}
          />
        </div>
      </div>

      {/* General Settings */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>General</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Site Name</label>
            <input
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Office Address</label>
          <input
            value={settings.office_address}
            onChange={(e) => handleChange('office_address', e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>
      </div>

      {/* Homepage Content */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Homepage Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Hero Title</label>
            <input
              value={settings.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Hero Subtitle</label>
            <input
              value={settings.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>About Text</label>
          <textarea
            value={settings.about_text}
            onChange={(e) => handleChange('about_text', e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '100px' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>
      </div>
    </div>
  );
}
