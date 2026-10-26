import { useState, useMemo } from 'react';
import { useOutletContext, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const COUNTRY_CODES = ['+91','+1','+44','+61','+65','+60','+66','+971','+81','+49','+33','+7'];
const NATIONALITIES = ['India','USA','UK','Australia','Singapore','Malaysia','Thailand','UAE','China','Japan','Germany','France','Other'];

// ---------- enrich tour with extra detail data ----------
function enrichTour(tour) {
  if (!tour) return null;
  return {
    ...tour,
    inclusions: tour.inclusions || tour.features || ['✅ Professional guide','✅ All entrance fees','✅ Hotel pickup & drop','✅ Air-conditioned transport','✅ Bottled water'],
    exclusions: tour.exclusions || ['❌ Personal expenses','❌ Meals unless stated','❌ Gratuities','❌ Travel insurance'],
    itinerary: tour.itinerary || [
      { time: 'Morning',   desc: `Pickup from your hotel and head to ${tour.location || 'the destination'}.` },
      { time: 'Midday',    desc: 'Guided tour of main attractions with a local expert.' },
      { time: 'Afternoon', desc: 'Free time for exploration, photos, and shopping.' },
      { time: 'Evening',   desc: 'Return transfer to your hotel.' },
    ],
    reviewsList: tour.reviews_list || [
      { name: 'Sarah M.', country: '🇮🇳 India', rating: 5, comment: 'Absolutely wonderful experience! The guide was so knowledgeable and friendly. Highly recommend!', date: 'Oct 2026' },
      { name: 'David K.', country: '🇦🇺 Australia', rating: 5, comment: 'Best tour we did on this trip. Seamless organisation and great value for money.', date: 'Sep 2026' },
      { name: 'Priya R.', country: '🇸🇬 Singapore', rating: 4, comment: 'Very enjoyable, just a bit rushed at the last stop. Would still recommend.', date: 'Sep 2026' },
    ],
    addons: tour.addons || [
      { id: 'a1', label: 'Photographer', price: 30 },
      { id: 'a2', label: 'Snorkeling gear', price: 15 },
      { id: 'a3', label: 'Lunch upgrade', price: 20 },
    ],
    adultPrice: tour.adultPrice || parseFloat((tour.price || '$0').replace(/[^0-9.]/g,'')),
    childPrice:  tour.childPrice  || Math.round(parseFloat((tour.price || '$0').replace(/[^0-9.]/g,'')) * 0.6),
  };
}

export default function TourDetail() {
  const data       = useOutletContext();
  const { tourSlug } = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();

  // prefer state passed via Link; fall back to searching country data
  const rawTour = location.state?.tour
    || (data.dayTours || []).find(t => t.id === tourSlug);
  const tour = enrichTour(rawTour);

  const [activeTab, setActiveTab] = useState('overview');
  const [showBooking, setShowBooking] = useState(false);
  const [adults, setAdults]       = useState(2);
  const [children, setChildren]   = useState(0);
  const [selDate, setSelDate]     = useState('');
  const [pickup, setPickup]       = useState('');
  const [dropPoint, setDrop]      = useState('');
  const [promo, setPromo]         = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [nationality, setNation]  = useState('India');
  const [email,     setEmail]     = useState('');
  const [whatsapp,  setWhatsapp]  = useState('');
  const [wCode,     setWCode]     = useState('+91');
  const [tel,       setTel]       = useState('');
  const [tCode,     setTCode]     = useState('+91');
  const [errors,    setErrors]    = useState({});

  const TABS = [
    { id: 'overview',   label: 'Overview' },
    { id: 'inclusions', label: 'Inclusions / Exclusions' },
    { id: 'itinerary',  label: 'Itinerary' },
    { id: 'reviews',    label: 'Reviews' },
    { id: 'addons',     label: 'Add-on Options' },
  ];

  const addonTotal = useMemo(() =>
    selectedAddons.reduce((s, id) => {
      const a = tour?.addons?.find(x => x.id === id);
      return s + (a ? a.price * (adults + children) : 0);
    }, 0),
  [selectedAddons, adults, children, tour]);

  const subtotal  = tour ? tour.adultPrice * adults + tour.childPrice * children + addonTotal : 0;
  const discount  = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal - discount;

  function toggleAddon(id) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  }

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim())  e.lastName  = 'Required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!whatsapp.trim()) e.whatsapp = 'Required';
    if (!selDate) e.date = 'Please select a date';
    if (!pickup.trim()) e.pickup = 'Enter pick-up hotel';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePaymentOnline(e) {
    e.preventDefault();
    if (!validate()) return;
    navigate('/book-trip', {
      state: {
        destination: tour.title,
        country: data.name,
        image: tour.image,
        price: `$${total}`,
        rating: tour.rating,
        prefill: { firstName, lastName, email, whatsapp: `${wCode}${whatsapp}`, tel: `${tCode}${tel}`, date: selDate, adults, children, pickup, dropPoint, nationality, promo, total },
        paymentMethod: 'online',
      }
    });
  }

  function handleOffline(e) {
    e.preventDefault();
    if (!validate()) return;
    navigate('/book-trip', {
      state: {
        destination: tour.title, country: data.name, image: tour.image, price: `$${total}`,
        prefill: { firstName, lastName, email, whatsapp: `${wCode}${whatsapp}`, tel: `${tCode}${tel}`, date: selDate, adults, children, pickup, dropPoint, nationality, promo, total },
        paymentMethod: 'offline',
      }
    });
  }

  if (!tour) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Tour not found</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '12px 28px', background: '#f97316', color: 'white', border: 'none', borderRadius: 50, cursor: 'pointer', fontWeight: 700 }}>← Go Back</button>
      </div>
    );
  }

  const starBar = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="td-page">
      <Helmet>
        <title>{tour.title} – {data.name} | PlantripOnline</title>
        <meta name="description" content={tour.description} />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .td-page { background:#f8fafc; min-height:100vh; font-family:'Inter',system-ui,sans-serif; }

        /* back button */
        .td-back-btn { position:absolute; top:72px; left:48px; z-index:3; display:inline-flex; align-items:center; gap:7px; background:rgba(0,0,0,0.28); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.9); font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px 18px; border-radius:50px; font-family:inherit; transition:all 0.2s; }
        .td-back-btn:hover { background:rgba(0,0,0,0.45); color:white; }
        .td-back-btn:hover .td-back-arrow { transform:translateX(-3px); }
        .td-back-arrow { transition:transform 0.2s; display:inline-block; }
        @media(max-width:768px) { .td-back-btn { left:20px; top:64px; } }

        /* ── Hero ── */
        .td-hero { position:relative; height:65vh; min-height:480px; overflow:hidden; }
        .td-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.38); transform:scale(1.06); transition:transform 10s ease; }
        .td-hero:hover .td-hero-img { transform:scale(1.11); }
        .td-hero-overlay { position:absolute; inset:0; background:linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(15,23,42,0.3) 40%, rgba(15,23,42,0.92) 100%); }

        /* main content */
        .td-hero-content { position:absolute; bottom:0; left:0; right:0; z-index:2; padding:0 48px 40px; animation:tdHeroIn 0.7s ease; }
        @keyframes tdHeroIn { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }

        .td-hero-badges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
        .td-hero-badge-hot { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; padding:5px 14px; border-radius:50px; font-size:0.72rem; font-weight:800; letter-spacing:1px; text-transform:uppercase; box-shadow:0 4px 12px rgba(249,115,22,0.4); }
        .td-hero-badge-loc { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); backdrop-filter:blur(8px); color:rgba(255,255,255,0.9); padding:5px 14px; border-radius:50px; font-size:0.78rem; font-weight:600; }

        .td-hero-content h1 { font-size:3.2rem; font-weight:900; color:white; letter-spacing:-2px; line-height:1.05; text-shadow:0 4px 24px rgba(0,0,0,0.5); margin-bottom:20px; max-width:780px; }

        /* stats strip */
        .td-hero-stats { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
        .td-hero-stat { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); backdrop-filter:blur(10px); padding:8px 16px; border-radius:50px; font-size:0.82rem; font-weight:600; color:white; transition:background 0.2s; }
        .td-hero-stat:hover { background:rgba(255,255,255,0.18); }
        .td-hero-stat-icon { font-size:0.95rem; }
        .td-hero-stat.rating .td-hero-stat-icon { color:#fbbf24; }
        .td-hero-stat.price { background:rgba(249,115,22,0.25); border-color:rgba(249,115,22,0.5); }
        .td-hero-stat.price strong { color:#fb923c; font-size:1rem; font-weight:900; }

        /* review stars */
        .td-star-filled { color:#fbbf24; }
        .td-star-empty  { color:rgba(255,255,255,0.3); }

        @media(max-width:768px) {
          .td-hero-content { padding:0 20px 30px; }
          .td-hero-topbar { padding:16px 20px; }
          .td-hero-content h1 { font-size:2rem; letter-spacing:-1px; }
          .td-hero { height:55vh; min-height:400px; }
        }

        /* ── Tab bar ── */
        .td-tab-bar { background:white; border-bottom:2px solid #f1f5f9; position:sticky; top:0; z-index:100; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .td-tab-inner { max-width:1280px; margin:0 auto; padding:0 1.5rem; display:flex; align-items:center; gap:4px; overflow-x:auto; scrollbar-width:none; }
        .td-tab-inner::-webkit-scrollbar { display:none; }
        .td-tab-btn { padding:18px 20px; font-size:0.88rem; font-weight:600; color:#64748b; border:none; background:none; cursor:pointer; white-space:nowrap; border-bottom:3px solid transparent; margin-bottom:-2px; transition:all 0.2s; }
        .td-tab-btn:hover { color:#f97316; }
        .td-tab-btn.active { color:#f97316; border-bottom-color:#f97316; }

        /* ── Layout ── */
        .td-body { max-width:1280px; margin:0 auto; padding:40px 1.5rem 80px; display:grid; grid-template-columns:1fr 400px; gap:36px; align-items:start; }
        @media(max-width:1024px) { .td-body { grid-template-columns:1fr; } }

        /* ── Content panels ── */
        .td-panel { background:white; border-radius:20px; padding:36px; box-shadow:0 4px 20px rgba(0,0,0,0.06); }
        .td-panel h2 { font-size:1.5rem; font-weight:800; color:#1e293b; margin-bottom:20px; }
        .td-panel p { color:#64748b; line-height:1.7; font-size:0.95rem; }

        /* inclusions */
        .td-inc-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media(max-width:640px) { .td-inc-grid { grid-template-columns:1fr; } }
        .td-inc-item { background:#f8fafc; border-radius:10px; padding:12px 16px; font-size:0.88rem; color:#334155; font-weight:500; }
        .td-inc-item.ex { background:#fff1f2; color:#be123c; }

        /* itinerary */
        .td-itinerary { display:flex; flex-direction:column; gap:0; }
        .td-it-step { display:flex; gap:20px; padding-bottom:28px; position:relative; }
        .td-it-step::before { content:''; position:absolute; left:17px; top:36px; bottom:0; width:2px; background:#f1f5f9; }
        .td-it-step:last-child::before { display:none; }
        .td-it-dot { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#f97316,#fb923c); color:white; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; box-shadow:0 4px 12px rgba(249,115,22,0.3); }
        .td-it-body { flex:1; }
        .td-it-time { font-size:0.78rem; font-weight:700; color:#f97316; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
        .td-it-desc { font-size:0.9rem; color:#475569; line-height:1.6; }

        /* reviews */
        .td-reviews { display:flex; flex-direction:column; gap:16px; }
        .td-review-card { background:#f8fafc; border-radius:14px; padding:20px; }
        .td-review-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px; }
        .td-review-name { font-weight:700; color:#1e293b; font-size:0.95rem; }
        .td-review-country { font-size:0.8rem; color:#94a3b8; margin-top:2px; }
        .td-review-stars { color:#f97316; font-size:1.1rem; }
        .td-review-date { font-size:0.78rem; color:#94a3b8; }
        .td-review-text { font-size:0.88rem; color:#64748b; line-height:1.6; }

        /* addons */
        .td-addons { display:flex; flex-direction:column; gap:12px; }
        .td-addon-row { display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border-radius:12px; padding:16px 20px; cursor:pointer; border:2px solid transparent; transition:all 0.2s; }
        .td-addon-row.selected { border-color:#f97316; background:#fff7ed; }
        .td-addon-left { display:flex; align-items:center; gap:12px; }
        .td-addon-check { width:22px; height:22px; border-radius:6px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; font-size:0.8rem; transition:all 0.2s; }
        .td-addon-row.selected .td-addon-check { background:#f97316; border-color:#f97316; color:white; }
        .td-addon-label { font-weight:600; font-size:0.92rem; color:#1e293b; }
        .td-addon-price { font-weight:700; color:#f97316; font-size:0.9rem; }

        /* ── Sidebar booking card ── */
        .td-sidebar { display:flex; flex-direction:column; gap:20px; position:sticky; top:80px; }
        .td-rate-card { background:white; border-radius:20px; padding:28px; box-shadow:0 8px 30px rgba(0,0,0,0.08); }
        .td-rate-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .td-rate-label { font-size:0.78rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; }
        .td-rate-price { font-size:2.2rem; font-weight:900; color:#1e293b; }
        .td-rate-price small { font-size:0.8rem; color:#94a3b8; font-weight:400; }
        .td-rate-child { font-size:0.85rem; color:#64748b; margin-bottom:20px; }
        .td-rate-child span { color:#f97316; font-weight:700; }
        .td-rate-divider { height:1px; background:#f1f5f9; margin:20px 0; }

        /* ── Compact rate card (default sidebar) ── */
        .td-compact-card { background:white; border-radius:20px; padding:28px; box-shadow:0 8px 30px rgba(0,0,0,0.08); }
        .td-compact-features { display:flex; flex-direction:column; gap:8px; margin:16px 0 20px; }
        .td-compact-feature { display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#475569; font-weight:500; }
        .td-compact-feature span { color:#16a34a; font-weight:700; font-size:1rem; }
        .td-book-now-btn { width:100%; padding:16px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; border:none; border-radius:14px; font-size:1.05rem; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(249,115,22,0.35); transition:all 0.25s; letter-spacing:0.3px; }
        .td-book-now-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,0.45); }
        .td-guarantee { display:flex; align-items:center; gap:8px; justify-content:center; margin-top:14px; font-size:0.78rem; color:#94a3b8; font-weight:500; }

        /* ── Full-page booking overlay ── */
        .td-booking-overlay { position:fixed; inset:0; background:#f8fafc; z-index:200; overflow-y:auto; animation:slideInRight 0.3s ease; }
        @keyframes slideInRight { from { transform:translateX(60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
        .td-booking-overlay-inner { max-width:720px; margin:0 auto; padding:24px 24px 80px; }
        .td-booking-back { display:inline-flex; align-items:center; gap:8px; background:none; border:none; color:#64748b; font-size:0.88rem; font-weight:600; cursor:pointer; padding:10px 0; margin-bottom:20px; transition:color 0.2s; }
        .td-booking-back:hover { color:#f97316; }
        .td-booking-header { background:white; border-radius:20px; padding:24px 28px; box-shadow:0 4px 20px rgba(0,0,0,0.07); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
        .td-booking-header-img { width:90px; height:70px; border-radius:12px; object-fit:cover; flex-shrink:0; }
        .td-booking-header-info { flex:1; min-width:0; }
        .td-booking-header-title { font-size:1.1rem; font-weight:800; color:#1e293b; margin-bottom:4px; line-height:1.3; }
        .td-booking-header-meta { display:flex; gap:12px; flex-wrap:wrap; }
        .td-booking-header-meta span { font-size:0.82rem; color:#64748b; font-weight:500; }
        .td-booking-header-price { text-align:right; flex-shrink:0; }
        .td-booking-header-price .price-big { font-size:1.8rem; font-weight:900; color:#1e293b; }
        .td-booking-header-price .price-big small { font-size:0.78rem; color:#94a3b8; font-weight:400; }
        .td-booking-header-price .price-child { font-size:0.82rem; color:#64748b; margin-top:2px; }
        .td-booking-form-card { background:white; border-radius:20px; padding:28px; box-shadow:0 4px 20px rgba(0,0,0,0.07); }

        /* form fields */
        .td-form { display:flex; flex-direction:column; gap:14px; }
        .td-form-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .td-field { display:flex; flex-direction:column; gap:5px; }
        .td-field label { font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; }
        .td-field input, .td-field select {
          padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.9rem; color:#1e293b; font-weight:500; outline:none; background:white; font-family:inherit; transition:border-color 0.2s;
        }
        .td-field input:focus, .td-field select:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
        .td-field.error input, .td-field.error select { border-color:#ef4444; }
        .td-err { font-size:0.72rem; color:#ef4444; font-weight:600; margin-top:2px; }
        .td-phone-row { display:flex; gap:6px; }
        .td-phone-row select { width:90px; flex-shrink:0; }
        .td-phone-row input  { flex:1; }

        /* pax counter */
        .td-pax-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .td-pax-box { background:#f8fafc; border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; }
        .td-pax-label { font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase; }
        .td-pax-ctrl { display:flex; align-items:center; gap:10px; }
        .td-pax-btn { width:28px; height:28px; border-radius:8px; border:1.5px solid #e2e8f0; background:white; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; color:#1e293b; transition:all 0.15s; }
        .td-pax-btn:hover { border-color:#f97316; color:#f97316; }
        .td-pax-num { font-size:1rem; font-weight:800; color:#1e293b; min-width:18px; text-align:center; }

        /* promo */
        .td-promo-row { display:flex; gap:8px; }
        .td-promo-row input { flex:1; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.88rem; outline:none; font-family:inherit; }
        .td-promo-row input:focus { border-color:#f97316; }
        .td-promo-btn { padding:10px 16px; background:#f97316; color:white; border:none; border-radius:10px; font-weight:700; font-size:0.82rem; cursor:pointer; white-space:nowrap; transition:background 0.2s; }
        .td-promo-btn:hover { background:#ea580c; }
        .td-promo-success { font-size:0.78rem; color:#16a34a; font-weight:700; margin-top:4px; }

        /* price summary */
        .td-price-summary { background:#f8fafc; border-radius:14px; padding:18px; }
        .td-price-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; font-size:0.88rem; color:#64748b; }
        .td-price-row.total { border-top:2px solid #e2e8f0; margin-top:8px; padding-top:12px; font-size:1.1rem; font-weight:900; color:#1e293b; }
        .td-price-row.discount { color:#16a34a; font-weight:700; }

        /* action btns */
        .td-action-btns { display:flex; flex-direction:column; gap:10px; }
        .td-btn-online { background:linear-gradient(135deg,#f97316,#fb923c); color:white; padding:15px; border-radius:14px; font-size:0.95rem; font-weight:800; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(249,115,22,0.35); transition:all 0.25s; width:100%; }
        .td-btn-online:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,0.45); }
        .td-btn-offline { background:white; color:#1e293b; padding:15px; border-radius:14px; font-size:0.95rem; font-weight:700; border:2px solid #e2e8f0; cursor:pointer; transition:all 0.25s; width:100%; }
        .td-btn-offline:hover { border-color:#1e293b; background:#f8fafc; }
      `}</style>

      {/* ── Hero ── */}
      <div className="td-hero">
        <img src={tour.image} alt={tour.title} className="td-hero-img" />
        <div className="td-hero-overlay" />

        {/* Back button */}
        <button className="td-back-btn" onClick={() => navigate(-1)}>
          <span className="td-back-arrow">←</span> Back
        </button>

        {/* Bottom content */}
        <div className="td-hero-content">
          {/* Badges */}
          <div className="td-hero-badges">
            {tour.badge && (
              <span className="td-hero-badge-hot">🔥 {tour.badge}</span>
            )}
            {tour.location && (
              <span className="td-hero-badge-loc">📍 {tour.location}</span>
            )}
          </div>

          {/* Title */}
          <h1>{tour.title}</h1>

          {/* Stats strip */}
          <div className="td-hero-stats">
            {tour.duration && (
              <div className="td-hero-stat">
                <span className="td-hero-stat-icon">⏱</span>
                {tour.duration.replace('⏱ ', '')}
              </div>
            )}
            {tour.rating && (
              <div className="td-hero-stat rating">
                <span className="td-hero-stat-icon">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={i <= Math.round(tour.rating) ? 'td-star-filled' : 'td-star-empty'}>★</span>
                  ))}
                </span>
                {tour.rating}
                {typeof tour.reviews === 'number' && (
                  <span style={{ opacity: 0.7, fontSize:'0.78rem' }}>({tour.reviews} reviews)</span>
                )}
              </div>
            )}
            <div className="td-hero-stat price">
              <span className="td-hero-stat-icon">💰</span>
              From <strong>{tour.price}</strong> /person
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="td-tab-bar">
        <div className="td-tab-inner">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`td-tab-btn${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="td-body">

        {/* ── Left: content ── */}
        <div>
          {activeTab === 'overview' && (
            <div className="td-panel">
              <h2>About This Tour</h2>
              <p>{tour.description}</p>
              {tour.features?.length > 0 && (
                <>
                  <div style={{ marginTop: 24, marginBottom: 12, fontWeight: 700, color: '#1e293b' }}>Highlights</div>
                  <div className="td-inc-grid">
                    {tour.features.map((f, i) => <div key={i} className="td-inc-item">{f}</div>)}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="td-panel">
              <h2>Inclusions</h2>
              <div className="td-inc-grid" style={{ marginBottom: 28 }}>
                {tour.inclusions.map((inc, i) => <div key={i} className="td-inc-item">{inc}</div>)}
              </div>
              <h2>Exclusions</h2>
              <div className="td-inc-grid">
                {tour.exclusions.map((exc, i) => <div key={i} className="td-inc-item ex">{exc}</div>)}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="td-panel">
              <h2>Itinerary</h2>
              <div className="td-itinerary">
                {tour.itinerary.map((step, i) => (
                  <div key={i} className="td-it-step">
                    <div className="td-it-dot">{['🌅','☀️','🌇','🌙'][i] || '📍'}</div>
                    <div className="td-it-body">
                      <div className="td-it-time">{step.time}</div>
                      <div className="td-it-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="td-panel">
              <h2>Guest Reviews <span style={{ color: '#f97316', fontSize: '1rem' }}>⭐ {tour.rating}</span></h2>
              <div className="td-reviews">
                {tour.reviewsList.map((r, i) => (
                  <div key={i} className="td-review-card">
                    <div className="td-review-top">
                      <div>
                        <div className="td-review-name">{r.name}</div>
                        <div className="td-review-country">{r.country}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="td-review-stars">{starBar(r.rating)}</div>
                        <div className="td-review-date">{r.date}</div>
                      </div>
                    </div>
                    <div className="td-review-text">{r.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'addons' && (
            <div className="td-panel">
              <h2>Add-on Options</h2>
              <p style={{ marginBottom: 20 }}>Enhance your experience with these optional extras. Price is per person.</p>
              <div className="td-addons">
                {tour.addons.map(addon => (
                  <div
                    key={addon.id}
                    className={`td-addon-row${selectedAddons.includes(addon.id) ? ' selected' : ''}`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="td-addon-left">
                      <div className="td-addon-check">{selectedAddons.includes(addon.id) ? '✓' : ''}</div>
                      <span className="td-addon-label">{addon.label}</span>
                    </div>
                    <span className="td-addon-price">+${addon.price}/person</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: booking sidebar ── */}
        <div className="td-sidebar">
          <div className="td-compact-card">
            <div className="td-rate-label">Display Rate</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:8 }}>
              <div>
                <div className="td-rate-price">{tour.price} <small>/adult</small></div>
                <div className="td-rate-child" style={{ marginBottom:0 }}>Child: <span>${tour.childPrice}</span> /child</div>
              </div>
              {tour.rating && (
                <div style={{ textAlign:'right' }}>
                  <div style={{ color:'#f97316', fontWeight:800, fontSize:'1.1rem' }}>⭐ {tour.rating}</div>
                  <div style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{typeof tour.reviews === 'number' ? tour.reviews : ''} reviews</div>
                </div>
              )}
            </div>

            <div className="td-rate-divider" />

            <div className="td-compact-features">
              {(tour.features || []).slice(0, 3).map((f, i) => (
                <div key={i} className="td-compact-feature"><span>✓</span> {f}</div>
              ))}
              {tour.duration && <div className="td-compact-feature"><span>⏱</span> {tour.duration.replace('⏱ ','')}</div>}
            </div>

            <button className="td-book-now-btn" onClick={() => { setShowBooking(true); window.scrollTo(0,0); }}>
              Book Now →
            </button>
            <div className="td-guarantee">🔒 Free cancellation &nbsp;·&nbsp; Instant confirmation</div>
          </div>
        </div>
      </div>{/* end td-body */}

      {/* ── Full-page booking overlay ── */}
      {showBooking && (
        <div className="td-booking-overlay">
          <div className="td-booking-overlay-inner">

            {/* Back button */}
            <button className="td-booking-back" onClick={() => setShowBooking(false)}>
              ← Back to Tour Details
            </button>

            {/* Tour summary header */}
            <div className="td-booking-header">
              <img src={tour.image} alt={tour.title} className="td-booking-header-img" />
              <div className="td-booking-header-info">
                <div className="td-booking-header-title">{tour.title}</div>
                <div className="td-booking-header-meta">
                  {tour.duration && <span>⏱ {tour.duration.replace('⏱ ','')}</span>}
                  {tour.location && <span>📍 {tour.location}</span>}
                  {tour.rating  && <span>⭐ {tour.rating} ({typeof tour.reviews === 'number' ? tour.reviews : ''} reviews)</span>}
                </div>
              </div>
              <div className="td-booking-header-price">
                <div className="price-big">{tour.price} <small>/adult</small></div>
                <div className="price-child">Child: ${tour.childPrice}/child</div>
              </div>
            </div>

            {/* Booking form */}
            <div className="td-booking-form-card">
              <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1e293b', marginBottom:24 }}>Complete Your Booking</h2>
              <form className="td-form" onSubmit={e => e.preventDefault()}>

                <div className="td-form-row">
                  <div className={`td-field${errors.firstName ? ' error' : ''}`}>
                    <label>First Name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" />
                    {errors.firstName && <span className="td-err">{errors.firstName}</span>}
                  </div>
                  <div className={`td-field${errors.lastName ? ' error' : ''}`}>
                    <label>Last Name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" />
                    {errors.lastName && <span className="td-err">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="td-field">
                  <label>Country / Nationality</label>
                  <select value={nationality} onChange={e => setNation(e.target.value)}>
                    {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>

                <div className={`td-field${errors.email ? ' error' : ''}`}>
                  <label>Email ID</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@email.com" />
                  {errors.email && <span className="td-err">{errors.email}</span>}
                </div>

                <div className="td-form-row">
                  <div className={`td-field${errors.whatsapp ? ' error' : ''}`}>
                    <label>WhatsApp No.</label>
                    <div className="td-phone-row">
                      <select value={wCode} onChange={e => setWCode(e.target.value)}>
                        {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="9876543210" />
                    </div>
                    {errors.whatsapp && <span className="td-err">{errors.whatsapp}</span>}
                  </div>
                  <div className="td-field">
                    <label>Telephone</label>
                    <div className="td-phone-row">
                      <select value={tCode} onChange={e => setTCode(e.target.value)}>
                        {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="Optional" />
                    </div>
                  </div>
                </div>

                <div className={`td-field${errors.date ? ' error' : ''}`}>
                  <label>Select Date</label>
                  <input type="date" value={selDate} min={new Date().toISOString().split('T')[0]} onChange={e => setSelDate(e.target.value)} />
                  {errors.date && <span className="td-err">{errors.date}</span>}
                </div>

                <div className="td-pax-row">
                  <div className="td-pax-box">
                    <span className="td-pax-label">Adult</span>
                    <div className="td-pax-ctrl">
                      <button type="button" className="td-pax-btn" onClick={() => setAdults(a => Math.max(1, a - 1))}>−</button>
                      <span className="td-pax-num">{adults}</span>
                      <button type="button" className="td-pax-btn" onClick={() => setAdults(a => a + 1)}>+</button>
                    </div>
                  </div>
                  <div className="td-pax-box">
                    <span className="td-pax-label">Child</span>
                    <div className="td-pax-ctrl">
                      <button type="button" className="td-pax-btn" onClick={() => setChildren(c => Math.max(0, c - 1))}>−</button>
                      <span className="td-pax-num">{children}</span>
                      <button type="button" className="td-pax-btn" onClick={() => setChildren(c => c + 1)}>+</button>
                    </div>
                  </div>
                </div>

                <div className="td-form-row">
                  <div className={`td-field${errors.pickup ? ' error' : ''}`}>
                    <label>Pick Up (Hotel Name)</label>
                    <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="e.g. Marriott Bangkok" />
                    {errors.pickup && <span className="td-err">{errors.pickup}</span>}
                  </div>
                  <div className="td-field">
                    <label>Drop Point (Hotel Name)</label>
                    <input value={dropPoint} onChange={e => setDrop(e.target.value)} placeholder="Same as pickup" />
                  </div>
                </div>

                <div className="td-field">
                  <label>Promotion Code (if any)</label>
                  <div className="td-promo-row">
                    <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="e.g. SAVE10" disabled={promoApplied} />
                    {!promoApplied && <button type="button" className="td-promo-btn" onClick={applyPromo}>Apply</button>}
                  </div>
                  {promoApplied && <span className="td-promo-success">✓ 10% promo applied!</span>}
                </div>

                <div className="td-rate-divider" />

                <div className="td-price-summary">
                  <div className="td-price-row"><span>Adult × {adults}</span><span>${tour.adultPrice * adults}</span></div>
                  {children > 0 && <div className="td-price-row"><span>Child × {children}</span><span>${tour.childPrice * children}</span></div>}
                  {addonTotal > 0 && <div className="td-price-row"><span>Add-ons</span><span>${addonTotal}</span></div>}
                  {promoApplied && <div className="td-price-row discount"><span>Promo (SAVE10)</span><span>−${discount}</span></div>}
                  <div className="td-price-row total"><span>Total</span><span style={{ color:'#f97316' }}>${total} USD</span></div>
                </div>

                <div className="td-action-btns" style={{ marginTop:8 }}>
                  <button type="button" className="td-btn-online" onClick={handlePaymentOnline}>💳 Go to Payment Online</button>
                  <button type="button" className="td-btn-offline" onClick={handleOffline}>📋 Continue with Offline</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
