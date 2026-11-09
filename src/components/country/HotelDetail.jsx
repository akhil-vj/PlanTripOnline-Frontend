import { useState, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { apiFetch } from '../../config/api';

/* ── Amenity emoji map ───────────────────────────────────────────── */
const AMENITY_MAP = [
  ['wifi',        '📶'],
  ['pool',        '🏊'],
  ['gym',         '💪'],
  ['fitness',     '💪'],
  ['spa',         '🧖'],
  ['restaurant',  '🍽️'],
  ['dining',      '🍽️'],
  ['parking',     '🅿️'],
  ['ac',          '❄️'],
  ['air',         '❄️'],
  ['bar',         '🍹'],
  ['breakfast',   '☕'],
  ['beach',       '🏖️'],
  ['tennis',      '🎾'],
  ['golf',        '⛳'],
  ['kids',        '🧒'],
  ['pet',         '🐾'],
  ['laundry',     '👕'],
  ['concierge',   '🛎️'],
  ['transfer',    '🚌'],
  ['airport',     '✈️'],
  ['butler',      '🤵'],
  ['rooftop',     '🏙️'],
  ['view',        '🌅'],
  ['safe',        '🔒'],
  ['tv',          '📺'],
  ['jacuzzi',     '🛁'],
  ['kayak',       '🛶'],
];

function amenityEmoji(name = '') {
  const n = name.toLowerCase();
  const hit = AMENITY_MAP.find(([k]) => n.includes(k));
  return hit ? hit[1] : '✓';
}

/* ── Star renderer ───────────────────────────────────────────────── */
function Stars({ count = 0, max = 5 }) {
  const n = Math.min(Math.max(Math.round(count), 0), max);
  return (
    <span style={{ color: '#fbbf24', fontSize: '1.1rem', letterSpacing: 1 }}>
      {'★'.repeat(n)}
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'★'.repeat(max - n)}</span>
    </span>
  );
}

/* ── Badge tone helper ───────────────────────────────────────────── */
function badgeStyle(badge = '') {
  const b = badge.toLowerCase();
  if (/(luxury|boutique|upscale|premium)/.test(b))
    return { background: 'linear-gradient(135deg,#f59a23,#fb923c)' };
  if (/budget/.test(b))
    return { background: 'linear-gradient(135deg,#1d5fbf,#2563eb)' };
  return { background: 'linear-gradient(135deg,#0b7fd1,#38bdf8)' };
}

/* ═══════════════════════════════════════════════════════════════════
   HotelDetail — main component
═══════════════════════════════════════════════════════════════════ */
export default function HotelDetail() {
  const data = useOutletContext();
  const { country, hotelSlug } = useParams();
  const navigate = useNavigate();

  /* ── 1. Try to find hotel in static context data ── */
  const staticHotel = (data?.hotels || []).find(h => h.slug === hotelSlug);

  /* ── 2. If not found, fetch from API ── */
  const [hotel, setHotel] = useState(staticHotel || null);
  const [loading, setLoading] = useState(!staticHotel);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (staticHotel) return; // already found
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    (async () => {
      try {
        // Try slug endpoint first, fall back to query param
        let res = await apiFetch(`/api/hotels/${hotelSlug}`);
        if (!res.ok) {
          res = await apiFetch(`/api/hotels?slug=${hotelSlug}`);
        }
        if (!res.ok) throw new Error(`Hotel not found (${res.status})`);
        const json = await res.json();
        if (!cancelled) setHotel(Array.isArray(json) ? json[0] : json);
      } catch (err) {
        if (!cancelled) setFetchError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hotelSlug, staticHotel]);

  /* ── Booking form state ── */
  const [checkIn,   setCheckIn]  = useState('');
  const [checkOut,  setCheckOut] = useState('');
  const [adults,    setAdults]   = useState(2);
  const [children,  setChildren] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  function handleEnquire() {
    navigate('/enquiry', {
      state: {
        hotel: hotel?.title,
        country: data?.name,
        image: hotel?.image,
        price: hotel?.price,
        checkIn,
        checkOut,
        adults,
        children,
      },
    });
  }

  /* ── Loading spinner ── */
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16,
        fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #f1f5f9', borderTopColor: '#f97316',
          animation: 'spin .8s linear infinite',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ color: '#94a3b8', fontSize: '.9rem', fontWeight: 500 }}>
          Loading hotel…
        </span>
      </div>
    );
  }

  /* ── Not found ── */
  if (!hotel || fetchError) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16,
        fontFamily: "'Inter',system-ui,sans-serif", textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: '3rem' }}>🏨</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Hotel Not Found
        </h2>
        <p style={{ color: '#64748b', margin: 0 }}>
          {fetchError || `We couldn't find the hotel "${hotelSlug}".`}
        </p>
        <button
          onClick={() => navigate(`/${country}/hotels`)}
          style={{ marginTop: 8, padding: '12px 28px', background: '#f97316',
            color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700,
            cursor: 'pointer', fontSize: '.9rem' }}
        >
          ← Back to Hotels
        </button>
      </div>
    );
  }

  const stars = typeof hotel.stars === 'number' ? hotel.stars : parseInt(hotel.stars) || 0;
  const heroGradient = 'linear-gradient(160deg,rgba(10,22,40,.88) 0%,rgba(10,22,40,.55) 50%,rgba(10,22,40,.8) 100%)';

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh',
      fontFamily: "'Inter',system-ui,sans-serif", color: '#1e293b' }}>

      <Helmet>
        <title>{hotel.title} – {data?.name} | PlantripOnline</title>
        <meta name="description" content={hotel.description || `Book ${hotel.title} in ${hotel.location}.`} />
      </Helmet>

      {/* ── Global style ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .hd-page * { box-sizing:border-box; }
        @keyframes hdHeroIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes hdSpin { to{transform:rotate(360deg)} }
      `}</style>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden' }}>
        {/* Background image */}
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'brightness(0.42)', transform: 'scale(1.04)',
              transition: 'transform 10s ease' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0ea5e9 100%)' }} />
        )}
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: heroGradient }} />

        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`/${country}/hotels`)}
          style={{ position: 'absolute', top: 72, left: 48, zIndex: 3,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)',
            fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
            padding: '8px 18px', borderRadius: 50, fontFamily: 'inherit',
            transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.5)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.3)'}
        >
          ← Back to Hotels
        </button>

        {/* Hero content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          padding: '0 48px 44px', animation: 'hdHeroIn .7s ease' }}>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {hotel.badge && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#fff', padding: '5px 14px', borderRadius: 50,
                fontSize: '.75rem', fontWeight: 800, letterSpacing: 1,
                textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,.3)',
                ...badgeStyle(hotel.badge) }}>
                🏨 {hotel.badge}
              </span>
            )}
            {hotel.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)',
                backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,.9)',
                padding: '5px 14px', borderRadius: 50, fontSize: '.78rem', fontWeight: 600 }}>
                📍 {hotel.location}
              </span>
            )}
            {hotel.category && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)',
                backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,.9)',
                padding: '5px 14px', borderRadius: 50, fontSize: '.78rem', fontWeight: 600 }}>
                🏷️ {hotel.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff',
            letterSpacing: '-1.5px', lineHeight: 1.07,
            textShadow: '0 4px 24px rgba(0,0,0,.5)', margin: '0 0 18px',
            maxWidth: 800 }}>
            {hotel.title}
          </h1>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {stars > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)',
                backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 50,
                fontSize: '.82rem', fontWeight: 600, color: '#fff' }}>
                <Stars count={stars} />
                <span style={{ opacity: .8 }}>{stars}-Star Hotel</span>
              </div>
            )}
            {hotel.rating && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)',
                backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 50,
                fontSize: '.82rem', fontWeight: 600, color: '#fff' }}>
                <span style={{ color: '#fbbf24' }}>⭐</span>
                {hotel.rating}
                {hotel.reviews && (
                  <span style={{ opacity: .7, fontSize: '.75rem' }}>
                    ({hotel.reviews} reviews)
                  </span>
                )}
              </div>
            )}
            {hotel.price && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(249,115,22,.28)', border: '1px solid rgba(249,115,22,.5)',
                backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 50,
                fontSize: '.82rem', fontWeight: 600, color: '#fff' }}>
                💰 From <strong style={{ color: '#fb923c', fontSize: '1rem', fontWeight: 900 }}>
                  {hotel.price}
                </strong> /night
              </div>
            )}
          </div>
        </div>

        {/* Wave */}
        <svg style={{ position: 'absolute', left: 0, bottom: -1, width: '100%', height: 60 }}
          viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 C 360 5, 720 5, 1080 25 S 1320 55, 1440 20 L1440 60 L0 60 Z" fill="#f8fafc" />
        </svg>
      </section>

      {/* ═══════════════ INFO BAR ═══════════════ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap' }}>
          {[
            hotel.price    && { icon: '💰', label: 'Price / Night', value: hotel.price },
            hotel.category && { icon: '🏷️', label: 'Category',      value: hotel.category },
            stars > 0      && { icon: '⭐', label: 'Star Rating',    value: `${stars} Stars` },
            hotel.location && { icon: '📍', label: 'Location',       value: hotel.location },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
              padding: '18px 28px', borderRight: '1px solid #f1f5f9',
              minWidth: 160, flex: '1 1 auto' }}>
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ BODY ═══════════════ */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 1.5rem 80px',
        display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Description */}
          {hotel.description && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 36,
              boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b',
                margin: '0 0 16px' }}>
                About This Hotel
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '.95rem', margin: 0 }}>
                {hotel.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 36,
              boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b',
                margin: '0 0 20px' }}>
                Amenities & Facilities
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {hotel.amenities.map((amenity, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#f4f6fa', border: '1px solid #e2e8f0', borderRadius: 999,
                    padding: '9px 18px', fontSize: '.85rem', fontWeight: 600, color: '#334155',
                    transition: 'all .2s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#fff7ed'; e.currentTarget.style.borderColor='#fed7aa'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#f4f6fa'; e.currentTarget.style.borderColor='#e2e8f0'; }}
                  >
                    <span style={{ fontSize: '1rem' }}>{amenityEmoji(amenity)}</span>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick facts / highlights */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 36,
            boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b',
              margin: '0 0 20px' }}>
              Why Choose This Hotel?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {[
                '✅ Prime location with easy access',
                '✅ Fully air-conditioned rooms',
                '✅ 24/7 front desk & concierge',
                '✅ Complimentary high-speed Wi-Fi',
                '✅ Daily housekeeping service',
                '✅ Safe and secure environment',
              ].map((f, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10,
                  padding: '12px 16px', fontSize: '.87rem', color: '#334155', fontWeight: 500 }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Booking CTA ── */}
        <div style={{ position: 'sticky', top: 88, display: 'flex',
          flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28,
            boxShadow: '0 8px 30px rgba(0,0,0,.09)' }}>

            {/* Price header */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: 1 }}>Starting From</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a',
                  lineHeight: 1 }}>
                  {hotel.price || 'Contact Us'}
                </span>
                {hotel.price && (
                  <span style={{ fontSize: '.82rem', color: '#94a3b8', paddingBottom: 4 }}>
                    /night
                  </span>
                )}
              </div>
              {hotel.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                  marginTop: 8, fontSize: '.82rem', color: '#64748b' }}>
                  <span style={{ color: '#f97316', fontWeight: 800 }}>⭐ {hotel.rating}</span>
                  {hotel.reviews && <span>· {hotel.reviews} reviews</span>}
                </div>
              )}
            </div>

            <div style={{ height: 1, background: '#f1f5f9', margin: '20px 0' }} />

            {/* Date inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: .5 }}>Check-In</span>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={e => setCheckIn(e.target.value)}
                    style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0',
                      borderRadius: 10, fontSize: '.88rem', color: '#1e293b',
                      fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor='#f97316'}
                    onBlur={e => e.target.style.borderColor='#e2e8f0'}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: .5 }}>Check-Out</span>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={e => setCheckOut(e.target.value)}
                    style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0',
                      borderRadius: 10, fontSize: '.88rem', color: '#1e293b',
                      fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor='#f97316'}
                    onBlur={e => e.target.style.borderColor='#e2e8f0'}
                  />
                </label>
              </div>

              {/* Guests */}
              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>
                  Guests
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {/* Adults */}
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#64748b' }}>Adults</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button type="button"
                        onClick={() => setAdults(a => Math.max(1, a - 1))}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0',
                          background: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>−</button>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b',
                        minWidth: 18, textAlign: 'center' }}>{adults}</span>
                      <button type="button"
                        onClick={() => setAdults(a => a + 1)}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0',
                          background: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>+</button>
                    </div>
                  </div>
                  {/* Children */}
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#64748b' }}>Children</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button type="button"
                        onClick={() => setChildren(c => Math.max(0, c - 1))}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0',
                          background: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>−</button>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b',
                        minWidth: 18, textAlign: 'center' }}>{children}</span>
                      <button type="button"
                        onClick={() => setChildren(c => c + 1)}
                        style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0',
                          background: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <button
                type="button"
                onClick={handleEnquire}
                style={{ width: '100%', padding: '15px', marginTop: 4,
                  background: 'linear-gradient(135deg,#f97316,#fb923c)',
                  color: '#fff', border: 'none', borderRadius: 14,
                  fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(249,115,22,.35)',
                  transition: 'all .25s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(249,115,22,.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(249,115,22,.35)'; }}
              >
                Enquire Now →
              </button>

              <button
                type="button"
                onClick={handleEnquire}
                style={{ width: '100%', padding: '14px',
                  background: '#fff', color: '#1e293b',
                  border: '2px solid #e2e8f0', borderRadius: 14,
                  fontSize: '.95rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all .25s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#f97316'; e.currentTarget.style.color='#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#1e293b'; }}
              >
                Check Availability
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              justifyContent: 'center', marginTop: 14,
              fontSize: '.75rem', color: '#94a3b8', fontWeight: 500 }}>
              🔒 Free enquiry &nbsp;·&nbsp; No booking fees
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '✅', text: 'Best Price Guarantee' },
                { icon: '📞', text: '24/7 Customer Support' },
                { icon: '⚡', text: 'Instant Confirmation' },
                { icon: '🛡️', text: 'Secure & Safe Booking' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: '.85rem', color: '#475569', fontWeight: 500 }}>
                  <span>{t.icon}</span> {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ RESPONSIVE overrides via inline media trick ═══════════════ */}
      <style>{`
        @media (max-width: 1024px) {
          /* stack columns */
        }
        @media (max-width: 768px) {
          section h1 { font-size: 2rem !important; }
          section > div:last-of-type { padding: 0 20px 30px !important; }
          button[style*="left: 48px"] { left: 20px !important; top: 64px !important; }
        }
      `}</style>
    </div>
  );
}
