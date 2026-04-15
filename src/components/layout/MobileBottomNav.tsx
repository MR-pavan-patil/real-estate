'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Info, Phone } from 'lucide-react';
import { cn } from '@/utils/helpers';

const PUBLIC_NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes as they have their own bottom nav
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.03)'
      }}
    >
      <nav className="flex items-center justify-around h-16">
        {PUBLIC_NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              {isActive && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1"
                  style={{
                    background: 'var(--primary)',
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px'
                  }}
                />
              )}
              <div 
                className={cn(
                  "flex items-center justify-center p-1 rounded-full transition-all",
                  isActive ? "bg-blue-50" : "bg-transparent"
                )}
              >
                <Icon 
                  size={isActive ? 22 : 20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: isActive ? 700 : 500,
                  marginTop: '-2px'
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
