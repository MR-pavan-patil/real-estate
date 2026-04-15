/**
 * About Section
 * 
 * Brief company intro with value propositions.
 */
'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, Handshake } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description:
      'Every property is legally verified and documented for your complete peace of mind.',
  },
  {
    icon: Clock,
    title: 'Hassle-Free Process',
    description:
      'From site visit to registration, we handle everything so you don\'t have to.',
  },
  {
    icon: Handshake,
    title: 'Transparent Pricing',
    description:
      'No hidden charges, no middlemen. What you see is exactly what you pay.',
  },
];

export default function AboutSection() {
  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}>
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--primary)',
                marginBottom: '0.75rem',
                display: 'inline-block',
              }}
            >
              About Us
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.375rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Your Trusted Partner in{' '}
              <span style={{ color: 'var(--primary)' }}>Real Estate</span>
            </h2>
            <p
              style={{
                fontSize: 'clamp(0.875rem, 1.8vw, 0.9375rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                marginBottom: 'clamp(1.25rem, 3vw, 2rem)',
              }}
            >
              With over a decade of experience in the real estate industry, we
              have helped hundreds of families find their dream properties. Our
              commitment to transparency, legal verification, and customer
              satisfaction sets us apart.
            </p>

            {/* Value Props */}
            <div className="flex flex-col" style={{ gap: '1.25rem' }}>
              {values.map((item) => (
                <div key={item.title} className="flex items-start" style={{ gap: '0.875rem' }}>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                    }}
                  >
                    <item.icon size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '2px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.8125rem)',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--border)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Real estate professional"
                className="w-full object-cover"
                style={{ height: 'clamp(240px, 40vw, 380px)' }}
              />
            </div>
            {/* Floating stat card */}
            <div
              className="absolute"
              style={{
                bottom: 'clamp(0.5rem, 2vw, 1rem)',
                left: 'clamp(0.5rem, 2vw, 1rem)',
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.875rem, 2vw, 1.25rem)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.375rem)',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                10+ Years
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                of Trusted Service
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
