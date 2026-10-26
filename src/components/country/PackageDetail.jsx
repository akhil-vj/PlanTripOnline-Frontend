import { useState } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NATIONALITIES = ['India','USA','UK','Australia','Singapore','Malaysia','Thailand','UAE','China','Japan','Germany','France','Other'];
const COUNTRY_CODES = ['+91','+1','+44','+61','+65','+60','+66','+971','+81','+49'];
const ROOM_OPTIONS  = ['Single Room','Double Room','Twin Room','Triple Room','Family Room','Suite'];
const HOTEL_OPTIONS = ['3 Star','4 Star','5 Star','Boutique','Budget Friendly'];

function enrichPkg(pkg) {
  if (!pkg) return null;
  return {
    ...pkg,
    inclusions: pkg.inclusions || ['✅ Hotel accommodation as per package','✅ Daily breakfast','✅ All transfers mentioned','✅ English speaking guide','✅ All entrance fees','✅ Airport pickup & drop'],
    exclusions: pkg.exclusions || ['❌ International flights','❌ Travel insurance','❌ Personal expenses','❌ Optional activities','❌ Meals unless stated'],
    itinerary:  pkg.itinerary  || [
      { day: 'Day 1', title: 'Arrival & Welcome', desc: 'Arrive at the airport, transfer to your hotel. Rest and welcome dinner.' },
      { day: 'Day 2', title: 'City Highlights', desc: 'Full-day guided sightseeing of key attractions including temples, markets, and iconic landmarks.' },
      { day: 'Day 3', title: 'Leisure & Explore', desc: 'Free morning for leisure. Optional activities available. Afternoon optional tour.' },
      { day: 'Day 4', title: 'Departure', desc: 'Breakfast at hotel. Transfer to airport for departure.' },
    ],
    reviewsList: pkg.reviews_list || [
      { name: 'Anjali S.', country: '🇮🇳 India', rating: 5, comment: 'Perfect package! Everything was well organised and the hotels were excellent.', date: 'Oct 2026' },
      { name: 'Michael T.', country: '🇦🇺 Australia', rating: 5, comment: 'Great value for money. The itinerary was packed but not rushed. Loved it!', date: 'Sep 2026' },
      { name: 'Mei L.',    country: '🇸🇬 Singapore', rating: 4, comment: 'Very smooth experience. Would have liked one more free day, but overall brilliant.', date: 'Sep 2026' },
    ],
    basePrice: pkg.basePrice || parseFloat((pkg.price || '$0').replace(/[^0-9.]/g, '')),
  };
}

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'inclusions', label: 'Inclusions / Exclusions' },
  { id: 'itinerary',  label: 'Itinerary' },
  { id: 'reviews',    label: 'Reviews' },
];

export default function PackageDetail() {
  const data           = useOutletContext();
  const { packageSlug } = useParams();
  const location       = useLocation();
  const navigate       = useNavigate();

  const rawPkg = location.state?.pkg
    || (data.tourPackages || []).find(p => p.id === packageSlug);
  const pkg = enrichPkg(rawPkg);

  const [activeTab,   setActiveTab]   = useState('overview');
  const [showBooking, setShowBooking] = useState(false);

  // form state
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [nationality, setNation]      = useState('India');
  const [adults,      setAdults]      = useState(2);
  const [children,    setChildren]    = useState(0);
  const [arrDate,     setArrDate]     = useState('');
  const [depDate,     setDepDate]     = useState('');
  const [email,       setEmail]       = useState('');
  const [whatsapp,    setWhatsapp]    = useState('');
  const [wCode,       setWCode]       = useState('+91');
  const [tel,         setTel]         = useState('');
  const [tCode,       setTCode]       = useState('+91');
  const [arrFlight,   setArrFlight]   = useState('');
  const [arrAirport,  setArrAirport]  = useState('');
  const [depFlight,   setDepFlight]   = useState('');
  const [depAirport,  setDepAirport]  = useState('');
  const [roomType,    setRoomType]    = useState('Double Room');
  const [hotelPref,   setHotelPref]   = useState('4 Star');
  const [note,        setNote]        = useState('');
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);

  const adultTotal = pkg ? pkg.basePrice * adults : 0;
  const childTotal = pkg ? (pkg.basePrice * 0.7) * children : 0;
  const total      = adultTotal + childTotal;

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim())  e.lastName  = 'Required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!arrDate) e.arrDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm(e) {
    e.preventDefault();
    if (!validate()) return;
    navigate('/book-trip', {
      state: {
        destination: pkg.title,
        country: data.name,
        image: pkg.image,
        price: `$${total}`,
        prefill: { firstName, lastName, nationality, adults, children, arrDate, depDate, email, whatsapp:`${wCode}${whatsapp}`, tel:`${tCode}${tel}`, arrFlight, arrAirport, depFlight, depAirport, roomType, hotelPref, note, total },
        paymentMethod: 'online',
      }
    });
  }

  if (!pkg) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
        <h2 style={{ fontSize:'2rem', color:'#1e293b' }}>Package not found</h2>
        <button type="button" onClick={() => navigate(-1)} style={{ padding:'12px 28px', background:'#f97316', color:'white', border:'none', borderRadius:50, cursor:'pointer', fontWeight:700 }}>← Go Back</button>
      </div>
    );
  }

  const starBar = n => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="pd-page">
      <Helmet>
        <title>{pkg.title} – {data.name} Packages | PlantripOnline</title>
        <meta name="description" content={pkg.subtitle || pkg.title} />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .pd-page { background:#f8fafc; min-height:100vh; font-family:'Inter',system-ui,sans-serif; }

        /* Hero */
        .pd-hero { position:relative; height:62vh; min-height:440px; overflow:hidden; }
        .pd-hero img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.35); transform:scale(1.06); transition:transform 10s ease; }
        .pd-hero:hover img { transform:scale(1.1); }
        .pd-hero-overlay { position:absolute; inset:0; background:linear-gradient(160deg,rgba(0,0,0,0.05) 0%,rgba(15,23,42,0.28) 40%,rgba(15,23,42,0.92) 100%); }
        .pd-back-btn { position:absolute; top:72px; left:48px; z-index:3; display:inline-flex; align-items:center; gap:7px; background:rgba(0,0,0,0.28); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.9); font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px 18px; border-radius:50px; font-family:inherit; transition:all 0.2s; }
        .pd-back-btn:hover { background:rgba(0,0,0,0.45); color:white; }
        .pd-hero-content { position:absolute; bottom:0; left:0; right:0; z-index:2; padding:0 48px 40px; }
        .pd-hero-badge { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; padding:5px 16px; border-radius:50px; font-size:0.72rem; font-weight:800; letter-spacing:1px; text-transform:uppercase; box-shadow:0 4px 12px rgba(249,115,22,0.4); margin-bottom:14px; }
        .pd-hero-content h1 { font-size:3rem; font-weight:900; color:white; letter-spacing:-2px; line-height:1.06; text-shadow:0 4px 24px rgba(0,0,0,0.5); margin-bottom:18px; max-width:820px; }
        .pd-hero-stats { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .pd-hero-stat { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); backdrop-filter:blur(10px); padding:8px 16px; border-radius:50px; font-size:0.82rem; font-weight:600; color:white; }
        .pd-hero-stat.price { background:rgba(249,115,22,0.25); border-color:rgba(249,115,22,0.55); }
        .pd-hero-stat.price strong { color:#fb923c; font-size:1rem; font-weight:900; }

        /* Tab bar */
        .pd-tab-bar { background:white; border-bottom:2px solid #f1f5f9; position:sticky; top:0; z-index:100; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .pd-tab-inner { max-width:1280px; margin:0 auto; padding:0 1.5rem; display:flex; gap:4px; overflow-x:auto; scrollbar-width:none; }
        .pd-tab-inner::-webkit-scrollbar { display:none; }
        .pd-tab-btn { padding:18px 22px; font-size:0.88rem; font-weight:600; color:#64748b; border:none; background:none; cursor:pointer; white-space:nowrap; border-bottom:3px solid transparent; margin-bottom:-2px; transition:all 0.2s; font-family:inherit; }
        .pd-tab-btn:hover { color:#f97316; }
        .pd-tab-btn.active { color:#f97316; border-bottom-color:#f97316; }

        /* Body layout */
        .pd-body { max-width:1280px; margin:0 auto; padding:40px 1.5rem 80px; display:grid; grid-template-columns:1fr 380px; gap:36px; align-items:start; }
        @media(max-width:1024px){ .pd-body { grid-template-columns:1fr; } }

        /* Content panel */
        .pd-panel { background:white; border-radius:20px; padding:36px; box-shadow:0 4px 20px rgba(0,0,0,0.06); }
        .pd-panel h2 { font-size:1.5rem; font-weight:800; color:#1e293b; margin-bottom:20px; }
        .pd-panel p { color:#64748b; line-height:1.7; font-size:0.95rem; }
        .pd-inc-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media(max-width:640px){ .pd-inc-grid { grid-template-columns:1fr; } }
        .pd-inc-item { background:#f8fafc; border-radius:10px; padding:12px 16px; font-size:0.88rem; color:#334155; font-weight:500; }
        .pd-inc-item.ex { background:#fff1f2; color:#be123c; }
        .pd-itinerary { display:flex; flex-direction:column; gap:0; }
        .pd-it-step { display:flex; gap:20px; padding-bottom:28px; position:relative; }
        .pd-it-step::before { content:''; position:absolute; left:17px; top:40px; bottom:0; width:2px; background:#f1f5f9; }
        .pd-it-step:last-child::before { display:none; }
        .pd-it-dot { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#f97316,#fb923c); color:white; display:flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:800; flex-shrink:0; box-shadow:0 4px 12px rgba(249,115,22,0.3); }
        .pd-it-body { flex:1; }
        .pd-it-day { font-size:0.75rem; font-weight:700; color:#f97316; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
        .pd-it-title { font-size:1rem; font-weight:700; color:#1e293b; margin-bottom:4px; }
        .pd-it-desc { font-size:0.88rem; color:#64748b; line-height:1.6; }
        .pd-reviews { display:flex; flex-direction:column; gap:16px; }
        .pd-review-card { background:#f8fafc; border-radius:14px; padding:20px; }
        .pd-review-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px; }
        .pd-review-name { font-weight:700; color:#1e293b; font-size:0.95rem; }
        .pd-review-country { font-size:0.8rem; color:#94a3b8; margin-top:2px; }
        .pd-review-stars { color:#f97316; }
        .pd-review-date { font-size:0.78rem; color:#94a3b8; }
        .pd-review-text { font-size:0.88rem; color:#64748b; line-height:1.6; }
        .pd-includes-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }
        .pd-include-chip { background:#fff7ed; border:1px solid #fed7aa; color:#c2410c; padding:6px 14px; border-radius:50px; font-size:0.82rem; font-weight:600; }

        /* Sidebar */
        .pd-sidebar { position:sticky; top:80px; display:flex; flex-direction:column; gap:20px; }
        .pd-rate-card { background:white; border-radius:20px; padding:28px; box-shadow:0 8px 30px rgba(0,0,0,0.08); }
        .pd-rate-label { font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
        .pd-rate-price { font-size:2.2rem; font-weight:900; color:#1e293b; margin-bottom:4px; }
        .pd-rate-price small { font-size:0.8rem; color:#94a3b8; font-weight:400; }
        .pd-rate-child { font-size:0.84rem; color:#64748b; margin-bottom:18px; }
        .pd-rate-child span { color:#f97316; font-weight:700; }
        .pd-rate-divider { height:1px; background:#f1f5f9; margin:18px 0; }
        .pd-rate-features { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
        .pd-rate-feature { display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#475569; font-weight:500; }
        .pd-rate-feature span { color:#16a34a; font-weight:700; font-size:1rem; }
        .pd-book-now-btn { width:100%; padding:16px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; border:none; border-radius:14px; font-size:1.05rem; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(249,115,22,0.35); transition:all 0.25s; font-family:inherit; letter-spacing:0.3px; }
        .pd-book-now-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,0.45); }
        .pd-guarantee { display:flex; align-items:center; gap:6px; justify-content:center; margin-top:14px; font-size:0.76rem; color:#94a3b8; }

        /* Booking overlay */
        .pd-booking-overlay { position:fixed; inset:0; background:#f8fafc; z-index:200; overflow-y:auto; animation:pdSlideIn 0.3s ease; }
        @keyframes pdSlideIn { from{transform:translateX(60px);opacity:0;} to{transform:translateX(0);opacity:1;} }
        .pd-booking-inner { max-width:800px; margin:0 auto; padding:24px 24px 80px; }
        .pd-booking-back { display:inline-flex; align-items:center; gap:8px; background:none; border:none; color:#64748b; font-size:0.88rem; font-weight:600; cursor:pointer; padding:10px 0; margin-bottom:20px; font-family:inherit; transition:color 0.2s; }
        .pd-booking-back:hover { color:#f97316; }

        /* Booking header card */
        .pd-booking-header { background:white; border-radius:20px; padding:24px 28px; box-shadow:0 4px 20px rgba(0,0,0,0.07); margin-bottom:20px; display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
        .pd-booking-header img { width:100px; height:75px; border-radius:12px; object-fit:cover; flex-shrink:0; }
        .pd-booking-header-info { flex:1; min-width:0; }
        .pd-booking-header-country { font-size:0.75rem; font-weight:700; color:#f97316; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
        .pd-booking-header-title { font-size:1.15rem; font-weight:800; color:#1e293b; line-height:1.3; margin-bottom:6px; }
        .pd-booking-header-meta { display:flex; gap:12px; flex-wrap:wrap; }
        .pd-booking-header-meta span { font-size:0.8rem; color:#64748b; font-weight:500; }
        .pd-booking-header-price { text-align:right; flex-shrink:0; }
        .pd-booking-header-price .pb-price-big { font-size:1.9rem; font-weight:900; color:#1e293b; line-height:1; }
        .pd-booking-header-price .pb-price-big small { font-size:0.78rem; color:#94a3b8; font-weight:400; }
        .pd-booking-header-price .pb-child-price { font-size:0.8rem; color:#64748b; margin-top:2px; }

        /* Booking form */
        .pd-booking-form-card { background:white; border-radius:20px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.07); }
        .pd-booking-form-card h2 { font-size:1.25rem; font-weight:800; color:#1e293b; margin-bottom:24px; }
        .pd-form { display:flex; flex-direction:column; gap:16px; }
        .pd-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .pd-form-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        .pd-field { display:flex; flex-direction:column; gap:5px; }
        .pd-field label { font-size:0.74rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; }
        .pd-field input,.pd-field select,.pd-field textarea { padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.9rem; color:#1e293b; font-weight:500; outline:none; background:white; font-family:inherit; transition:border-color 0.2s; resize:vertical; }
        .pd-field input:focus,.pd-field select:focus,.pd-field textarea:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
        .pd-field.error input,.pd-field.error select { border-color:#ef4444; }
        .pd-err { font-size:0.72rem; color:#ef4444; font-weight:600; }
        .pd-phone-row { display:flex; gap:6px; }
        .pd-phone-row select { width:90px; flex-shrink:0; }
        .pd-phone-row input  { flex:1; }
        .pd-pax-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .pd-pax-box { background:#f8fafc; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; }
        .pd-pax-label { font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase; }
        .pd-pax-ctrl { display:flex; align-items:center; gap:10px; }
        .pd-pax-btn { width:28px; height:28px; border-radius:8px; border:1.5px solid #e2e8f0; background:white; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; color:#1e293b; transition:all 0.15s; font-family:inherit; }
        .pd-pax-btn:hover { border-color:#f97316; color:#f97316; }
        .pd-pax-num { font-size:1rem; font-weight:800; color:#1e293b; min-width:18px; text-align:center; }
        .pd-divider { height:1px; background:#f1f5f9; margin:4px 0; }
        .pd-pkg-display { background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:14px 18px; }
        .pd-pkg-display-label { font-size:0.72rem; font-weight:700; color:#f97316; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
        .pd-pkg-display-name { font-size:1rem; font-weight:800; color:#1e293b; }
        .pd-pkg-display-sub { font-size:0.82rem; color:#64748b; margin-top:2px; }
        .pd-price-summary { background:#f8fafc; border-radius:14px; padding:16px; margin-bottom:6px; }
        .pd-price-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; font-size:0.88rem; color:#64748b; }
        .pd-price-row.total { border-top:2px solid #e2e8f0; margin-top:8px; padding-top:12px; font-size:1.1rem; font-weight:900; color:#1e293b; }
        .pd-confirm-btn { width:100%; padding:16px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; border:none; border-radius:14px; font-size:1rem; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(249,115,22,0.35); transition:all 0.25s; font-family:inherit; margin-top:4px; }
        .pd-confirm-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,0.45); }

        @media(max-width:768px){
          .pd-hero-content { padding:0 20px 28px; }
          .pd-back-btn { left:20px; top:64px; }
          .pd-hero-content h1 { font-size:2rem; letter-spacing:-1px; }
          .pd-form-row,.pd-form-row3 { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="pd-hero">
        <img src={pkg.image} alt={pkg.title} />
        <div className="pd-hero-overlay" />
        <button type="button" className="pd-back-btn" onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`/${data.slug}/tour-packages`)}>
          ← Back
        </button>
        <div className="pd-hero-content">
          {pkg.badge && <div className="pd-hero-badge">🌟 {pkg.badge}</div>}
          <h1>{pkg.title}</h1>
          <div className="pd-hero-stats">
            {pkg.duration && <div className="pd-hero-stat">⏱ {pkg.duration}</div>}
            {pkg.subtitle  && <div className="pd-hero-stat">📍 {pkg.subtitle}</div>}
            <div className="pd-hero-stat price">Rate from <strong>&nbsp;{pkg.price}</strong> <small style={{color:'rgba(255,255,255,0.6)',fontWeight:400}}>/person</small></div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="pd-tab-bar">
        <div className="pd-tab-inner">
          {TABS.map(t => (
            <button key={t.id} type="button" className={`pd-tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="pd-body">

        {/* Left content */}
        <div>
          {activeTab === 'overview' && (
            <div className="pd-panel">
              <h2>{data.name} Packages – {pkg.title}</h2>
              <p>{pkg.subtitle}</p>
              {pkg.includes?.length > 0 && (
                <>
                  <div style={{ marginTop:24, fontWeight:700, color:'#1e293b', marginBottom:12 }}>What's Included</div>
                  <div className="pd-includes-chips">
                    {pkg.includes.map((inc, i) => <span key={i} className="pd-include-chip">{inc}</span>)}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="pd-panel">
              <h2>Inclusions</h2>
              <div className="pd-inc-grid" style={{ marginBottom:28 }}>
                {pkg.inclusions.map((inc, i) => <div key={i} className="pd-inc-item">{inc}</div>)}
              </div>
              <h2>Exclusions</h2>
              <div className="pd-inc-grid">
                {pkg.exclusions.map((exc, i) => <div key={i} className="pd-inc-item ex">{exc}</div>)}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="pd-panel">
              <h2>Day-by-Day Itinerary</h2>
              <div className="pd-itinerary">
                {pkg.itinerary.map((step, i) => (
                  <div key={i} className="pd-it-step">
                    <div className="pd-it-dot">{i + 1}</div>
                    <div className="pd-it-body">
                      <div className="pd-it-day">{step.day}</div>
                      <div className="pd-it-title">{step.title}</div>
                      <div className="pd-it-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="pd-panel">
              <h2>Guest Reviews</h2>
              <div className="pd-reviews">
                {pkg.reviewsList.map((r, i) => (
                  <div key={i} className="pd-review-card">
                    <div className="pd-review-top">
                      <div>
                        <div className="pd-review-name">{r.name}</div>
                        <div className="pd-review-country">{r.country}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div className="pd-review-stars">{starBar(r.rating)}</div>
                        <div className="pd-review-date">{r.date}</div>
                      </div>
                    </div>
                    <div className="pd-review-text">{r.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="pd-sidebar">
          <div className="pd-rate-card">
            <div className="pd-rate-label">Rate from</div>
            <div className="pd-rate-price">{pkg.price} <small>/adult</small></div>
            <div className="pd-rate-child">Child (u12): <span>${Math.round(pkg.basePrice * 0.7)}</span> /child</div>
            <div className="pd-rate-features">
              {(pkg.includes || []).slice(0, 4).map((inc, i) => (
                <div key={i} className="pd-rate-feature"><span>✓</span> {inc}</div>
              ))}
              {pkg.duration && <div className="pd-rate-feature"><span>⏱</span> {pkg.duration}</div>}
            </div>
            <button type="button" className="pd-book-now-btn" onClick={() => { setShowBooking(true); window.scrollTo(0, 0); }}>
              Book Now →
            </button>
            <div className="pd-guarantee">🔒 Flexible cancellation · Best price</div>
          </div>
        </div>

      </div>

      {/* Full-page booking overlay */}
      {showBooking && (
        <div className="pd-booking-overlay">
          <div className="pd-booking-inner">

            <button type="button" className="pd-booking-back" onClick={() => setShowBooking(false)}>
              ← Back to Package Details
            </button>

            {/* Package summary header */}
            <div className="pd-booking-header">
              <img src={pkg.image} alt={pkg.title} />
              <div className="pd-booking-header-info">
                <div className="pd-booking-header-country">{data.name} Packages</div>
                <div className="pd-booking-header-title">{pkg.title}</div>
                <div className="pd-booking-header-meta">
                  {pkg.duration && <span>⏱ {pkg.duration}</span>}
                  {pkg.subtitle  && <span>📍 {pkg.subtitle}</span>}
                </div>
              </div>
              <div className="pd-booking-header-price">
                <div className="pb-price-big">{pkg.price} <small>/adult</small></div>
                <div className="pb-child-price">Child: ${Math.round(pkg.basePrice * 0.7)}</div>
              </div>
            </div>

            {/* Booking form */}
            <div className="pd-booking-form-card">
              <h2>Complete Your Booking</h2>
              <form className="pd-form" onSubmit={handleConfirm}>

                {/* Name + Nationality */}
                <div className="pd-form-row3">
                  <div className={`pd-field${errors.firstName ? ' error' : ''}`}>
                    <label>First Name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" />
                    {errors.firstName && <span className="pd-err">{errors.firstName}</span>}
                  </div>
                  <div className={`pd-field${errors.lastName ? ' error' : ''}`}>
                    <label>Last Name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" />
                    {errors.lastName && <span className="pd-err">{errors.lastName}</span>}
                  </div>
                  <div className="pd-field">
                    <label>Nationality</label>
                    <select value={nationality} onChange={e => setNation(e.target.value)}>
                      {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Pax + Arrival Date */}
                <div className="pd-form-row">
                  <div className="pd-pax-row" style={{ gap:10 }}>
                    <div className="pd-pax-box">
                      <span className="pd-pax-label">Adult</span>
                      <div className="pd-pax-ctrl">
                        <button type="button" className="pd-pax-btn" onClick={() => setAdults(a => Math.max(1, a - 1))}>−</button>
                        <span className="pd-pax-num">{adults}</span>
                        <button type="button" className="pd-pax-btn" onClick={() => setAdults(a => a + 1)}>+</button>
                      </div>
                    </div>
                    <div className="pd-pax-box">
                      <span className="pd-pax-label">Child</span>
                      <div className="pd-pax-ctrl">
                        <button type="button" className="pd-pax-btn" onClick={() => setChildren(c => Math.max(0, c - 1))}>−</button>
                        <span className="pd-pax-num">{children}</span>
                        <button type="button" className="pd-pax-btn" onClick={() => setChildren(c => c + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className={`pd-field${errors.arrDate ? ' error' : ''}`}>
                    <label>Arrival Date</label>
                    <input type="date" value={arrDate} min={new Date().toISOString().split('T')[0]} onChange={e => setArrDate(e.target.value)} />
                    {errors.arrDate && <span className="pd-err">{errors.arrDate}</span>}
                  </div>
                </div>

                {/* Contact */}
                <div className={`pd-field${errors.email ? ' error' : ''}`}>
                  <label>Email ID</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@email.com" />
                  {errors.email && <span className="pd-err">{errors.email}</span>}
                </div>

                <div className="pd-form-row">
                  <div className="pd-field">
                    <label>WhatsApp No.</label>
                    <div className="pd-phone-row">
                      <select value={wCode} onChange={e => setWCode(e.target.value)}>
                        {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="9876543210" />
                    </div>
                  </div>
                  <div className="pd-field">
                    <label>Telephone</label>
                    <div className="pd-phone-row">
                      <select value={tCode} onChange={e => setTCode(e.target.value)}>
                        {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="Optional" />
                    </div>
                  </div>
                </div>

                <div className="pd-divider" />

                {/* Arrival flight */}
                <div className="pd-form-row3">
                  <div className="pd-field">
                    <label>Arrival Flight No.</label>
                    <input value={arrFlight} onChange={e => setArrFlight(e.target.value)} placeholder="e.g. TG205" />
                  </div>
                  <div className="pd-field">
                    <label>Arrival Date</label>
                    <input type="date" value={arrDate} min={new Date().toISOString().split('T')[0]} onChange={e => setArrDate(e.target.value)} />
                  </div>
                  <div className="pd-field">
                    <label>Arrival Airport</label>
                    <input value={arrAirport} onChange={e => setArrAirport(e.target.value)} placeholder="e.g. BKK" />
                  </div>
                </div>

                {/* Departure flight */}
                <div className="pd-form-row3">
                  <div className="pd-field">
                    <label>Departure Flight No.</label>
                    <input value={depFlight} onChange={e => setDepFlight(e.target.value)} placeholder="e.g. TG206" />
                  </div>
                  <div className="pd-field">
                    <label>Departure Date</label>
                    <input type="date" value={depDate} min={arrDate || new Date().toISOString().split('T')[0]} onChange={e => setDepDate(e.target.value)} />
                  </div>
                  <div className="pd-field">
                    <label>Departure Airport</label>
                    <input value={depAirport} onChange={e => setDepAirport(e.target.value)} placeholder="e.g. BKK" />
                  </div>
                </div>

                <div className="pd-divider" />

                {/* Package display + room + hotel */}
                <div className="pd-pkg-display">
                  <div className="pd-pkg-display-label">Package Selected</div>
                  <div className="pd-pkg-display-name">{pkg.title}</div>
                  {pkg.subtitle && <div className="pd-pkg-display-sub">{pkg.subtitle}</div>}
                </div>

                <div className="pd-form-row">
                  <div className="pd-field">
                    <label>Room Requirements</label>
                    <select value={roomType} onChange={e => setRoomType(e.target.value)}>
                      {ROOM_OPTIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="pd-field">
                    <label>Hotel Options</label>
                    <select value={hotelPref} onChange={e => setHotelPref(e.target.value)}>
                      {HOTEL_OPTIONS.map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div className="pd-field">
                  <label>Note / Special Requests</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any special requirements, dietary preferences, accessibility needs..." rows={3} />
                </div>

                <div className="pd-divider" />

                {/* Price summary */}
                <div className="pd-price-summary">
                  <div className="pd-price-row"><span>Adult × {adults}</span><span>${adultTotal}</span></div>
                  {children > 0 && <div className="pd-price-row"><span>Child × {children}</span><span>${childTotal.toFixed(0)}</span></div>}
                  <div className="pd-price-row total"><span>Total</span><span style={{ color:'#f97316' }}>${total} USD</span></div>
                </div>

                <button type="submit" className="pd-confirm-btn">
                  ✅ Confirm the Order
                </button>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
