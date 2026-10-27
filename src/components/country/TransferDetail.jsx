import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const COUNTRY_CODES = ['+91','+1','+44','+61','+65','+60','+66','+971','+81','+49'];
const VEHICLE_PRICES = { Sedan: 0, SUV: 15, Van: 25, Minibus: 40 };
const VEHICLE_ICONS  = { Sedan:'🚗', SUV:'🚙', Van:'🚐', Minibus:'🚌' };
const VEHICLE_CAPS   = { Sedan:'1–3 pax', SUV:'1–6 pax', Van:'1–9 pax', Minibus:'10–20 pax' };

const DEFAULT_PICKUPS = {
  Bangkok:      ['Suvarnabhumi Airport (BKK)', 'Don Mueang Airport (DMK)', 'Chatuchak', 'Sukhumvit', 'Silom', 'Khao San Road'],
  Pattaya:      ['North Pattaya Road', 'Walking Street', 'Jomtien Beach', 'Central Pattaya'],
  Phuket:       ['Phuket International Airport', 'Patong Beach', 'Kata Beach', 'Karon Beach', 'Old Phuket Town'],
  Krabi:        ['Krabi Airport', 'Ao Nang', 'Railay Beach', 'Krabi Town'],
  Samui:        ['Samui Airport', 'Chaweng Beach', 'Lamai Beach', "Bophut Fisherman's Village"],
  'Chiang Mai': ['Chiang Mai Airport', 'Old City', 'Nimman Road', 'Night Bazaar'],
  'Kuala Lumpur': ['KLIA', 'KLIA2', 'Bukit Bintang', 'Petaling Jaya'],
  Penang:       ['Penang International Airport', 'Georgetown', 'Batu Ferringhi'],
  Langkawi:     ['Langkawi Airport', 'Pantai Cenang', 'Kuah Town'],
};
const LOCATIONS = Object.keys(DEFAULT_PICKUPS);

/* ─── Child Age Popup ─────────────────────────────────────── */
function ChildAgePopup({ onAdd, onClose }) {
  const [age, setAge] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const valid = age !== '' && !isNaN(+age) && +age >= 0 && +age <= 17;

  return (
    <div className="td2-popup-bg" onMouseDown={onClose}>
      <div className="td2-popup" onMouseDown={e => e.stopPropagation()}>
        <div className="td2-popup-icon">👶</div>
        <h3 className="td2-popup-h">Child's Age</h3>
        <p className="td2-popup-sub">Enter age in years (0 – 17)</p>
        <input
          ref={ref}
          type="number" min="0" max="17"
          value={age}
          onChange={e => setAge(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && valid && onAdd(+age)}
          placeholder="e.g. 7"
          className="td2-popup-input"
        />
        <div className="td2-popup-btns">
          <button type="button" className="td2-popup-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="td2-popup-confirm" disabled={!valid}
            onClick={() => onAdd(+age)}>Add Child ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export default function TransferDetail() {
  const data           = useOutletContext();
  const { transferSlug } = useParams();
  const loc            = useLocation();
  const navigate       = useNavigate();

  const raw = loc.state?.transfer || (data.transfers || []).find(t => t.id === transferSlug);

  /* personal */
  const [fullName,    setFullName]    = useState('');
  const [cc,          setCC]          = useState('+91');
  const [whatsapp,    setWhatsapp]    = useState('');
  const [email,       setEmail]       = useState('');

  /* trip */
  const [startDest,   setStartDest]  = useState(raw?.from?.split(' ')[0] || LOCATIONS[0]);
  const [endDest,     setEndDest]    = useState(raw?.to?.split(' ')[0]   || LOCATIONS[1]);
  const [pickup,      setPickup]     = useState('');
  const [dropPt,      setDropPt]     = useState('');
  const [vehicle,     setVehicle]    = useState(raw?.vehicles?.[0] || 'Sedan');
  const [adults,      setAdults]     = useState(2);
  const [kids,        setKids]       = useState([]);   // [{age}]
  const [showKidPop,  setShowKidPop] = useState(false);
  const [selDate,     setDate]       = useState('');
  const [flightNo,    setFlightNo]   = useState('');
  const [flightType,  setFlightType] = useState('Arrival');
  const [flightTime,  setFlightTime] = useState('');
  const [pickupTime,  setPickupTime] = useState('');
  const [rep,         setRep]        = useState('Yes');
  const [promo,       setPromo]      = useState('');
  const [promoOk,     setPromoOk]    = useState(false);
  const [errors,      setErrors]     = useState({});

  const pickups  = DEFAULT_PICKUPS[startDest] || [];
  const vehicles = raw?.vehicles || ['Sedan','SUV','Van'];

  const base      = raw ? parseFloat((raw.price || '$0').replace(/[^0-9.]/g,'')) : 0;
  const vExtra    = VEHICLE_PRICES[vehicle] || 0;
  const pp        = base + vExtra;
  const subtotal  = pp * adults + pp * 0.5 * kids.length;
  const disc      = promoOk ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal - disc;

  function validate() {
    const e = {};
    if (!fullName.trim())  e.fullName = 'Required';
    if (!whatsapp.trim())  e.whatsapp = 'Required';
    if (!email.trim())     e.email    = 'Required';
    if (!selDate)          e.date     = 'Required';
    if (!pickup)           e.pickup   = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const [showConfirm, setShowConfirm] = useState(false);
  const bookingRef = `PT-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

  function goOnline() {
    if (!validate()) return;
    navigate('/book-trip', {
      state: {
        destination: raw?.title || 'Transfer',
        country: data.name,
        image: raw?.image,
        price: `$${total}`,
        prefill: { fullName, cc, whatsapp, email, startDest, endDest, pickup, dropPt, vehicle, adults, kids, date: selDate, flightNo, flightType, flightTime, pickupTime, rep, total },
        paymentMethod: 'online',
      }
    });
  }

  function goOffline() {
    if (!validate()) return;
    setShowConfirm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!raw) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <h2 style={{ color:'#1e293b', fontSize:'2rem' }}>Transfer not found</h2>
      <button onClick={() => navigate(-1)} style={{ padding:'12px 28px', background:'#f97316', color:'#fff', border:'none', borderRadius:50, cursor:'pointer', fontWeight:700, fontSize:'1rem' }}>← Go Back</button>
    </div>
  );

  return (
    <div className="td2-page">
      <Helmet>
        <title>{raw.title} – {data.name} | PlantripOnline</title>
        <meta name="description" content={raw.description} />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ── Base ───────────────────────────────────── */
        .td2-page { font-family:'Inter',system-ui,sans-serif; background:#f0f4f8; min-height:100vh; }

        /* ── Hero ───────────────────────────────────── */
        .td2-hero { position:relative; height:52vh; min-height:340px; overflow:hidden; }
        .td2-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
          filter:brightness(.38); transform:scale(1.06); transition:transform 10s ease; }
        .td2-hero:hover .td2-hero-img { transform:scale(1.1); }
        .td2-hero-grad { position:absolute; inset:0;
          background:linear-gradient(170deg, rgba(0,0,0,.02) 0%, rgba(15,23,42,.18) 35%, rgba(15,23,42,.9) 100%); }

        .td2-back { position:absolute; top:76px; left:44px; z-index:4;
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,.12); backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,.22); border-radius:50px;
          color:#fff; font-size:.82rem; font-weight:700; padding:9px 20px;
          cursor:pointer; font-family:inherit; transition:all .2s; }
        .td2-back:hover { background:rgba(255,255,255,.22); }

        .td2-hero-body { position:absolute; bottom:0; left:0; right:0; z-index:3;
          padding:0 44px 38px; }
        .td2-hero-eyebrow { display:inline-flex; align-items:center; gap:7px;
          background:rgba(249,115,22,.22); border:1px solid rgba(249,115,22,.45);
          backdrop-filter:blur(8px); color:#fb923c; font-size:.72rem; font-weight:800;
          letter-spacing:1.2px; text-transform:uppercase; padding:5px 14px;
          border-radius:50px; margin-bottom:12px; }
        .td2-hero-h1 { font-size:2.8rem; font-weight:900; color:#fff;
          letter-spacing:-1.5px; line-height:1.06; text-shadow:0 4px 24px rgba(0,0,0,.5);
          margin-bottom:18px; }
        .td2-hero-h1 span { color:#fb923c; }

        .td2-route-strip { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .td2-rpill { display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2);
          backdrop-filter:blur(8px); color:#fff; padding:7px 18px;
          border-radius:50px; font-size:.82rem; font-weight:600; }
        .td2-rarrow { color:rgba(255,255,255,.45); font-size:1.2rem; }
        .td2-rpill-price { background:rgba(249,115,22,.28); border-color:rgba(249,115,22,.55); }
        .td2-rpill-price strong { color:#fb923c; font-size:.95rem; font-weight:900; }

        /* ── Layout ─────────────────────────────────── */
        .td2-wrap { max-width:1120px; margin:0 auto; padding:40px 1.5rem 100px;
          display:grid; grid-template-columns:1fr 370px; gap:28px; align-items:start; }
        @media(max-width:1060px){ .td2-wrap { grid-template-columns:1fr; } }

        /* ── Form card ──────────────────────────────── */
        .td2-card { background:#fff; border-radius:24px; padding:36px;
          box-shadow:0 4px 24px rgba(0,0,0,.07); }

        .td2-card-title { font-size:1.3rem; font-weight:900; color:#0f172a; margin-bottom:6px; }
        .td2-card-sub   { font-size:.85rem; color:#64748b; margin-bottom:28px; }

        .td2-section-hdr { display:flex; align-items:center; gap:10px;
          margin:28px 0 16px; }
        .td2-section-hdr-line { flex:1; height:1px; background:#f1f5f9; }
        .td2-section-hdr-label { font-size:.7rem; font-weight:800; color:#94a3b8;
          text-transform:uppercase; letter-spacing:1.2px; white-space:nowrap; }

        .td2-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:600px){ .td2-grid2 { grid-template-columns:1fr; } }

        .td2-field { display:flex; flex-direction:column; gap:5px; }
        .td2-label { font-size:.72rem; font-weight:700; color:#64748b;
          text-transform:uppercase; letter-spacing:.6px; }
        .td2-input, .td2-select {
          padding:12px 15px; border:1.5px solid #e2e8f0; border-radius:12px;
          font-size:.9rem; color:#0f172a; font-weight:500; outline:none;
          background:#fff; font-family:inherit; transition:border-color .2s, box-shadow .2s; }
        .td2-input:focus, .td2-select:focus {
          border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.1); }
        .td2-field.err .td2-input,
        .td2-field.err .td2-select { border-color:#ef4444; }
        .td2-err-msg { font-size:.7rem; color:#ef4444; font-weight:700; }

        /* whatsapp */
        .td2-wa { display:flex; gap:8px; }
        .td2-wa-cc { flex:0 0 86px; padding:12px 8px; border:1.5px solid #e2e8f0;
          border-radius:12px; font-size:.85rem; font-weight:600; color:#0f172a;
          outline:none; background:#fff; font-family:inherit; transition:border-color .2s; }
        .td2-wa-cc:focus { border-color:#f97316; }

        /* vehicle */
        .td2-vehicles { display:flex; gap:10px; flex-wrap:wrap; }
        .td2-veh { display:flex; flex-direction:column; align-items:center; gap:3px;
          padding:12px 18px; border:2px solid #e2e8f0; border-radius:14px;
          background:#fff; cursor:pointer; font-family:inherit; transition:all .2s;
          min-width:90px; }
        .td2-veh-icon { font-size:1.5rem; }
        .td2-veh-name { font-size:.8rem; font-weight:700; color:#475569; }
        .td2-veh-cap  { font-size:.68rem; color:#94a3b8; }
        .td2-veh.sel  { border-color:#f97316; background:#fff7ed; }
        .td2-veh.sel .td2-veh-name { color:#c2410c; }
        .td2-veh:hover { border-color:#f97316; }
        .td2-veh-price { font-size:.68rem; color:#f97316; font-weight:700; }

        /* pax */
        .td2-pax-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:600px){ .td2-pax-grid { grid-template-columns:1fr; } }

        .td2-pax-box { background:#f8fafc; border-radius:14px; padding:14px 18px; }
        .td2-pax-top { display:flex; justify-content:space-between; align-items:center; }
        .td2-pax-lbl { font-size:.72rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.6px; }
        .td2-pax-ctrl { display:flex; align-items:center; gap:12px; }
        .td2-pax-btn { width:30px; height:30px; border-radius:9px; border:1.5px solid #e2e8f0;
          background:#fff; font-size:1.15rem; font-weight:700; cursor:pointer; color:#0f172a;
          display:flex; align-items:center; justify-content:center; transition:all .15s; font-family:inherit; }
        .td2-pax-btn:hover { border-color:#f97316; color:#f97316; background:#fff7ed; }
        .td2-pax-num { font-size:1.1rem; font-weight:900; color:#0f172a; min-width:20px; text-align:center; }

        /* children box */
        .td2-kids-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .td2-kids-add { width:30px; height:30px; border-radius:9px; border:2px solid #f97316;
          background:#fff; font-size:1.15rem; font-weight:700; cursor:pointer; color:#f97316;
          display:flex; align-items:center; justify-content:center; transition:all .15s; font-family:inherit; }
        .td2-kids-add:hover { background:#fff7ed; }
        .td2-kids-chips { display:flex; flex-wrap:wrap; gap:7px; margin-top:4px; }
        .td2-kid-chip { display:inline-flex; align-items:center; gap:5px;
          background:linear-gradient(135deg,#fff7ed,#ffedd5); border:1.5px solid #fed7aa;
          border-radius:20px; padding:4px 10px 4px 12px;
          font-size:.76rem; font-weight:700; color:#c2410c; }
        .td2-kid-x { background:none; border:none; cursor:pointer; color:#f97316;
          font-size:1rem; line-height:1; padding:0; display:flex; align-items:center; }
        .td2-kid-x:hover { color:#dc2626; }
        .td2-kids-empty { font-size:.75rem; color:#94a3b8; font-style:italic; }

        /* ── Child popup ────────────────────────────── */
        .td2-popup-bg { position:fixed; inset:0; z-index:1000;
          display:flex; align-items:center; justify-content:center;
          background:rgba(15,23,42,.38); backdrop-filter:blur(5px); }
        .td2-popup { background:#fff; border-radius:24px; padding:32px 28px 28px;
          width:310px; box-shadow:0 24px 72px rgba(0,0,0,.22);
          animation:td2Pop .22s cubic-bezier(.34,1.56,.64,1); text-align:center; }
        @keyframes td2Pop { from { opacity:0; transform:scale(.85) translateY(12px); } to { opacity:1; transform:none; } }
        .td2-popup-icon { font-size:2.2rem; margin-bottom:8px; }
        .td2-popup-h    { font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:4px; }
        .td2-popup-sub  { font-size:.82rem; color:#64748b; margin-bottom:18px; }
        .td2-popup-input { width:100%; padding:14px; border:2px solid #e2e8f0; border-radius:14px;
          font-size:1.3rem; font-weight:800; color:#0f172a; text-align:center; outline:none;
          font-family:inherit; box-sizing:border-box; transition:border-color .2s; }
        .td2-popup-input:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
        .td2-popup-btns { display:flex; gap:10px; margin-top:20px; }
        .td2-popup-cancel { flex:1; padding:12px; border:1.5px solid #e2e8f0; background:#fff;
          border-radius:12px; font-size:.88rem; font-weight:600; color:#64748b;
          cursor:pointer; font-family:inherit; transition:all .2s; }
        .td2-popup-cancel:hover { border-color:#94a3b8; color:#0f172a; }
        .td2-popup-confirm { flex:1; padding:12px;
          background:linear-gradient(135deg,#f97316,#fb923c); border:none;
          border-radius:12px; font-size:.88rem; font-weight:700; color:#fff;
          cursor:pointer; font-family:inherit; box-shadow:0 4px 14px rgba(249,115,22,.35);
          transition:all .2s; }
        .td2-popup-confirm:disabled { opacity:.42; cursor:not-allowed; box-shadow:none; }
        .td2-popup-confirm:not(:disabled):hover { background:linear-gradient(135deg,#ea580c,#f97316); }

        /* ── Divider ────────────────────────────────── */
        .td2-hr { height:1px; background:#f1f5f9; margin:8px 0; }

        /* ── Price sidebar ──────────────────────────── */
        .td2-side { position:sticky; top:84px; display:flex; flex-direction:column; gap:16px; }

        .td2-price-card { background:#fff; border-radius:24px; padding:28px;
          box-shadow:0 8px 32px rgba(0,0,0,.09); }
        .td2-price-eyebrow { font-size:.68rem; font-weight:800; color:#94a3b8;
          text-transform:uppercase; letter-spacing:1.2px; margin-bottom:4px; }
        .td2-price-amount { font-size:2.5rem; font-weight:900; color:#0f172a; line-height:1;
          margin-bottom:4px; display:flex; align-items:baseline; gap:6px; }
        .td2-price-amount small { font-size:.78rem; color:#94a3b8; font-weight:400; }
        .td2-price-route { font-size:.8rem; color:#64748b; margin-bottom:18px; }
        .td2-price-hr { height:1px; background:#f1f5f9; margin:16px 0; }

        .td2-price-rows { background:#f8fafc; border-radius:14px; padding:16px; margin-bottom:18px; }
        .td2-price-row { display:flex; justify-content:space-between; align-items:center;
          padding:5px 0; font-size:.85rem; color:#64748b; }
        .td2-price-row.total { border-top:2px solid #e2e8f0; margin-top:8px; padding-top:12px;
          font-size:1.05rem; font-weight:900; color:#0f172a; }
        .td2-price-row.discount { color:#16a34a; font-weight:700; }

        .td2-cta-stack { display:flex; flex-direction:column; gap:10px; }
        .td2-btn-pay { width:100%; padding:16px; border:none; border-radius:16px;
          background:linear-gradient(135deg,#f97316,#fb923c); color:#fff;
          font-size:.95rem; font-weight:800; cursor:pointer; font-family:inherit;
          box-shadow:0 6px 22px rgba(249,115,22,.38); transition:all .25s; }
        .td2-btn-pay:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(249,115,22,.48); }
        .td2-btn-wait { width:100%; padding:15px; border:2px solid #e2e8f0; border-radius:16px;
          background:#fff; color:#0f172a; font-size:.95rem; font-weight:700;
          cursor:pointer; font-family:inherit; transition:all .25s; }
        .td2-btn-wait:hover { border-color:#0f172a; background:#f8fafc; }
        .td2-trust { display:flex; align-items:center; justify-content:center; gap:6px;
          margin-top:14px; font-size:.74rem; color:#94a3b8; }

        /* info card */
        .td2-info-card { background:#fff; border-radius:20px; padding:22px;
          box-shadow:0 4px 16px rgba(0,0,0,.07); }
        .td2-info-title { font-size:.78rem; font-weight:800; color:#0f172a;
          text-transform:uppercase; letter-spacing:.8px; margin-bottom:14px; }
        .td2-info-row { display:flex; align-items:center; gap:10px;
          padding:8px 0; border-bottom:1px solid #f1f5f9; }
        .td2-info-row:last-child { border-bottom:none; padding-bottom:0; }
        .td2-info-icon { font-size:1.1rem; width:28px; text-align:center; flex-shrink:0; }
        .td2-info-text { font-size:.82rem; color:#475569; font-weight:500; }

        /* promo */
        .td2-promo-row { display:flex; gap:8px; }
        .td2-promo-inp { flex:1; padding:11px 14px; border:1.5px solid #e2e8f0;
          border-radius:12px; font-size:.88rem; outline:none; font-family:inherit;
          transition:border-color .2s; }
        .td2-promo-inp:focus { border-color:#f97316; }
        .td2-promo-btn { padding:11px 16px; background:#f97316; color:#fff;
          border:none; border-radius:12px; font-weight:700; font-size:.82rem;
          cursor:pointer; font-family:inherit; transition:background .2s; }
        .td2-promo-btn:hover { background:#ea580c; }
        .td2-promo-ok { font-size:.76rem; color:#16a34a; font-weight:700; margin-top:4px; }

        @media(max-width:768px){
          .td2-hero { height:44vh; }
          .td2-hero-body { padding:0 20px 28px; }
          .td2-hero-h1 { font-size:1.9rem; }
          .td2-back { left:20px; top:68px; }
          .td2-card { padding:22px 18px; }
          .td2-wrap { padding:24px 1rem 70px; }
        }
      `}</style>

      {showKidPop && <ChildAgePopup onAdd={a => { setKids(k => [...k, {age:a}]); setShowKidPop(false); }} onClose={() => setShowKidPop(false)} />}

      {/* ── OFFLINE CONFIRMATION OVERLAY ─────────────────────── */}
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, zIndex:500, background:'#f0f4f8', overflowY:'auto', fontFamily:"'Inter',system-ui,sans-serif", animation:'td2ConfIn .35s ease' }}>
          <style>{`@keyframes td2ConfIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
          <div style={{ maxWidth:620, margin:'0 auto', padding:'40px 24px 80px' }}>

            {/* Close */}
            <button type="button" onClick={() => setShowConfirm(false)}
              style={{ display:'inline-flex', alignItems:'center', gap:7, background:'none', border:'none', color:'#64748b', fontSize:'.88rem', fontWeight:600, cursor:'pointer', marginBottom:28, fontFamily:'inherit' }}>
              ← Edit Booking
            </button>

            {/* Success card */}
            <div style={{ background:'#fff', borderRadius:24, padding:'36px 32px', boxShadow:'0 8px 40px rgba(0,0,0,.1)', marginBottom:20 }}>
              {/* Animated tick */}
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(34,197,94,.35)', fontSize:'2rem', animation:'td2ConfIn .4s .1s both' }}>✓</div>
              </div>
              <h2 style={{ textAlign:'center', fontSize:'1.5rem', fontWeight:900, color:'#0f172a', margin:'0 0 6px' }}>Booking Request Sent!</h2>
              <p style={{ textAlign:'center', color:'#64748b', fontSize:'.9rem', margin:'0 0 28px' }}>Our team will contact you within <strong>2–4 hours</strong> to confirm your booking.</p>

              {/* Ref badge */}
              <div style={{ background:'#f8fafc', border:'1.5px dashed #cbd5e1', borderRadius:14, padding:'14px 20px', textAlign:'center', marginBottom:28 }}>
                <div style={{ fontSize:'.72rem', color:'#94a3b8', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:4 }}>Booking Reference</div>
                <div style={{ fontSize:'1.4rem', fontWeight:900, color:'#f97316', letterSpacing:2 }}>{bookingRef}</div>
              </div>

              {/* Details */}
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  ['👤 Name',      fullName],
                  ['📱 WhatsApp',  `${cc} ${whatsapp}`],
                  ['📧 Email',     email],
                  ['📍 From',      `${startDest} — ${pickup || '—'}`],
                  ['📍 To',        `${endDest}${dropPt ? ' — '+dropPt : ''}`],
                  ['🚗 Vehicle',   vehicle],
                  ['📅 Date',      selDate],
                  ['👥 Adults',    adults],
                  kids.length > 0 ? ['👧 Children',  kids.map(k=>`${k.age}yr`).join(', ')] : null,
                  flightNo ? ['✈️ Flight',  `${flightNo} (${flightType})`] : null,
                  rep === 'Yes' ? ['🛬 Airport Rep', 'Yes – Meet & Greet'] : null,
                  ['💵 Total',     `$${total} USD${promoOk ? ' (10% promo applied)' : ''}`],
                ].filter(Boolean).map(([label, val], i, arr) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'11px 0', borderBottom: i < arr.length-1 ? '1px solid #f1f5f9' : 'none', gap:12 }}>
                    <span style={{ fontSize:'.83rem', color:'#64748b', fontWeight:600, flexShrink:0 }}>{label}</span>
                    <span style={{ fontSize:'.88rem', color:'#0f172a', fontWeight:700, textAlign:'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div style={{ background:'linear-gradient(135deg,#fff7ed,#ffedd5)', border:'1.5px solid #fed7aa', borderRadius:20, padding:'24px 28px', marginBottom:20 }}>
              <div style={{ fontSize:'.78rem', fontWeight:800, color:'#ea580c', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>📞 We'll reach you at</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'1.2rem' }}>💬</span>
                  <div>
                    <div style={{ fontSize:'.72rem', color:'#92400e', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px' }}>WhatsApp</div>
                    <div style={{ fontSize:'.95rem', fontWeight:800, color:'#7c2d12' }}>{cc} {whatsapp}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'1.2rem' }}>✉️</span>
                  <div>
                    <div style={{ fontSize:'.72rem', color:'#92400e', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px' }}>Email</div>
                    <div style={{ fontSize:'.95rem', fontWeight:800, color:'#7c2d12' }}>{email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button type="button" onClick={() => navigate(`/${data.slug}/transfers`)}
                style={{ width:'100%', padding:'16px', background:'linear-gradient(135deg,#f97316,#fb923c)', border:'none', borderRadius:16, fontSize:'.95rem', fontWeight:800, color:'#fff', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 6px 20px rgba(249,115,22,.35)' }}>
                🏠 Back to Transfers
              </button>
              <button type="button" onClick={() => setShowConfirm(false)}
                style={{ width:'100%', padding:'15px', background:'#fff', border:'2px solid #e2e8f0', borderRadius:16, fontSize:'.9rem', fontWeight:700, color:'#0f172a', cursor:'pointer', fontFamily:'inherit' }}>
                ✏️ Edit My Booking
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="td2-hero">
        <img className="td2-hero-img" src={raw.image} alt={raw.title} />
        <div className="td2-hero-grad" />

        <button type="button" className="td2-back"
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`/${data.slug}/transfers`)}>
          ← Back
        </button>

        <div className="td2-hero-body">
          <div className="td2-hero-eyebrow">🚗 Private Transfer</div>
          <h1 className="td2-hero-h1">{raw.title || <>{data.name} <span>Transfer</span></>}</h1>
          <div className="td2-route-strip">
            <div className="td2-rpill">📍 {raw.from}</div>
            <div className="td2-rarrow">→</div>
            <div className="td2-rpill">📍 {raw.to}</div>
            {raw.duration && <div className="td2-rpill">⏱ {raw.duration}</div>}
            <div className="td2-rpill td2-rpill-price">
              From&nbsp;<strong>{raw.price?.replace('From ','')}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="td2-wrap">

        {/* ─ FORM ─ */}
        <div className="td2-card">
          <div className="td2-card-title">Book Your Transfer</div>
          <div className="td2-card-sub">Fill in the details below and we'll confirm your booking.</div>

          {/* PERSONAL */}
          <div className="td2-section-hdr">
            <div className="td2-section-hdr-label">👤 Personal Info</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className={`td2-field${errors.fullName ? ' err' : ''}`}>
            <label className="td2-label">Full Name</label>
            <input className="td2-input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" />
            {errors.fullName && <span className="td2-err-msg">Required</span>}
          </div>

          <div style={{marginTop:12}} className={`td2-field${errors.whatsapp ? ' err' : ''}`}>
            <label className="td2-label">WhatsApp Number</label>
            <div className="td2-wa">
              <select className="td2-wa-cc" value={cc} onChange={e => setCC(e.target.value)}>
                {COUNTRY_CODES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="td2-input" style={{flex:1}} type="tel" value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)} />
            </div>
            {errors.whatsapp && <span className="td2-err-msg">Required</span>}
          </div>

          <div style={{marginTop:12}} className={`td2-field${errors.email ? ' err' : ''}`}>
            <label className="td2-label">Email Address</label>
            <input className="td2-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="e.g. name@example.com" />
            {errors.email && <span className="td2-err-msg">Required</span>}
          </div>

          {/* TRIP */}
          <div className="td2-section-hdr" style={{marginTop:28}}>
            <div className="td2-section-hdr-label">🗺 Trip Details</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className="td2-grid2">
            <div className="td2-field">
              <label className="td2-label">From</label>
              <select className="td2-select" value={startDest}
                onChange={e => { setStartDest(e.target.value); setPickup(''); }}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="td2-field">
              <label className="td2-label">To</label>
              <select className="td2-select" value={endDest} onChange={e => setEndDest(e.target.value)}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="td2-grid2" style={{marginTop:14}}>
            <div className={`td2-field${errors.pickup ? ' err' : ''}`}>
              <label className="td2-label">Pick-up Point</label>
              <select className="td2-select" value={pickup} onChange={e => setPickup(e.target.value)}>
                <option value="">— Select —</option>
                {pickups.map(p => <option key={p}>{p}</option>)}
                <option value="other">Other (specify)</option>
              </select>
              {errors.pickup && <span className="td2-err-msg">Required</span>}
            </div>
            <div className="td2-field">
              <label className="td2-label">Drop Point</label>
              <select className="td2-select" value={dropPt} onChange={e => setDropPt(e.target.value)}>
                <option value="">— Select —</option>
                {(DEFAULT_PICKUPS[endDest] || []).map(p => <option key={p}>{p}</option>)}
                <option value="other">Other (specify)</option>
              </select>
            </div>
          </div>

          {/* VEHICLE */}
          <div className="td2-section-hdr" style={{marginTop:28}}>
            <div className="td2-section-hdr-label">🚘 Vehicle Type</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className="td2-vehicles">
            {vehicles.map(v => (
              <button type="button" key={v}
                className={`td2-veh${vehicle === v ? ' sel' : ''}`}
                onClick={() => setVehicle(v)}>
                <span className="td2-veh-icon">{VEHICLE_ICONS[v] || '🚗'}</span>
                <span className="td2-veh-name">{v}</span>
                <span className="td2-veh-cap">{VEHICLE_CAPS[v] || ''}</span>
                {VEHICLE_PRICES[v] > 0
                  ? <span className="td2-veh-price">+${VEHICLE_PRICES[v]}</span>
                  : <span className="td2-veh-price" style={{color:'#16a34a'}}>Base</span>}
              </button>
            ))}
          </div>

          {/* PASSENGERS + DATE */}
          <div className="td2-section-hdr" style={{marginTop:28}}>
            <div className="td2-section-hdr-label">👥 Passengers & Date</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className="td2-pax-grid">

            {/* Adults */}
            <div className="td2-pax-box">
              <div className="td2-pax-top">
                <span className="td2-pax-lbl">Adults</span>
                <div className="td2-pax-ctrl">
                  <button type="button" className="td2-pax-btn" onClick={() => setAdults(a => Math.max(1,a-1))}>−</button>
                  <span className="td2-pax-num">{adults}</span>
                  <button type="button" className="td2-pax-btn" onClick={() => setAdults(a => a+1)}>+</button>
                </div>
              </div>
            </div>

            {/* Children */}
            <div className="td2-pax-box">
              <div className="td2-kids-top">
                <span className="td2-pax-lbl">Children</span>
                <button type="button" className="td2-kids-add"
                  title="Add child" onClick={() => setShowKidPop(true)}>+</button>
              </div>
              {kids.length === 0
                ? <div className="td2-kids-empty">No children added</div>
                : <div className="td2-kids-chips">
                    {kids.map((k, i) => (
                      <span key={i} className="td2-kid-chip">
                        👧 {k.age} yr
                        <button type="button" className="td2-kid-x"
                          onClick={() => setKids(prev => prev.filter((_,j)=>j!==i))}>×</button>
                      </span>
                    ))}
                  </div>
              }
            </div>
          </div>

          <div style={{marginTop:14}} className={`td2-field${errors.date ? ' err' : ''}`}>
            <label className="td2-label">Travel Date</label>
            <input className="td2-input" type="date" value={selDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)} />
            {errors.date && <span className="td2-err-msg">Required</span>}
          </div>

          {/* FLIGHT */}
          <div className="td2-section-hdr" style={{marginTop:28}}>
            <div className="td2-section-hdr-label">✈️ Flight Details</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className="td2-grid2">
            <div className="td2-field">
              <label className="td2-label">Flight No.</label>
              <input className="td2-input" value={flightNo}
                onChange={e => setFlightNo(e.target.value)} placeholder="e.g. TG205" />
            </div>
            <div className="td2-field">
              <label className="td2-label">Arrival / Departure</label>
              <select className="td2-select" value={flightType}
                onChange={e => setFlightType(e.target.value)}>
                <option>Arrival</option>
                <option>Departure</option>
              </select>
            </div>
          </div>

          <div className="td2-grid2" style={{marginTop:14}}>
            <div className="td2-field">
              <label className="td2-label">Flight Time</label>
              <input className="td2-input" type="time" value={flightTime}
                onChange={e => setFlightTime(e.target.value)} />
            </div>
            <div className="td2-field">
              <label className="td2-label">Pick-up Time</label>
              <input className="td2-input" type="time" value={pickupTime}
                onChange={e => setPickupTime(e.target.value)} />
            </div>
          </div>

          <div style={{marginTop:14}} className="td2-field">
            <label className="td2-label">Airport Rep Service</label>
            <select className="td2-select" value={rep} onChange={e => setRep(e.target.value)}>
              <option value="Yes">Yes – Meet &amp; Greet at airport</option>
              <option value="No">No – Self meet</option>
            </select>
          </div>

          {/* PROMO */}
          <div className="td2-section-hdr" style={{marginTop:28}}>
            <div className="td2-section-hdr-label">🏷 Promo Code</div>
            <div className="td2-section-hdr-line" />
          </div>

          <div className="td2-promo-row">
            <input className="td2-promo-inp" value={promo}
              onChange={e => setPromo(e.target.value)}
              placeholder="e.g. SAVE10" disabled={promoOk} />
            {!promoOk && (
              <button type="button" className="td2-promo-btn"
                onClick={() => promo.trim().toUpperCase() === 'SAVE10'
                  ? setPromoOk(true) : alert('Invalid promo code')}>
                Apply
              </button>
            )}
          </div>
          {promoOk && <div className="td2-promo-ok">✓ 10% discount applied!</div>}

        </div>

        {/* ─ SIDEBAR ─ */}
        <div className="td2-side">

          {/* Price Card */}
          <div className="td2-price-card">
            <div className="td2-price-eyebrow">Total Amount</div>
            <div className="td2-price-amount">${pp}<small>/person</small></div>
            <div className="td2-price-route">{vehicle} · {raw.from} → {raw.to}</div>
            <div className="td2-price-hr" />

            <div className="td2-price-rows">
              <div className="td2-price-row">
                <span>Adult × {adults}</span>
                <span>${pp * adults}</span>
              </div>
              {kids.map((k, i) => (
                <div className="td2-price-row" key={i}>
                  <span>Child ({k.age} yr)</span>
                  <span>${(pp * 0.5).toFixed(0)}</span>
                </div>
              ))}
              {promoOk && (
                <div className="td2-price-row discount">
                  <span>Promo SAVE10</span>
                  <span>−${disc}</span>
                </div>
              )}
              <div className="td2-price-row total">
                <span>Total</span>
                <span style={{color:'#f97316'}}>${total} USD</span>
              </div>
            </div>

            <div className="td2-cta-stack">
              <button type="button" className="td2-btn-pay" onClick={goOnline}>
                💳 Pay Online Now
              </button>
              <button type="button" className="td2-btn-wait" onClick={goOffline}>
                ⏳ Wait for Confirmation
              </button>
            </div>
            <div className="td2-trust">🔒 Free cancellation · Instant booking</div>
          </div>

          

        </div>
      </div>
    </div>
  );
}
