/**
 * Admin Login Page
 * 
 * Handles email/password authentication for admin panel.
 * Redirects to dashboard on successful login.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Building2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Verify admin role
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication failed.');
        setLoading(false);
        return;
      }

      const { data: admin, error: dbError } = await supabase
        .from('admins')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!admin) {
        await supabase.auth.signOut();
        const errorMsg = dbError ? `Access denied [DB Info]: ${dbError.message} (Hint: ${dbError.hint})` : 'Access denied. Admin account required.';
        setError(errorMsg);
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'var(--bg-secondary)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          background: 'white',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--primary)',
              color: 'white',
              marginBottom: '1rem',
            }}
          >
            <Building2 size={22} />
          </div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Admin Panel
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sign in to manage your properties
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              fontSize: '0.8125rem',
              background: 'var(--error-bg)',
              color: 'var(--error)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form id="login-form" onSubmit={handleLogin} className="flex flex-col" style={{ gap: '1.25rem' }}>
          <div className="input-group">
            <label htmlFor="admin-email" className="input-label">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="admin-password" className="input-label">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input-field"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  right: '12px',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Demo Login Button */}
          <button
            type="button"
            onClick={() => {
              setEmail('demo@estatereserve.com');
              setPassword('password123');
              // We dispatch a slight delay to allow state to settle before submission
              setTimeout(() => {
                const form = document.getElementById('login-form') as HTMLFormElement;
                if (form) form.requestSubmit();
              }, 100);
            }}
            disabled={loading}
            className="w-full transition-colors"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-lg)',
              marginTop: '-0.25rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            Log in as Demo Admin
          </button>
        </form>
      </div>
    </div>
  );
}
