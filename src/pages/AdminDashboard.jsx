import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminOverview        from '../components/admin/AdminOverview';
import BookingsList         from '../components/admin/BookingsList';
import EnquiriesList        from '../components/admin/EnquiriesList';
import UsersList            from '../components/admin/UsersList';
import PromoCodesList       from '../components/admin/PromoCodesList';
import DayToursManager      from '../components/admin/content/DayToursManager';
import TourPackagesManager  from '../components/admin/content/TourPackagesManager';
import HotelsManager        from '../components/admin/content/HotelsManager';
import TransfersManager     from '../components/admin/content/TransfersManager';
import DestinationsManager  from '../components/admin/content/DestinationsManager';

/* ── Icons ───────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV_MAIN = [
  { label: 'Overview',    path: '',            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact: true },
  { label: 'Bookings',    path: 'bookings',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Enquiries',   path: 'enquiries',   icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { label: 'Users',       path: 'users',       icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Promo Codes', path: 'promo-codes', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
];

const NAV_CONTENT = [
  { label: 'Day Tours',     path: 'day-tours',     emoji: '🏖️' },
  { label: 'Tour Packages', path: 'tour-packages',  emoji: '📦' },
  { label: 'Hotels',        path: 'hotels',         emoji: '🏨' },
  { label: 'Transfers',     path: 'transfers',      emoji: '🚗' },
  { label: 'Destinations',  path: 'destinations',   emoji: '📍' },
];

// Combined for page title lookup
const NAV = [...NAV_MAIN, ...NAV_CONTENT];

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName  = localStorage.getItem('userName') || 'Admin';
  const userEmail = localStorage.getItem('userEmail') || 'admin@plantriponline.com';

  function handleLogout() {
    ['token','userRole','userName','userEmail'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  }

  function isActive(path, exact) {
    const base = '/admin-dashboard';
    if (exact) return location.pathname === base || location.pathname === base + '/';
    return location.pathname.startsWith(`${base}/${path}`);
  }

  /* Close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f1f5f9', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Helmet><title>Admin Dashboard – PlantripOnline</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

        .adm-sidebar {
          width: 240px; background: #0f172a; display: flex; flex-direction: column;
          transition: width .25s cubic-bezier(.4,0,.2,1); position: fixed; top: 0; left: 0;
          height: 100vh; z-index: 200; overflow: hidden;
        }
        .adm-sidebar.collapsed { width: 68px; }
        @media(max-width:900px){
          .adm-sidebar { transform: translateX(-100%); transition: transform .25s ease; }
          .adm-sidebar.mobile-open { transform: translateX(0); width: 240px; }
        }
        .adm-overlay { display:none; }
        @media(max-width:900px){
          .adm-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,.5);
            z-index:199; backdrop-filter:blur(2px); }
        }
        .adm-main { margin-left: 240px; flex:1; display:flex; flex-direction:column;
          transition: margin-left .25s cubic-bezier(.4,0,.2,1); min-height:100vh; }
        .adm-main.collapsed { margin-left: 68px; }
        @media(max-width:900px){ .adm-main, .adm-main.collapsed { margin-left:0; } }

        .adm-logo { padding: 22px 20px 18px; border-bottom: 1px solid rgba(255,255,255,.07);
          display:flex; align-items:center; gap:10px; white-space:nowrap; overflow:hidden; }
        .adm-logo-text { font-size:1.1rem; font-weight:900; color:#fff; letter-spacing:-.5px; }
        .adm-logo-text span { color:#f97316; }

        .adm-nav { flex:1; padding:12px 0; overflow-y:auto; overflow-x:hidden; }
        .adm-nav-link {
          display:flex; align-items:center; gap:12px; padding:11px 18px;
          color:rgba(255,255,255,.55); text-decoration:none; font-size:.85rem; font-weight:500;
          transition:all .18s; white-space:nowrap; overflow:hidden; cursor:pointer;
          border-left: 3px solid transparent; margin: 2px 0;
        }
        .adm-nav-link:hover { color:#fff; background:rgba(255,255,255,.06); border-left-color:rgba(249,115,22,.4); }
        .adm-nav-link.active { color:#f97316; background:rgba(249,115,22,.1); border-left-color:#f97316; font-weight:700; }
        .adm-nav-label { transition: opacity .2s; }
        .adm-sidebar.collapsed .adm-nav-label { opacity:0; pointer-events:none; width:0; }
        .adm-nav-icon { flex-shrink:0; }

        .adm-nav-section { padding: 12px 18px 4px; font-size:.62rem; font-weight:800;
          color:rgba(255,255,255,.25); text-transform:uppercase; letter-spacing:1.4px;
          white-space:nowrap; overflow:hidden; transition:opacity .2s; }
        .adm-sidebar.collapsed .adm-nav-section { opacity:0; }

        .adm-user-box { padding:14px; border-top:1px solid rgba(255,255,255,.07);
          display:flex; align-items:center; gap:10px; overflow:hidden; }
        .adm-avatar { width:36px; height:36px; border-radius:50%;
          background:linear-gradient(135deg,#f97316,#fb923c); display:flex; align-items:center;
          justify-content:center; font-weight:800; color:#fff; font-size:.9rem; flex-shrink:0; }
        .adm-user-info { overflow:hidden; }
        .adm-user-name { font-size:.82rem; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .adm-user-email { font-size:.68rem; color:rgba(255,255,255,.35); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .adm-sidebar.collapsed .adm-user-info { display:none; }

        .adm-topbar { background:#fff; border-bottom:1px solid #e2e8f0; padding:0 28px;
          height:64px; display:flex; align-items:center; justify-content:space-between;
          position:sticky; top:0; z-index:100; box-shadow:0 1px 8px rgba(0,0,0,.06); }
        .adm-topbar-left { display:flex; align-items:center; gap:14px; }
        .adm-toggle-btn { background:none; border:none; cursor:pointer; color:#64748b;
          display:flex; align-items:center; padding:6px; border-radius:8px; transition:all .15s; }
        .adm-toggle-btn:hover { background:#f1f5f9; color:#0f172a; }
        .adm-page-title { font-size:1.1rem; font-weight:800; color:#0f172a; }
        .adm-topbar-right { display:flex; align-items:center; gap:10px; }
        .adm-topbar-btn { background:none; border:1px solid #e2e8f0; cursor:pointer; color:#64748b;
          display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px;
          font-size:.82rem; font-weight:600; font-family:inherit; transition:all .15s; }
        .adm-topbar-btn:hover { border-color:#f97316; color:#f97316; background:#fff7ed; }

        .adm-content { padding:28px; flex:1; }
        @media(max-width:640px){ .adm-content { padding:16px; } }

        .adm-logout-btn { width:100%; padding:10px 18px; background:none; border:none;
          cursor:pointer; display:flex; align-items:center; gap:12px; color:rgba(255,255,255,.45);
          font-size:.82rem; font-weight:500; font-family:inherit; transition:all .18s;
          border-top:1px solid rgba(255,255,255,.07); margin-top:auto; }
        .adm-logout-btn:hover { color:#ef4444; background:rgba(239,68,68,.08); }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && <div className="adm-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Logo */}
        <div className="adm-logo">
          <img src="/favicon.svg" alt="" width={28} height={28} style={{ filter:'brightness(0) invert(1)', flexShrink:0 }} />
          <span className="adm-logo-text">Plan<span>Trip</span> Admin</span>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          <div className="adm-nav-section">Main</div>
          {NAV_MAIN.map(item => (
            <Link key={item.path}
              to={`/admin-dashboard${item.path ? `/${item.path}` : ''}`}
              className={`adm-nav-link${isActive(item.path, item.exact) ? ' active' : ''}`}
              title={collapsed ? item.label : undefined}>
              <span className="adm-nav-icon">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon}/>
                </svg>
              </span>
              <span className="adm-nav-label">{item.label}</span>
            </Link>
          ))}

          <div className="adm-nav-section" style={{marginTop:8}}>Content</div>
          {NAV_CONTENT.map(item => (
            <Link key={item.path}
              to={`/admin-dashboard/${item.path}`}
              className={`adm-nav-link${isActive(item.path) ? ' active' : ''}`}
              title={collapsed ? item.label : undefined}>
              <span className="adm-nav-icon" style={{fontSize:'1rem'}}>{item.emoji}</span>
              <span className="adm-nav-label">{item.label}</span>
            </Link>
          ))}

          <div className="adm-nav-section" style={{marginTop:8}}>View Site</div>
          <a href="/" target="_blank" rel="noreferrer"
            className="adm-nav-link" title={collapsed ? 'Live Site' : undefined}>
            <span className="adm-nav-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </span>
            <span className="adm-nav-label">Live Site</span>
          </a>
        </nav>

        {/* User box */}
        <div className="adm-user-box">
          <div className="adm-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="adm-user-info">
            <div className="adm-user-name">{userName}</div>
            <div className="adm-user-email">{userEmail}</div>
          </div>
        </div>

        {/* Logout */}
        <button className="adm-logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="adm-nav-label">Logout</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className={`adm-main${collapsed ? ' collapsed' : ''}`}>
        {/* Top bar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-toggle-btn" onClick={() => { setCollapsed(c => !c); setMobileOpen(o => !o); }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="adm-page-title">
              {NAV.find(n => isActive(n.path, n.exact))?.label || 'Admin'}
            </span>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-topbar-btn" onClick={handleLogout}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="adm-content">
          {/* Panel switcher — reads pathname directly (no nested Routes needed) */}
          {(() => {
            const sub = location.pathname.replace('/admin-dashboard', '').replace(/^\//, '');
            const panels = {
              '':             <AdminOverview />,
              'bookings':     <BookingsList />,
              'enquiries':    <EnquiriesList />,
              'users':        <UsersList />,
              'promo-codes':  <PromoCodesList />,
              'day-tours':    <DayToursManager />,
              'tour-packages':<TourPackagesManager />,
              'hotels':       <HotelsManager />,
              'transfers':    <TransfersManager />,
              'destinations': <DestinationsManager />,
            };
            return panels[sub] ?? (
              <div style={{textAlign:'center',padding:'80px 24px',color:'#64748b'}}>
                <div style={{fontSize:'3rem',marginBottom:16}}>🚧</div>
                <h3 style={{fontSize:'1.2rem',fontWeight:800,color:'#0f172a',marginBottom:8}}>Coming Soon</h3>
                <p style={{fontSize:'.9rem'}}>This module is under development.</p>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
