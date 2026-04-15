/**
 * CTA Section
 * 
 * Contact call-to-action with action buttons.
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mx-auto"
          style={{
            maxWidth: '640px',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem)',
            background: 'var(--text-primary)',
            borderRadius: 'var(--radius-2xl)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
            }}
          >
            Ready to Find Your Property?
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: 'clamp(1.25rem, 3vw, 2rem)',
            }}
          >
            Get in touch with us today and let our experts help you find the
            perfect property for your needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: '0.75rem' }}>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 font-semibold transition-all w-full sm:w-auto"
              style={{
                padding: '10px 22px',
                fontSize: '0.875rem',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3B82F6';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={15} />
              Enquire Now
              <ArrowRight size={13} />
            </Link>
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 font-semibold transition-all w-full sm:w-auto"
              style={{
                padding: '10px 22px',
                fontSize: '0.875rem',
                background: 'transparent',
                color: '#CBD5E1',
                border: '1.5px solid #334155',
                borderRadius: 'var(--radius-lg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#64748B';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.color = '#CBD5E1';
              }}
            >
              <Phone size={15} />
              Call Us Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
