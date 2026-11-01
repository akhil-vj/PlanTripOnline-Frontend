import { useState } from 'react';
import { useAdminList } from '../../hooks/useAdminApi';
import { adminPut, adminDelete } from '../../config/api';

function RoleBadge({ role }) {
  const isAdmin = role?.toLowerCase() === 'admin';
  return (
    <span style={{
      background: isAdmin ? '#ede9fe' : '#f0fdf4',
      color: isAdmin ? '#7c3aed' : '#15803d',
      borderRadius:50, padding:'3px 10px', fontSize:'.7rem', fontWeight:800,
    }}>{role || 'User'}</span>
  );
}

function StatusBadge({ status }) {
  const active = status?.toLowerCase() === 'active';
  return (
    <span style={{
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#16a34a' : '#94a3b8',
      borderRadius:50, padding:'3px 10px', fontSize:'.7rem', fontWeight:800,
    }}>{status || 'Active'}</span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({length:6}).map((_,i) => (
        <td key={i} style={{ padding:'14px 16px' }}>
          <div style={{ height:13, background:'#f1f5f9', borderRadius:6, animation:'admPulse 1.4s ease infinite' }} />
        </td>
      ))}
    </tr>
  );
}

function UserPanel({ user, onClose, onUpdate }) {
  const [name,   setName]   = useState(user.name   || '');
  const [role,   setRole]   = useState(user.role   || 'User');
  const [status, setStatus] = useState(user.status || 'Active');
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');

  async function handleSave() {
    setSaving(true); setMsg('');
    try {
      await adminPut(`/api/users/${user.id}`, { name, role, status });
      setMsg('✓ User updated');
      onUpdate();
    } catch(e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
        backdropFilter:'blur(3px)', zIndex:300 }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:380, maxWidth:'100vw',
        background:'#fff', zIndex:301, overflowY:'auto', boxShadow:'-8px 0 40px rgba(0,0,0,.15)',
        animation:'slideInRight .25s cubic-bezier(.4,0,.2,1)' }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}`}</style>

        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'linear-gradient(135deg,#0f172a,#1e293b)' }}>
          <div>
            <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.5)', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'1px', marginBottom:2 }}>Edit User</div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:'#fff' }}>{user.name}</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)' }}>{user.email}</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'none',
            borderRadius:10, width:34, height:34, cursor:'pointer', color:'#fff', fontSize:'1.2rem',
            display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        <div style={{ padding:'24px' }}>
          {/* Avatar */}
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ width:64, height:64, borderRadius:'50%',
              background:'linear-gradient(135deg,#f97316,#fb923c)',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.5rem', fontWeight:900, color:'#fff', boxShadow:'0 6px 20px rgba(249,115,22,.3)' }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
              textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{
              width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
              fontSize:'.88rem', outline:'none', fontFamily:'inherit', color:'#0f172a', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
              textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Email</label>
            <input value={user.email} disabled style={{
              width:'100%', padding:'9px 12px', border:'1.5px solid #f1f5f9', borderRadius:10,
              fontSize:'.88rem', fontFamily:'inherit', color:'#94a3b8', background:'#f8fafc', boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
                textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{
                width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', color:'#0f172a' }}>
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:'#64748b',
                textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{
                width:'100%', padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
                fontSize:'.85rem', outline:'none', fontFamily:'inherit', color:'#0f172a' }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {msg && <div style={{ fontSize:'.8rem', fontWeight:600, marginBottom:10,
            color: msg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{msg}</div>}

          <button onClick={handleSave} disabled={saving} style={{
            width:'100%', padding:'13px', background:'linear-gradient(135deg,#f97316,#fb923c)',
            border:'none', borderRadius:12, color:'#fff', fontWeight:800, fontSize:'.9rem',
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
            opacity: saving ? .7 : 1, boxShadow:'0 4px 14px rgba(249,115,22,.35)',
          }}>{saving ? 'Saving…' : '💾 Save Changes'}</button>
        </div>
      </div>
    </>
  );
}

export default function UsersList() {
  const { data, loading, error, refetch } = useAdminList('/api/users', {});
  const [search,   setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const users = data?.users ?? (Array.isArray(data) ? data : []);

  const filtered = users.filter(u => {
    const matchSearch = search.trim()
      ? [u.name, u.email].join(' ').toLowerCase().includes(search.toLowerCase())
      : true;
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  async function handleDelete(id) {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;
    try {
      await adminDelete(`/api/users/${id}`);
      refetch();
    } catch(e) { alert(e.message); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {error && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:12,
          padding:'12px 18px', color:'#dc2626', fontSize:'.85rem', display:'flex',
          justifyContent:'space-between', alignItems:'center' }}>
          ⚠️ {error}
          <button onClick={refetch} style={{ background:'#dc2626', color:'#fff', border:'none',
            borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.78rem', fontWeight:700 }}>Retry</button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ background:'#fff', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(0,0,0,.05)',
        display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email…"
          style={{ flex:'1 1 200px', padding:'9px 14px', border:'1.5px solid #e2e8f0', borderRadius:10,
            fontSize:'.85rem', outline:'none', fontFamily:'inherit' }} />
        {['All','Admin','User'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)} style={{
            padding:'8px 16px', border:'1.5px solid',
            borderColor: roleFilter === r ? '#f97316' : '#e2e8f0',
            background: roleFilter === r ? '#fff7ed' : '#fff',
            color: roleFilter === r ? '#f97316' : '#64748b',
            borderRadius:10, fontSize:'.82rem', fontWeight:700, cursor:'pointer',
          }}>{r}</button>
        ))}
        <button onClick={refetch} style={{ padding:'9px 18px', background:'#f97316', color:'#fff',
          border:'none', borderRadius:10, fontSize:'.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:0 }}>
            All Users
            {!loading && <span style={{ fontSize:'.78rem', fontWeight:500, color:'#94a3b8', marginLeft:8 }}>
              ({filtered.length} of {users.length})
            </span>}
          </h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['User','Email','Role','Status','Joined','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:700,
                    color:'#64748b', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.5px',
                    whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:6}).map((_,i) => <SkeletonRow key={i} />)
                : filtered.map(u => (
                    <tr key={u.id}
                      style={{ borderTop:'1px solid #f8fafc', transition:'background .12s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', flexShrink:0,
                            background:'linear-gradient(135deg,#f97316,#fb923c)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'.85rem', fontWeight:800, color:'#fff' }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight:700, color:'#0f172a' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'13px 16px', color:'#475569' }}>{u.email}</td>
                      <td style={{ padding:'13px 16px' }}><RoleBadge role={u.role} /></td>
                      <td style={{ padding:'13px 16px' }}><StatusBadge status={u.status} /></td>
                      <td style={{ padding:'13px 16px', color:'#94a3b8', fontSize:'.78rem' }}>
                        {u.date || (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—')}
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => setSelected(u)} style={{
                            padding:'5px 12px', background:'#f97316', color:'#fff', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>Edit</button>
                          <button onClick={() => handleDelete(u.id)} style={{
                            padding:'5px 10px', background:'#fee2e2', color:'#dc2626', border:'none',
                            borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loading && !filtered.length && (
                <tr><td colSpan={6} style={{ padding:'50px', textAlign:'center', color:'#94a3b8' }}>
                  No users found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <UserPanel
          user={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { refetch(); setSelected(null); }}
        />
      )}
    </div>
  );
}
