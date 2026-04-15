/**
 * Select Component
 *
 * Reusable select dropdown with label and error state.
 */
'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={selectId} className="input-label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'input-field appearance-none',
            error && 'input-error',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="input-error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
