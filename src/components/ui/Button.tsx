/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 * Supports Framer Motion animations.
 */
'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/helpers';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const MotionButton = motion.create('button');
    return (
      <MotionButton
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'btn',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'btn-disabled',
          className
        )}
        disabled={disabled || isLoading}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading && (
          <svg
            className="btn-spinner"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="45"
            />
          </svg>
        )}
        {!isLoading && icon && <span className="btn-icon">{icon}</span>}
        <span>{children}</span>
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
