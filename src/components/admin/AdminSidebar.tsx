/**
 * AdminSidebar Component
 * 
 * Shared sidebar navigation for all admin pages.
 * Shows logo, nav links with active state, and logout button.
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_NAV_LINKS } from '@/utils/constants';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Settings,
  Plus,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2" style={{ marginBottom: '2rem' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
          }}
        >
          <Building2 size={16} color="white" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.02em',
          }}
        >
          Estate Reserve
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1" style={{ gap: '2px' }}>
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon];
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 transition-colors"
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: active ? 600 : 500,
                color: active ? 'white' : '#64748B',
                background: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
              }}
            >
              {Icon && <Icon size={16} />}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left transition-colors"
        style={{
          padding: '9px 12px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: '#64748B',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col"
        style={{
          width: '240px',
          background: '#0F172A',
          padding: '1.5rem',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        {navContent}
      </aside>

      {/* Mobile Header Bar */}
      <div
        className="lg:hidden flex items-center justify-between"
        style={{
          padding: '0.75rem 1rem',
          background: '#0F172A',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)',
            }}
          >
            <Building2 size={14} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>
            Estate Reserve
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94A3B8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="lg:hidden flex items-center justify-around"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid var(--border)',
          zIndex: 40,
          padding: '0.5rem 0.25rem',
          paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon];
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center gap-1 transition-colors relative"
              style={{
                padding: '0.25rem',
                color: active ? 'var(--primary)' : '#64748B',
                width: '60px',
                textDecoration: 'none',
              }}
            >
              <div 
                className="flex items-center justify-center"
                style={{ 
                  height: '32px', 
                  width: '48px', 
                  borderRadius: 'var(--radius-xl)', 
                  background: active ? 'var(--primary-light)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {Icon && <Icon size={active ? 20 : 18} />}
              </div>
              <span 
                style={{ 
                  fontSize: '0.625rem', 
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.2s',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label === 'Add Property' ? 'Add' : link.label === 'Properties' ? 'Props' : link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
