/**
 * Badge Component
 * 
 * Small label badge for status indicators and tags.
 */
import { cn } from '@/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  success: { bg: 'var(--success-bg)', color: 'var(--success)' },
  warning: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
  error: { bg: 'var(--error-bg)', color: 'var(--error)' },
  info: { bg: 'var(--info-bg)', color: 'var(--info)' },
};

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const style = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: 'var(--radius-full)',
        letterSpacing: '0.025em',
      }}
    >
      {children}
    </span>
  );
}
