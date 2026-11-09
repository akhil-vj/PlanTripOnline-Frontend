import { useState, useEffect, useRef, Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { adminGet } from '../config/api';
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
import CountriesManager     from '../components/admin/content/CountriesManager';
import ReviewsManager       from '../components/admin/content/ReviewsManager';
import AdminProfileSettings from '../components/admin/AdminProfileSettings';

/* ── Error Boundary ─────────────────────────────────────────────────────── */
class PanelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, msg: '' }; }
  static getDerivedStateFromError(e) { return { hasError: true, msg: e?.message || 'Unexpected error' }; }
  componentDidCatch(e, info) { console.error('[AdminPanel]', e, info); }
  render() {
    if (this.state.hasError) return (
      <div style={{ textAlign:'center', padding:'80px 24px' }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>💥</div>
        <h3 style={{ color:'#0f172a', marginBottom:8, fontSize:'1.1rem', fontWeight:800 }}>Something went wrong</h3>
        <p style={{ color:'#64748b', marginBottom:24, fontSize:'.88rem' }}>{this.state.msg}</p>
        <button onClick={() => this.setState({ hasError: false })}
          style={{ padding:'11px 28px', background:'linear-gradient(135deg,#f97316,#fb923c)', color:'#fff',
            border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', fontSize:'.88rem',
            boxShadow:'0 4px 14px rgba(249,115,22,.35)' }}>
          Try Again
        </button>
      </div>
    );
    return this.props.children;
  }
}

/* ── Nav definitions ────────────────────────────────────────────────────── */
const NAV_MAIN = [
  { label:'Overview',  path:'', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact:true },
  { label:'Bookings',  path:'bookings',  icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label:'Enquiries', path:'enquiries', icon:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
];
const NAV_CONTENT = [
  { label:'Day Tours',     path:'day-tours',    icon:'M12 3v2m0 14v2m9-9h-2M5 12H3m14.364 5.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z' },
  { label:'Tour Packages', path:'tour-packages', icon:'M16.5 9.4L7.55 4.24M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12' },
  { label:'Hotels',        path:'hotels',        icon:'M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3a1 1 0 011-1h2a1 1 0 011 1v3' },
  { label:'Transfers',     path:'transfers',     icon:'M5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0zm-13-4h12l-1.5-4.5A2 2 0 0014.6 7H9.4a2 2 0 00-1.9 1.5L6 13zM2 13h20' },
  { label:'Destinations',  path:'destinations',  icon:'M12 21s-6-5.686-6-10a6 6 0 0112 0c0 4.314-6 10-6 10zm0-7a3 3 0 100-6 3 3 0 000 6z' },
  { label:'Reviews',       path:'reviews',       icon:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
];
const NAV_SETTINGS = [
  { label:'Users',       path:'users',       icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label:'Promo Codes', path:'promo-codes', icon:'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { label:'Countries',   path:'countries',   icon:'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 3 4 6.5 4 10s-1.5 7-4 10m0-20C9.5 5 8 8.5 8 12s1.5 7 4 10M2 12h20' },
];
const NAV_ALL = [
  ...NAV_MAIN,
  ...NAV_CONTENT,
  ...NAV_SETTINGS,
  { label:'Profile', path:'profile' },
];

/* ── Panel map ──────────────────────────────────────────────────────────── */
const PANELS = {
  '':              <AdminOverview />,
  'bookings':      <BookingsList />,
  'enquiries':     <EnquiriesList />,
  'users':         <UsersList />,
  'promo-codes':   <PromoCodesList />,
  'day-tours':     <DayToursManager />,
  'tour-packages': <TourPackagesManager />,
  'hotels':        <HotelsManager />,
  'transfers':     <TransfersManager />,
  'destinations':  <DestinationsManager />,
  'countries':     <CountriesManager />,
  'reviews':       <ReviewsManager />,
  'profile':       <AdminProfileSettings />,
};

/* ── SVG icon ───────────────────────────────────────────────────────────── */
const Ico = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ── Nav link ───────────────────────────────────────────────────────────── */
function NavLink({ item, active, collapsed }) {
  return (
    <Link
      to={`/admin-dashboard${item.path ? `/${item.path}` : ''}`}
      className={`adm-nav-link${active ? ' active' : ''}`}
      aria-label={item.label}
    >
      <span className="adm-nav-icon">
        <Ico d={item.icon} size={19} />
      </span>
      <span className="adm-nav-label">{item.label}</span>
      {active && !collapsed && <span className="adm-nav-dot" />}
      {collapsed && <span className="adm-tooltip">{item.label}</span>}
    </Link>
  );
}

/* ── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*, *::before, *::after { box-sizing: border-box; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 99px; }
.adm-main ::-webkit-scrollbar-thumb { background: #cbd5e1; }

/* ── Sidebar ── */
.adm-sidebar {
  width: 250px;
  background: linear-gradient(180deg,#0a0e17 0%,#101625 50%,#131a2c 100%);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; height: 100vh; z-index: 200;
  transition: width .24s cubic-bezier(.4,0,.2,1);
  overflow: visible;
  border-right: 1px solid rgba(255,255,255,.055);
  box-shadow: 4px 0 28px rgba(0,0,0,.38);
}
.adm-sidebar.collapsed { width: 70px; }
@media(max-width:900px){
  .adm-sidebar { transform: translateX(-100%); transition: transform .25s ease; width: 250px; }
  .adm-sidebar.mobile-open { transform: translateX(0); }
}
.adm-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,.55);
  z-index: 199; backdrop-filter: blur(3px);
}
@media(max-width:900px){ .adm-overlay { display: block; } }

/* ── Brand Header ── */
.adm-brand-link {
  padding: 18px 16px 16px;
  display: flex; align-items: center; gap: 12px;
  text-decoration: none; position: relative;
  border-bottom: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0; transition: all .2s;
}
.adm-brand-badge {
  width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg,#f97316 0%,#ea580c 100%);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(249,115,22,.4), inset 0 1px 1px rgba(255,255,255,.35);
  transition: transform .2s cubic-bezier(.4,0,.2,1);
}
.adm-brand-link:hover .adm-brand-badge {
  transform: scale(1.04);
}
.adm-brand-details {
  display: flex; flex-direction: column; min-width: 0; overflow: hidden;
  transition: opacity .18s;
}
.adm-brand-name {
  font-size: 1.15rem; font-weight: 800; line-height: 1.15;
  letter-spacing: -.4px; display: flex; align-items: center; gap: 6px;
}
.adm-brand-white { color: #ffffff; }
.adm-brand-accent { color: #fb923c; }
.adm-brand-tag {
  font-size: .56rem; font-weight: 800; letter-spacing: .8px;
  background: rgba(249,115,22,.18); color: #f97316;
  border: 1px solid rgba(249,115,22,.35); border-radius: 5px;
  padding: 1px 5px; line-height: 1.2;
}
.adm-brand-sub {
  font-size: .65rem; font-weight: 600; color: rgba(255,255,255,.38);
  letter-spacing: .6px; margin-top: 3px; display: flex; align-items: center; gap: 5px;
}
.adm-brand-status-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #10b981;
  box-shadow: 0 0 6px rgba(16,185,129,.7); display: inline-block;
}

/* Collapsed brand */
.adm-sidebar.collapsed .adm-brand-link {
  padding: 16px 0; justify-content: center;
}
.adm-sidebar.collapsed .adm-brand-details {
  display: none !important;
}

/* ── Nav Scroll Container ── */
.adm-nav { flex: 1; padding: 12px 10px; overflow-y: auto; overflow-x: visible; }
.adm-sidebar.collapsed .adm-nav { padding: 12px 0; }

.adm-nav-section {
  padding: 10px 10px 4px;
  font-size: .56rem; font-weight: 800; color: rgba(255,255,255,.2);
  text-transform: uppercase; letter-spacing: 1.8px;
  white-space: nowrap; overflow: hidden;
}
.adm-sidebar.collapsed .adm-nav-section { display: none !important; }

.adm-nav-divider { height: 1px; background: rgba(255,255,255,.05); margin: 6px 8px; }
.adm-sidebar.collapsed .adm-nav-divider { width: 28px; margin: 8px auto; opacity: .6; }

/* ── Nav Links ── */
.adm-nav-link {
  display: flex; align-items: center; gap: 11px;
  padding: 9px 12px; border-radius: 12px; margin: 2px 0;
  color: rgba(255,255,255,.5); text-decoration: none;
  font-size: .84rem; font-weight: 500;
  transition: all .16s ease; white-space: nowrap;
  position: relative;
}
.adm-nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,.07);
}
.adm-nav-link.active {
  color: #fff;
  background: linear-gradient(135deg,rgba(249,115,22,.24),rgba(251,146,60,.12));
  font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(249,115,22,.32);
}
.adm-nav-icon {
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
}
.adm-nav-label { transition: opacity .18s; }
.adm-nav-dot {
  position: absolute; right: 12px; width: 6px; height: 6px;
  border-radius: 50%; background: #f97316;
  box-shadow: 0 0 8px rgba(249,115,22,.8);
}

/* Collapsed nav link tiles */
.adm-sidebar.collapsed .adm-nav-link {
  width: 44px; height: 44px; margin: 5px auto; padding: 0;
  justify-content: center; border-radius: 12px;
}
.adm-sidebar.collapsed .adm-nav-label,
.adm-sidebar.collapsed .adm-nav-dot {
  display: none !important;
}

/* ── Floating Tooltip for Collapsed Mode ── */
.adm-tooltip {
  position: absolute; left: calc(100% + 14px); top: 50%;
  transform: translateY(-50%) translateX(-6px);
  background: #0f172a; color: #ffffff;
  font-size: .76rem; font-weight: 700; font-family: 'Inter', system-ui, sans-serif;
  white-space: nowrap; padding: 6px 13px; border-radius: 9px;
  box-shadow: 0 8px 24px rgba(0,0,0,.45), 0 2px 6px rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.12);
  pointer-events: none; opacity: 0; visibility: hidden;
  transition: opacity .15s ease, transform .15s ease, visibility .15s;
  z-index: 9999;
}
.adm-tooltip::before {
  content: ''; position: absolute; right: 100%; top: 50%;
  margin-top: -5px; border-width: 5px; border-style: solid;
  border-color: transparent #0f172a transparent transparent;
}
.adm-sidebar.collapsed .adm-nav-link:hover .adm-tooltip,
.adm-sidebar.collapsed .adm-brand-link:hover .adm-tooltip,
.adm-sidebar.collapsed .adm-user-box:hover .adm-tooltip,
.adm-sidebar.collapsed .adm-logout-btn:hover .adm-tooltip {
  opacity: 1; visibility: visible;
  transform: translateY(-50%) translateX(0);
}

/* ── User Box ── */
.adm-user-box {
  padding: 12px 14px; border-top: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; gap: 11px; overflow: visible; flex-shrink: 0;
  cursor: pointer; text-decoration: none; position: relative;
  transition: background .18s;
}
.adm-user-box:hover { background: rgba(255,255,255,.06); }
.adm-avatar {
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg,#f97316,#fb923c);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: #fff; font-size: .95rem;
  box-shadow: 0 3px 10px rgba(249,115,22,.35);
}
.adm-user-info { overflow: hidden; min-width: 0; flex: 1; }
.adm-user-name  { font-size: .82rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.adm-user-role  { font-size: .64rem; color: rgba(255,255,255,.35); white-space: nowrap; letter-spacing: .3px; }
.adm-user-edit  { flex-shrink: 0; color: rgba(255,255,255,.25); transition: color .18s; }
.adm-user-box:hover .adm-user-edit { color: #f97316; }

/* Collapsed user box */
.adm-sidebar.collapsed .adm-user-box {
  padding: 12px 0; justify-content: center; width: 100%;
}
.adm-sidebar.collapsed .adm-user-info,
.adm-sidebar.collapsed .adm-user-edit {
  display: none !important;
}

/* ── Logout Button ── */
.adm-logout-btn {
  width: 100%; padding: 12px 14px; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 11px;
  color: rgba(255,255,255,.4); font-size: .82rem; font-weight: 500;
  font-family: inherit; transition: all .18s;
  border-top: 1px solid rgba(255,255,255,.05); flex-shrink: 0;
  position: relative;
}
.adm-logout-btn:hover { color: #ef4444; background: rgba(239,68,68,.08); }

/* Collapsed logout */
.adm-sidebar.collapsed .adm-logout-btn {
  width: 44px; height: 44px; margin: 8px auto 10px; padding: 0;
  border-radius: 12px; border-top: none; justify-content: center;
}
.adm-sidebar.collapsed .adm-logout-btn .adm-nav-label {
  display: none !important;
}

/* ── Main Area ── */
.adm-main {
  margin-left: 250px; flex: 1; display: flex; flex-direction: column;
  min-height: 100vh; transition: margin-left .24s cubic-bezier(.4,0,.2,1);
  background: #f4f7fb;
}
.adm-main.collapsed { margin-left: 70px; }
@media(max-width:900px){ .adm-main, .adm-main.collapsed { margin-left: 0; } }

/* ── Topbar ── */
.adm-topbar {
  background: rgba(255,255,255,.95); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226,232,240,.8);
  padding: 0 28px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 20px rgba(15,23,42,.06);
  flex-shrink: 0;
}
.adm-topbar-left { display: flex; align-items: center; gap: 14px; }
.adm-toggle-btn {
  background: #fff; border: 1.5px solid #e2e8f0; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;
  border-radius: 10px; transition: all .15s;
}
.adm-toggle-btn:hover { background: #fff7ed; border-color: #f97316; color: #f97316; }
.adm-breadcrumb {
  display: flex; align-items: center; gap: 7px;
}
.adm-breadcrumb-root { font-size: .78rem; color: #94a3b8; font-weight: 500; }
.adm-breadcrumb-sep  { color: #cbd5e1; font-size: .75rem; }
.adm-page-title { font-size: .95rem; font-weight: 800; color: #0f172a; }

.adm-topbar-right { display: flex; align-items: center; gap: 8px; }
.adm-topbar-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 15px; border-radius: 10px;
  font-size: .8rem; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: all .15s;
  border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
  text-decoration: none;
}
.adm-topbar-btn:hover { border-color: #f97316; color: #f97316; background: #fff7ed; }
.adm-topbar-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 10px;
  border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
  cursor: pointer; position: relative; transition: all .15s;
}
.adm-topbar-icon-btn:hover { border-color: #f97316; color: #f97316; background: #fff7ed; }

/* ── Content ── */
.adm-content { padding: 28px; flex: 1; }
@media(max-width:640px){ .adm-content { padding: 16px; } }

/* ── Animations ── */
@keyframes admPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes admFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.adm-content > * { animation: admFadeIn .22s ease; }
`;

/* ── Dashboard Component ────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const timerRef = useRef(null);

  const userName  = localStorage.getItem('userName')  || 'Admin';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const d = await adminGet('/api/admin/notifications/count');
        setNotifCount((d?.pending_bookings ?? 0) + (d?.pending_enquiries ?? 0) + (d?.pending_reviews ?? 0));
      } catch (_) {}
    }
    fetchNotifs();
    timerRef.current = setInterval(fetchNotifs, 60_000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  function handleLogout() {
    ['token','userRole','userName','userEmail'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  }

  function isActive(path, exact) {
    const base = '/admin-dashboard';
    if (exact) return location.pathname === base || location.pathname === base + '/';
    return location.pathname.startsWith(`${base}/${path}`);
  }

  const subKey    = location.pathname.replace('/admin-dashboard', '').replace(/^\//, '');
  const pageTitle = NAV_ALL.find(n => isActive(n.path, n.exact))?.label || 'Dashboard';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f4f7fb', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Helmet><title>{pageTitle} – PlantripOnline Admin</title></Helmet>
      <style>{CSS}</style>

      {/* Mobile overlay */}
      {mobileOpen && <div className="adm-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>

        {/* Brand Header */}
        <Link to="/admin-dashboard" className="adm-brand-link" title={collapsed ? 'PlanTrip Admin' : undefined}>
          <div className="adm-brand-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffffff', transform: 'rotate(45deg)', transformOrigin: 'center' }}>
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <div className="adm-brand-details">
            <div className="adm-brand-name">
              <span className="adm-brand-white">Plan</span><span className="adm-brand-accent">trip</span>
              <span className="adm-brand-tag">ADMIN</span>
            </div>
            <div className="adm-brand-sub">
              <span className="adm-brand-status-dot" />
              Operations Center
            </div>
          </div>
          {collapsed && <span className="adm-tooltip">PlanTrip Admin</span>}
        </Link>

        {/* Nav */}
        <nav className="adm-nav">
          <div className="adm-nav-section">Main</div>
          {NAV_MAIN.map(item => (
            <NavLink key={item.path} item={item} active={isActive(item.path, item.exact)} collapsed={collapsed} />
          ))}

          <div className="adm-nav-divider" style={{ marginTop:8 }} />
          <div className="adm-nav-section">Content</div>
          {NAV_CONTENT.map(item => (
            <NavLink key={item.path} item={item} active={isActive(item.path)} collapsed={collapsed} />
          ))}

          <div className="adm-nav-divider" style={{ marginTop:8 }} />
          <div className="adm-nav-section">Settings</div>
          {NAV_SETTINGS.map(item => (
            <NavLink key={item.path} item={item} active={isActive(item.path)} collapsed={collapsed} />
          ))}

          <div className="adm-nav-divider" style={{ marginTop:8 }} />
          <a href="/" target="_blank" rel="noreferrer"
            className="adm-nav-link" aria-label="Live Site">
            <span className="adm-nav-icon">
              <Ico d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" size={19} />
            </span>
            <span className="adm-nav-label">Live Site</span>
            {collapsed && <span className="adm-tooltip">Live Site ↗</span>}
          </a>
        </nav>

        {/* User box → Profile */}
        <Link to="/admin-dashboard/profile" className="adm-user-box" aria-label="Profile">
          <div className="adm-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="adm-user-info">
            <div className="adm-user-name">{userName}</div>
            <div className="adm-user-role">{userEmail || 'Administrator'}</div>
          </div>
          <svg className="adm-user-edit" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          {collapsed && <span className="adm-tooltip">{userName} · Profile</span>}
        </Link>

        {/* Logout */}
        <button className="adm-logout-btn" onClick={handleLogout} aria-label="Logout">
          <Ico d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={17} />
          <span className="adm-nav-label">Logout</span>
          {collapsed && <span className="adm-tooltip">Logout</span>}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className={`adm-main${collapsed ? ' collapsed' : ''}`}>

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              className="adm-toggle-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => { setCollapsed(c => !c); setMobileOpen(o => !o); }}
            >
              <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {collapsed ? (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <polyline points="14 10 16 12 14 14" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <polyline points="15 14 13 12 15 10" />
                  </>
                )}
              </svg>
            </button>
            <div className="adm-breadcrumb">
              <span className="adm-breadcrumb-root">Admin</span>
              {pageTitle !== 'Overview' && <>
                <span className="adm-breadcrumb-sep">/</span>
                <span className="adm-page-title">{pageTitle}</span>
              </>}
              {pageTitle === 'Overview' && <span className="adm-page-title">Overview</span>}
            </div>
          </div>

          <div className="adm-topbar-right">
            {/* Notifications */}
            {notifCount > 0 && (
              <button className="adm-topbar-icon-btn" onClick={() => navigate('/admin-dashboard/bookings')}
                title={`${notifCount} pending item${notifCount > 1 ? 's' : ''}`}>
                <Ico d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={17} />
                <span style={{
                  position:'absolute', top:3, right:3, background:'#ef4444', color:'#fff',
                  borderRadius:999, fontSize:'.58rem', fontWeight:900,
                  minWidth:15, height:15, display:'flex', alignItems:'center',
                  justifyContent:'center', padding:'0 3px', lineHeight:1,
                }}>{notifCount > 99 ? '99+' : notifCount}</span>
              </button>
            )}

            <a href="/" target="_blank" rel="noreferrer" className="adm-topbar-btn">
              <Ico d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" size={13} />
              View Site
            </a>
            <button className="adm-topbar-btn" onClick={handleLogout}>
              <Ico d="M17 16l4-4m0 0l-4-4m4 4H7" size={13} />
              Logout
            </button>
          </div>
        </header>

        {/* Panel content */}
        <div className="adm-content">
          <PanelErrorBoundary key={subKey}>
            {PANELS[subKey] ?? (
              <div style={{ textAlign:'center', padding:'80px 24px', color:'#64748b' }}>
                <div style={{ fontSize:'3.5rem', marginBottom:20 }}>🚧</div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:800, color:'#0f172a', marginBottom:10 }}>Coming Soon</h3>
                <p style={{ fontSize:'.9rem' }}>This module is under development.</p>
              </div>
            )}
          </PanelErrorBoundary>
        </div>
      </main>
    </div>
  );
}
