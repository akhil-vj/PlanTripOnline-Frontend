import { useState, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ---------- tiny inline icon set ---------- */
const PATHS = {
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4.5-4.5',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  flame: 'M12 2c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z',
};

function Icon({ name, size = 18, fill = 'none', sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

const INCLUDE_ICONS = [
  ['hotel', '🛏️'], ['resort', '🏝️'], ['flight', '✈️'], ['meal', '🍴'], ['breakfast', '🍴'],
  ['island', '⛵'], ['tour', '🎫'], ['transport', '🚗'], ['transfer', '🚗'], ['spa', '💆'],
  ['activit', '⛰️'], ['guide', '🧭'], ['visa', '🛂'], ['insurance', '🛡️'],
];
const includeIcon = (name = '') => {
  const n = name.toLowerCase();
  const hit = INCLUDE_ICONS.find(([k]) => n.includes(k));
  return hit ? hit[1] : '✔';
};

export default function TourPackages() {
  const data = useOutletContext();
  const packages = data.tourPackages || [];
  const resultsRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPackages = searchQuery.trim()
    ? packages.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.duration?.toLowerCase().includes(q) ||
          p.includes?.some(inc => inc.toLowerCase().includes(q))
        );
      })
    : packages;

  const featured = filteredPackages[0];
  const rest = filteredPackages.slice(1);

  const scrollToResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const bookLink = (pkg) => ({
    to: `/${data.slug}/package/${pkg.id}`,
    state: { pkg, country: data },
  });

  return (
    <div className="packages-page">
      <Helmet>
        <title>{data.name} Tour Packages - PlantripOnline</title>
      </Helmet>

      <style>{`
        .packages-page { background:#fafaf9; min-height:100vh; color:#1e293b; }
        .packages-page * { box-sizing:border-box; }

        /* ---------- HERO ---------- */
        .packages-page .pkg-hero { position:relative; color:#fff; overflow:hidden; padding:120px 1.5rem 120px; }
        .packages-page .pkg-hero-bg { position:absolute; inset:0; background-size:cover; background-position:center; }
        .packages-page .pkg-hero-bg::after { content:''; position:absolute; inset:0;
          background:linear-gradient(90deg, rgba(10,22,40,.82) 0%, rgba(10,22,40,.45) 50%, rgba(10,22,40,0) 100%),
                     linear-gradient(180deg, rgba(10,22,40,.55) 0%, transparent 35%); }
        .packages-page .pkg-wave { position:absolute; left:0; bottom:-1px; width:100%; height:60px; display:block; }
        .packages-page .pkg-hero-inner { position:relative; z-index:2; max-width:1180px; margin:0 auto; }
        .packages-page .pkg-hero h1 { font-size:3.6rem; line-height:1.05; font-weight:800; letter-spacing:-1.5px;
          margin:0 0 16px; text-shadow:0 4px 24px rgba(0,0,0,.35); max-width:620px; }
        .packages-page .pkg-hero h1 .pkg-accent { display:inline-flex; align-items:center; gap:14px; color:#ff8a1f; }
        .packages-page .pkg-hero h1 svg { width:90px; height:22px; flex-shrink:0; }
        .packages-page .pkg-hero p { max-width:440px; font-size:1.05rem; line-height:1.55; color:rgba(255,255,255,.92); margin:0; }

        /* ---------- SEARCH BAR ---------- */
        .packages-page .pkg-search-wrap { position:relative; z-index:5; max-width:1000px; margin:-56px auto 0; padding:0 1.5rem; }
        .packages-page .pkg-search { background:#fff; border-radius:999px; padding:10px; display:flex; align-items:center; gap:12px;
          box-shadow:0 16px 44px rgba(15,23,42,.16); }
        .packages-page .pkg-search-field { flex:1; display:flex; align-items:center; gap:14px; background:#f4f6fa;
          border:1px solid #e6eaf1; border-radius:999px; padding:0 22px; height:50px; min-width:0; }
        .packages-page .pkg-search-field:focus-within { background:#fff; box-shadow:0 0 0 2px rgba(255,138,31,.4); }
        .packages-page .pkg-search-field svg { color:#1e293b; flex-shrink:0; }
        .packages-page .pkg-search-field input { flex:1; min-width:0; border:none; outline:none; background:transparent;
          font:inherit; font-size:.95rem; color:#1e293b; }
        .packages-page .pkg-search-field input::placeholder { color:#7b8798; }
        .packages-page .pkg-clear { background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1rem; padding:0; }
        .packages-page .pkg-clear:hover { color:#ef4444; }
        .packages-page .pkg-count { display:flex; align-items:center; gap:8px; height:50px; padding:0 18px; border-radius:999px;
          background:#f4f6fa; border:1px solid #e6eaf1; font-size:.92rem; color:#1e293b; white-space:nowrap; }
        .packages-page .pkg-search-btn { display:flex; align-items:center; gap:9px; height:50px; padding:0 30px; border:none;
          border-radius:999px; cursor:pointer; color:#fff; font-size:.98rem; font-weight:700;
          background:linear-gradient(135deg,#ff7a00,#ff9a2e); box-shadow:0 8px 20px rgba(255,122,0,.35);
          transition:transform .2s, box-shadow .2s; }
        .packages-page .pkg-search-btn:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(255,122,0,.45); }

        /* ---------- SECTION ---------- */
        .packages-page .pkg-grid-section { max-width:1180px; margin:0 auto; padding:34px 1.5rem 80px; scroll-margin-top:90px; }

        /* ---------- FEATURED ---------- */
        .packages-page .pkg-featured { display:grid; grid-template-columns:1.1fr 1fr; background:#fff; border-radius:22px;
          overflow:hidden; box-shadow:0 8px 30px rgba(15,23,42,.08); margin-bottom:26px; min-height:300px; }
        .packages-page .pkg-featured-img { position:relative; overflow:hidden; }
        .packages-page .pkg-featured-img img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;
          transition:transform .6s; }
        .packages-page .pkg-featured:hover .pkg-featured-img img { transform:scale(1.05); }
        .packages-page .pkg-featured-badge { position:absolute; top:18px; left:18px; z-index:2; display:inline-flex; align-items:center; gap:7px;
          background:linear-gradient(135deg,#dc2626,#ef4444); color:#fff; padding:9px 18px; border-radius:999px;
          font-size:.85rem; font-weight:800; text-transform:uppercase; box-shadow:0 6px 16px rgba(220,38,38,.4); }
        .packages-page .pkg-featured-body { padding:26px 32px 28px; display:flex; flex-direction:column; }
        .packages-page .pkg-duration-pill { display:inline-flex; align-items:center; gap:7px; align-self:flex-start;
          background:#fff7ed; color:#ea580c; border:1px solid #fed7aa; padding:6px 14px; border-radius:999px;
          font-size:.85rem; font-weight:700; margin-bottom:14px; }
        .packages-page .pkg-featured-body h2 { font-size:2rem; font-weight:800; margin:0 0 8px; color:#0f172a; line-height:1.15; }
        .packages-page .pkg-featured-subtitle { display:flex; align-items:center; gap:8px; color:#64748b; font-size:1rem; margin:0 0 18px; }
        .packages-page .pkg-featured-subtitle svg { color:#f97316; flex-shrink:0; }
        .packages-page .pkg-chips { display:flex; flex-wrap:wrap; gap:8px; }
        .packages-page .pkg-featured .pkg-chips { margin-bottom:22px; }
        .packages-page .pkg-chip { display:inline-flex; align-items:center; gap:7px; background:#f4f6fa; color:#334155;
          border:1px solid #e8ecf2; padding:6px 14px; border-radius:999px; font-size:.85rem; font-weight:500; }
        .packages-page .pkg-chip i { font-style:normal; }
        .packages-page .pkg-featured-footer { display:flex; justify-content:space-between; align-items:center; gap:14px;
          border-top:1px solid #eef1f5; padding-top:18px; margin-top:auto; }
        .packages-page .pkg-price-label { font-size:.78rem; color:#64748b; text-transform:uppercase; letter-spacing:.4px; }
        .packages-page .pkg-price { font-size:2rem; font-weight:800; color:#0f172a; line-height:1.15; }
        .packages-page .pkg-price small { font-size:.95rem; font-weight:400; color:#64748b; }
        .packages-page .pkg-cta { display:inline-flex; align-items:center; gap:9px; background:linear-gradient(135deg,#ff7a00,#ff9a2e);
          color:#fff; text-decoration:none; font-weight:700; padding:14px 28px; border-radius:999px; font-size:.98rem;
          box-shadow:0 8px 20px rgba(255,122,0,.35); transition:transform .2s, box-shadow .2s; white-space:nowrap; }
        .packages-page .pkg-cta:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(255,122,0,.45); }

        /* ---------- CARDS (last row centered) ---------- */
        .packages-page .pkg-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:22px; }
        .packages-page .pkg-card { width:calc((100% - 44px) / 3); background:#fff; border-radius:18px; overflow:hidden;
          box-shadow:0 6px 22px rgba(15,23,42,.07); display:flex; flex-direction:column; transition:transform .3s, box-shadow .3s; }
        .packages-page .pkg-card:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(15,23,42,.13); }
        .packages-page .pkg-card-img { position:relative; height:160px; overflow:hidden; }
        .packages-page .pkg-card-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
        .packages-page .pkg-card:hover .pkg-card-img img { transform:scale(1.07); }
        .packages-page .pkg-card-badge { position:absolute; top:12px; right:12px; z-index:2; background:linear-gradient(135deg,#dc2626,#ef4444);
          color:#fff; padding:6px 14px; border-radius:999px; font-size:.72rem; font-weight:800; text-transform:uppercase; letter-spacing:.3px; }
        .packages-page .pkg-card-duration { position:absolute; left:14px; bottom:12px; z-index:2; display:inline-flex; align-items:center; gap:7px;
          background:rgba(15,23,42,.75); backdrop-filter:blur(6px); color:#fff; padding:6px 12px; border-radius:10px;
          font-size:.85rem; font-weight:700; }
        .packages-page .pkg-card-body { padding:14px 18px 18px; display:flex; flex-direction:column; flex:1; }
        .packages-page .pkg-card-body h3 { font-size:1.2rem; font-weight:800; margin:0 0 3px; color:#0f172a; }
        .packages-page .pkg-card-subtitle { color:#64748b; font-size:.9rem; margin:0 0 12px; }
        .packages-page .pkg-card .pkg-chips { gap:6px; margin-bottom:16px; }
        .packages-page .pkg-card .pkg-chip { padding:4px 11px; font-size:.78rem; }
        .packages-page .pkg-card-footer { display:flex; justify-content:space-between; align-items:center; margin-top:auto; }
        .packages-page .pkg-card-price { font-size:1.55rem; font-weight:800; color:#0f172a; }
        .packages-page .pkg-card-btn { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#ff7a00,#ff9a2e);
          color:#fff; text-decoration:none; font-weight:700; font-size:.9rem; padding:10px 22px; border-radius:999px;
          box-shadow:0 6px 16px rgba(255,122,0,.3); transition:transform .2s, box-shadow .2s; }
        .packages-page .pkg-card-btn:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(255,122,0,.42); }

        /* ---------- EMPTY ---------- */
        .packages-page .pkg-empty { text-align:center; padding:70px 20px; background:#fff; border-radius:20px; box-shadow:0 4px 20px rgba(0,0,0,.05); }
        .packages-page .pkg-empty h3 { font-size:1.8rem; margin:0 0 10px; }
        .packages-page .pkg-empty p { color:#64748b; margin:0 0 24px; font-size:1.05rem; }
        .packages-page .pkg-empty .pkg-cta { border:none; cursor:pointer; font-family:inherit; }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width:1000px) { .packages-page .pkg-card { width:calc((100% - 22px) / 2); } }
        @media (max-width:860px) {
          .packages-page .pkg-hero { padding:105px 1.25rem 110px; }
          .packages-page .pkg-hero h1 { font-size:2.4rem; }
          .packages-page .pkg-featured { grid-template-columns:1fr; }
          .packages-page .pkg-featured-img { height:240px; }
          .packages-page .pkg-featured-body h2 { font-size:1.6rem; }
          .packages-page .pkg-search { flex-wrap:wrap; border-radius:26px; }
          .packages-page .pkg-search-field { flex-basis:100%; }
          .packages-page .pkg-count, .packages-page .pkg-search-btn { flex:1; justify-content:center; }
        }
        @media (max-width:640px) {
          .packages-page .pkg-card { width:100%; }
          .packages-page .pkg-featured-footer { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      {/* ---------- Hero ---------- */}
      <section className="pkg-hero">
        <div className="pkg-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }} />
        <div className="pkg-hero-inner">
          <h1>
            {data.name} Tour{' '}
            <span className="pkg-accent">
              Packages
              <svg viewBox="0 0 90 22" fill="none" aria-hidden="true">
                <path d="M2 16 C 25 4, 55 2, 88 8" stroke="#ff8a1f" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p>Perfectly curated multi-day itineraries with hotels, flights, meals, and guided experiences included.</p>
        </div>
        <svg className="pkg-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 C 240 0, 520 0, 760 24 S 1200 60, 1440 20 L1440 60 L0 60 Z" fill="#fafaf9" />
        </svg>
      </section>

      {/* ---------- Search bar ---------- */}
      <div className="pkg-search-wrap">
        <div className="pkg-search">
          <label className="pkg-search-field">
            <Icon name="search" size={22} />
            <input
              type="text"
              placeholder="Search packages by name, duration, inclusions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scrollToResults()}
            />
            {searchQuery && (
              <button type="button" className="pkg-clear" aria-label="Clear search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </label>
          <div className="pkg-count">
            <Icon name="briefcase" size={20} />
            <span>{filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}</span>
          </div>
          <button type="button" className="pkg-search-btn" onClick={scrollToResults}>
            <Icon name="search" size={18} sw={2.2} /> Search
          </button>
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <div className="pkg-grid-section" ref={resultsRef}>
        {featured ? (
          <>
            {/* Featured — first package */}
            <div className="pkg-featured">
              <div className="pkg-featured-img">
                <img src={featured.image} alt={featured.title} />
                {featured.badge && (
                  <span className="pkg-featured-badge"><Icon name="flame" size={16} fill="currentColor" sw={0} />{featured.badge}</span>
                )}
              </div>
              <div className="pkg-featured-body">
                <span className="pkg-duration-pill"><Icon name="calendar" size={15} />{featured.duration}</span>
                <h2>{featured.title}</h2>
                <p className="pkg-featured-subtitle"><Icon name="pin" size={18} fill="currentColor" sw={0} />{featured.subtitle}</p>
                <div className="pkg-chips">
                  {featured.includes?.map((inc, i) => (
                    <span key={i} className="pkg-chip"><i>{includeIcon(inc)}</i>{inc}</span>
                  ))}
                </div>
                <div className="pkg-featured-footer">
                  <div>
                    <div className="pkg-price-label">Starting from</div>
                    <div className="pkg-price">{featured.price} <small>/person</small></div>
                  </div>
                  <Link {...bookLink(featured)} className="pkg-cta">Book This Package <Icon name="arrow" size={18} sw={2.4} /></Link>
                </div>
              </div>
            </div>

            {/* Rest of packages */}
            {rest.length > 0 && (
              <div className="pkg-grid">
                {rest.map(pkg => (
                  <article key={pkg.id} className="pkg-card">
                    <div className="pkg-card-img">
                      <img src={pkg.image} alt={pkg.title} loading="lazy" />
                      {pkg.badge && <span className="pkg-card-badge">{pkg.badge}</span>}
                      <span className="pkg-card-duration"><Icon name="clock" size={16} />{pkg.duration}</span>
                    </div>
                    <div className="pkg-card-body">
                      <h3>{pkg.title}</h3>
                      <p className="pkg-card-subtitle">{pkg.subtitle}</p>
                      <div className="pkg-chips">
                        {pkg.includes?.map((inc, i) => (
                          <span key={i} className="pkg-chip"><i>{includeIcon(inc)}</i>{inc}</span>
                        ))}
                      </div>
                      <div className="pkg-card-footer">
                        <div className="pkg-card-price">{pkg.price}</div>
                        <Link {...bookLink(pkg)} className="pkg-card-btn">Book Now <Icon name="arrow" size={16} sw={2.4} /></Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="pkg-empty">
            {searchQuery ? (
              <>
                <h3>No packages matching “{searchQuery}”</h3>
                <p>Try a different keyword or browse all packages.</p>
                <button type="button" className="pkg-cta" onClick={() => setSearchQuery('')}>Clear Search</button>
              </>
            ) : (
              <>
                <h3>Tour Packages Coming Soon!</h3>
                <p>We are crafting the ultimate multi-day packages for {data.name}.</p>
                <Link to="/enquiry" className="pkg-cta">Enquire Custom Package</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}