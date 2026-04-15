'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';
import { NAV_LINKS, DEFAULT_SETTINGS } from '@/utils/constants';
export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ background: '#0F172A' }}>
      <div className="container-main">
        {/* Main Footer Content */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 'clamp(1.5rem, 4vw, 2.5rem)', paddingTop: 'clamp(2rem, 5vw, 3.5rem)', paddingBottom: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                }}
              >
                <Building2 size={16} color="white" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                Estate Reserve
              </span>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.7 }}>
              {DEFAULT_SETTINGS.about_text}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col" style={{ gap: '0.625rem' }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{ fontSize: '0.8125rem', color: '#64748B' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Property Types
            </h4>
            <ul className="flex flex-col" style={{ gap: '0.625rem' }}>
              {['Plots', 'Houses', 'Apartments', 'Villas', 'Commercial', 'Farm Land'].map(
                (type) => (
                  <li key={type}>
                    <Link
                      href={`/properties?type=${type.toLowerCase()}`}
                      className="transition-colors"
                      style={{ fontSize: '0.8125rem', color: '#64748B' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                    >
                      {type}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col" style={{ gap: '0.875rem' }}>
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                <span style={{ fontSize: '0.8125rem', color: '#64748B', wordBreak: 'break-all' }}>
                  {DEFAULT_SETTINGS.phone}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                <span style={{ fontSize: '0.8125rem', color: '#64748B', wordBreak: 'break-all' }}>
                  {DEFAULT_SETTINGS.email}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  {DEFAULT_SETTINGS.office_address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between"
          style={{
            padding: '1.25rem 0',
            borderTop: '1px solid #1E293B',
            gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'center' }}>
            © {currentYear} Estate Reserve. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors"
              style={{ fontSize: '0.75rem', color: '#475569' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors"
              style={{ fontSize: '0.75rem', color: '#475569' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
