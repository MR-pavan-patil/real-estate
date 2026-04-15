/**
 * Textarea Component
 * 
 * Reusable textarea with label and error state.
 */
'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={textareaId} className="input-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'input-field min-h-[120px] resize-y',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
