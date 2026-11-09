import { useState } from 'react';
import { useAdminList } from '../../hooks/useAdminApi';
import { adminPut, adminDelete } from '../../config/api';

/* ── Shared helpers ─────────────────────────────────────────────────────────── */
function Badge({ value, map }) {
  const [bg, col] = map[value?.toLowerCase?.()] ?? ['#f1f5f9','#64748b'];
  return (
    <span style={{ background:bg, color:col, borderRadius:50, padding:'3px 10px',
      fontSize:'.7rem', fontWeight:800, textTransform:'capitalize', display:'inline-block' }}>
      {value || '—'}
    </span>
  );
}

const STATUS_MAP = {
  confirmed: ['#dcfce7','#16a34a'], pending: ['#fef9c3','#ca8a04'],
  cancelled: ['#fee2e2','#dc2626'], completed: ['#dbeafe','#2563eb'],
};
const PAY_MAP = {
  paid: ['#dcfce7','#16a34a'], unpaid: ['#fef9c3','#ca8a04'], refunded: ['#ede9fe','#7c3aed'],
};

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({length:cols}).map((_,i) => (
        <td key={i} style={{ padding:'14px 16px' }}>
          <div style={{ height:13, background:'#f1f5f9', borderRadius:6, animation:'admPulse 1.4s ease infinite' }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Slide-out panel ─────────────────────────────────────────────────────────── */
function BookingPanel({ booking, onClose, onUpdate }) {
  const [status,     setStatus]     = useState(booking.status     || 'pending');
  const [payStatus,  setPayStatus]  = useState(booking.payment_status || 'unpaid');
  const [notes,      setNotes]      = useState(booking.admin_notes || '');
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState('');

  async function handleSave() {
    setSaving(true); setSaveMsg('');
    try {
      await adminPut(`/api/admin/bookings/${booking.id}`, {
        status, payment_status: payStatus, admin_notes: notes,
      });
      setSaveMsg('✓ Saved successfully');
      onUpdate();
    } catch (e) {
      setSaveMsg(`⚠️ ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  const Row = ({ label, value }) => value ? (
    <div style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:'1px solid #f1f5f9', alignItems:'flex-start' }}>
      <span style={{ fontSize:'.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase',
        letterSpacing:'.5px', flexShrink:0, width:110, paddingTop:1 }}>{label}</span>
      <span style={{ fontSize:'.85rem', color:'#0f172a', fontWeight:500, flex:1 }}>{value}</span>
    </div>
  ) : null;

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
        backdropFilter:'blur(3px)', zIndex:300 }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:440, maxWidth:'100vw',
        background:'#fff', zIndex:301, overflowY:'auto',
        boxShadow:'-8px 0 40px rgba(0,0,0,.15)',
        animation:'slideInRight .25s cubic-bezier(.4,0,.2,1)',
      }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
          <div>
            <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.5)', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'1px', marginBottom:2 }}>Booking Detail</div>
            <div style={{ fontSize:'1.1rem', fontWeight:900, color:'#f97316' }}>{booking.booking_reference}</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'none',
            borderRadius:10, width:34, height:34, cursor:'pointer', color:'#fff', fontSize:'1.2rem',
            display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        <div style={{ padding:'20px 24px' }}>

          {/* Traveller */}
          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', marginBottom:10 }}>Traveller</div>
          <Row label="Name"      value={`${booking.first_name} ${booking.last_name}`} />
          <Row label="Email"     value={booking.email} />
          <Row label="WhatsApp"  value={booking.whatsapp} />
          <Row label="Nationality" value={booking.nationality} />

          {/* Trip */}
          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', margin:'16px 0 10px' }}>Trip Details</div>
          <Row label="Destination" value={booking.destination} />
          <Row label="Country"     value={booking.country} />
          <Row label="Travel Date" value={booking.travel_date} />
          <Row label="Adults"      value={booking.adults} />
          <Row label="Children"    value={booking.children > 0 ? booking.children : null} />
          <Row label="Pick-up"     value={booking.pick_up} />
          <Row label="Drop Point"  value={booking.drop_point} />
          {booking.special_requests && <Row label="Requests" value={booking.special_requests} />}

          {/* Payment */}
          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', margin:'16px 0 10px' }}>Payment</div>
          <Row label="Method"    value={booking.payment_method} />
          <Row label="Subtotal"  value={booking.subtotal ? `$${booking.subtotal}` : null} />
          <Row label="Discount"  value={booking.discount ? `-$${booking.discount}` : null} />
          <Row label="Taxes"     value={booking.taxes ? `$${booking.taxes}` : null} />
          <Row label="Total"     value={booking.total_amount ? `$${booking.total_amount}` : null} />
          <Row label="Promo"     value={booking.promo_code} />

          {/* Admin controls */}
          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', margin:'20px 0 12px' }}>Admin Actions</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
                textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Booking Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{
                width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', color:'#0f172a',
              }}>
                {['pending','confirmed','cancelled','completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
                textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Payment Status</label>
              <select value={payStatus} onChange={e => setPayStatus(e.target.value)} style={{
                width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', color:'#0f172a',
              }}>
                {['unpaid','paid','refunded'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
              textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Admin Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Internal notes about this booking…"
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', resize:'vertical', color:'#0f172a' }} />
          </div>

          {saveMsg && <div style={{ fontSize:'.8rem', fontWeight:600, marginBottom:10,
            color: saveMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{saveMsg}</div>}

          <button onClick={handleSave} disabled={saving} style={{
            width:'100%', padding:'13px', background:'linear-gradient(135deg,#f97316,#fb923c)',
            border:'none', borderRadius:12, color:'#fff', fontWeight:800, fontSize:'.9rem',
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
            boxShadow:'0 4px 14px rgba(249,115,22,.35)', opacity: saving ? .7 : 1,
          }}>
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── CSV Export Helper ───────────────────────────────────────────────────────── */
function exportCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => {
      const v = r[h] ?? '';
      return typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))
        ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Main Component ──────────────────────────────────────────────────────────── */
export default function BookingsList() {
  const { data, loading, error, refetch, filters, setFilters } =
    useAdminList('/api/admin/bookings', { status:'', payment_status:'', per_page:15 });

  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState(null);
  const [deleting,   setDeleting]   = useState(null);

  const bookings = data?.bookings?.data ?? [];
  const meta     = data?.bookings       ?? {};
  const stats    = data?.stats          ?? {};

  // Client-side search
  const filtered = search.trim()
    ? bookings.filter(b =>
        [b.first_name, b.last_name, b.email, b.booking_reference, b.destination]
          .join(' ').toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  async function handleDelete(id) {
    if (!window.confirm('Delete this booking permanently?')) return;
    setDeleting(id);
    try {
      await adminDelete(`/api/admin/bookings/${id}`);
      refetch();
    } catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Stats bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
        {[
          { label:'Total', value: stats.total_bookings },
          { label:'Active', value: stats.active_bookings },
          { label:'Pending', value: stats.pending_count },
          { label:'Revenue (Paid)', value: stats.total_revenue ? `$${Number(stats.total_revenue).toLocaleString()}` : '$0' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:'14px 18px',
            boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}>
            <div style={{ fontSize:'.68rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase',
              letterSpacing:'.8px', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#0f172a' }}>
              {loading ? <div style={{ height:24, width:50, background:'#f1f5f9', borderRadius:6 }} /> : (s.value ?? '—')}
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12,
        padding:'12px 18px', color:'#dc2626', fontSize:'.85rem', display:'flex',
        justifyContent:'space-between', alignItems:'center' }}>
        ⚠️ {error} <button onClick={refetch} style={{ background:'#dc2626', color:'#fff',
          border:'none', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.78rem', fontWeight:700 }}>Retry</button>
      </div>}

      {/* Filter bar */}
      <div style={{ background:'#fff', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)',
        display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search name, email, ref…"
          style={{ flex:'1 1 200px', padding:'9px 14px', border:'1.5px solid #e2e8f0', borderRadius:10,
            fontSize:'.85rem', outline:'none', fontFamily:'inherit', minWidth:180 }} />
        {[
          { key:'status',         opts:['','pending','confirmed','cancelled','completed'], label:'Status' },
          { key:'payment_status', opts:['','unpaid','paid','refunded'],                   label:'Payment' },
        ].map(f => (
          <select key={f.key} value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
            style={{ padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:'.85rem',
              outline:'none', fontFamily:'inherit', color:'#0f172a', flex:'0 0 auto' }}>
            <option value="">{f.label}: All</option>
            {f.opts.slice(1).map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
          </select>
        ))}
        <button onClick={refetch} style={{ padding:'9px 18px', background:'#f97316', color:'#fff',
          border:'none', borderRadius:10, fontSize:'.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          ↻ Refresh
        </button>

      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Ref #','Customer','Destination','Date','Adults','Total','Status','Payment','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:700,
                    color:'#64748b', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.5px',
                    whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:8}).map((_,i) => <SkeletonRow key={i} cols={9} />)
                : filtered.map(b => (
                    <tr key={b.id}
                      style={{ borderTop:'1px solid #f8fafc', transition:'background .12s', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 14px' }}>
                        <span style={{ fontWeight:800, color:'#f97316', fontFamily:'monospace', fontSize:'.8rem' }}>
                          {b.booking_reference}
                        </span>
                      </td>
                      <td style={{ padding:'13px 14px' }}>
                        <div style={{ fontWeight:700, color:'#0f172a' }}>{b.first_name} {b.last_name}</div>
                        <div style={{ fontSize:'.72rem', color:'#94a3b8' }}>{b.email}</div>
                      </td>
                      <td style={{ padding:'13px 14px', color:'#475569', maxWidth:160,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.destination}</td>
                      <td style={{ padding:'13px 14px', color:'#475569', whiteSpace:'nowrap' }}>
                        {b.travel_date ? new Date(b.travel_date).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding:'13px 14px', color:'#475569', textAlign:'center' }}>{b.adults}</td>
                      <td style={{ padding:'13px 14px', fontWeight:700, color:'#0f172a', whiteSpace:'nowrap' }}>
                        ${Number(b.total_amount).toFixed(0)}
                      </td>
                      <td style={{ padding:'13px 14px' }}><Badge value={b.status} map={STATUS_MAP} /></td>
                      <td style={{ padding:'13px 14px' }}><Badge value={b.payment_status} map={PAY_MAP} /></td>
                      <td style={{ padding:'13px 14px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => setSelected(b)} style={{
                            padding:'5px 12px', background:'#f97316', color:'#fff', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer',
                          }}>View</button>
                          <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} style={{
                            padding:'5px 10px', background:'#fee2e2', color:'#dc2626', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer',
                          }}>{deleting === b.id ? '…' : '✕'}</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loading && !filtered.length && (
                <tr><td colSpan={9} style={{ padding:'50px', textAlign:'center', color:'#94a3b8' }}>
                  No bookings found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        {meta.last_page > 1 && (
          <div style={{ padding:'12px 20px', borderTop:'1px solid #f1f5f9', display:'flex',
            justifyContent:'space-between', alignItems:'center', fontSize:'.8rem', color:'#64748b' }}>
            <span>Page {meta.current_page} of {meta.last_page} — {meta.total} total</span>
            <div style={{ display:'flex', gap:8 }}>
              <button disabled={meta.current_page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                style={{ padding:'5px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff',
                  cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>← Prev</button>
              <button disabled={meta.current_page >= meta.last_page}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                style={{ padding:'5px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff',
                  cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <BookingPanel
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { refetch(); setSelected(null); }}
        />
      )}
    </div>
  );
}
