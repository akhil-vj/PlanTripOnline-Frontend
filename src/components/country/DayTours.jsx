import { useState, useRef } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BADGE_COLORS = {
  Bestseller:    '#f97316',
  Popular:       '#f97316',
  'UNESCO Site': '#f97316',
  Nature:        '#22a447',
  Adventure:     '#f97316',
  Scenic:        '#f97316',
  default:       '#64748b',
};

/* ───────── Small inline SVG icons ───────── */
const Svg = ({ children, size = 18, fill = 'none', stroke = 'currentColor', sw = 1.8, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

const PinIcon = ({ size = 18, fill = 'none', ...p }) => (
  <Svg size={size} fill={fill} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" fill={fill === 'none' ? 'none' : '#fff'} stroke={fill === 'none' ? 'currentColor' : 'none'} />
  </Svg>
);
const CalendarIcon = p => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" sw="2.4" />
  </Svg>
);
const UsersIcon = p => (
  <Svg {...p} fill="currentColor" stroke="none">
    <circle cx="9" cy="8" r="3.4" />
    <path d="M2.5 19.5c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6z" />
    <circle cx="17.2" cy="9" r="2.6" opacity=".75" />
    <path d="M16.8 14.2c3 .1 4.9 1.9 4.9 4.8h-4.4c0-1.9-.4-3.4-1.4-4.5.3-.2.6-.3.9-.3z" opacity=".75" />
  </Svg>
);
const SearchIcon = p => (
  <Svg {...p} sw={2.4}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Svg>
);
const ChevronDown = p => (<Svg size={14} sw={2.4} {...p}><path d="m6 9 6 6 6-6" /></Svg>);
const ArrowRight = p => (<Svg size={15} sw={2.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>);
const ClockIcon = p => (<Svg size={13} sw={2} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>);
const HeartIcon = ({ liked }) => (
  <Svg size={22} sw={1.9}
       fill={liked ? '#ef4444' : 'none'}
       stroke={liked ? '#ef4444' : '#fff'}
       style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))' }}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.7 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.4 3.1 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </Svg>
);
const PinBadgeIcon = () => (
  <Svg size={14} fill="currentColor" stroke="none"><path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12zm0-9.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /></Svg>
);

/* Trust strip icons */
const TrustCurated = () => (
  <Svg size={30} sw={1.5}>
    <rect x="4" y="5" width="16" height="15" rx="3" />
    <path d="M9 5V3.5M15 5V3.5" />
    <path d="M12 9.5l1 2.1 2.2.3-1.6 1.6.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.6 2.2-.3z" />
  </Svg>
);
const TrustGuides = () => (
  <Svg size={30} sw={1.5}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19.5c0-3.3 2.6-5.5 6-5.5 1.4 0 2.6.3 3.6 1" />
    <circle cx="17.5" cy="15.5" r="4" />
    <path d="m15.7 15.6 1.4 1.4 2.4-2.6" />
  </Svg>
);
const TrustPrice = () => (
  <Svg size={30} sw={1.5}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.1 8 7.5 9.5 4.4-1.5 7.5-5 7.5-9.5V6z" />
    <path d="m8.8 12 2.4 2.4 4.2-4.6" />
  </Svg>
);
const TrustConfirm = () => (
  <Svg size={30} sw={1.5}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="m8.2 12.3 2.8 2.8 5-5.4" />
  </Svg>
);

const TRUST = [
  { Icon: TrustCurated, text: 'Curated Experiences' },
  { Icon: TrustGuides,  text: 'Local Expert Guides' },
  { Icon: TrustPrice,   text: 'Best Price Guarantee' },
  { Icon: TrustConfirm, text: 'Instant Confirmation' },
];

export default function DayTours() {
  const data     = useOutletContext();
  const navigate = useNavigate();
  const tours    = data.dayTours || [];
  const gridRef  = useRef(null);

  const [activeLocation, setActiveLocation] = useState('all');
  const [travellers,     setTravellers]     = useState('');
  const [selDate,        setSelDate]        = useState('');
  const [wishlist,       setWishlist]       = useState([]);

  const locations = [...new Set(tours.map(t => t.location).filter(Boolean))];

  const filteredTours = tours.filter(
    t => activeLocation === 'all' || t.location === activeLocation
  );

  const toggleWishlist = id =>
    setWishlist(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const scrollToGrid = () =>
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const heroImage =
    tours[2]?.image ||
    data.heroImage ||
    'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1600';

  const tourState = tour => ({ tour, country: data, date: selDate, travellers });

  return (
    <div className="dt-page">
      <Helmet>
        <title>{data.name} Day Tours – PlantripOnline</title>
        <meta
          name="description"
          content={`Handpicked ${data.name} day tours — curated local experiences, temple visits, island adventures and more.`}
        />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

        .dt-page, .dt-page * { box-sizing: border-box; }
        .dt-page { background:#fff; min-height:100vh; font-family:'Inter',system-ui,sans-serif; color:#0f172a; }
        .dt-page h1, .dt-page h2, .dt-card-title { font-family:'Montserrat','Inter',sans-serif; }

        /* ───────── HERO ───────── */
        .dt-hero { position:relative; height:470px; overflow:hidden; background:#0f2a44; }
        .dt-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 40%; }
        .dt-hero-overlay { position:absolute; inset:0;
          background:
            linear-gradient(90deg, rgba(6,18,38,0.72) 0%, rgba(6,18,38,0.38) 42%, rgba(6,18,38,0) 70%),
            linear-gradient(180deg, rgba(6,18,38,0.45) 0%, rgba(6,18,38,0) 28%, rgba(6,18,38,0) 70%, rgba(6,18,38,0.25) 100%); }
        .dt-hero-inner { position:absolute; left:0; right:0; bottom:0; z-index:2; max-width:1180px; margin:0 auto; padding:0 24px 86px; }

        .dt-hero-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(15,23,42,0.45); border:1px solid rgba(255,255,255,0.28); backdrop-filter:blur(8px); color:#fff; font-size:0.8rem; font-weight:500; padding:6px 14px; border-radius:50px; margin-bottom:16px; }
        .dt-hero-badge svg { color:#fb923c; }
        .dt-hero-h1 { font-size:clamp(2.6rem, 5vw, 4.1rem); font-weight:800; color:#fff; letter-spacing:-1.5px; line-height:1.04; margin:0 0 16px; text-shadow:0 3px 24px rgba(0,0,0,0.35); }
        .dt-hero-h1 .accent { color:#fb923c; }
        .dt-hero-sub { font-size:1rem; color:rgba(255,255,255,0.88); max-width:430px; line-height:1.6; margin:0 0 26px; }
        .dt-hero-btns { display:flex; gap:12px; flex-wrap:wrap; }
        .dt-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:50px; font-family:inherit; font-size:0.88rem; font-weight:600; cursor:pointer; text-decoration:none; transition:transform .2s, background .2s, box-shadow .2s; }
        .dt-btn-primary { background:linear-gradient(135deg,#f97316,#fb923c); color:#fff; border:none; box-shadow:0 6px 18px rgba(249,115,22,0.4); }
        .dt-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(249,115,22,0.45); }
        .dt-btn-ghost { background:rgba(255,255,255,0.06); color:#fff; border:1.5px solid rgba(255,255,255,0.75); }
        .dt-btn-ghost:hover { background:rgba(255,255,255,0.18); }

        /* ───────── SEARCH BAR ───────── */
        .dt-search { position:relative; z-index:10; max-width:1140px; margin:-44px auto 0; background:#fff; border-radius:22px; padding:9px; box-shadow:0 14px 44px rgba(15,23,42,0.16); display:flex; align-items:stretch; gap:10px; }
        .dt-search-fields { flex:1; display:flex; background:#f1f5f9; border-radius:14px; min-width:0; }
        .dt-field { flex:1; display:flex; align-items:center; gap:12px; padding:0 20px; min-height:54px; min-width:0; position:relative; }
        .dt-field + .dt-field::before { content:''; position:absolute; left:0; top:25%; bottom:25%; width:1px; background:#dbe2ea; }
        .dt-field-icon { color:#334155; display:flex; flex-shrink:0; }
        .dt-field select, .dt-field input { border:none; outline:none; background:transparent; font-family:inherit; font-size:0.92rem; font-weight:500; color:#1e293b; width:100%; cursor:pointer; appearance:none; -webkit-appearance:none; padding:0; }
        .dt-field input::placeholder { color:#1e293b; opacity:1; }
        .dt-field .chev { position:absolute; right:18px; color:#475569; pointer-events:none; display:flex; }
        .dt-field.has-chev select { padding-right:22px; }
        .dt-search-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg,#f97316,#fb923c); color:#fff; border:none; border-radius:14px; padding:0 34px; font-family:inherit; font-size:0.92rem; font-weight:700; cursor:pointer; white-space:nowrap; box-shadow:0 5px 16px rgba(249,115,22,0.35); transition:transform .2s; }
        .dt-search-btn:hover { transform:translateY(-1px); }

        /* ───────── TRUST STRIP ───────── */
        .dt-trust { max-width:1140px; margin:0 auto; padding:30px 24px 6px; display:flex; justify-content:space-between; align-items:center; gap:16px; }
        .dt-trust-item { display:flex; align-items:center; gap:12px; color:#475569; flex:1; justify-content:center; }
        .dt-trust-item svg { color:#334155; flex-shrink:0; }
        .dt-trust-text { font-size:0.84rem; font-weight:500; color:#475569; white-space:nowrap; }

        /* ───────── SECTION ───────── */
        .dt-section { max-width:1216px; margin:0 auto; padding:34px 24px 80px; }
        .dt-section-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:26px; }
        .dt-title-wrap { position:relative; display:inline-block; }
        .dt-section-title { font-size:1.9rem; font-weight:800; letter-spacing:-0.8px; margin:0; color:#0b1220; }
        .dt-swoosh { position:absolute; left:2px; bottom:-12px; width:min(240px, 92%); height:14px; }
        .dt-view-all { display:inline-flex; align-items:center; gap:6px; color:#f97316; font-size:0.84rem; font-weight:600; text-decoration:none; transition:gap .2s; }
        .dt-view-all:hover { gap:10px; }

        /* ───────── CARD GRID ───────── */
        .dt-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; }

        .dt-card { background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(15,23,42,0.09); cursor:pointer; transition:transform .25s, box-shadow .25s; display:flex; flex-direction:column; }
        .dt-card:hover { transform:translateY(-4px); box-shadow:0 14px 32px rgba(15,23,42,0.14); }
        .dt-card:focus-visible { outline:3px solid #f97316; outline-offset:2px; }

        .dt-card-img { position:relative; aspect-ratio:2.45 / 1; overflow:hidden; background:#e2e8f0; }
        .dt-card-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .dt-card:hover .dt-card-img img { transform:scale(1.05); }
        .dt-card-img::after { content:''; position:absolute; left:0; right:0; bottom:0; height:55%; background:linear-gradient(to top, rgba(0,0,0,0.55), transparent); pointer-events:none; }

        .dt-badge { position:absolute; top:10px; left:10px; z-index:2; padding:4px 11px; border-radius:7px; font-size:0.7rem; font-weight:600; color:#fff; }
        .dt-wish { position:absolute; top:8px; right:10px; z-index:2; width:32px; height:32px; background:none; border:none; padding:0; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:transform .2s; }
        .dt-wish:hover { transform:scale(1.15); }
        .dt-img-meta { position:absolute; left:10px; right:10px; bottom:8px; z-index:2; display:flex; justify-content:space-between; align-items:center; }
        .dt-pill { display:inline-flex; align-items:center; gap:5px; background:rgba(15,23,42,0.55); backdrop-filter:blur(4px); color:#fff; font-size:0.74rem; font-weight:600; padding:4px 10px; border-radius:50px; }
        .dt-star { color:#fbbf24; }
        .dt-pill small { font-size:inherit; font-weight:500; opacity:.95; }

        .dt-card-body { padding:12px 16px 16px; display:flex; flex-direction:column; flex:1; }
        .dt-card-loc { display:inline-flex; align-items:center; gap:4px; align-self:flex-start; font-size:0.76rem; font-weight:500; color:#475569; background:none; border:none; padding:0; font-family:inherit; cursor:pointer; margin-bottom:4px; }
        .dt-card-loc svg { color:#ef4444; }
        .dt-card-loc:hover { color:#f97316; }
        .dt-card-title { font-size:1.02rem; font-weight:700; line-height:1.3; color:#0b1220; margin:0 0 5px; letter-spacing:-0.2px; }
        .dt-card-desc { font-size:0.8rem; line-height:1.5; color:#64748b; margin:0 0 12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .dt-card-footer { margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .dt-price { font-family:'Montserrat','Inter',sans-serif; font-size:1.3rem; font-weight:800; color:#0b1220; }
        .dt-price small { font-family:'Inter',sans-serif; font-size:0.74rem; font-weight:400; color:#94a3b8; margin-left:4px; }
        .dt-book { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,#f97316,#fb923c); color:#fff; padding:8px 17px; border-radius:50px; font-size:0.78rem; font-weight:600; text-decoration:none; box-shadow:0 3px 10px rgba(249,115,22,0.3); white-space:nowrap; transition:transform .2s, box-shadow .2s; }
        .dt-book:hover { transform:translateY(-1px); box-shadow:0 6px 14px rgba(249,115,22,0.4); }

        /* Empty state */
        .dt-empty { text-align:center; padding:70px 24px; }
        .dt-empty h3 { font-family:'Montserrat','Inter',sans-serif; font-size:1.4rem; font-weight:800; margin:0 0 8px; }
        .dt-empty p { color:#64748b; margin:0 0 22px; }

        /* ───────── RESPONSIVE ───────── */
        @media (max-width:1024px) {
          .dt-grid { grid-template-columns:repeat(2, 1fr); }
          .dt-trust { flex-wrap:wrap; justify-content:center; }
          .dt-trust-item { flex:0 0 calc(50% - 16px); justify-content:flex-start; }
        }
        @media (max-width:820px) {
          .dt-search { margin:-36px 16px 0; flex-direction:column; }
          .dt-search-fields { flex-direction:column; }
          .dt-field + .dt-field::before { left:20px; right:20px; top:0; bottom:auto; width:auto; height:1px; }
          .dt-search-btn { min-height:50px; }
        }
        @media (max-width:640px) {
          .dt-hero { height:520px; }
          .dt-hero-inner { padding:0 20px 78px; }
          .dt-grid { grid-template-columns:1fr; }
          .dt-section { padding:28px 16px 60px; }
          .dt-section-title { font-size:1.6rem; }
          .dt-trust { padding:24px 16px 0; }
          .dt-trust-item { flex:0 0 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dt-page * { transition:none !important; }
        }
      `}</style>

      {/* ───────── HERO ───────── */}
      <section className="dt-hero">
        <img className="dt-hero-img" src={heroImage} alt={`${data.name} Day Tours`} />
        <div className="dt-hero-overlay" />
        <div className="dt-hero-inner">

          <h1 className="dt-hero-h1">
            {data.name}<br />
            <span className="accent">Day Tours</span>
          </h1>
          <p className="dt-hero-sub">
            Handpicked local experiences — from temple visits and street food walks to island adventures and jungle treks.
          </p>
          <div className="dt-hero-btns">
            <button type="button" className="dt-btn dt-btn-primary" onClick={scrollToGrid}>
              Browse Day Tours <ArrowRight />
            </button>
            <Link to={`/${data.slug}/customized-packages`} className="dt-btn dt-btn-ghost">
              Customize Trip
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── SEARCH BAR ───────── */}
      <div className="dt-search" role="search">
        <div className="dt-search-fields">
          <label className="dt-field has-chev">
            <span className="dt-field-icon"><PinIcon size={20} /></span>
            <select
              value={activeLocation}
              onChange={e => setActiveLocation(e.target.value)}
              aria-label="Location"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <span className="chev"><ChevronDown /></span>
          </label>

          <label className="dt-field">
            <span className="dt-field-icon"><CalendarIcon size={20} /></span>
            <input
              type="text"
              placeholder="Select Date"
              value={selDate}
              aria-label="Select date"
              min={new Date().toISOString().split('T')[0]}
              onFocus={e => {
                e.target.type = 'date';
                e.target.min = new Date().toISOString().split('T')[0];
                try { e.target.showPicker?.(); } catch (_) { /* ignore */ }
              }}
              onBlur={e => { if (!e.target.value) e.target.type = 'text'; }}
              onChange={e => setSelDate(e.target.value)}
            />
          </label>

          <label className="dt-field has-chev">
            <span className="dt-field-icon"><UsersIcon size={20} /></span>
            <select
              value={travellers}
              onChange={e => setTravellers(e.target.value)}
              aria-label="Travellers"
            >
              <option value="">Travellers</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
            <span className="chev"><ChevronDown /></span>
          </label>
        </div>

        <button type="button" className="dt-search-btn" onClick={scrollToGrid}>
          <SearchIcon size={16} /> Search
        </button>
      </div>

      {/* ───────── TRUST STRIP ───────── */}
      <div className="dt-trust">
        {TRUST.map(({ Icon, text }) => (
          <div key={text} className="dt-trust-item">
            <Icon />
            <span className="dt-trust-text">{text}</span>
          </div>
        ))}
      </div>

      {/* ───────── TOUR GRID ───────── */}
      <section className="dt-section" ref={gridRef}>
        <div className="dt-section-head">
          <div className="dt-title-wrap">
            <h2 className="dt-section-title">Popular Day Tours</h2>
            <svg className="dt-swoosh" viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 9 C 50 3, 120 3, 175 7 S 225 9, 238 4" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <path d="M150 11 C 180 7, 210 8, 232 11" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity=".7" />
            </svg>
          </div>
          <a
            href="#all"
            className="dt-view-all"
            onClick={e => { e.preventDefault(); setActiveLocation('all'); }}
          >
            View All Tours <ArrowRight size={14} />
          </a>
        </div>

        {filteredTours.length > 0 ? (
          <div className="dt-grid">
            {filteredTours.map(tour => {
              const badgeColor = BADGE_COLORS[tour.badge] || BADGE_COLORS.default;
              const liked = wishlist.includes(tour.id);
              const goTo = () => navigate(`/${data.slug}/tours/${tour.id}`, { state: tourState(tour) });

              return (
                <article
                  key={tour.id}
                  className="dt-card"
                  tabIndex={0}
                  onClick={goTo}
                  onKeyDown={e => { if (e.key === 'Enter') goTo(); }}
                >
                  <div className="dt-card-img">
                    <img src={tour.image} alt={tour.title} loading="lazy" />

                    {tour.badge && (
                      <span className="dt-badge" style={{ background: badgeColor }}>{tour.badge}</span>
                    )}

                    <button
                      type="button"
                      className="dt-wish"
                      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                      aria-pressed={liked}
                      onClick={e => { e.stopPropagation(); toggleWishlist(tour.id); }}
                    >
                      <HeartIcon liked={liked} />
                    </button>

                    <div className="dt-img-meta">
                      {tour.duration ? (
                        <span className="dt-pill">
                          <ClockIcon /> {String(tour.duration).replace('⏱ ', '')}
                        </span>
                      ) : <span />}
                      {tour.rating && (
                        <span className="dt-pill">
                          <span className="dt-star">★</span> {tour.rating}
                          {typeof tour.reviews === 'number' && <small>({tour.reviews})</small>}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="dt-card-body">
                    {tour.location && (
                      <button
                        type="button"
                        className="dt-card-loc"
                        onClick={e => { e.stopPropagation(); setActiveLocation(tour.location); }}
                      >
                        <PinBadgeIcon /> {tour.location}
                      </button>
                    )}
                    <h3 className="dt-card-title">{tour.title}</h3>
                    <p className="dt-card-desc">{tour.description}</p>

                    <div className="dt-card-footer">
                      <div className="dt-price">
                        {tour.price}<small>/person</small>
                      </div>
                      <Link
                        to={`/${data.slug}/tours/${tour.id}`}
                        state={tourState(tour)}
                        className="dt-book"
                        onClick={e => e.stopPropagation()}
                      >
                        Book Now <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dt-empty">
            <h3>No tours found in {activeLocation}</h3>
            <p>Try a different location or browse all available tours.</p>
            <button type="button" className="dt-btn dt-btn-primary" onClick={() => setActiveLocation('all')}>
              Show all tours
            </button>
          </div>
        )}
      </section>
    </div>
  );
}