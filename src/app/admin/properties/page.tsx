/**
 * Manage Properties Page
 * 
 * Lists all properties with search, filter, and CRUD actions.
 * Responsive: card layout on mobile, table on desktop.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Loader2,
  Download,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/utils/constants';
import { formatPrice, formatDate, getStatusInfo, getPropertyTypeLabel } from '@/utils/helpers';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface PropertyRow {
  id: string;
  title: string;
  slug: string;
  price: number;
  property_type: string;
  status: string;
  featured: boolean;
  created_at: string;
  property_images: { image_url: string }[];
}

export default function ManagePropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('properties')
      .select('id, title, slug, price, property_type, status, featured, created_at, property_images(image_url)');

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }
    if (typeFilter) query = query.eq('property_type', typeFilter);
    if (statusFilter) query = query.eq('status', statusFilter);

    if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else if (sortBy === 'oldest') query = query.order('created_at', { ascending: true });
    else if (sortBy === 'price_high') query = query.order('price', { ascending: false });
    else if (sortBy === 'price_low') query = query.order('price', { ascending: true });

    const { data } = await query;
    setProperties((data as PropertyRow[]) || []);
    setLoading(false);
  }, [search, typeFilter, statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchProperties, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProperties, search]);

  function handleDeleteClick(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  function handleDeleted(id: string) {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  function handleExportCSV() {
    if (properties.length === 0) return;

    const headers = ['ID', 'Title', 'Slug', 'Price', 'Type', 'Status', 'Featured', 'Created At'];
    
    const csvRows = properties.map((p) => {
      return [
        `"${p.id}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.slug}"`,
        `"${p.price}"`,
        `"${p.property_type}"`,
        `"${p.status}"`,
        `"${p.featured ? 'Yes' : 'No'}"`,
        `"${new Date(p.created_at).toLocaleString()}"`,
      ].join(',');
    });

    const csvString = [headers.map(h => `"${h}"`).join(','), ...csvRows].join('\n');
    
    // Add BOM for UTF-8 Support in Excel
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Fallback for older browsers
    const nav = window.navigator as any;
    if (nav.msSaveOrOpenBlob) {
      nav.msSaveBlob(blob, `properties_export_${Date.now()}.csv`);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      link.download = `properties_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }
  }

  const selectStyle = {
    padding: '8px 12px',
    fontSize: '0.8125rem',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'white',
    color: 'var(--text-primary)',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Manage Properties
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {properties.length} properties found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={properties.length === 0}
            className="flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              background: 'white',
              color: 'var(--text-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              cursor: properties.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (properties.length > 0) {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (properties.length > 0) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <Download size={15} />
            <span className="hidden xs:inline">Export</span>
          </button>
          <Link
            href="/admin/properties/new"
            className="flex items-center justify-center gap-2 font-semibold"
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
            <span className="hidden xs:inline">Add Property</span>
            <span className="xs:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.875rem, 2vw, 1.25rem)',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1rem',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative flex-1" style={{ minWidth: 0 }}>
            <Search size={15} className="absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              style={{
                ...selectStyle,
                paddingLeft: '36px',
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="">All Status</option>
              {PROPERTY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_high">Price ↓</option>
              <option value="price_low">Price ↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
            <Loader2 size={20} className="animate-spin" style={{ marginRight: '8px' }} />
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No properties found.{' '}
            <Link href="/admin/properties/new" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Add your first property
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                    {['Property', 'Type', 'Price', 'Status', 'Featured', 'Date', 'Actions'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 14px',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--text-muted)',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => {
                    const statusInfo = getStatusInfo(p.status);
                    return (
                      <tr
                        key={p.id}
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        {/* Property */}
                        <td style={{ padding: '10px 14px' }}>
                          <div className="flex items-center gap-3">
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: 'var(--bg-tertiary)',
                              }}
                            >
                              {p.property_images?.[0] && (
                                <img src={p.property_images[0].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <p className="truncate" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '200px' }}>
                              {p.title}
                            </p>
                          </div>
                        </td>
                        {/* Type */}
                        <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {getPropertyTypeLabel(p.property_type)}
                        </td>
                        {/* Price */}
                        <td style={{ padding: '10px 14px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {formatPrice(p.price)}
                        </td>
                        {/* Status */}
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.color,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        {/* Featured */}
                        <td style={{ padding: '10px 14px' }}>
                          {p.featured && <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />}
                        </td>
                        {/* Date */}
                        <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {formatDate(p.created_at)}
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '10px 14px' }}>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/properties/${p.slug}`}
                              target="_blank"
                              className="flex items-center justify-center transition-colors"
                              style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}
                              title="View"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <Link
                              href={`/admin/properties/${p.id}/edit`}
                              className="flex items-center justify-center transition-colors"
                              style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(p.id, p.title)}
                              className="flex items-center justify-center transition-colors"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--error)',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                              }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {properties.map((p) => {
                const statusInfo = getStatusInfo(p.status);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3"
                    style={{
                      padding: 'clamp(0.75rem, 2vw, 1rem)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--bg-tertiary)',
                      }}
                    >
                      {p.property_images?.[0] && (
                        <img src={p.property_images[0].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="truncate" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {p.title}
                        </p>
                        {p.featured && <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B', flexShrink: 0 }} />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatPrice(p.price)}
                        </span>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          {getPropertyTypeLabel(p.property_type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="flex items-center justify-center"
                        style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(p.id, p.title)}
                        className="flex items-center justify-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--error)',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        propertyId={deleteTarget?.id || ''}
        propertyTitle={deleteTarget?.title || ''}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
