/**
 * AdminShell Component
 * 
 * Client component that conditionally renders the sidebar shell.
 * Excludes the shell on the login page.
 * Responsive: sidebar on lg+, mobile header + bottom nav on smaller screens.
 */
'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith('/admin/login');

  const globalStyle = (
    <style>{`
      body { padding-bottom: 0 !important; }
      main { 
        padding-top: 0 !important; 
        padding-bottom: 0 !important;
      }
      @media (min-width: 1024px) {
        .admin-main-content { margin-left: 240px !important; }
      }
      @media (max-width: 1023px) {
        .admin-main-content { 
          padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
        }
      }
    `}</style>
  );

  if (isLogin) {
    return (
      <>
        {globalStyle}
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {globalStyle}
      <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <AdminSidebar />
        <div className="flex-1 min-w-0 min-h-[100dvh]">
          <div className="admin-main-content" style={{ minHeight: '100dvh' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
