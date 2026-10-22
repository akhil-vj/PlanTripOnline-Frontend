import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function DestinationDetail() {
  const data = useOutletContext();
  const { destSlug } = useParams();
  const navigate = useNavigate();

  // Find the destination from country data
  const dest = (data.destinations || []).find(d => d.id === destSlug);

  if (!dest) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Destination not found</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '12px 28px', background: '#f97316', color: 'white', border: 'none', borderRadius: 50, cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>← Go Back</button>
      </div>
    );
  }

  // Pull related data from country context, filtered by this destination
  const tours = (data.dayTours || []).filter(t => t.location?.toLowerCase() === dest.name.toLowerCase());
  const hotels = (data.hotels || []).filter(h => h.destination?.toLowerCase() === dest.name.toLowerCase() || h.location?.toLowerCase().includes(dest.name.toLowerCase()));
  const packages = (data.tourPackages || []).filter(p => p.subtitle?.toLowerCase().includes(dest.name.toLowerCase()) || p.title?.toLowerCase().includes(dest.name.toLowerCase()));

  return (
    <div className="dest-detail-page">
      <Helmet>
        <title>{dest.name}, {data.name} - PlantripOnline</title>
        <meta name="description" content={dest.description} />
      </Helmet>

      <style>{`
        .dest-detail-page {
          background: #fafaf9;
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Hero ── */
        .dest-detail-page .dd-hero {
          position: relative;
          height: 92vh;
          min-height: 580px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }
        .dest-detail-page .dd-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.35);
          transform: scale(1.07);
          transition: transform 10s ease;
        }
        .dest-detail-page .dd-hero:hover .dd-hero-bg { transform: scale(1.12); }
        .dest-detail-page .dd-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(15,23,42,0.4) 55%, rgba(15,23,42,0.82) 100%);
        }
        .dest-detail-page .dd-hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
          padding: 0 24px;
          animation: ddFadeUp 0.85s ease;
        }
        @keyframes ddFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dest-detail-page .dd-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-bottom: 20px;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.5px;
        }
        .dest-detail-page .dd-breadcrumb:hover { background: rgba(255,255,255,0.2); }
        .dest-detail-page .dd-country-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(249,115,22,0.2);
          border: 1px solid rgba(249,115,22,0.4);
          color: #fdba74;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 18px;
          backdrop-filter: blur(8px);
        }
        .dest-detail-page .dd-hero-content h1 {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -3px;
          margin-bottom: 18px;
          text-shadow: 0 4px 40px rgba(0,0,0,0.5);
        }
        .dest-detail-page .dd-hero-content h1 span { color: #fb923c; }
        .dest-detail-page .dd-hero-desc {
          font-size: 1.2rem;
          opacity: 0.88;
          line-height: 1.65;
          max-width: 600px;
          margin: 0 auto 30px;
          font-weight: 400;
        }
        .dest-detail-page .dd-hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .dest-detail-page .dd-btn-primary {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          padding: 15px 34px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(249,115,22,0.4);
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .dest-detail-page .dd-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(249,115,22,0.5);
        }
        .dest-detail-page .dd-btn-secondary {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: white;
          padding: 15px 34px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .dest-detail-page .dd-btn-secondary:hover {
          background: rgba(255,255,255,0.22);
        }

        /* ── Highlights bar ── */
        .dest-detail-page .dd-highlights-bar {
          background: white;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          padding: 22px 0;
          position: relative;
          z-index: 5;
        }
        .dest-detail-page .dd-highlights-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .dest-detail-page .dd-hl-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
          margin-right: 6px;
        }
        .dest-detail-page .dd-hl-tag {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.83rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ── Section commons ── */
        .dest-detail-page .dd-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 1.5rem;
        }
        .dest-detail-page .dd-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dest-detail-page .dd-section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.5px;
        }
        .dest-detail-page .dd-section-title span { color: #f97316; }
        .dest-detail-page .dd-section-sub {
          font-size: 1rem;
          color: #64748b;
          margin-top: 4px;
        }
        .dest-detail-page .dd-see-all {
          font-size: 0.88rem;
          font-weight: 700;
          color: #f97316;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: gap 0.2s;
        }
        .dest-detail-page .dd-see-all:hover { gap: 8px; }

        /* ── Stats row ── */
        .dest-detail-page .dd-stats-row {
          background: white;
          border-top: 1px solid #f1f5f9;
        }
        .dest-detail-page .dd-stats-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          divide-x: 1px solid #f1f5f9;
        }
        .dest-detail-page .dd-stat-card {
          padding: 28px 24px;
          text-align: center;
          border-right: 1px solid #f1f5f9;
        }
        .dest-detail-page .dd-stat-card:last-child { border-right: none; }
        .dest-detail-page .dd-stat-icon { font-size: 1.8rem; margin-bottom: 8px; }
        .dest-detail-page .dd-stat-num { font-size: 2rem; font-weight: 900; color: #f97316; line-height: 1; }
        .dest-detail-page .dd-stat-label { font-size: 0.78rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        /* ── Tours grid ── */
        .dest-detail-page .dd-tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .dest-detail-page .dd-tour-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .dest-detail-page .dd-tour-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }
        .dest-detail-page .dd-tour-img {
          position: relative;
          height: 210px;
          overflow: hidden;
        }
        .dest-detail-page .dd-tour-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .dest-detail-page .dd-tour-card:hover .dd-tour-img img { transform: scale(1.07); }
        .dest-detail-page .dd-tour-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg,#f97316,#fb923c);
          color: white;
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .dest-detail-page .dd-tour-duration {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.65);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }
        .dest-detail-page .dd-tour-rating {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.65);
          color: #fbbf24;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }
        .dest-detail-page .dd-tour-body { padding: 20px; }
        .dest-detail-page .dd-tour-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.35;
        }
        .dest-detail-page .dd-tour-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .dest-detail-page .dd-tour-features {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .dest-detail-page .dd-tour-features span {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .dest-detail-page .dd-tour-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }
        .dest-detail-page .dd-tour-price { font-size: 1.4rem; font-weight: 800; color: #1e293b; }
        .dest-detail-page .dd-tour-price small { font-size: 0.78rem; color: #94a3b8; font-weight: 400; }
        .dest-detail-page .dd-book-btn {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          padding: 9px 22px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(249,115,22,0.25);
          transition: all 0.25s;
        }
        .dest-detail-page .dd-book-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249,115,22,0.35); }

        /* ── Hotels grid ── */
        .dest-detail-page .dd-hotels-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 60px 0;
        }
        .dest-detail-page .dd-hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .dest-detail-page .dd-hotel-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .dest-detail-page .dd-hotel-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 44px rgba(0,0,0,0.3);
        }
        .dest-detail-page .dd-hotel-img {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .dest-detail-page .dd-hotel-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .dest-detail-page .dd-hotel-card:hover .dd-hotel-img img { transform: scale(1.07); }
        .dest-detail-page .dd-hotel-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          color: white;
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .dest-detail-page .dd-hotel-stars {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.65);
          color: #fbbf24;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.82rem;
          backdrop-filter: blur(4px);
        }
        .dest-detail-page .dd-hotel-body { padding: 20px; }
        .dest-detail-page .dd-hotel-location { font-size: 0.78rem; color: #94a3b8; font-weight: 500; margin-bottom: 6px; }
        .dest-detail-page .dd-hotel-body h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
        .dest-detail-page .dd-hotel-amenities { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
        .dest-detail-page .dd-hotel-amenities span {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 3px 9px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .dest-detail-page .dd-hotel-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }
        .dest-detail-page .dd-hotel-price { font-size: 1.3rem; font-weight: 800; color: #1e293b; }
        .dest-detail-page .dd-hotel-price small { font-size: 0.75rem; color: #94a3b8; font-weight: 400; }
        .dest-detail-page .dd-enquire-btn {
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          color: white;
          padding: 9px 22px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(2,132,199,0.25);
          transition: all 0.25s;
        }
        .dest-detail-page .dd-enquire-btn:hover { transform: translateY(-2px); }

        /* ── Packages ── */
        .dest-detail-page .dd-pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        .dest-detail-page .dd-pkg-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          display: flex;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .dest-detail-page .dd-pkg-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }
        .dest-detail-page .dd-pkg-img {
          width: 140px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .dest-detail-page .dd-pkg-img img { width: 100%; height: 100%; object-fit: cover; }
        .dest-detail-page .dd-pkg-body { padding: 20px; flex: 1; }
        .dest-detail-page .dd-pkg-duration {
          display: inline-block;
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #fed7aa;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .dest-detail-page .dd-pkg-body h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .dest-detail-page .dd-pkg-sub { font-size: 0.8rem; color: #64748b; margin-bottom: 10px; }
        .dest-detail-page .dd-pkg-includes { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px; }
        .dest-detail-page .dd-pkg-includes span {
          background: #f8fafc;
          color: #475569;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 500;
        }
        .dest-detail-page .dd-pkg-footer { display: flex; justify-content: space-between; align-items: center; }
        .dest-detail-page .dd-pkg-price { font-size: 1.2rem; font-weight: 800; color: #1e293b; }
        .dest-detail-page .dd-pkg-price small { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }
        .dest-detail-page .dd-pkg-btn {
          background: #1e293b;
          color: white;
          padding: 8px 18px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.25s;
        }
        .dest-detail-page .dd-pkg-btn:hover { background: #f97316; }

        /* ── CTA banner ── */
        .dest-detail-page .dd-cta-banner {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          padding: 70px 0;
          text-align: center;
          color: white;
        }
        .dest-detail-page .dd-cta-inner { max-width: 640px; margin: 0 auto; padding: 0 1.5rem; }
        .dest-detail-page .dd-cta-inner h2 { font-size: 2.6rem; font-weight: 900; margin-bottom: 14px; letter-spacing: -1px; }
        .dest-detail-page .dd-cta-inner p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 30px; }
        .dest-detail-page .dd-cta-inner a {
          background: white;
          color: #ea580c;
          padding: 16px 38px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 800;
          font-size: 1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          transition: all 0.3s;
          display: inline-block;
        }
        .dest-detail-page .dd-cta-inner a:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.28); }

        /* ── Empty states ── */
        .dest-detail-page .dd-empty {
          text-align: center;
          padding: 50px 20px;
          background: #f8fafc;
          border-radius: 16px;
          color: #94a3b8;
        }
        .dest-detail-page .dd-empty-icon { font-size: 3rem; margin-bottom: 12px; }
        .dest-detail-page .dd-empty h4 { font-size: 1.2rem; color: #64748b; margin-bottom: 8px; }
        .dest-detail-page .dd-empty p { font-size: 0.9rem; }

        /* ── Media ── */
        @media (max-width: 768px) {
          .dest-detail-page .dd-hero-content h1 { font-size: 3rem; letter-spacing: -1.5px; }
          .dest-detail-page .dd-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .dest-detail-page .dd-stat-card { border-right: none; border-bottom: 1px solid #f1f5f9; }
          .dest-detail-page .dd-pkg-card { flex-direction: column; }
          .dest-detail-page .dd-pkg-img { width: 100%; height: 160px; }
          .dest-detail-page .dd-cta-inner h2 { font-size: 1.8rem; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="dd-hero">
        <div className="dd-hero-bg" style={{ backgroundImage: `url(${dest.image})` }}></div>
        <div className="dd-hero-overlay"></div>
        <div className="dd-hero-content">
          <div
            className="dd-breadcrumb"
            onClick={() => navigate(-1)}
          >
            ← {data.name} / Destinations
          </div>
          <div className="dd-country-badge">
            {data.flag} {data.name} · {dest.badge || 'Top Destination'}
          </div>
          <h1><span>{dest.name}</span></h1>
          <p className="dd-hero-desc">{dest.description}</p>
          <div className="dd-hero-actions">
            <Link
              to="/book-trip"
              state={{ destination: dest.name, country: data.name, image: dest.image, price: '' }}
              className="dd-btn-primary"
            >
              ✈️ Plan My Trip
            </Link>
            <Link to="/enquiry" className="dd-btn-secondary">
              💬 Talk to Expert
            </Link>
          </div>
        </div>
      </div>

      {/* ── Highlights bar ── */}
      {dest.highlights?.length > 0 && (
        <div className="dd-highlights-bar">
          <div className="dd-highlights-inner">
            <span className="dd-hl-label">Must See</span>
            {dest.highlights.map((h, i) => (
              <span key={i} className="dd-hl-tag">✦ {h}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="dd-stats-row">
        <div className="dd-stats-inner">
          <div className="dd-stat-card">
            <div className="dd-stat-icon">🗺️</div>
            <div className="dd-stat-num">{dest.locations || '10+'}</div>
            <div className="dd-stat-label">Locations</div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon">🎒</div>
            <div className="dd-stat-num">{tours.length || '5+'}</div>
            <div className="dd-stat-label">Day Tours</div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon">🏨</div>
            <div className="dd-stat-num">{hotels.length || '3+'}</div>
            <div className="dd-stat-label">Hotels</div>
          </div>
          <div className="dd-stat-card">
            <div className="dd-stat-icon">⭐</div>
            <div className="dd-stat-num">{dest.rating || '4.8'}</div>
            <div className="dd-stat-label">Rating</div>
          </div>
        </div>
      </div>

      {/* ── Day Tours ── */}
      <div className="dd-section">
        <div className="dd-section-header">
          <div>
            <h2 className="dd-section-title">Day Tours in <span>{dest.name}</span></h2>
            <p className="dd-section-sub">Handpicked experiences to make the most of your time</p>
          </div>
          <Link to={`/${data.slug}/day-tours`} className="dd-see-all">View All Tours →</Link>
        </div>
        {tours.length > 0 ? (
          <div className="dd-tours-grid">
            {tours.slice(0, 6).map(tour => (
              <div key={tour.id} className="dd-tour-card">
                <div className="dd-tour-img">
                  <img src={tour.image} alt={tour.title} loading="lazy" />
                  {tour.badge && <span className="dd-tour-badge">{tour.badge}</span>}
                  {tour.duration && <span className="dd-tour-duration">{tour.duration}</span>}
                  {tour.rating && <span className="dd-tour-rating">★ {tour.rating}</span>}
                </div>
                <div className="dd-tour-body">
                  <h3>{tour.title}</h3>
                  <p className="dd-tour-desc">{tour.description}</p>
                  <div className="dd-tour-features">
                    {tour.features?.map((f, i) => <span key={i}>{f}</span>)}
                  </div>
                  <div className="dd-tour-footer">
                    <div className="dd-tour-price">{tour.price} <small>/person</small></div>
                    <Link
                      to="/book-trip"
                      state={{ destination: tour.title, country: data.name, image: tour.image, price: tour.price }}
                      className="dd-book-btn"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dd-empty">
            <div className="dd-empty-icon">🎒</div>
            <h4>Tours Coming Soon</h4>
            <p>We're curating the best day tours for {dest.name}. Check back soon!</p>
          </div>
        )}
      </div>

      {/* ── Hotels ── */}
      <div className="dd-hotels-bg">
        <div className="dd-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="dd-section-header">
            <div>
              <h2 className="dd-section-title" style={{ color: 'white' }}>Stay in <span>{dest.name}</span></h2>
              <p className="dd-section-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>Carefully selected hotels for every budget</p>
            </div>
            <Link to={`/${data.slug}/hotels`} className="dd-see-all">View All Hotels →</Link>
          </div>
          {hotels.length > 0 ? (
            <div className="dd-hotels-grid">
              {hotels.slice(0, 3).map(hotel => (
                <div key={hotel.id} className="dd-hotel-card">
                  <div className="dd-hotel-img">
                    <img src={hotel.image} alt={hotel.title} loading="lazy" />
                    {hotel.badge && <span className="dd-hotel-badge">{hotel.badge}</span>}
                    {hotel.stars && <span className="dd-hotel-stars">{'★'.repeat(Number(hotel.stars))}</span>}
                  </div>
                  <div className="dd-hotel-body">
                    <div className="dd-hotel-location">📍 {hotel.location}</div>
                    <h3>{hotel.title}</h3>
                    <div className="dd-hotel-amenities">
                      {hotel.amenities?.map((a, i) => <span key={i}>{a}</span>)}
                    </div>
                    <div className="dd-hotel-footer">
                      <div className="dd-hotel-price">{hotel.price} <small>/night</small></div>
                      <Link to="/enquiry" className="dd-enquire-btn">Enquire</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dd-empty" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              <div className="dd-empty-icon">🏨</div>
              <h4 style={{ color: 'rgba(255,255,255,0.7)' }}>Hotels Coming Soon</h4>
              <p>We're finding the best stays in {dest.name}.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Packages ── */}
      {packages.length > 0 && (
        <div className="dd-section">
          <div className="dd-section-header">
            <div>
              <h2 className="dd-section-title">Tour <span>Packages</span></h2>
              <p className="dd-section-sub">All-inclusive multi-day itineraries featuring {dest.name}</p>
            </div>
            <Link to={`/${data.slug}/tour-packages`} className="dd-see-all">View All Packages →</Link>
          </div>
          <div className="dd-pkg-grid">
            {packages.slice(0, 3).map(pkg => (
              <div key={pkg.id} className="dd-pkg-card">
                <div className="dd-pkg-img">
                  <img src={pkg.image} alt={pkg.title} loading="lazy" />
                </div>
                <div className="dd-pkg-body">
                  <span className="dd-pkg-duration">⏱ {pkg.duration}</span>
                  <h3>{pkg.title}</h3>
                  <p className="dd-pkg-sub">{pkg.subtitle}</p>
                  <div className="dd-pkg-includes">
                    {pkg.includes?.map((inc, i) => <span key={i}>{inc}</span>)}
                  </div>
                  <div className="dd-pkg-footer">
                    <div className="dd-pkg-price">{pkg.price} <small>/person</small></div>
                    <Link
                      to="/book-trip"
                      state={{ destination: pkg.title, country: data.name, image: pkg.image, price: pkg.price }}
                      className="dd-pkg-btn"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="dd-cta-banner">
        <div className="dd-cta-inner">
          <h2>Ready to Explore {dest.name}?</h2>
          <p>Let our travel experts plan your perfect trip — flights, hotels, tours, and transfers all in one package.</p>
          <Link to="/book-trip" state={{ destination: dest.name, country: data.name, image: dest.image, price: '' }}>
            Start Planning Now ✈️
          </Link>
        </div>
      </div>
    </div>
  );
}
