/**
 * Inquiries Management Page
 * 
 * Lists all inquiries with status filter.
 * Allows marking as contacted/closed and deleting.
 * Responsive: shows card layout on mobile, table on desktop.
 */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Phone,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { INQUIRY_STATUSES } from '@/utils/constants';
import { formatDate, getStatusInfo, truncateText } from '@/utils/helpers';

interface InquiryRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  message: string;
  status: string;
  created_at: string;
  properties: { id: string; title: string } | null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('inquiries')
      .select('*, properties(id, title)')
      .order('created_at', { ascending: false });

    if (statusFilter) query = query.eq('status', statusFilter);

    const { data } = await query;
    setInquiries((data as InquiryRow[]) || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch {
      alert('Failed to update status.');
    }
    setUpdatingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch {
      alert('Failed to delete inquiry.');
    }
    setUpdatingId(null);
  }

  // Status badge colors mapping
  function getInquiryStatusInfo(status: string) {
    if (status === 'new') return getStatusInfo('upcoming'); // amber
    if (status === 'contacted') return getStatusInfo('available'); // green
    return getStatusInfo('sold'); // red for closed
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Inquiries
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {inquiries.length} {statusFilter ? statusFilter : ''} inquiries
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('')}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: !statusFilter ? 600 : 500,
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid',
              borderColor: !statusFilter ? 'var(--primary)' : 'var(--border)',
              background: !statusFilter ? 'var(--primary-light)' : 'white',
              color: !statusFilter ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {INQUIRY_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: statusFilter === s.value ? 600 : 500,
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: statusFilter === s.value ? 'var(--primary)' : 'var(--border)',
                background: statusFilter === s.value ? 'var(--primary-light)' : 'white',
                color: statusFilter === s.value ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
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
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <MessageSquare size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            No inquiries found.
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="hidden md:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                    {['Customer', 'Phone', 'City', 'Property', 'Status', 'Date', 'Actions'].map((h) => (
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
                  {inquiries.map((inq) => {
                    const statusInfo = getInquiryStatusInfo(inq.status);
                    const isExpanded = expandedId === inq.id;
                    return (
                      <React.Fragment key={inq.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                          style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}
                        >
                          <td style={{ padding: '10px 14px' }}>
                            <div className="flex items-center gap-2">
                              <div
                                className="flex items-center justify-center flex-shrink-0"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                }}
                              >
                                {inq.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {inq.name}
                                </p>
                                {inq.message && (
                                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', maxWidth: '180px' }} className="truncate">
                                    {truncateText(inq.message, 40)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                            <a
                              href={`tel:${inq.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 transition-colors"
                              style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 500 }}
                            >
                              <Phone size={12} />
                              {inq.phone}
                            </a>
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {inq.city || '—'}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <p className="truncate" style={{ maxWidth: '160px' }}>
                              {inq.properties?.title || 'General'}
                            </p>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: statusInfo.bgColor,
                                color: statusInfo.color,
                                textTransform: 'capitalize',
                              }}
                            >
                              {inq.status}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {formatDate(inq.created_at)}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {inq.status !== 'contacted' && (
                                <button
                                  onClick={() => updateStatus(inq.id, 'contacted')}
                                  disabled={updatingId === inq.id}
                                  title="Mark Contacted"
                                  style={{
                                    width: '28px', height: '28px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none', background: 'transparent',
                                    color: '#10B981', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              {inq.status !== 'closed' && (
                                <button
                                  onClick={() => updateStatus(inq.id, 'closed')}
                                  disabled={updatingId === inq.id}
                                  title="Mark Closed"
                                  style={{
                                    width: '28px', height: '28px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none', background: 'transparent',
                                    color: '#F59E0B', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <XCircle size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(inq.id)}
                                disabled={updatingId === inq.id}
                                title="Delete"
                                style={{
                                  width: '28px', height: '28px',
                                  borderRadius: 'var(--radius-md)',
                                  border: 'none', background: 'transparent',
                                  color: 'var(--error)', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                              <span style={{ color: 'var(--text-muted)' }}>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Message Row */}
                        {isExpanded && (
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td colSpan={7} style={{ padding: '0 14px 14px 60px' }}>
                              <div
                                style={{
                                  padding: '0.75rem 1rem',
                                  background: 'var(--bg-secondary)',
                                  borderRadius: 'var(--radius-lg)',
                                  fontSize: '0.8125rem',
                                  color: 'var(--text-secondary)',
                                  lineHeight: 1.6,
                                }}
                              >
                                <strong style={{ color: 'var(--text-primary)' }}>Message:</strong>
                                <br />
                                {inq.message || 'No message provided.'}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {inquiries.map((inq) => {
                const statusInfo = getInquiryStatusInfo(inq.status);
                const isExpanded = expandedId === inq.id;
                return (
                  <div
                    key={inq.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                      style={{ padding: 'clamp(0.75rem, 2vw, 1rem)', cursor: 'pointer' }}
                    >
                      <div className="flex items-start gap-3">
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
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="truncate" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {inq.name}
                            </p>
                            <span
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: statusInfo.bgColor,
                                color: statusInfo.color,
                                textTransform: 'capitalize',
                                flexShrink: 0,
                              }}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <p className="truncate" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            {inq.properties?.title || 'General Inquiry'}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <a
                              href={`tel:${inq.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1"
                              style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}
                            >
                              <Phone size={11} />
                              {inq.phone}
                            </a>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {inq.city || '—'} · {formatDate(inq.created_at)}
                            </span>
                          </div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '4px' }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1rem)' }}>
                        {inq.message && (
                          <div
                            style={{
                              padding: '0.75rem',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-lg)',
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.6,
                              marginBottom: '0.75rem',
                            }}
                          >
                            {inq.message}
                          </div>
                        )}
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {inq.status !== 'contacted' && (
                            <button
                              onClick={() => updateStatus(inq.id, 'contacted')}
                              disabled={updatingId === inq.id}
                              className="flex items-center gap-1"
                              style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #10B981',
                                background: '#ECFDF5',
                                color: '#10B981',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle size={12} /> Contacted
                            </button>
                          )}
                          {inq.status !== 'closed' && (
                            <button
                              onClick={() => updateStatus(inq.id, 'closed')}
                              disabled={updatingId === inq.id}
                              className="flex items-center gap-1"
                              style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #F59E0B',
                                background: '#FFFBEB',
                                color: '#F59E0B',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              <XCircle size={12} /> Close
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inq.id)}
                            disabled={updatingId === inq.id}
                            className="flex items-center gap-1"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--error)',
                              background: 'var(--error-bg)',
                              color: 'var(--error)',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
