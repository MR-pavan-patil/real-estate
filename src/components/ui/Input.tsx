/**
 * Input Component
 * 
 * Reusable form input with label, error state,
 * and consistent styling from the design system.
 */
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-field',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && <p className="input-error-text">{error}</p>}
        {helperText && !error && (
          <p className="input-helper-text">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
