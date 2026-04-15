/**
 * Admin Dashboard Page
 * 
 * Overview page with live stats from Supabase,
 * recent inquiries, and recent properties.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  Users,
  Eye,
  Plus,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate, getStatusInfo, getPropertyTypeLabel } from '@/utils/helpers';

interface DashboardStats {
  total: number;
  available: number;
  sold: number;
  inquiries: number;
}

interface RecentProperty {
  id: string;
  title: string;
  price: number;
  property_type: string;
  status: string;
  created_at: string;
  property_images: { image_url: string }[];
}

interface RecentInquiry {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: string;
  created_at: string;
  properties: { title: string } | null;
}

const statCardConfig = [
  { key: 'total', label: 'Total Properties', icon: Building2, color: '#2563EB' },
  { key: 'inquiries', label: 'Total Inquiries', icon: Users, color: '#8B5CF6' },
  { key: 'available', label: 'Available', icon: TrendingUp, color: '#10B981' },
  { key: 'sold', label: 'Sold', icon: Eye, color: '#EF4444' },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, available: 0, sold: 0, inquiries: 0 });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const supabase = createClient();

      const [
        { count: totalCount },
        { count: availableCount },
        { count: soldCount },
        { count: inquiryCount },
        { data: properties },
        { data: inquiries },
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*, property_images(image_url)').order('created_at', { ascending: false }).limit(4),
        supabase.from('inquiries').select('*, properties(title)').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        total: totalCount || 0,
        available: availableCount || 0,
        sold: soldCount || 0,
        inquiries: inquiryCount || 0,
      });
      setRecentProperties((properties as RecentProperty[]) || []);
      setRecentInquiries((inquiries as RecentInquiry[]) || []);
      setLoading(false);
    }

    fetchDashboard();
  }, []);

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: '1.5rem', gap: '0.75rem' }}>
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="hidden sm:flex items-center gap-2 font-semibold transition-all"
          style={{
            padding: '8px 16px',
            fontSize: '0.8125rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Plus size={15} />
          Add Property
        </Link>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{ gap: 'clamp(0.625rem, 1.5vw, 1rem)', marginBottom: '1.5rem' }}
      >
        {statCardConfig.map((stat) => (
          <div
            key={stat.key}
            style={{
              padding: 'clamp(0.875rem, 2vw, 1.25rem)',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '0.625rem' }}>
              <p style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {stat.label}
              </p>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 'clamp(28px, 5vw, 34px)',
                  height: 'clamp(28px, 5vw, 34px)',
                  borderRadius: 'var(--radius-md)',
                  background: `${stat.color}12`,
                  color: stat.color,
                }}
              >
                <stat.icon size={14} />
              </div>
            </div>
            <p
              style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {loading ? '—' : stats[stat.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Two Column: Recent Properties + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1.25rem' }}>
        {/* Recent Properties */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.875rem, 2vw, 1.25rem)', borderBottom: '1px solid var(--border)' }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Properties
            </h3>
            <Link
              href="/admin/properties"
              className="flex items-center gap-1 transition-colors"
              style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--primary)' }}
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Loading...
              </div>
            ) : recentProperties.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No properties yet. <Link href="/admin/properties/new" style={{ color: 'var(--primary)' }}>Add your first property</Link>
              </div>
            ) : (
              recentProperties.map((p) => {
                const status = getStatusInfo(p.status);
                return (
                  <Link
                    key={p.id}
                    href={`/admin/properties/${p.id}/edit`}
                    className="flex items-center gap-3 transition-colors"
                    style={{
                      padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(0.875rem, 2vw, 1.25rem)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--bg-tertiary)',
                      }}
                    >
                      {p.property_images?.[0] && (
                        <img
                          src={p.property_images[0].image_url}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {getPropertyTypeLabel(p.property_type)} · {formatPrice(p.price)}
                      </p>
                    </div>
                    <span
                      className="hidden xs:inline-block"
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: status.bgColor,
                        color: status.color,
                        flexShrink: 0,
                      }}
                    >
                      {status.label}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.875rem, 2vw, 1.25rem)', borderBottom: '1px solid var(--border)' }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Inquiries
            </h3>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-1 transition-colors"
              style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--primary)' }}
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Loading...
              </div>
            ) : recentInquiries.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No inquiries yet.
              </div>
            ) : (
              recentInquiries.map((inq) => {
                const status = getStatusInfo(inq.status === 'new' ? 'upcoming' : inq.status === 'contacted' ? 'available' : 'sold');
                return (
                  <div
                    key={inq.id}
                    className="flex items-center gap-3"
                    style={{
                      padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(0.875rem, 2vw, 1.25rem)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}
                      >
                        {inq.name}
                      </p>
                      <p className="truncate" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {inq.properties?.title || 'General Inquiry'} · {inq.city || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={`tel:${inq.phone}`} style={{ color: 'var(--primary)' }}>
                        <Phone size={14} />
                      </a>
                      <span
                        className="hidden sm:inline-block"
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: status.bgColor,
                          color: status.color,
                          textTransform: 'capitalize',
                        }}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
