import { useState } from 'react';
import { useAdminList } from '../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../config/api';

function ActiveBadge({ active }) {
  return (
    <span style={{
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#16a34a' : '#94a3b8',
      borderRadius:50, padding:'3px 10px', fontSize:'.7rem', fontWeight:800,
    }}>{active ? 'Active' : 'Inactive'}</span>
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

const EMPTY_FORM = {
  code:'', type:'percentage', value:'', min_amount:'', max_uses:'', expires_at:'', is_active:true,
};

function PromoForm({ initial, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const Field = ({ label, children }) => (
    <div>
      <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
        textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = {
    width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
    fontSize:'.88rem', outline:'none', fontFamily:'inherit', color:'#0f172a', boxSizing:'border-box',
  };

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <Field label="Code">
          <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
            placeholder="e.g. SAVE20" style={inputStyle} />
        </Field>
        <Field label="Type">
          <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed ($)</option>
          </select>
        </Field>
        <Field label={form.type === 'percentage' ? 'Discount %' : 'Discount $'}>
          <input type="number" value={form.value} onChange={e => set('value', e.target.value)}
            placeholder={form.type === 'percentage' ? '10' : '25'} style={inputStyle} />
        </Field>
        <Field label="Min Order ($)">
          <input type="number" value={form.min_amount} onChange={e => set('min_amount', e.target.value)}
            placeholder="0" style={inputStyle} />
        </Field>
        <Field label="Max Uses">
          <input type="number" value={form.max_uses} onChange={e => set('max_uses', e.target.value)}
            placeholder="Unlimited" style={inputStyle} />
        </Field>
        <Field label="Expires At">
          <input type="date" value={form.expires_at} onChange={e => set('expires_at', e.target.value)}
            style={inputStyle} />
        </Field>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <label style={{ position:'relative', display:'inline-flex', alignItems:'center',
          cursor:'pointer', userSelect:'none' }}>
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
            style={{ width:0, height:0, opacity:0, position:'absolute' }} />
          <div style={{ width:40, height:22, borderRadius:11, background: form.is_active ? '#f97316' : '#cbd5e1',
            transition:'background .2s', position:'relative' }}>
            <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff',
              position:'absolute', top:3, left: form.is_active ? 21 : 3, transition:'left .2s',
              boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
          </div>
          <span style={{ marginLeft:8, fontSize:'.82rem', fontWeight:600, color:'#0f172a' }}>Active</span>
        </label>
      </div>
      {error && <div style={{ fontSize:'.8rem', color:'#dc2626', fontWeight:600, marginBottom:10 }}>⚠️ {error}</div>}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => onSave(form)} disabled={saving} style={{
          flex:1, padding:'11px', background:'linear-gradient(135deg,#f97316,#fb923c)',
          border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.88rem',
          cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit', opacity: saving ? .7 : 1,
        }}>{saving ? 'Saving…' : '💾 Save'}</button>
        <button onClick={onCancel} style={{
          padding:'11px 20px', border:'1.5px solid #e2e8f0', background:'#fff',
          borderRadius:10, fontSize:'.85rem', fontWeight:700, color:'#64748b', cursor:'pointer',
        }}>Cancel</button>
      </div>
    </div>
  );
}

export default function PromoCodesList() {
  const { data, loading, error, refetch } = useAdminList('/api/admin/promo-codes', {});
  const [showAdd, setShowAdd]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving,  setSaving]    = useState(false);
  const [saveErr, setSaveErr]   = useState('');
  const [search,  setSearch]    = useState('');

  const codes = data?.data ?? (Array.isArray(data) ? data : []);
  const filtered = search.trim()
    ? codes.filter(c => c.code?.toLowerCase().includes(search.toLowerCase()))
    : codes;

  async function handleSave(form) {
    setSaving(true); setSaveErr('');
    try {
      if (editing) {
        await adminPut(`/api/admin/promo-codes/${editing.id}`, form);
      } else {
        await adminPost('/api/admin/promo-codes', form);
      }
      setShowAdd(false); setEditing(null);
      refetch();
    } catch(e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await adminDelete(`/api/admin/promo-codes/${id}`);
      refetch();
    } catch(e) { alert(e.message); }
  }

  async function toggleActive(code) {
    try {
      await adminPut(`/api/admin/promo-codes/${code.id}`, { is_active: !code.is_active });
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

      {/* Toolbar */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search codes…"
          style={{ flex:'1 1 200px', padding:'9px 14px', border:'1.5px solid #e2e8f0', borderRadius:10,
            fontSize:'.85rem', outline:'none', fontFamily:'inherit', background:'#fff' }} />
        <button onClick={() => { setShowAdd(true); setEditing(null); setSaveErr(''); }} style={{
          padding:'9px 20px', background:'linear-gradient(135deg,#f97316,#fb923c)', color:'#fff',
          border:'none', borderRadius:10, fontSize:'.85rem', fontWeight:800, cursor:'pointer', fontFamily:'inherit',
          boxShadow:'0 4px 14px rgba(249,115,22,.3)',
        }}>+ New Promo Code</button>
      </div>

      {/* Add/Edit form card */}
      {(showAdd || editing) && (
        <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,.08)' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:'0 0 18px' }}>
            {editing ? `Edit: ${editing.code}` : 'Create New Promo Code'}
          </h3>
          <PromoForm
            initial={editing ? { ...editing } : EMPTY_FORM}
            onSave={handleSave}
            onCancel={() => { setShowAdd(false); setEditing(null); }}
            saving={saving}
            error={saveErr}
          />
        </div>
      )}

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:0 }}>
            Promo Codes
            {!loading && <span style={{ fontSize:'.78rem', fontWeight:500, color:'#94a3b8', marginLeft:8 }}>
              ({filtered.length})
            </span>}
          </h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Code','Type','Discount','Min Order','Uses','Max Uses','Expires','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:700,
                    color:'#64748b', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.5px',
                    whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:4}).map((_,i) => <SkeletonRow key={i} cols={9} />)
                : filtered.map(c => (
                    <tr key={c.id}
                      style={{ borderTop:'1px solid #f8fafc', transition:'background .12s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 14px' }}>
                        <span style={{ fontFamily:'monospace', fontWeight:800, color:'#0f172a',
                          background:'#f1f5f9', padding:'3px 8px', borderRadius:6, fontSize:'.82rem' }}>
                          {c.code}
                        </span>
                      </td>
                      <td style={{ padding:'13px 14px', color:'#475569', textTransform:'capitalize' }}>{c.type}</td>
                      <td style={{ padding:'13px 14px', fontWeight:700, color:'#f97316' }}>
                        {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                      </td>
                      <td style={{ padding:'13px 14px', color:'#475569' }}>{c.min_amount ? `$${c.min_amount}` : '—'}</td>
                      <td style={{ padding:'13px 14px', color:'#475569', textAlign:'center' }}>{c.uses_count ?? 0}</td>
                      <td style={{ padding:'13px 14px', color:'#475569', textAlign:'center' }}>{c.max_uses ?? '∞'}</td>
                      <td style={{ padding:'13px 14px', color:'#475569', whiteSpace:'nowrap' }}>
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={{ padding:'13px 14px' }}>
                        <button onClick={() => toggleActive(c)} style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
                          <ActiveBadge active={c.is_active} />
                        </button>
                      </td>
                      <td style={{ padding:'13px 14px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => { setEditing(c); setShowAdd(false); setSaveErr(''); }} style={{
                            padding:'5px 12px', background:'#dbeafe', color:'#2563eb', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>Edit</button>
                          <button onClick={() => handleDelete(c.id)} style={{
                            padding:'5px 10px', background:'#fee2e2', color:'#dc2626', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loading && !filtered.length && (
                <tr><td colSpan={9} style={{ padding:'50px', textAlign:'center', color:'#94a3b8' }}>
                  No promo codes yet. Create your first one!
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
