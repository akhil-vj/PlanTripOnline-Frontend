import { useState, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ---------- tiny inline icon set (stroke icons) ---------- */
const PATHS = {
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z',
  badge: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9 9l6 6M15 9l-6 6',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2',
  headset: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19c0 1.5-2 2-5 2',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4.5-4.5',
  heart: 'M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0112 7a4.5 4.5 0 018.5 2c0 6-8.5 11.5-8.5 11.5z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
};

function Icon({ name, size = 18, fill = 'none', color = 'currentColor', sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

const AMENITY_ICONS = [
  ['pool', '🏊'], ['beach', '🏖️'], ['restaurant', '🍽️'], ['dining', '🍷'], ['spa', '💆'],
  ['wifi', '📶'], ['fitness', '🏋️'], ['gym', '🏋️'], ['breakfast', '☕'], ['kayak', '🛶'],
  ['bike', '🚲'], ['bts', '🚆'], ['bar', '🍸'], ['parking', '🅿️'],
];
const amenityIcon = (name = '') => {
  const n = name.toLowerCase();
  const hit = AMENITY_ICONS.find(([k]) => n.includes(k));
  return hit ? hit[1] : '✔';
};

const badgeTone = (badge = '') => {
  const b = badge.toLowerCase();
  if (/(luxury|boutique|upscale|premium)/.test(b)) return 'orange';
  if (/budget/.test(b)) return 'navy';
  return 'blue';
};

const reviewsText = (r) => (!r ? '' : /review/i.test(String(r)) ? r : `${r} reviews`);

export default function Hotels() {
  const data = useOutletContext();
  const hotels = data.hotels || [];
  const gridRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [favs, setFavs] = useState([]);

  const categories = [...new Set(hotels.map(h => h.category).filter(Boolean))];

  const filteredHotels = hotels.filter(h => {
    const catMatch = activeCategory === 'all' || h.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = !q ||
      h.title?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q) ||
      h.category?.toLowerCase().includes(q) ||
      h.amenities?.some(a => a.toLowerCase().includes(q));
    return catMatch && searchMatch;
  });

  const toggleFav = (id) =>
    setFavs(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]));

  const scrollToGrid = () =>
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const trust = [
    { icon: 'star', label: 'Curated Stays' },
    { icon: 'badge', label: 'Best Price Guarantee' },
    { icon: 'calendar', label: 'Instant Confirmation' },
    { icon: 'headset', label: '24/7 Support' },
  ];

  return (
    <div className="hotels-page">
      <Helmet>
        <title>{data.name} Hotels &amp; Resorts - PlantripOnline</title>
      </Helmet>

      <style>{`
        .hotels-page { background:#fafaf9; min-height:100vh; color:#1e293b; }
        .hotels-page * { box-sizing:border-box; }

        /* ---------- HERO ---------- */
        .hotels-page .ht-hero { position:relative; color:#fff; overflow:hidden;
          padding:140px 1.5rem 150px; }
        .hotels-page .ht-hero-bg { position:absolute; inset:0; background-size:cover; background-position:center right; }
        .hotels-page .ht-hero-bg::after { content:''; position:absolute; inset:0;
          background:linear-gradient(90deg, rgba(10,22,40,.88) 0%, rgba(10,22,40,.55) 45%, rgba(10,22,40,.05) 100%),
                     linear-gradient(180deg, rgba(10,22,40,.55) 0%, transparent 30%); }
        .hotels-page .ht-wave { position:absolute; left:0; bottom:-1px; width:100%; height:70px; display:block; }
        .hotels-page .ht-hero-inner { position:relative; z-index:2; max-width:1180px; margin:0 auto; }
        .hotels-page .ht-hero h1 { font-size:4rem; line-height:1.05; font-weight:800; letter-spacing:-1.5px;
          margin:0 0 18px; text-shadow:0 4px 24px rgba(0,0,0,.35); }
        .hotels-page .ht-hero h1 span { display:block; color:#ff8a1f; }
        .hotels-page .ht-hero p { max-width:470px; font-size:1.1rem; line-height:1.55; color:rgba(255,255,255,.9); margin:0 0 30px; }
        .hotels-page .ht-trust { display:flex; flex-wrap:wrap; gap:14px 26px; align-items:center;
          background:rgba(15,23,42,.35); backdrop-filter:blur(8px); border-radius:14px;
          padding:12px 20px; width:fit-content; max-width:100%; }
        .hotels-page .ht-trust-item { display:flex; align-items:center; gap:10px; font-size:.88rem; font-weight:500; }
        .hotels-page .ht-trust-item svg { color:#ff8a1f; width:26px; height:26px; }

        /* ---------- SEARCH CARD ---------- */
        .hotels-page .ht-search-card { position:relative; z-index:5; max-width:1180px; margin:-62px auto 0;
          padding:0 1.5rem; }
        .hotels-page .ht-search-inner { background:#fff; border-radius:26px; padding:14px;
          box-shadow:0 18px 50px rgba(15,23,42,.18); display:flex; gap:12px; align-items:stretch; }
        .hotels-page .ht-fields { flex:1; display:grid; grid-template-columns:1.6fr 1.1fr .9fr;
          background:#f4f6fa; border-radius:18px; border:1px solid #e6eaf1; }
        .hotels-page .ht-field { display:flex; align-items:center; gap:14px; padding:14px 22px; min-width:0; }
        .hotels-page .ht-field + .ht-field { border-left:1px solid #dde2ea; }
        .hotels-page .ht-field > svg { color:#1e293b; flex-shrink:0; width:26px; height:26px; }
        .hotels-page .ht-field-body { display:flex; flex-direction:column; min-width:0; flex:1; }
        .hotels-page .ht-field-label { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:2px; }
        .hotels-page .ht-field input, .hotels-page .ht-field select { border:none; outline:none; background:transparent;
          font:inherit; font-size:.85rem; color:#64748b; padding:0; width:100%; min-width:0; }
        .hotels-page .ht-field input::placeholder { color:#94a3b8; }
        .hotels-page .ht-field select { appearance:none; -webkit-appearance:none; cursor:pointer; }
        .hotels-page .ht-dates { display:flex; align-items:center; gap:6px; color:#94a3b8; }
        .hotels-page .ht-dates input { width:auto; flex:1; }
        .hotels-page .ht-field:focus-within { background:#fff; border-radius:18px; box-shadow:0 0 0 2px rgba(255,138,31,.35) inset; }
        .hotels-page .ht-search-btn { display:flex; align-items:center; justify-content:center; gap:10px;
          background:linear-gradient(135deg,#ff7a00,#ff9a2e); color:#fff; border:none; border-radius:18px;
          padding:0 38px; font-size:1rem; font-weight:700; cursor:pointer;
          box-shadow:0 8px 20px rgba(255,122,0,.35); transition:transform .2s, box-shadow .2s; }
        .hotels-page .ht-search-btn:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(255,122,0,.45); }

        /* ---------- FILTER ROW ---------- */
        .hotels-page .ht-filter-row { max-width:1180px; margin:0 auto; padding:34px 1.5rem 0;
          display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .hotels-page .ht-pills { display:flex; gap:12px; flex-wrap:wrap; }
        .hotels-page .ht-pill { background:#fff; color:#1e293b; border:1px solid #e2e8f0; border-radius:999px;
          padding:9px 22px; font-size:.88rem; font-weight:600; cursor:pointer;
          box-shadow:0 2px 8px rgba(15,23,42,.05); transition:all .2s; text-transform:capitalize; }
        .hotels-page .ht-pill:hover { border-color:#ff9a2e; color:#ea6a00; }
        .hotels-page .ht-pill.active { background:linear-gradient(135deg,#ff7a00,#ff9a2e); color:#fff;
          border-color:transparent; box-shadow:0 6px 16px rgba(255,122,0,.35); }
        .hotels-page .ht-count { font-size:.95rem; color:#475569; }
        .hotels-page .ht-count strong { color:#1e293b; font-weight:800; }

        /* ---------- GRID / CARDS ---------- */
        .hotels-page .ht-grid-section { max-width:1180px; margin:0 auto; padding:28px 1.5rem 80px; scroll-margin-top:90px; }
        .hotels-page .ht-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:26px; }
        .hotels-page .ht-card { background:#fff; border-radius:20px; overflow:hidden;
          box-shadow:0 6px 22px rgba(15,23,42,.07); display:flex; flex-direction:column;
          transition:transform .3s, box-shadow .3s; }
        .hotels-page .ht-card:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(15,23,42,.13); }
        .hotels-page .ht-card-img { position:relative; height:210px; overflow:hidden; }
        .hotels-page .ht-card-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
        .hotels-page .ht-card:hover .ht-card-img img { transform:scale(1.06); }
        .hotels-page .ht-card-img::after { content:''; position:absolute; inset:auto 0 0 0; height:90px;
          background:linear-gradient(180deg, transparent, rgba(0,0,0,.55)); pointer-events:none; }
        .hotels-page .ht-badge { position:absolute; top:14px; left:14px; z-index:2; color:#fff; padding:6px 16px;
          border-radius:999px; font-size:.78rem; font-weight:700; box-shadow:0 4px 10px rgba(0,0,0,.2); }
        .hotels-page .ht-badge.blue { background:#0b7fd1; }
        .hotels-page .ht-badge.orange { background:#f59a23; }
        .hotels-page .ht-badge.navy { background:#1d5fbf; }
        .hotels-page .ht-heart { position:absolute; top:12px; right:12px; z-index:2; width:38px; height:38px;
          border-radius:50%; border:none; background:rgba(255,255,255,.22); backdrop-filter:blur(6px);
          color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
        .hotels-page .ht-heart:hover { background:rgba(255,255,255,.4); transform:scale(1.08); }
        .hotels-page .ht-heart.on { background:#fff; color:#ef4444; }
        .hotels-page .ht-rating { position:absolute; left:14px; bottom:12px; z-index:2; display:flex; align-items:center;
          gap:6px; background:rgba(15,23,42,.72); backdrop-filter:blur(6px); color:#fff;
          padding:5px 12px; border-radius:999px; font-size:.8rem; font-weight:600; }
        .hotels-page .ht-rating svg { color:#fbbf24; }
        .hotels-page .ht-card-body { padding:18px 20px 20px; display:flex; flex-direction:column; flex:1; }
        .hotels-page .ht-loc { display:flex; align-items:center; gap:6px; color:#64748b; font-size:.82rem; margin-bottom:6px; }
        .hotels-page .ht-loc svg { color:#ef4444; }
        .hotels-page .ht-card-body h3 { font-size:1.22rem; font-weight:800; margin:0 0 12px; color:#0f172a; }
        .hotels-page .ht-amenities { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
        .hotels-page .ht-amenity { display:inline-flex; align-items:center; gap:6px; background:#f4f6fa; color:#334155;
          padding:5px 11px; border-radius:9px; font-size:.78rem; font-weight:500; border:1px solid #e8ecf2; }
        .hotels-page .ht-amenity i { font-style:normal; font-size:.85rem; }
        .hotels-page .ht-card-footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto; }
        .hotels-page .ht-price-label { font-size:.82rem; color:#64748b; }
        .hotels-page .ht-price { font-size:1.55rem; font-weight:800; color:#0f172a; line-height:1.15; }
        .hotels-page .ht-price small { font-size:.82rem; font-weight:400; color:#94a3b8; }
        .hotels-page .ht-enquire { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#ff7a00,#ff9a2e);
          color:#fff; text-decoration:none; font-weight:700; font-size:.9rem; padding:11px 24px; border-radius:999px;
          box-shadow:0 6px 16px rgba(255,122,0,.3); transition:transform .2s, box-shadow .2s; }
        .hotels-page .ht-enquire:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(255,122,0,.42); }

        /* ---------- EMPTY ---------- */
        .hotels-page .ht-empty { text-align:center; padding:70px 20px; background:#fff; border-radius:20px;
          box-shadow:0 4px 20px rgba(0,0,0,.05); }
        .hotels-page .ht-empty h3 { font-size:1.8rem; margin:0 0 10px; }
        .hotels-page .ht-empty p { color:#64748b; margin:0 0 24px; }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width:1000px) { .hotels-page .ht-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:860px) {
          .hotels-page .ht-hero { padding:110px 1.25rem 130px; }
          .hotels-page .ht-hero h1 { font-size:2.6rem; }
          .hotels-page .ht-search-inner { flex-direction:column; }
          .hotels-page .ht-fields { grid-template-columns:1fr; }
          .hotels-page .ht-field + .ht-field { border-left:none; border-top:1px solid #dde2ea; }
          .hotels-page .ht-search-btn { padding:16px; }
        }
        @media (max-width:640px) {
          .hotels-page .ht-grid { grid-template-columns:1fr; }
          .hotels-page .ht-trust { gap:10px 18px; }
        }
      `}</style>

      {/* ---------- Hero ---------- */}
      <section className="ht-hero">
        <div className="ht-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }} />
        <div className="ht-hero-inner">
          <h1>{data.name}<span>Hotels &amp; Resorts</span></h1>
          <p>From 5-star luxury resorts to charming boutique stays — find the perfect accommodation for your trip.</p>
          <div className="ht-trust">
            {trust.map(t => (
              <div className="ht-trust-item" key={t.label}>
                <Icon name={t.icon} size={26} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <svg className="ht-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C 240 5, 480 5, 720 30 S 1200 70, 1440 25 L1440 70 L0 70 Z" fill="#fafaf9" />
        </svg>
      </section>

      {/* ---------- Search card ---------- */}
      <div className="ht-search-card">
        <div className="ht-search-inner">
          <div className="ht-fields">
            <label className="ht-field">
              <Icon name="pin" size={26} />
              <span className="ht-field-body">
                <span className="ht-field-label">Where are you staying?</span>
                <input
                  type="text"
                  placeholder="Search hotels by name, location, or amenities..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && scrollToGrid()}
                />
              </span>
            </label>

            <div className="ht-field">
              <Icon name="calendar" size={26} />
              <span className="ht-field-body">
                <span className="ht-field-label">Check-in – Check-out</span>
                <span className="ht-dates">
                  <input type="date" aria-label="Check-in date" value={checkIn}
                    onChange={e => setCheckIn(e.target.value)} />
                  –
                  <input type="date" aria-label="Check-out date" value={checkOut} min={checkIn || undefined}
                    onChange={e => setCheckOut(e.target.value)} />
                </span>
              </span>
            </div>

            <label className="ht-field">
              <Icon name="user" size={26} />
              <span className="ht-field-body">
                <span className="ht-field-label">Guests</span>
                <select value={guests} onChange={e => setGuests(e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </span>
              <Icon name="chevron" size={18} />
            </label>
          </div>

          <button className="ht-search-btn" type="button" onClick={scrollToGrid}>
            <Icon name="search" size={20} sw={2.2} /> Search
          </button>
        </div>
      </div>

      {/* ---------- Category pills + count ---------- */}
      <div className="ht-filter-row">
        <div className="ht-pills">
          <button type="button" className={`ht-pill${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCategory('all')}>All</button>
          {categories.map(cat => (
            <button type="button" key={cat}
              className={`ht-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat ? 'all' : cat)}>
              {cat}
            </button>
          ))}
        </div>
        <span className="ht-count">
          <strong>{filteredHotels.length}</strong> {filteredHotels.length === 1 ? 'property' : 'properties'}
        </span>
      </div>

      {/* ---------- Grid ---------- */}
      <div className="ht-grid-section" ref={gridRef}>
        {filteredHotels.length > 0 ? (
          <div className="ht-grid">
            {filteredHotels.map(hotel => (
              <article key={hotel.id} className="ht-card">
                <div className="ht-card-img">
                  <img src={hotel.image} alt={hotel.title} loading="lazy" />
                  {hotel.badge && <span className={`ht-badge ${badgeTone(hotel.badge)}`}>{hotel.badge}</span>}
                  <button type="button"
                    className={`ht-heart${favs.includes(hotel.id) ? ' on' : ''}`}
                    aria-label="Save hotel" aria-pressed={favs.includes(hotel.id)}
                    onClick={() => toggleFav(hotel.id)}>
                    <Icon name="heart" size={20} fill={favs.includes(hotel.id) ? 'currentColor' : 'none'} />
                  </button>
                  {hotel.rating && (
                    <span className="ht-rating">
                      <Icon name="star" size={14} fill="currentColor" sw={0} />
                      {hotel.rating}{hotel.reviews ? ` · ${reviewsText(hotel.reviews)}` : ''}
                    </span>
                  )}
                </div>

                <div className="ht-card-body">
                  <div className="ht-loc"><Icon name="pin" size={15} fill="currentColor" sw={0} />{hotel.location}</div>
                  <h3>{hotel.title}</h3>
                  <div className="ht-amenities">
                    {hotel.amenities?.map((a, i) => (
                      <span key={i} className="ht-amenity"><i>{amenityIcon(a)}</i>{a}</span>
                    ))}
                  </div>
                  <div className="ht-card-footer">
                    <div>
                      <div className="ht-price-label">Starting from</div>
                      <div className="ht-price">{hotel.price} <small>/night</small></div>
                    </div>
                    <Link to="/enquiry" className="ht-enquire">Enquire <Icon name="arrow" size={16} sw={2.4} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ht-empty">
            <h3>No Hotels Found</h3>
            <p>Try a different search term or category filter.</p>
            <button type="button" className="ht-enquire" style={{ border: 'none', cursor: 'pointer' }}
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
              Show All Hotels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}