import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ───────── Inline SVG icons ───────── */
const Svg = ({ children, size = 20, fill = 'none', stroke = 'currentColor', sw = 1.8, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

const CarIcon = ({ size = 16 }) => (
  <Svg size={size} sw={1.8}>
    <path d="M5 16.5V18a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1.5M15.5 16.5V18a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-1.5" />
    <path d="M3.5 16.5h17v-4l-1.8-4.6A2 2 0 0 0 16.8 6.5H7.2a2 2 0 0 0-1.9 1.4L3.5 12.5z" />
    <path d="M3.5 12.5h17" />
    <circle cx="7.5" cy="14.5" r=".6" fill="currentColor" />
    <circle cx="16.5" cy="14.5" r=".6" fill="currentColor" />
  </Svg>
);
const CarSolid = () => (
  <Svg size={26} fill="#f97316" stroke="#f97316" sw={1.2}>
    <path d="M4 12.5 5.8 8a2 2 0 0 1 1.9-1.3h8.6A2 2 0 0 1 18.2 8l1.8 4.5V18a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M7 9l-1 3h12l-1-3z" fill="#fff" stroke="none" />
    <circle cx="7.5" cy="14.6" r="1" fill="#fff" stroke="none" />
    <circle cx="16.5" cy="14.6" r="1" fill="#fff" stroke="none" />
  </Svg>
);
const PersonSolid = () => (
  <Svg size={26} fill="#f97316" stroke="none">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z" />
  </Svg>
);
const ClockOutline = () => (
  <Svg size={28} stroke="#f97316" sw={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 1.8" />
  </Svg>
);
const CardOutline = () => (
  <Svg size={28} stroke="#f97316" sw={2}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M6.5 14.5h4" />
  </Svg>
);
const SearchIcon = () => (
  <Svg size={22} sw={2.2} stroke="#0f172a"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Svg>
);
const ClockSmall = () => (
  <Svg size={15} sw={1.9}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
);
const ArrowRight = () => (
  <Svg size={16} sw={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
);

const FEATURES = [
  { Icon: CarSolid,    title: 'Private Vehicles', sub: 'No sharing' },
  { Icon: PersonSolid, title: 'Meet & Greet',     sub: 'Driver waits at arrivals' },
  { Icon: ClockOutline, title: '24/7 Service',    sub: 'Any time, any day' },
  { Icon: CardOutline, title: 'Fixed Pricing',    sub: 'No hidden charges' },
];

export default function Transfers() {
  const data      = useOutletContext();
  const transfers = data.transfers || [];
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.toLowerCase();
  const filteredTransfers = q
    ? transfers.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.from?.toLowerCase().includes(q) ||
        t.to?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.vehicles?.some(v => v.toLowerCase().includes(q))
      )
    : transfers;

  const heroImage = 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1600';

  const priceLabel = price =>
    !price ? '' : /^from/i.test(String(price).trim()) ? price : `From ${price}`;

  const count = filteredTransfers.length;

  return (
    <div className="tf-page">
      <Helmet>
        <title>{data.name} Transfers &amp; Transport – PlantripOnline</title>
        <meta
          name="description"
          content={`Reliable private airport transfers and intercity transport in ${data.name} with professional drivers.`}
        />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

        .tf-page, .tf-page * { box-sizing:border-box; }
        .tf-page { background:#f8fafc; min-height:100vh; font-family:'Inter',system-ui,sans-serif; color:#0f172a; }
        .tf-page h1, .tf-card-title, .tf-price { font-family:'Montserrat','Inter',sans-serif; }

        /* ───────── HERO ───────── */
        .tf-hero { position:relative; height:440px; overflow:hidden; background:#0f2a44; }
        .tf-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 45%; }
        .tf-hero-overlay { position:absolute; inset:0;
          background:
            linear-gradient(90deg, rgba(6,18,38,0.6) 0%, rgba(6,18,38,0.25) 50%, rgba(6,18,38,0) 75%),
            linear-gradient(180deg, rgba(6,18,38,0.5) 0%, rgba(6,18,38,0) 30%, rgba(6,18,38,0) 75%, rgba(6,18,38,0.2) 100%); }
        /* soft curved edge into the page background */
        .tf-hero::after { content:''; position:absolute; left:-6%; right:-6%; bottom:-2px; height:56px; background:#f8fafc; border-radius:50% 50% 0 0 / 100% 100% 0 0; z-index:1; }

        .tf-hero-inner { position:absolute; left:0; right:0; bottom:0; z-index:2; max-width:1148px; margin:0 auto; padding:0 24px 120px; }
        .tf-hero-h1 { font-size:clamp(2.5rem, 5.4vw, 4.4rem); font-weight:800; color:#fff; letter-spacing:-2px; line-height:1.05; margin:0 0 12px; text-shadow:0 3px 24px rgba(0,0,0,0.4); }
        .tf-hero-h1 .accent { color:#fb923c; }
        .tf-hero-sub { font-size:clamp(1rem, 1.7vw, 1.3rem); color:#fff; max-width:560px; line-height:1.5; font-weight:500; margin:0; text-shadow:0 2px 12px rgba(0,0,0,0.35); }
        .tf-hero-swoosh { display:block; margin:14px 0 0 60px; width:110px; height:14px; }

        /* ───────── FEATURES ───────── */
        .tf-wrap { max-width:1148px; margin:0 auto; padding:0 24px; }
        .tf-features-wrap { position:relative; z-index:10; margin-top:-86px; }
        .tf-features { background:#fff; border-radius:22px; padding:20px 12px; box-shadow:0 12px 36px rgba(15,23,42,0.12); display:grid; grid-template-columns:repeat(4, 1fr); }
        .tf-feat { display:flex; align-items:center; gap:14px; padding:6px 24px; position:relative; min-width:0; }
        .tf-feat + .tf-feat::before { content:''; position:absolute; left:0; top:12%; bottom:12%; width:1px; background:#e2e8f0; }
        .tf-feat-icon { width:48px; height:48px; border-radius:14px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .tf-feat-text strong { display:block; font-size:0.95rem; font-weight:700; color:#0b1220; margin-bottom:2px; }
        .tf-feat-text span { font-size:0.8rem; color:#64748b; font-weight:500; }

        /* ───────── SEARCH ───────── */
        .tf-search-wrap { margin-top:26px; }
        .tf-search { background:#fff; border-radius:16px; padding:0 26px; height:56px; box-shadow:0 4px 20px rgba(15,23,42,0.07); display:flex; align-items:center; gap:14px; border:2px solid transparent; transition:border-color .2s, box-shadow .2s; }
        .tf-search:focus-within { border-color:#f97316; box-shadow:0 4px 20px rgba(249,115,22,0.15); }
        .tf-search input { border:none; outline:none; flex:1; min-width:0; font-family:inherit; font-size:0.95rem; font-weight:500; color:#1e293b; background:transparent; }
        .tf-search input::placeholder { color:#7b8798; }
        .tf-count { font-size:0.9rem; color:#475569; white-space:nowrap; border-left:1px solid #e2e8f0; padding-left:16px; height:26px; display:flex; align-items:center; }
        .tf-count b { color:#0b1220; font-weight:700; margin-right:4px; }

        /* ───────── GRID ───────── */
        .tf-grid-section { max-width:1196px; margin:34px auto 90px; padding:0 24px; }
        .tf-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:22px; align-items:stretch; }

        .tf-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(15,23,42,0.09); display:flex; flex-direction:column; transition:transform .25s, box-shadow .25s; }
        .tf-card:hover { transform:translateY(-4px); box-shadow:0 16px 36px rgba(15,23,42,0.14); }
        .tf-card-img { aspect-ratio:2 / 1; overflow:hidden; background:#e2e8f0; }
        .tf-card-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .tf-card:hover .tf-card-img img { transform:scale(1.05); }

        .tf-card-body { padding:18px 22px 20px; display:flex; flex-direction:column; flex:1; }
        .tf-card-title { font-size:1.3rem; font-weight:800; letter-spacing:-0.5px; color:#0b1220; margin:0 0 12px; }

        .tf-route { background:#f3f5f8; border-radius:10px; padding:10px 14px; margin-bottom:12px; display:flex; flex-direction:column; gap:8px; }
        .tf-route-point { display:flex; align-items:center; gap:12px; font-size:0.95rem; font-weight:500; color:#1e293b; }
        .tf-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
        .tf-dot.from { background:#16c35a; }
        .tf-dot.to   { background:#e11d1d; }

        .tf-desc { font-size:0.92rem; color:#475569; line-height:1.5; margin:0 0 10px; max-width:30ch; }
        .tf-duration { display:flex; align-items:center; gap:8px; font-size:0.88rem; color:#475569; margin-bottom:12px; }
        .tf-duration svg { color:#334155; }

        .tf-vehicles { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
        .tf-vehicle { display:inline-flex; align-items:center; gap:8px; background:#f1f4f8; color:#1e293b; padding:5px 12px; border-radius:7px; font-size:0.8rem; font-weight:600; }
        .tf-vehicle svg { color:#1e293b; }

        .tf-card-footer { margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:12px; padding-top:16px; border-top:1px solid #e8edf3; }
        .tf-price { font-size:1.45rem; font-weight:800; letter-spacing:-0.5px; color:#0b1220; white-space:nowrap; }
        .tf-book { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#f97316,#fb923c); color:#fff; padding:11px 24px; border-radius:50px; font-size:0.9rem; font-weight:600; text-decoration:none; box-shadow:0 4px 14px rgba(249,115,22,0.38); white-space:nowrap; transition:transform .2s, box-shadow .2s; }
        .tf-book:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(249,115,22,0.45); }
        .tf-book:focus-visible { outline:3px solid #fdba74; outline-offset:2px; }

        /* Empty state */
        .tf-empty { text-align:center; padding:70px 24px; }
        .tf-empty h3 { font-family:'Montserrat','Inter',sans-serif; font-size:1.4rem; font-weight:800; margin:0 0 8px; }
        .tf-empty p { color:#64748b; margin:0 0 22px; }
        .tf-empty button { background:linear-gradient(135deg,#f97316,#fb923c); color:#fff; padding:12px 28px; border-radius:50px; border:none; font-family:inherit; font-size:0.9rem; font-weight:600; cursor:pointer; }

        /* ───────── RESPONSIVE ───────── */
        @media (max-width:1024px) {
          .tf-grid { grid-template-columns:repeat(2, 1fr); }
          .tf-features { grid-template-columns:repeat(2, 1fr); row-gap:14px; }
          .tf-feat:nth-child(3)::before { display:none; }
        }
        @media (max-width:640px) {
          .tf-hero { height:420px; }
          .tf-hero-inner { padding:0 20px 112px; }
          .tf-hero-swoosh { margin-left:20px; }
          .tf-features-wrap { margin-top:-76px; }
          .tf-features { grid-template-columns:1fr; padding:14px 8px; }
          .tf-feat + .tf-feat::before { left:24px; right:24px; top:0; bottom:auto; width:auto; height:1px; }
          .tf-feat { padding:12px 16px; }
          .tf-grid { grid-template-columns:1fr; }
          .tf-grid-section { padding:0 16px; }
          .tf-wrap { padding:0 16px; }
          .tf-search { padding:0 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tf-page * { transition:none !important; }
        }
      `}</style>

      {/* ───────── HERO ───────── */}
      <section className="tf-hero">
        <img className="tf-hero-img" src={heroImage} alt={`${data.name} Transfers`} />
        <div className="tf-hero-overlay" />
        <div className="tf-hero-inner">
          <h1 className="tf-hero-h1">
            <span className="accent">{data.name}</span> Transfers
          </h1>
          <p className="tf-hero-sub">
            Reliable private airport transfers and intercity transport with professional drivers.
          </p>
          <svg className="tf-hero-swoosh" viewBox="0 0 110 14" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 11 C 30 5, 70 3, 108 2" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <div className="tf-wrap tf-features-wrap">
        <div className="tf-features">
          {FEATURES.map(({ Icon, title, sub }) => (
            <div key={title} className="tf-feat">
              <div className="tf-feat-icon"><Icon /></div>
              <div className="tf-feat-text">
                <strong>{title}</strong>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── SEARCH ───────── */}
      <div className="tf-wrap tf-search-wrap">
        <div className="tf-search" role="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search transfers by route, destination, vehicle type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search transfers"
          />
          <span className="tf-count">
            <b>{count}</b> transfer{count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ───────── GRID ───────── */}
      <div className="tf-grid-section">
        {count > 0 ? (
          <div className="tf-grid">
            {filteredTransfers.map(transfer => (
              <article key={transfer.id} className="tf-card">
                <div className="tf-card-img">
                  <img src={transfer.image} alt={transfer.title} loading="lazy" />
                </div>

                <div className="tf-card-body">
                  <h3 className="tf-card-title">{transfer.title}</h3>

                  <div className="tf-route">
                    <div className="tf-route-point"><span className="tf-dot from" />{transfer.from}</div>
                    <div className="tf-route-point"><span className="tf-dot to" />{transfer.to}</div>
                  </div>

                  <p className="tf-desc">{transfer.description}</p>

                  {transfer.duration && (
                    <div className="tf-duration">
                      <ClockSmall /> {String(transfer.duration).replace('⏱ ', '')}
                    </div>
                  )}

                  {transfer.vehicles?.length > 0 && (
                    <div className="tf-vehicles">
                      {transfer.vehicles.map((v, i) => (
                        <span key={i} className="tf-vehicle"><CarIcon /> {v}</span>
                      ))}
                    </div>
                  )}

                  <div className="tf-card-footer">
                    <div className="tf-price">{priceLabel(transfer.price)}</div>
                    <Link
                      to={`/${data.slug}/transfers/${transfer.id}`}
                      state={{ transfer, country: data }}
                      className="tf-book"
                    >
                      Book Transfer <ArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="tf-empty">
            <h3>{searchQuery ? `No results for "${searchQuery}"` : 'No transfers available'}</h3>
            <p>
              {searchQuery
                ? 'Try a different keyword.'
                : `We are arranging transport options for ${data.name}.`}
            </p>
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}>Clear search</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}