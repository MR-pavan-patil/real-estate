'use client';

import { usePathname } from 'next/navigation';
import { DEFAULT_SETTINGS } from '@/utils/constants';

// Clean the number for WhatsApp URL (remove spaces, pluses, etc.)
// Provide fallback if there's an issue
const rawNumber = DEFAULT_SETTINGS.whatsapp || '';
const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

export default function WhatsAppWidget() {
  const pathname = usePathname();

  // Hide the floating widget on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Mobile Bottom Nav takes up 64px on mobile, plus safe-area-inset.
  // We offset the widget on mobile so it doesn't overlap.
  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 rounded-full transition-all duration-300 md:bottom-6 md:right-6 right-4 sm:right-6 hover:-translate-y-1"
      aria-label="Chat on WhatsApp"
      style={{
        width: '56px',
        height: '56px',
        background: '#25D366',
        color: 'white',
        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* Responsive bottom position targeting mobile screens exclusively */
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
      }}
      /* Use a small styled-jsx to override bottom behavior on md breakpoint in conjunction with inline style priority */
    >
      <style jsx>{`
        @media (min-width: 768px) {
          a { bottom: 1.5rem !important; }
        }
      `}</style>
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    </a>
  );
}
