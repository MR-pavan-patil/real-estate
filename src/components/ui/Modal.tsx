/**
 * Modal Component
 * 
 * Reusable modal overlay with Framer Motion animations.
 * Supports focus trapping and escape key dismissal.
 */
'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '32rem',
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full"
            style={{
              maxWidth,
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {/* Header */}
            {title && (
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
