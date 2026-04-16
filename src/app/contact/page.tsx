'use client';

import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/utils/constants';

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          city: '',
          message: `Email: ${formData.email}\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ fullName: '', phone: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = DEFAULT_SETTINGS.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = DEFAULT_SETTINGS.whatsapp.replace(/[^0-9]/g, '');

  const contactCards = [
    {
      icon: Phone,
      label: 'Phone Number',
      value: DEFAULT_SETTINGS.phone,
      color: 'var(--primary)',
      bgColor: 'var(--primary-surface)',
      href: `tel:${cleanPhone}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: DEFAULT_SETTINGS.whatsapp,
      color: '#25D366',
      bgColor: '#ECFDF5',
      href: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hi, I would like to get more information about your properties.')}`,
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: DEFAULT_SETTINGS.email,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      href: `mailto:${DEFAULT_SETTINGS.email}`,
    },
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>

      {/* Responsive CSS for grid layouts */}
      <style jsx>{`
        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .contact-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .contact-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 768px) {
          .contact-form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .contact-main-grid {
            grid-template-columns: 1fr 340px;
          }
        }
      `}</style>

      {/* ─── Hero Header ─── */}
      <section
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border)',
          padding: 'clamp(3rem, 7vw, 5rem) 1rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Get in <span style={{ color: 'var(--primary)' }}>Touch</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            Have a question about our properties or want to schedule a visit?
            Our team is ready to assist you with all your real estate needs.
          </p>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 3.5rem) 1rem 4rem',
        }}
      >

        {/* ─── Contact Info Cards ─── */}
        <div className="contact-cards-grid" style={{ marginBottom: '2.5rem' }}>
          {contactCards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target={card.label === 'WhatsApp' ? '_blank' : undefined}
              rel={card.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none',
                transition: 'box-shadow 0.3s, transform 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <card.icon size={24} style={{ color: card.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '2px',
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all',
                  }}
                >
                  {card.value}
                </p>
              </div>
              <ArrowRight
                size={18}
                style={{
                  color: 'var(--text-muted)',
                  marginLeft: 'auto',
                  flexShrink: 0,
                }}
              />
            </a>
          ))}
        </div>

        {/* ─── Form + Quick Actions Grid ─── */}
        <div className="contact-main-grid">

          {/* ─── Contact Form ─── */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '0.375rem',
              }}
            >
              Send us a Message
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.75rem',
                lineHeight: 1.6,
              }}
            >
              Fill out the form below and we&apos;ll respond within 24 hours.
            </p>

            {/* Success Toast */}
            {submitStatus === 'success' && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '14px 18px',
                  background: 'var(--success-bg)',
                  border: '1px solid #A7F3D0',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontSize: '0.875rem',
                  color: '#065F46',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '1px' }} />
                <span>Thank you! Your message has been sent successfully. We&apos;ll get back to you shortly.</span>
              </div>
            )}

            {/* Error Toast */}
            {submitStatus === 'error' && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '14px 18px',
                  background: 'var(--error-bg)',
                  border: '1px solid #FECACA',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontSize: '0.875rem',
                  color: '#991B1B',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: '1px' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Name + Phone */}
              <div className="contact-form-row" style={{ marginBottom: '1.25rem' }}>
                <div className="input-group">
                  <label htmlFor="contact-fullName" className="input-label">Full Name</label>
                  <input
                    type="text"
                    id="contact-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={isSubmitting}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-phone" className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="contact-email" className="input-label">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className="input-field"
                />
              </div>

              {/* Row 3: Message */}
              <div className="input-group" style={{ marginBottom: '1.75rem' }}>
                <label htmlFor="contact-message" className="input-label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  disabled={isSubmitting}
                  className="input-field"
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{
                  borderRadius: '9999px',
                  padding: '14px 32px',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #FFF', borderRadius: '50%' }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ─── Sidebar: Quick Actions ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Call Now */}
            <a
              href={`tel:${cleanPhone}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '18px 24px',
                background: 'var(--text-primary)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderRadius: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15,23,42,0.2)';
              }}
            >
              <Phone size={20} />
              Call Now
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hi, I would like to get more information about your properties.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '18px 24px',
                background: '#25D366',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderRadius: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37,211,102,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.25)';
              }}
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>

            {/* Extra Info Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                Quick Response
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  'We respond within 24 hours',
                  'Free consultation available',
                  'No obligations or hidden fees',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
