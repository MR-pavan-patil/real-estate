/**
 * Navbar Component
 * 
 * Responsive navigation bar with glass effect,
 * mobile hamburger menu, and scroll-aware styling.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Phone } from 'lucide-react';
import { useScrollDirection } from '@/hooks';
import { NAV_LINKS } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const pathname = usePathname();
  const { isAtTop } = useScrollDirection();

  // Don't show public navbar on admin routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isAtTop ? 'py-1' : 'py-0'
      )}
      style={{
        background: isAtTop ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isAtTop ? 'none' : '1px solid var(--border)',
      }}
    >
      <div className="container-main">
        <nav
          className="flex items-center justify-between"
          style={{ height: 'var(--navbar-height)' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <Building2 size={20} />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Estate Reserve
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{
                        backgroundColor: 'var(--primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 text-[15px] font-bold tracking-wide rounded-full transition-all"
              style={{
                padding: '12px 28px',
                background: 'var(--primary)',
                color: 'white',
                boxShadow: 'var(--shadow-md)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <Phone size={16} className="flex-shrink-0" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Note: Mobile Navigation is now handled by MobileBottomNav Component */}
        </nav>
      </div>
    </header>
  );
}
