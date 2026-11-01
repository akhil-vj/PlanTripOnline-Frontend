import { useAdminApi } from '../../hooks/useAdminApi';

/* ── Shared sub-components ─────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, icon, color, loading }) {
  return (
    <div style={{
      background:'#fff', borderRadius:20, padding:'22px 24px',
      boxShadow:'0 2px 12px rgba(0,0,0,.06)', display:'flex',
      alignItems:'flex-start', justifyContent:'space-between', gap:12,
    }}>
      <div>
        <div style={{ fontSize:'.72rem', fontWeight:700, color:'#94a3b8',
          textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>{label}</div>
        {loading
          ? <div style={{ height:32, width:80, background:'#f1f5f9', borderRadius:8, animation:'adm-pulse 1.4s ease infinite' }} />
          : <div style={{ fontSize:'1.9rem', fontWeight:900, color:'#0f172a', lineHeight:1 }}>{value}</div>
        }
        {sub && <div style={{ fontSize:'.75rem', color:'#64748b', marginTop:6, fontWeight:500 }}>{sub}</div>}
      </div>
      <div style={{
        width:44, height:44, borderRadius:14, background:`${color}18`,
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, color, fontSize:'1.3rem',
      }}>{icon}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    confirmed: ['#dcfce7','#16a34a'], pending: ['#fef9c3','#ca8a04'],
    cancelled: ['#fee2e2','#dc2626'], completed: ['#dbeafe','#2563eb'],
    paid: ['#dcfce7','#16a34a'], unpaid: ['#fef9c3','#ca8a04'],
    refunded: ['#ede9fe','#7c3aed'],
  };
  const [bg, col] = map[status?.toLowerCase()] || ['#f1f5f9','#64748b'];
  return (
    <span style={{
      background:bg, color:col, borderRadius:50, padding:'3px 10px',
      fontSize:'.7rem', fontWeight:800, letterSpacing:'.3px',
      textTransform:'capitalize', display:'inline-block',
    }}>{status || '—'}</span>
  );
}

function RevenueChart({ labels = [], data = [] }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:120, padding:'0 4px' }}>
      {labels.map((label, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{
            width:'100%', background:'linear-gradient(180deg,#f97316,#fb923c)',
            borderRadius:'6px 6px 0 0', height:`${(data[i] / max) * 100}%`,
            minHeight: data[i] > 0 ? 4 : 0, transition:'height .4s ease',
          }} title={`$${data[i]}`} />
          <span style={{ fontSize:'.62rem', color:'#94a3b8', fontWeight:600 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminOverview() {
  const { data, loading, error, refetch } = useAdminApi('/api/admin/dashboard/stats');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <style>{`
        @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {error && (
        <div style={{
          background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:14,
          padding:'14px 20px', display:'flex', justifyContent:'space-between',
          alignItems:'center', fontSize:'.85rem', color:'#dc2626',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={refetch} style={{
            background:'#dc2626', color:'#fff', border:'none', borderRadius:8,
            padding:'6px 14px', fontSize:'.78rem', fontWeight:700, cursor:'pointer',
          }}>Retry</button>
        </div>
      )}

      {/* Welcome */}
      <div style={{
        background:'linear-gradient(135deg,#0f172a,#1e293b)',
        borderRadius:20, padding:'24px 28px',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12,
      }}>
        <div>
          <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.5)', fontWeight:600, marginBottom:4 }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
          <h2 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:0 }}>
            Welcome back, {localStorage.getItem('userName') || 'Admin'}! 👋
          </h2>
          <p style={{ color:'rgba(255,255,255,.5)', margin:'4px 0 0', fontSize:'.85rem' }}>
            Here's what's happening at PlantripOnline today.
          </p>
        </div>
        <div style={{
          background:'linear-gradient(135deg,#f97316,#fb923c)',
          borderRadius:14, padding:'10px 20px', color:'#fff',
          fontSize:'.85rem', fontWeight:800, letterSpacing:'.3px',
        }}>
          {loading ? '…' : `${data?.pending_enquiries ?? 0} pending enquiries`}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:16 }}>
        <KpiCard label="Total Users"       loading={loading} value={data?.total_users       ?? '—'} icon="👥" color="#2563eb" sub="Registered accounts" />
        <KpiCard label="Active Bookings"   loading={loading} value={data?.active_bookings   ?? '—'} icon="📅" color="#f97316" sub="Pending + confirmed" />
        <KpiCard label="Total Revenue"     loading={loading} value={data ? `$${Number(data.total_revenue).toLocaleString()}` : '—'} icon="💰" color="#16a34a" sub="Paid bookings only" />
        <KpiCard label="Active Products"   loading={loading} value={data?.active_packages   ?? '—'} icon="🗺️" color="#7c3aed" sub="Tours + packages" />
        <KpiCard label="Open Enquiries"    loading={loading} value={data?.pending_enquiries ?? '—'} icon="📨" color="#dc2626" sub="Needs response" />
      </div>

      {/* Chart + Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>

        {/* Revenue chart */}
        <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:0 }}>Revenue Overview</h3>
              <p style={{ fontSize:'.78rem', color:'#64748b', margin:'2px 0 0' }}>Last 7 days — paid bookings</p>
            </div>
            <div style={{ fontSize:'.8rem', color:'#f97316', fontWeight:700 }}>
              {loading ? '…' : `$${data?.revenue_chart?.data?.reduce((a,b) => a+b, 0).toLocaleString() ?? 0} this week`}
            </div>
          </div>
          {loading
            ? <div style={{ height:120, background:'#f8fafc', borderRadius:12, animation:'adm-pulse 1.4s ease infinite' }} />
            : <RevenueChart labels={data?.revenue_chart?.labels ?? []} data={data?.revenue_chart?.data ?? []} />
          }
        </div>

        {/* Recent Activity */}
        <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:'0 0 16px' }}>Recent Activity</h3>
          {loading
            ? Array.from({length:5}).map((_,i) => (
                <div key={i} style={{ height:40, background:'#f8fafc', borderRadius:10, marginBottom:10, animation:'adm-pulse 1.4s ease infinite' }} />
              ))
            : (data?.recent_activity ?? []).slice(0, 8).map((act, i) => {
                const icons = { booking:'📋', enquiry:'📨', signup:'👤' };
                return (
                  <div key={i} style={{
                    display:'flex', gap:10, alignItems:'flex-start',
                    padding:'8px 0', borderBottom: i < (data?.recent_activity?.length - 1) ? '1px solid #f8fafc' : 'none',
                  }}>
                    <span style={{ fontSize:'1rem', flexShrink:0 }}>{icons[act.type] || '📌'}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:'.78rem', color:'#334155', fontWeight:500, lineHeight:1.4,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {act.message}
                      </div>
                      <div style={{ fontSize:'.68rem', color:'#94a3b8', marginTop:2 }}>{act.time}</div>
                    </div>
                  </div>
                );
              })
          }
          {!loading && !data?.recent_activity?.length && (
            <p style={{ color:'#94a3b8', fontSize:'.82rem', textAlign:'center', padding:'20px 0' }}>No recent activity</p>
          )}
        </div>
      </div>

      {/* Recent Bookings table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:0 }}>Recent Bookings</h3>
          <a href="/admin-dashboard/bookings" style={{
            fontSize:'.78rem', color:'#f97316', fontWeight:700, textDecoration:'none',
          }}>View All →</a>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Reference','Customer','Destination','Date','Amount','Status','Payment'].map(h => (
                  <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontWeight:700,
                    color:'#64748b', fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'.5px',
                    whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i) => (
                    <tr key={i}>
                      {Array.from({length:7}).map((__,j) => (
                        <td key={j} style={{ padding:'14px 16px' }}>
                          <div style={{ height:14, background:'#f1f5f9', borderRadius:6, animation:'adm-pulse 1.4s ease infinite' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.recent_bookings ?? []).map(b => (
                    <tr key={b.id} style={{ borderTop:'1px solid #f8fafc', transition:'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'13px 16px', fontWeight:700, color:'#f97316' }}>{b.reference}</td>
                      <td style={{ padding:'13px 16px', color:'#0f172a', fontWeight:600 }}>{b.customer}</td>
                      <td style={{ padding:'13px 16px', color:'#475569' }}>{b.destination}</td>
                      <td style={{ padding:'13px 16px', color:'#475569', whiteSpace:'nowrap' }}>{b.date}</td>
                      <td style={{ padding:'13px 16px', fontWeight:700, color:'#0f172a' }}>{b.amount}</td>
                      <td style={{ padding:'13px 16px' }}><StatusBadge status={b.status} /></td>
                      <td style={{ padding:'13px 16px' }}><StatusBadge status={b.payment_status} /></td>
                    </tr>
                  ))
              }
              {!loading && !data?.recent_bookings?.length && (
                <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
