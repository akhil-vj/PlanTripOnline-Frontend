/**
 * ReviewsManager — Manage customer reviews via /api/admin/reviews
 */
import { useState } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPut, adminDelete } from '../../../config/api';
import {
  SkeletonRow, ErrorBanner, SlidePanel,
  Field, inputStyle, SaveButton, FormMessage, EmptyState,
} from './ContentShared';

/* ── Star display ─────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ fontSize: '1rem', letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  );
}

/* ── Status badge ─────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
  pending:  { bg: '#fef9c3', color: '#a16207', border: '#fde68a' },
  approved: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  rejected: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 50, padding: '3px 10px', fontSize: '.72rem', fontWeight: 800,
      whiteSpace: 'nowrap', textTransform: 'capitalize',
    }}>
      {status || 'pending'}
    </span>
  );
}

/* ── View / Edit panel ────────────────────────────────────────────────────── */
function ReviewPanel({ review, onClose, onSaved }) {
  const [status,    setStatus]    = useState(review.status || 'pending');
  const [adminNote, setAdminNote] = useState(review.admin_note || '');
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await adminPut(`/api/admin/reviews/${review.id}`, { status, admin_note: adminNote });
      setMsg('✓ Review updated successfully');
      onSaved();
    } catch (err) {
      setMsg(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlidePanel
      title={`Review by ${review.name || 'Anonymous'}`}
      sub="Review Details"
      onClose={onClose}
    >
      <FormMessage msg={msg} />

      {/* Review info */}
      <div style={{
        background: '#f8fafc', borderRadius: 12, padding: '16px',
        marginBottom: 20, border: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '.95rem' }}>{review.name}</div>
            {review.email && (
              <div style={{ fontSize: '.78rem', color: '#64748b' }}>{review.email}</div>
            )}
          </div>
          <Stars rating={review.rating} />
        </div>
        {review.destination && (
          <div style={{ fontSize: '.78rem', color: '#64748b', marginBottom: 8 }}>
            📍 {review.destination}
          </div>
        )}
        <div style={{
          fontSize: '.88rem', color: '#334155', lineHeight: 1.6,
          background: '#fff', borderRadius: 8, padding: '12px',
          border: '1px solid #e2e8f0',
        }}>
          {review.comment || <span style={{ color: '#94a3b8' }}>No comment</span>}
        </div>
        {review.created_at && (
          <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 8 }}>
            {new Date(review.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        <Field label="Status">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </Field>

        <Field label="Admin Note" hint="Optional internal note">
          <textarea
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            placeholder="Internal note about this review…"
            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          />
        </Field>

        <SaveButton saving={saving} label="Update Review" icon="💾" />
      </form>
    </SlidePanel>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function ReviewsManager() {
  const { data, loading, error, refetch, filters, setFilters } =
    useAdminList('/api/admin/reviews', { status: '', per_page: 20 });

  const [search,  setSearch]  = useState('');
  const [panel,   setPanel]   = useState(null); // { review }
  const [deleting, setDeleting] = useState(null);

  const all = Array.isArray(data) ? data : (data?.data ?? []);
  const rows = all.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    );
  });

  async function quickStatus(review, newStatus) {
    try {
      await adminPut(`/api/admin/reviews/${review.id}`, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  }

  async function handleDelete(review) {
    if (!window.confirm(`Delete review by "${review.name}"? This cannot be undone.`)) return;
    setDeleting(review.id);
    try {
      await adminDelete(`/api/admin/reviews/${review.id}`);
      refetch();
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  /* shared cell style */
  const th = {
    padding: '11px 14px', textAlign: 'left', fontSize: '.68rem',
    fontWeight: 800, color: '#64748b', textTransform: 'uppercase',
    letterSpacing: '.6px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  };
  const td = { padding: '12px 14px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            ⭐ Reviews
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>
            {rows.length} review{rows.length !== 1 ? 's' : ''} shown
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'flex', gap: 10, flexWrap: 'wrap',
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search reviewer, destination…"
          style={{
            flex: '1 1 180px', padding: '8px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 10, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          style={{
            padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
            fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
            color: '#0f172a', background: '#fff',
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={refetch}
          style={{
            padding: '8px 16px', background: '#f97316', color: '#fff', border: 'none',
            borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '.82rem', fontFamily: 'inherit',
          }}
        >↻ Refresh</button>
      </div>

      <ErrorBanner error={error} onRetry={refetch} />

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1px solid #e2e8f0',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Reviewer</th>
                <th style={th}>Rating</th>
                <th style={th}>Destination</th>
                <th style={th}>Comment</th>
                <th style={th}>Status</th>
                <th style={th}>Date</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                : rows.length === 0
                  ? <EmptyState icon="⭐" title="No reviews found" />
                  : rows.map(review => (
                    <tr key={review.id} style={{ transition: 'background .12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={td}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '.88rem' }}>
                          {review.name || '—'}
                        </div>
                        {review.email && (
                          <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>{review.email}</div>
                        )}
                      </td>
                      <td style={td}>
                        <Stars rating={review.rating} />
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: '.82rem', color: '#475569' }}>
                          {review.destination || '—'}
                        </span>
                      </td>
                      <td style={{ ...td, maxWidth: 220 }}>
                        <span style={{
                          fontSize: '.82rem', color: '#334155',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {review.comment || '—'}
                        </span>
                      </td>
                      <td style={td}>
                        <StatusBadge status={review.status} />
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: '.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {/* Approve / Reject quick actions */}
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => quickStatus(review, 'approved')}
                              title="Approve"
                              style={{
                                padding: '4px 10px', background: '#dcfce7', color: '#16a34a',
                                border: 'none', borderRadius: 7, fontSize: '.7rem',
                                fontWeight: 700, cursor: 'pointer',
                              }}
                            >✓ Approve</button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => quickStatus(review, 'rejected')}
                              title="Reject"
                              style={{
                                padding: '4px 10px', background: '#fee2e2', color: '#dc2626',
                                border: 'none', borderRadius: 7, fontSize: '.7rem',
                                fontWeight: 700, cursor: 'pointer',
                              }}
                            >✕ Reject</button>
                          )}
                          {/* View */}
                          <button
                            onClick={() => setPanel({ review })}
                            style={{
                              padding: '4px 10px', background: '#dbeafe', color: '#2563eb',
                              border: 'none', borderRadius: 7, fontSize: '.7rem',
                              fontWeight: 700, cursor: 'pointer',
                            }}
                          >View</button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(review)}
                            disabled={deleting === review.id}
                            style={{
                              padding: '4px 8px', background: '#f1f5f9', color: '#94a3b8',
                              border: 'none', borderRadius: 7, fontSize: '.7rem',
                              fontWeight: 700, cursor: 'pointer',
                              opacity: deleting === review.id ? .5 : 1,
                            }}
                          >{deleting === review.id ? '…' : '🗑'}</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide panel */}
      {panel && (
        <ReviewPanel
          review={panel.review}
          onClose={() => setPanel(null)}
          onSaved={() => { refetch(); setPanel(null); }}
        />
      )}
    </div>
  );
}
