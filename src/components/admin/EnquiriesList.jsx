import { useState } from 'react';
import { useAdminList } from '../../hooks/useAdminApi';
import { adminPut, adminDelete } from '../../config/api';

const STATUS_COLORS = {
  pending:     ['#fef9c3','#ca8a04'],
  in_progress: ['#dbeafe','#2563eb'],
  completed:   ['#dcfce7','#16a34a'],
  cancelled:   ['#fee2e2','#dc2626'],
};

function Badge({ value }) {
  const label = value?.replace('_',' ') || '—';
  const [bg, col] = STATUS_COLORS[value] ?? ['#f1f5f9','#64748b'];
  return (
    <span style={{ background:bg, color:col, borderRadius:50, padding:'3px 10px',
      fontSize:'.7rem', fontWeight:800, textTransform:'capitalize', display:'inline-block' }}>
      {label}
    </span>
  );
}

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

/* ── Enquiry Detail Slide-out ────────────────────────────────────────────────── */
function EnquiryPanel({ enquiry, onClose, onUpdate }) {
  const [status, setStatus] = useState(enquiry.status || 'pending');
  const [notes,  setNotes]  = useState(enquiry.notes  || '');
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');

  async function handleSave() {
    setSaving(true); setMsg('');
    try {
      await adminPut(`/api/admin/enquiries/${enquiry.id}`, { status, notes });
      setMsg('✓ Updated successfully');
      onUpdate();
    } catch(e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  const Row = ({ label, value }) => value ? (
    <div style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:'1px solid #f1f5f9', alignItems:'flex-start' }}>
      <span style={{ fontSize:'.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase',
        letterSpacing:'.5px', flexShrink:0, width:110, paddingTop:1 }}>{label}</span>
      <span style={{ fontSize:'.85rem', color:'#0f172a', fontWeight:500 }}>{value}</span>
    </div>
  ) : null;

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
        backdropFilter:'blur(3px)', zIndex:300 }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:420, maxWidth:'100vw',
        background:'#fff', zIndex:301, overflowY:'auto', boxShadow:'-8px 0 40px rgba(0,0,0,.15)',
        animation:'slideInRight .25s cubic-bezier(.4,0,.2,1)' }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
          <div>
            <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.5)', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'1px', marginBottom:2 }}>Enquiry #{enquiry.id}</div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:'#fff' }}>{enquiry.full_name}</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'none',
            borderRadius:10, width:34, height:34, cursor:'pointer', color:'#fff', fontSize:'1.2rem',
            display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        <div style={{ padding:'20px 24px' }}>
          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', marginBottom:10 }}>Contact Info</div>
          <Row label="Name"      value={enquiry.full_name} />
          <Row label="Email"     value={enquiry.email} />
          <Row label="Phone"     value={enquiry.phone} />
          <Row label="Country"   value={enquiry.country} />

          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', margin:'16px 0 10px' }}>Trip Preferences</div>
          <Row label="Destination"  value={enquiry.destination} />
          <Row label="Travel Type"  value={enquiry.travel_type} />
          <Row label="Start Date"   value={enquiry.start_date} />
          <Row label="Duration"     value={enquiry.duration} />
          {enquiry.message && (
            <div style={{ margin:'12px 0', padding:'12px 14px', background:'#f8fafc',
              borderRadius:12, fontSize:'.85rem', color:'#334155', lineHeight:1.6 }}>
              {enquiry.message}
            </div>
          )}

          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase',
            letterSpacing:'1px', margin:'16px 0 12px' }}>Admin Response</div>

          <div style={{ marginBottom:12 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
              textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{
              width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
              fontSize:'.85rem', outline:'none', fontFamily:'inherit', color:'#0f172a' }}>
              {['pending','in_progress','completed','cancelled'].map(s => (
                <option key={s} value={s}>{s.replace('_',' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
              textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Response notes / follow-up actions…"
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', resize:'vertical', color:'#0f172a' }} />
          </div>

          {msg && <div style={{ fontSize:'.8rem', fontWeight:600, marginBottom:10,
            color: msg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{msg}</div>}

          <button onClick={handleSave} disabled={saving} style={{
            width:'100%', padding:'13px', background:'linear-gradient(135deg,#f97316,#fb923c)',
            border:'none', borderRadius:12, color:'#fff', fontWeight:800, fontSize:'.9rem',
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
            opacity: saving ? .7 : 1, boxShadow:'0 4px 14px rgba(249,115,22,.35)',
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
export default function EnquiriesList() {
  const { data, loading, error, refetch, filters, setFilters } =
    useAdminList('/api/admin/enquiries', { status:'', per_page:15 });

  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const enquiries = data?.data ?? [];

  const filtered = search.trim()
    ? enquiries.filter(e =>
        [e.full_name, e.email, e.destination, e.country]
          .join(' ').toLowerCase().includes(search.toLowerCase())
      )
    : enquiries;

  async function handleDelete(id) {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await adminDelete(`/api/admin/enquiries/${id}`);
      refetch();
    } catch(e) { alert(e.message); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {error && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12,
        padding:'12px 18px', color:'#dc2626', fontSize:'.85rem', display:'flex',
        justifyContent:'space-between', alignItems:'center' }}>
        ⚠️ {error}
        <button onClick={refetch} style={{ background:'#dc2626', color:'#fff', border:'none',
          borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.78rem', fontWeight:700 }}>Retry</button>
      </div>}

      {/* Filter bar */}
      <div style={{ background:'#fff', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)',
        display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search name, email, destination…"
          style={{ flex:'1 1 200px', padding:'9px 14px', border:'1.5px solid #e2e8f0', borderRadius:10,
            fontSize:'.85rem', outline:'none', fontFamily:'inherit', minWidth:180 }} />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          style={{ padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:'.85rem',
            outline:'none', fontFamily:'inherit', color:'#0f172a' }}>
          <option value="">Status: All</option>
          {['pending','in_progress','completed','cancelled'].map(s => (
            <option key={s} value={s}>{s.replace('_',' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>
        <button onClick={refetch} style={{ padding:'9px 18px', background:'#f97316', color:'#fff',
          border:'none', borderRadius:10, fontSize:'.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9', display:'flex',
          justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:0 }}>
            All Enquiries
            {!loading && <span style={{ fontSize:'.78rem', fontWeight:500, color:'#94a3b8', marginLeft:8 }}>
              ({data?.total ?? filtered.length} total)
            </span>}
          </h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Name','Email','Phone','Destination','Travel Type','Start Date','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:700,
                    color:'#64748b', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.5px',
                    whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:8}).map((_,i) => <SkeletonRow key={i} cols={8} />)
                : filtered.map(enq => (
                    <tr key={enq.id}
                      style={{ borderTop:'1px solid #f8fafc', transition:'background .12s', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 14px' }}>
                        <div style={{ fontWeight:700, color:'#0f172a' }}>{enq.full_name}</div>
                        <div style={{ fontSize:'.7rem', color:'#94a3b8' }}>
                          {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : ''}
                        </div>
                      </td>
                      <td style={{ padding:'13px 14px', color:'#475569' }}>{enq.email}</td>
                      <td style={{ padding:'13px 14px', color:'#475569' }}>{enq.phone || '—'}</td>
                      <td style={{ padding:'13px 14px', color:'#475569' }}>{enq.destination || '—'}</td>
                      <td style={{ padding:'13px 14px', color:'#475569' }}>{enq.travel_type || '—'}</td>
                      <td style={{ padding:'13px 14px', color:'#475569', whiteSpace:'nowrap' }}>
                        {enq.start_date || '—'}
                      </td>
                      <td style={{ padding:'13px 14px' }}><Badge value={enq.status} /></td>
                      <td style={{ padding:'13px 14px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => setSelected(enq)} style={{
                            padding:'5px 12px', background:'#f97316', color:'#fff', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>View</button>
                          <button onClick={() => handleDelete(enq.id)} style={{
                            padding:'5px 10px', background:'#fee2e2', color:'#dc2626', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loading && !filtered.length && (
                <tr><td colSpan={8} style={{ padding:'50px', textAlign:'center', color:'#94a3b8' }}>
                  No enquiries found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(data?.last_page > 1) && (
          <div style={{ padding:'12px 20px', borderTop:'1px solid #f1f5f9', display:'flex',
            justifyContent:'space-between', alignItems:'center', fontSize:'.8rem', color:'#64748b' }}>
            <span>Page {data.current_page} of {data.last_page}</span>
            <div style={{ display:'flex', gap:8 }}>
              <button disabled={data.current_page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: (f.page||1)-1 }))}
                style={{ padding:'5px 12px', border:'1.5px solid #e2e8f0', borderRadius:8,
                  background:'#fff', cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>← Prev</button>
              <button disabled={data.current_page >= data.last_page}
                onClick={() => setFilters(f => ({ ...f, page: (f.page||1)+1 }))}
                style={{ padding:'5px 12px', border:'1.5px solid #e2e8f0', borderRadius:8,
                  background:'#fff', cursor:'pointer', fontSize:'.78rem', fontWeight:600 }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <EnquiryPanel
          enquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { refetch(); setSelected(null); }}
        />
      )}
    </div>
  );
}
