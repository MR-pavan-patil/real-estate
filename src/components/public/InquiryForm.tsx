/**
 * InquiryForm
 * 
 * Public client component for users to send inquiries about properties.
 * Optionally takes a predefined property_id.
 */
'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

interface InquiryFormProps {
  propertyId?: string;
  defaultMessage?: string;
}

export default function InquiryForm({ propertyId, defaultMessage = '' }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: defaultMessage,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit inquiry.');
      }

      setSuccess(true);
      setFormData({ name: '', phone: '', city: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem)',
          background: 'var(--success-bg)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <div
          className="flex items-center justify-center mb-4"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--success)',
            color: 'white',
          }}
        >
          <CheckCircle size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
          Inquiry Sent!
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#065F46', lineHeight: 1.5 }}>
          Thank you for reaching out. Our team will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 font-semibold"
          style={{
            padding: '8px 16px',
            fontSize: '0.8125rem',
            background: 'white',
            color: 'var(--success)',
            border: '1px solid currentColor',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
          }}
        >
          Send Another
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.875rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'white',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--bg-secondary)',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
        Request Information
      </h3>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1.25rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          placeholder="John Doe"
        />
      </div>

      {/* Phone + City: stack on very small, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" style={{ marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div>
          <label style={labelStyle}>City *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            placeholder="Bangalore"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Message</label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          placeholder="I am interested in this property..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full transition-colors"
        style={{
          padding: '12px',
          background: 'var(--primary)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.8 : 1,
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1E40AF')}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--primary)')}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Inquiry
          </>
        )}
      </button>
    </form>
  );
}
