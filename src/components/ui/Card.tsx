/**
 * Card Component
 * 
 * Reusable card container with hover animations.
 * Used for property cards, stat cards, and content sections.
 */
'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-card-hover)' } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'card',
        paddingStyles[padding],
        hover && 'cursor-pointer',
        className
      )}
      style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
      }}
    >
      {children}
    </motion.div>
  );
}
