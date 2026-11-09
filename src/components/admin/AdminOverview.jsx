import { useAdminApi } from '../../hooks/useAdminApi';

/* ── Gradient KPI Card ───────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, icon, grad, loading }) {
  return (
    <div style={{
      borderRadius: 20, padding: '24px 26px', position: 'relative', overflow: 'hidden',
      background: grad, boxShadow: '0 8px 32px rgba(0,0,0,.12)',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 130,
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', right: -16, top: -16, width: 90, height: 90,
        borderRadius: '50%', background: 'rgba(255,255,255,.1)',
      }} />
      <div style={{
        position: 'absolute', right: 20, bottom: -24, width: 70, height: 70,
        borderRadius: '50%', background: 'rgba(255,255,255,.07)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{
          fontSize: '.68rem', fontWeight: 700, color: 'rgba(255,255,255,.75)',
          textTransform: 'uppercase', letterSpacing: '1.2px',
        }}>{label}</span>
        <span style={{
          fontSize: '1.4rem', background: 'rgba(255,255,255,.18)',
          borderRadius: 10, width: 38, height: 38, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>{icon}</span>
      </div>

      <div style={{ position: 'relative' }}>
        {loading
          ? <div style={{ height: 36, width: 100, background: 'rgba(255,255,255,.2)', borderRadius: 8, animation: 'adm-pulse 1.4s ease infinite' }} />
          : <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
        }
        {sub && <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.65)', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Status Badge ────────────────────────────────────────────────────────── */
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
      background: bg, color: col, borderRadius: 50, padding: '3px 10px',
      fontSize: '.7rem', fontWeight: 800, textTransform: 'capitalize',
    }}>{status || '—'}</span>
  );
}

/* ── Sparkline Bar Chart ─────────────────────────────────────────────────── */
function BarChart({ labels = [], data = [] }) {
  const max = Math.max(...data, 1);
  const barColors = ['#f97316','#fb923c','#fdba74','#f97316','#fb923c','#fdba74','#f97316'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, padding: '0 2px' }}>
      {labels.map((label, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: '100%', borderRadius: '8px 8px 0 0',
            background: `linear-gradient(180deg,${barColors[i % barColors.length]},${barColors[i % barColors.length]}88)`,
            height: `${(data[i] / max) * 100}%`,
            minHeight: data[i] > 0 ? 6 : 0,
            transition: 'height .5s cubic-bezier(.4,0,.2,1)',
            boxShadow: `0 -2px 10px ${barColors[i % barColors.length]}44`,
          }} title={`$${data[i]}`} />
          <span style={{ fontSize: '.62rem', color: '#94a3b8', fontWeight: 600 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Quick Stat Row ──────────────────────────────────────────────────────── */
function QuickStat({ icon, label, value, loading }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
        {loading
          ? <div style={{ height: 16, width: 50, background: '#f1f5f9', borderRadius: 6, marginTop: 3, animation: 'adm-pulse 1.4s ease infinite' }} />
          : <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{value}</div>
        }
      </div>
    </div>
  );
}

/* ── Main Overview ───────────────────────────────────────────────────────── */
export default function AdminOverview() {
  const { data, loading, error, refetch } = useAdminApi('/api/admin/dashboard/stats');
  const name = localStorage.getItem('userName') || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes adm-slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 16,
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '.85rem', color: '#dc2626',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={refetch} style={{
            background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 16px', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
          }}>Retry</button>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div style={{
        borderRadius: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0c1a3a 100%)',
        padding: '32px 36px', position: 'relative',
        boxShadow: '0 12px 40px rgba(15,23,42,.25)',
      }}>
        {/* Decoration circles */}
        {[
          { w:220, h:220, top:-80, right:-40, op:.06 },
          { w:140, h:140, top:20, right:140, op:.04 },
          { w:100, h:100, bottom:-30, right:60, op:.05 },
        ].map((c,i) => (
          <div key={i} style={{
            position:'absolute', width:c.w, height:c.h, borderRadius:'50%',
            background:'#f97316', opacity:c.op, top:c.top, right:c.right, bottom:c.bottom,
            pointerEvents:'none',
          }} />
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, position: 'relative' }}>
          <div>
            <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 8, letterSpacing: '.5px' }}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-.4px' }}>
              {greeting}, {name}! 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,.45)', margin: 0, fontSize: '.88rem', maxWidth: 420 }}>
              Here's your PlantripOnline dashboard overview for today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 14, padding: '12px 20px', textAlign: 'center', backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Pending</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f97316' }}>
                {loading ? '…' : (data?.pending_enquiries ?? 0)}
              </div>
              <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)' }}>Enquiries</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg,rgba(249,115,22,.3),rgba(251,146,60,.2))',
              border: '1px solid rgba(249,115,22,.35)',
              borderRadius: 14, padding: '12px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>This Week</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                {loading ? '…' : `$${Number(data?.revenue_chart?.data?.reduce((a,b)=>a+b,0) ?? 0).toLocaleString()}`}
              </div>
              <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.45)' }}>Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        <KpiCard label="Total Users"     loading={loading} value={data?.total_users ?? '—'}
          sub="Registered accounts" icon="👥" grad="linear-gradient(135deg,#2563eb,#3b82f6)" />
        <KpiCard label="Active Bookings" loading={loading} value={data?.active_bookings ?? '—'}
          sub="Pending + confirmed" icon="📅" grad="linear-gradient(135deg,#f97316,#fb923c)" />
        <KpiCard label="Total Revenue"   loading={loading}
          value={data ? `$${Number(data.total_revenue).toLocaleString()}` : '—'}
          sub="Paid bookings only" icon="💰" grad="linear-gradient(135deg,#059669,#10b981)" />
        <KpiCard label="Active Products" loading={loading} value={data?.active_packages ?? '—'}
          sub="Tours + packages" icon="🗺️" grad="linear-gradient(135deg,#7c3aed,#8b5cf6)" />
        <KpiCard label="Open Enquiries"  loading={loading} value={data?.pending_enquiries ?? '—'}
          sub="Needs response" icon="📨" grad="linear-gradient(135deg,#dc2626,#ef4444)" />
      </div>

      {/* ── Chart + Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Revenue Chart */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '26px 28px',
          boxShadow: '0 2px 20px rgba(0,0,0,.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Revenue Overview</h3>
              <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0 }}>Last 7 days — paid bookings only</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg,#fff7ed,#fed7aa)',
              border: '1px solid #fdba74', borderRadius: 10,
              padding: '6px 14px', fontSize: '.78rem', fontWeight: 800, color: '#ea580c',
            }}>
              {loading ? '…' : `$${Number(data?.revenue_chart?.data?.reduce((a,b)=>a+b,0) ?? 0).toLocaleString()} total`}
            </div>
          </div>
          {loading
            ? <div style={{ height:130, background:'#f8fafc', borderRadius:12, animation:'adm-pulse 1.4s ease infinite' }} />
            : <BarChart labels={data?.revenue_chart?.labels ?? []} data={data?.revenue_chart?.data ?? []} />
          }
        </div>

        {/* Quick Stats */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '24px 24px',
          boxShadow: '0 2px 20px rgba(0,0,0,.06)',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Quick Stats</h3>
          <QuickStat icon="📋" label="Total Bookings" value={data?.total_bookings ?? '—'} loading={loading} />
          <QuickStat icon="🏨" label="Active Hotels" value={data?.active_hotels ?? '—'} loading={loading} />
          <QuickStat icon="🏖️" label="Day Tours" value={data?.active_tours ?? '—'} loading={loading} />
          <QuickStat icon="⭐" label="Pending Reviews" value={data?.pending_reviews ?? '—'} loading={loading} />
          <div style={{ marginTop: 16 }}>
            <a href="/admin-dashboard/bookings" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px', background: 'linear-gradient(135deg,#f97316,#fb923c)',
              color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '.83rem',
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(249,115,22,.35)',
            }}>
              View All Bookings →
            </a>
          </div>
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 2px 20px rgba(0,0,0,.06)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 26px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Bookings</h3>
            <p style={{ fontSize: '.72rem', color: '#94a3b8', margin: '2px 0 0' }}>Latest transactions across all destinations</p>
          </div>
          <a href="/admin-dashboard/bookings" style={{
            fontSize: '.78rem', color: '#f97316', fontWeight: 700, textDecoration: 'none',
            padding: '7px 14px', border: '1.5px solid #fed7aa', borderRadius: 10,
            background: '#fff7ed', transition: 'all .15s',
          }}>View all →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Reference', 'Customer', 'Destination', 'Date', 'Amount', 'Status', 'Payment'].map(h => (
                  <th key={h} style={{
                    padding: '12px 18px', textAlign: 'left', fontWeight: 700,
                    color: '#64748b', fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.6px',
                    whiteSpace: 'nowrap', borderBottom: '1px solid #f1f5f9',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i) => (
                    <tr key={i}>
                      {Array.from({length:7}).map((__,j) => (
                        <td key={j} style={{ padding:'16px 18px' }}>
                          <div style={{ height:13, background:'#f1f5f9', borderRadius:6, animation:'adm-pulse 1.4s ease infinite' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.recent_bookings ?? []).map(b => (
                    <tr key={b.id}
                      style={{ borderTop: '1px solid #f8fafc', transition: 'background .15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding:'14px 18px' }}>
                        <span style={{ fontWeight:800, color:'#f97316', fontFamily:'monospace', fontSize:'.8rem',
                          background:'#fff7ed', padding:'3px 8px', borderRadius:6 }}>{b.reference}</span>
                      </td>
                      <td style={{ padding:'14px 18px', color:'#0f172a', fontWeight:600 }}>{b.customer}</td>
                      <td style={{ padding:'14px 18px', color:'#475569' }}>{b.destination}</td>
                      <td style={{ padding:'14px 18px', color:'#64748b', whiteSpace:'nowrap', fontSize:'.78rem' }}>{b.date}</td>
                      <td style={{ padding:'14px 18px', fontWeight:800, color:'#0f172a' }}>{b.amount}</td>
                      <td style={{ padding:'14px 18px' }}><StatusBadge status={b.status} /></td>
                      <td style={{ padding:'14px 18px' }}><StatusBadge status={b.payment_status} /></td>
                    </tr>
                  ))
              }
              {!loading && !data?.recent_bookings?.length && (
                <tr><td colSpan={7} style={{ padding:'50px', textAlign:'center', color:'#94a3b8' }}>
                  No bookings yet
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      {(loading || (data?.recent_activity?.length > 0)) && (
        <div style={{ background:'#fff', borderRadius:20, padding:'24px 26px', boxShadow:'0 2px 20px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#0f172a', margin:'0 0 18px' }}>Recent Activity</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
            {loading
              ? Array.from({length:4}).map((_,i) => (
                  <div key={i} style={{ height:60, background:'#f8fafc', borderRadius:14, animation:'adm-pulse 1.4s ease infinite' }} />
                ))
              : (data?.recent_activity ?? []).slice(0,8).map((act, i) => {
                  const icons = { booking:'📋', enquiry:'📨', signup:'👤', review:'⭐' };
                  const colors = { booking:'#dbeafe', enquiry:'#fef9c3', signup:'#dcfce7', review:'#f3e8ff' };
                  return (
                    <div key={i} style={{
                      display:'flex', gap:12, alignItems:'flex-start',
                      padding:'12px 14px', borderRadius:14,
                      background: colors[act.type] || '#f8fafc',
                    }}>
                      <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{icons[act.type] || '📌'}</span>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:'.8rem', color:'#334155', fontWeight:600, lineHeight:1.4 }}>{act.message}</div>
                        <div style={{ fontSize:'.68rem', color:'#94a3b8', marginTop:3 }}>{act.time}</div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
}
