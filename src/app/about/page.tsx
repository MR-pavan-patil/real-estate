import type { Metadata } from 'next';
import { CheckCircle2, Users, Trophy, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_SETTINGS } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'About Us | Estate Reserve',
  description: 'Learn more about Estate Reserve, your trusted real estate partner.',
};

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>

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
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
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
            Building Trust Through{' '}
            <span style={{ color: 'var(--primary)' }}>Transparency</span>
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
            {DEFAULT_SETTINGS.about_text} We are dedicated to providing
            premium real estate solutions that empower you to make the best
            property decisions.
          </p>
        </div>
      </section>

      {/* ─── Content Wrapper ─── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 3.5rem) 1rem 4rem',
        }}
      >
        {/* ─── Core Values ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {[
            {
              Icon: ShieldCheck,
              title: 'Trusted Expertise',
              desc: 'Years of experience in identifying premium market opportunities and securing them for our clients securely.',
            },
            {
              Icon: Target,
              title: 'Client-Centric',
              desc: 'Your requirements are our priority. We hand-pick properties that align with your lifestyle and financial goals.',
            },
            {
              Icon: Trophy,
              title: 'Exceptional Value',
              desc: 'From initial consultation to final paperwork, we ensure you receive unmatched value and seamless service.',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'var(--primary-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <item.Icon size={26} style={{ color: 'var(--primary)' }} />
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Our Vision ─── */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            marginBottom: '3.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0',
            }}
            className="md:!grid-cols-2"
          >
            {/* Text Side */}
            <div
              style={{
                padding: 'clamp(2rem, 4vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                Our Vision
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '0.75rem',
                }}
              >
                At Estate Reserve, we believe that finding the perfect plot
                or property shouldn&apos;t be a stressful endeavor. It should be an
                exciting journey backed by solid data and complete
                transparency.
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                Our team consists of industry veterans who have overseen
                hundreds of successful transactions. We filter out the noise
                and present you with only the finest real estate options.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  '100% verified authentic listings',
                  'End-to-end legal support and paperwork',
                  'Transparent pricing without hidden fees',
                  'Dedicated post-sale property assistance',
                ].map((point, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: 'var(--success)', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Side */}
            <div
              style={{
                position: 'relative',
                minHeight: '340px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
                alt="Modern real estate"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Trusted by Over
                  </p>
                  <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    200+ Clients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div
          style={{
            borderRadius: '24px',
            padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 60%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '1rem',
                lineHeight: 1.25,
              }}
            >
              Ready to Find Your Next Property?
            </h2>
            <p
              style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '2rem',
                lineHeight: 1.7,
              }}
            >
              Get in touch with our experts today and start your journey
              towards securing the perfect real estate investment.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 32px',
                  background: '#FFFFFF',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
              >
                Contact Us Now
              </Link>
              <Link
                href="/properties"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 32px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
