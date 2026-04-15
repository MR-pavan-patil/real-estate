/**
 * SectionWrapper Component
 * 
 * Consistent section layout wrapper with
 * optional heading, subtitle, and alternate background.
 */
import { type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  alternate?: boolean;
}

export default function SectionWrapper({
  children,
  className,
  id,
  title,
  subtitle,
  alternate = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn('section-padding', alternate && 'section-alt', className)}
    >
      <div className="container-main">
        {(title || subtitle) && (
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            {title && (
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.025em',
                  marginBottom: subtitle ? '0.5rem' : '0',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
