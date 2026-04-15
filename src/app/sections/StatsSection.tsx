/**
 * Stats Section
 * 
 * Key metrics display with animated counters.
 */
'use client';

import { motion } from 'framer-motion';
import { Building2, Users, MapPin, Award } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'Properties Listed',
    description: 'Premium plots and properties',
  },
  {
    icon: Users,
    value: '200+',
    label: 'Happy Clients',
    description: 'Satisfied property buyers',
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Locations',
    description: 'Across the region',
  },
  {
    icon: Award,
    value: '10+',
    label: 'Years Experience',
    description: 'Trusted real estate expertise',
  },
];

export default function StatsSection() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="container-main">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: 'clamp(0.625rem, 2vw, 1rem)' }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="text-center"
              style={{
                padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.75rem, 2vw, 1.25rem)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="inline-flex items-center justify-center"
                style={{
                  width: 'clamp(36px, 6vw, 44px)',
                  height: 'clamp(36px, 6vw, 44px)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  marginBottom: '0.625rem',
                }}
              >
                <stat.icon size={18} />
              </div>
              <p
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 'clamp(0.6875rem, 1.5vw, 0.8125rem)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '2px',
                }}
              >
                {stat.label}
              </p>
              <p
                className="hidden sm:block"
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
