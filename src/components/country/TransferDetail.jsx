import { useState, useMemo } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const COUNTRY_CODES = ['+91','+1','+44','+61','+65','+60','+66','+971','+81','+49'];
const VEHICLE_PRICES = { Sedan: 0, SUV: 15, Van: 25, Minibus: 40 };

const DEFAULT_PICKUPS = {
  Bangkok:             ['Suvarnabhumi Airport (BKK)', 'Don Mueang Airport (DMK)', 'Chatuchak', 'Sukhumvit', 'Silom', 'Khao San Road'],
  Pattaya:             ['North Pattaya Road', 'Walking Street', 'Jomtien Beach', 'Central Pattaya'],
  Phuket:              ['Phuket International Airport', 'Patong Beach', 'Kata Beach', 'Karon Beach', 'Old Phuket Town'],
  Krabi:               ['Krabi Airport', 'Ao Nang', 'Railay Beach', 'Krabi Town'],
  Samui:               ['Samui Airport', 'Chaweng Beach', 'Lamai Beach', 'Bophut Fisherman\'s Village'],
  'Chiang Mai':        ['Chiang Mai Airport', 'Old City', 'Nimman Road', 'Night Bazaar'],
};

const LOCATIONS = Object.keys(DEFAULT_PICKUPS);

export default function TransferDetail() {
  const data          = useOutletContext();
  const { transferSlug } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();

  const rawTransfer = location.state?.transfer
    || (data.transfers || []).find(t => t.id === transferSlug);

  // ── form state ────────────────────────────────────────────────
  const [startDest,   setStartDest]   = useState(rawTransfer?.from?.split(' ')[0] || LOCATIONS[0]);
  const [endDest,     setEndDest]     = useState(rawTransfer?.to?.split(' ')[0]   || LOCATIONS[1]);
  const [pickup,      setPickup]      = useState('');
  const [dropPoint,   setDrop]        = useState('');
  const [vehicle,     setVehicle]     = useState(rawTransfer?.vehicles?.[0] || 'Sedan');
  const [adults,      setAdults]      = useState(2);
  const [children,    setChildren]    = useState(0);
  const [selDate,     setDate]        = useState('');
  const [flightNo,    setFlightNo]    = useState('');
  const [flightType,  setFlightType]  = useState('Arrival');
  const [flightTime,  setFlightTime]  = useState('');
  const [pickupTime,  setPickupTime]  = useState('');
  const [airportRep,  setAirportRep]  = useState('Yes');
  const [promo,       setPromo]       = useState('');
  const [promoApplied,setPromoApplied]= useState(false);
  const [errors,      setErrors]      = useState({});

  const defaultPickups = DEFAULT_PICKUPS[startDest] || [];
  const vehicles = rawTransfer?.vehicles || ['Sedan', 'SUV', 'Van'];

  // base price from string e.g. "From $25"
  const basePrice = rawTransfer
    ? parseFloat((rawTransfer.price || 'From $0').replace(/[^0-9.]/g, ''))
    : 0;
  const vehicleExtra = VEHICLE_PRICES[vehicle] || 0;
  const perPerson    = basePrice + vehicleExtra;
  const subtotal     = perPerson * adults + (perPerson * 0.5) * children;
  const discount     = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total        = subtotal - discount;

  function applyPromo() {
    if (promo.trim().toUpperCase() === 'SAVE10') setPromoApplied(true);
    else alert('Invalid promo code');
  }

  function validate() {
    const e = {};
    if (!selDate)           e.date    = 'Please select a date';
    if (!pickup.trim())     e.pickup  = 'Select or enter pick-up point';
    return Object.keys(e).length === 0 ? (setErrors({}), true) : (setErrors(e), false);
  }

  function goPayment(method) {
    if (!validate()) return;
    navigate('/book-trip', {
      state: {
        destination: rawTransfer?.title || 'Transfer',
        country: data.name,
        image: rawTransfer?.image,
        price: `$${total}`,
        prefill: { startDest, endDest, pickup, dropPoint, vehicle, adults, children, date: selDate, flightNo, flightType, flightTime, pickupTime, airportRep, promo, total },
        paymentMethod: method,
      }
    });
  }

  if (!rawTransfer) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
        <h2 style={{ fontSize:'2rem', color:'#1e293b' }}>Transfer not found</h2>
        <button type="button" onClick={() => navigate(-1)} style={{ padding:'12px 28px', background:'#f97316', color:'white', border:'none', borderRadius:50, cursor:'pointer', fontWeight:700 }}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="trd-page">
      <Helmet>
        <title>{rawTransfer.title} – {data.name} Transfers | PlantripOnline</title>
        <meta name="description" content={rawTransfer.description} />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .trd-page { background:#f8fafc; min-height:100vh; font-family:'Inter',system-ui,sans-serif; }

        /* ── Hero ── */
        .trd-hero { position:relative; height:42vh; min-height:300px; overflow:hidden; }
        .trd-hero img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.35); transform:scale(1.05); transition:transform 8s ease; }
        .trd-hero:hover img { transform:scale(1.08); }
        .trd-hero-overlay { position:absolute; inset:0; background:linear-gradient(160deg,rgba(0,0,0,0.05) 0%,rgba(15,23,42,0.25) 40%,rgba(15,23,42,0.88) 100%); }
        .trd-back-btn { position:absolute; top:72px; left:48px; z-index:3; display:inline-flex; align-items:center; gap:7px; background:rgba(0,0,0,0.28); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.9); font-size:0.82rem; font-weight:600; cursor:pointer; padding:8px 18px; border-radius:50px; font-family:inherit; transition:all 0.2s; }
        .trd-back-btn:hover { background:rgba(0,0,0,0.45); color:white; }
        .trd-hero-content { position:absolute; bottom:0; left:0; right:0; z-index:2; padding:0 48px 32px; }
        .trd-hero-title { font-size:2.6rem; font-weight:900; color:white; letter-spacing:-1.5px; line-height:1.08; text-shadow:0 4px 20px rgba(0,0,0,0.5); margin-bottom:12px; }
        .trd-hero-route { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .trd-hero-pill { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); backdrop-filter:blur(8px); color:white; padding:6px 16px; border-radius:50px; font-size:0.82rem; font-weight:600; }
        .trd-hero-arrow { color:rgba(255,255,255,0.5); font-size:1.1rem; }
        .trd-hero-price { background:rgba(249,115,22,0.3); border-color:rgba(249,115,22,0.6); }
        .trd-hero-price strong { color:#fb923c; font-size:1rem; font-weight:900; }

        /* ── Location tabs ── */
        .trd-loc-bar { background:white; border-bottom:2px solid #f1f5f9; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .trd-loc-inner { max-width:1100px; margin:0 auto; padding:0 1.5rem; display:flex; gap:4px; overflow-x:auto; scrollbar-width:none; }
        .trd-loc-inner::-webkit-scrollbar { display:none; }
        .trd-loc-btn { padding:16px 22px; font-size:0.88rem; font-weight:700; color:#64748b; border:none; background:none; cursor:pointer; white-space:nowrap; border-bottom:3px solid transparent; margin-bottom:-2px; transition:all 0.2s; letter-spacing:0.2px; font-family:inherit; }
        .trd-loc-btn:hover { color:#f97316; }
        .trd-loc-btn.active { color:#f97316; border-bottom-color:#f97316; }

        /* ── Main layout ── */
        .trd-body { max-width:1100px; margin:0 auto; padding:36px 1.5rem 80px; display:grid; grid-template-columns:1fr 380px; gap:32px; align-items:start; }
        @media(max-width:1024px){ .trd-body { grid-template-columns:1fr; } }

        /* ── Form card ── */
        .trd-form-card { background:white; border-radius:20px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.07); }
        .trd-form-card h2 { font-size:1.25rem; font-weight:800; color:#1e293b; margin-bottom:24px; }
        .trd-form { display:flex; flex-direction:column; gap:16px; }
        .trd-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .trd-field { display:flex; flex-direction:column; gap:5px; }
        .trd-field label { font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; }
        .trd-field input,.trd-field select { padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.9rem; color:#1e293b; font-weight:500; outline:none; background:white; font-family:inherit; transition:border-color 0.2s; }
        .trd-field input:focus,.trd-field select:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,0.1); }
        .trd-field.error input,.trd-field.error select { border-color:#ef4444; }
        .trd-err { font-size:0.72rem; color:#ef4444; font-weight:600; }
        .trd-divider { height:1px; background:#f1f5f9; margin:4px 0; }

        /* vehicle selector */
        .trd-vehicles { display:flex; gap:8px; flex-wrap:wrap; }
        .trd-vehicle-btn { display:flex; align-items:center; gap:6px; padding:9px 18px; border-radius:10px; border:2px solid #e2e8f0; background:white; font-size:0.85rem; font-weight:600; color:#475569; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .trd-vehicle-btn.active { border-color:#f97316; background:#fff7ed; color:#c2410c; }
        .trd-vehicle-btn:hover { border-color:#f97316; }

        /* pax counter */
        .trd-pax-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .trd-pax-box { background:#f8fafc; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; }
        .trd-pax-label { font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase; }
        .trd-pax-ctrl { display:flex; align-items:center; gap:10px; }
        .trd-pax-btn { width:28px; height:28px; border-radius:8px; border:1.5px solid #e2e8f0; background:white; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; color:#1e293b; transition:all 0.15s; font-family:inherit; }
        .trd-pax-btn:hover { border-color:#f97316; color:#f97316; }
        .trd-pax-num { font-size:1rem; font-weight:800; color:#1e293b; min-width:18px; text-align:center; }

        /* promo */
        .trd-promo-row { display:flex; gap:8px; }
        .trd-promo-row input { flex:1; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:0.88rem; outline:none; font-family:inherit; }
        .trd-promo-row input:focus { border-color:#f97316; }
        .trd-promo-btn { padding:10px 16px; background:#f97316; color:white; border:none; border-radius:10px; font-weight:700; font-size:0.82rem; cursor:pointer; font-family:inherit; transition:background 0.2s; }
        .trd-promo-btn:hover { background:#ea580c; }
        .trd-promo-ok { font-size:0.78rem; color:#16a34a; font-weight:700; margin-top:3px; }

        /* ── Sidebar price card ── */
        .trd-price-card { background:white; border-radius:20px; padding:28px; box-shadow:0 8px 30px rgba(0,0,0,0.08); position:sticky; top:80px; }
        .trd-price-label { font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
        .trd-price-big { font-size:2.4rem; font-weight:900; color:#1e293b; line-height:1; margin-bottom:4px; }
        .trd-price-big small { font-size:0.8rem; color:#94a3b8; font-weight:400; }
        .trd-price-divider { height:1px; background:#f1f5f9; margin:20px 0; }
        .trd-price-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; font-size:0.88rem; color:#64748b; }
        .trd-price-row.total { border-top:2px solid #e2e8f0; margin-top:8px; padding-top:14px; font-size:1.1rem; font-weight:900; color:#1e293b; }
        .trd-price-row.discount { color:#16a34a; font-weight:700; }
        .trd-price-summary { background:#f8fafc; border-radius:14px; padding:16px; margin-bottom:20px; }
        .trd-cta { display:flex; flex-direction:column; gap:10px; }
        .trd-btn-pay { width:100%; padding:15px; background:linear-gradient(135deg,#f97316,#fb923c); color:white; border:none; border-radius:14px; font-size:0.95rem; font-weight:800; cursor:pointer; box-shadow:0 6px 20px rgba(249,115,22,0.35); transition:all 0.25s; font-family:inherit; }
        .trd-btn-pay:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,0.45); }
        .trd-btn-wait { width:100%; padding:15px; background:white; color:#1e293b; border:2px solid #e2e8f0; border-radius:14px; font-size:0.95rem; font-weight:700; cursor:pointer; transition:all 0.25s; font-family:inherit; }
        .trd-btn-wait:hover { border-color:#1e293b; background:#f8fafc; }
        .trd-guarantee { display:flex; align-items:center; gap:6px; justify-content:center; margin-top:12px; font-size:0.76rem; color:#94a3b8; }

        @media(max-width:768px){
          .trd-hero-content { padding:0 20px 24px; }
          .trd-back-btn { left:20px; top:64px; }
          .trd-hero-title { font-size:1.8rem; }
          .trd-row { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="trd-hero">
        <img src={rawTransfer.image} alt={rawTransfer.title} />
        <div className="trd-hero-overlay" />
        <button type="button" className="trd-back-btn" onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`/${data.slug}/transfers`)}>
          ← Back
        </button>
        <div className="trd-hero-content">
          <div className="trd-hero-title">{data.name} Transfers</div>
          <div className="trd-hero-route">
            <div className="trd-hero-pill">📍 {rawTransfer.from}</div>
            <div className="trd-hero-arrow">→</div>
            <div className="trd-hero-pill">📍 {rawTransfer.to}</div>
            <div className="trd-hero-pill">⏱ {rawTransfer.duration}</div>
            <div className="trd-hero-pill trd-hero-price">From <strong>&nbsp;{rawTransfer.price?.replace('From ', '')}</strong></div>
          </div>
        </div>
      </div>

      {/* ── Location tabs ── */}
      <div className="trd-loc-bar">
        <div className="trd-loc-inner">
          {LOCATIONS.map(loc => (
            <button
              key={loc}
              type="button"
              className={`trd-loc-btn${startDest === loc ? ' active' : ''}`}
              onClick={() => { setStartDest(loc); setPickup(''); }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="trd-body">

        {/* ── Left: booking form ── */}
        <div className="trd-form-card">
          <h2>Book Your Transfer</h2>
          <div className="trd-form">

            {/* Destinations */}
            <div className="trd-row">
              <div className="trd-field">
                <label>Starting Destination</label>
                <select value={startDest} onChange={e => { setStartDest(e.target.value); setPickup(''); }}>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="trd-field">
                <label>Last Destination</label>
                <select value={endDest} onChange={e => setEndDest(e.target.value)}>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Pick Up & Drop */}
            <div className="trd-row">
              <div className={`trd-field${errors.pickup ? ' error' : ''}`}>
                <label>Pick Up Point</label>
                <select value={pickup} onChange={e => setPickup(e.target.value)}>
                  <option value="">— Select pick-up —</option>
                  {defaultPickups.map(p => <option key={p}>{p}</option>)}
                  <option value="other">Other (specify below)</option>
                </select>
                {errors.pickup && <span className="trd-err">{errors.pickup}</span>}
              </div>
              <div className="trd-field">
                <label>Drop Point</label>
                <select value={dropPoint} onChange={e => setDrop(e.target.value)}>
                  <option value="">— Select drop point —</option>
                  {(DEFAULT_PICKUPS[endDest] || []).map(p => <option key={p}>{p}</option>)}
                  <option value="other">Other (specify below)</option>
                </select>
              </div>
            </div>

            {/* Vehicle */}
            <div className="trd-field">
              <label>Select Vehicle</label>
              <div className="trd-vehicles">
                {vehicles.map(v => (
                  <button
                    type="button"
                    key={v}
                    className={`trd-vehicle-btn${vehicle === v ? ' active' : ''}`}
                    onClick={() => setVehicle(v)}
                  >
                    {v === 'Sedan' ? '🚗' : v === 'SUV' ? '🚙' : v === 'Van' ? '🚐' : '🚌'} {v}
                    {VEHICLE_PRICES[v] > 0 && <span style={{ color:'#f97316', fontSize:'0.75rem', marginLeft:2 }}>+${VEHICLE_PRICES[v]}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pax + Date */}
            <div className="trd-pax-row">
              <div className="trd-pax-box">
                <span className="trd-pax-label">Adult</span>
                <div className="trd-pax-ctrl">
                  <button type="button" className="trd-pax-btn" onClick={() => setAdults(a => Math.max(1, a - 1))}>−</button>
                  <span className="trd-pax-num">{adults}</span>
                  <button type="button" className="trd-pax-btn" onClick={() => setAdults(a => a + 1)}>+</button>
                </div>
              </div>
              <div className="trd-pax-box">
                <span className="trd-pax-label">Child</span>
                <div className="trd-pax-ctrl">
                  <button type="button" className="trd-pax-btn" onClick={() => setChildren(c => Math.max(0, c - 1))}>−</button>
                  <span className="trd-pax-num">{children}</span>
                  <button type="button" className="trd-pax-btn" onClick={() => setChildren(c => c + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className={`trd-field${errors.date ? ' error' : ''}`}>
              <label>Date</label>
              <input type="date" value={selDate} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
              {errors.date && <span className="trd-err">{errors.date}</span>}
            </div>

            <div className="trd-divider" />

            {/* Flight details */}
            <div className="trd-row">
              <div className="trd-field">
                <label>Flight No.</label>
                <input value={flightNo} onChange={e => setFlightNo(e.target.value)} placeholder="e.g. TG205" />
              </div>
              <div className="trd-field">
                <label>Arr / Dep</label>
                <select value={flightType} onChange={e => setFlightType(e.target.value)}>
                  <option>Arrival</option>
                  <option>Departure</option>
                </select>
              </div>
            </div>

            <div className="trd-row">
              <div className="trd-field">
                <label>Flight Time</label>
                <input type="time" value={flightTime} onChange={e => setFlightTime(e.target.value)} />
              </div>
              <div className="trd-field">
                <label>Pick Up Time</label>
                <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
              </div>
            </div>

            {/* Airport rep */}
            <div className="trd-field">
              <label>Airport Rep Service</label>
              <select value={airportRep} onChange={e => setAirportRep(e.target.value)}>
                <option value="Yes">Yes – Meet &amp; Greet at airport</option>
                <option value="No">No – Self meet</option>
              </select>
            </div>

            <div className="trd-divider" />

            {/* Promo */}
            <div className="trd-field">
              <label>Promotion Code (if any)</label>
              <div className="trd-promo-row">
                <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="e.g. SAVE10" disabled={promoApplied} />
                {!promoApplied && <button type="button" className="trd-promo-btn" onClick={applyPromo}>Apply</button>}
              </div>
              {promoApplied && <span className="trd-promo-ok">✓ 10% discount applied!</span>}
            </div>

          </div>
        </div>

        {/* ── Right: price summary ── */}
        <div className="trd-price-card">
          <div className="trd-price-label">Amount</div>
          <div className="trd-price-big">${perPerson} <small>/person</small></div>
          <div style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:4 }}>{vehicle} · {rawTransfer.from} → {rawTransfer.to}</div>
          <div className="trd-price-divider" />

          <div className="trd-price-summary">
            <div className="trd-price-row">
              <span>Adult × {adults}</span>
              <span>${perPerson * adults}</span>
            </div>
            {children > 0 && (
              <div className="trd-price-row">
                <span>Child × {children}</span>
                <span>${(perPerson * 0.5 * children).toFixed(0)}</span>
              </div>
            )}
            {promoApplied && (
              <div className="trd-price-row discount">
                <span>Promo (SAVE10)</span>
                <span>−${discount}</span>
              </div>
            )}
            <div className="trd-price-row total">
              <span>Total</span>
              <span style={{ color:'#f97316' }}>${total} USD</span>
            </div>
          </div>

          <div className="trd-cta">
            <button type="button" className="trd-btn-pay" onClick={() => goPayment('online')}>
              💳 Go to Payment Online
            </button>
            <button type="button" className="trd-btn-wait" onClick={() => goPayment('offline')}>
              ⏳ Wait for Confirmation
            </button>
          </div>
          <div className="trd-guarantee">🔒 Free cancellation · Instant booking</div>
        </div>

      </div>
    </div>
  );
}
