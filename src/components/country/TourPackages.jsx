import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function TourPackages() {
  const data = useOutletContext();
  const packages = data.tourPackages || [];
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

  return (
    <div className="packages-page">
      <Helmet>
        <title>{data.name} Tour Packages - PlantripOnline</title>
      </Helmet>

      <style>{`
        .packages-page {
          background: #fafaf9;
          min-height: 100vh;
        }

        .packages-page .pkg-hero {
          position: relative;
          height: 50vh;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .packages-page .pkg-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.45);
          transform: scale(1.05);
        }

        .packages-page .pkg-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
          animation: pkgFadeUp 0.8s ease;
        }

        @keyframes pkgFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .packages-page .pkg-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .packages-page .pkg-hero-content h1 span {
          color: #fb923c;
        }

        .packages-page .pkg-hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .packages-page .pkg-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 1.5rem;
        }

        /* Featured Package — first card is big */
        .packages-page .pkg-featured {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          margin-bottom: 40px;
          transition: transform 0.3s, box-shadow 0.3s;
          min-height: 400px;
        }

        .packages-page .pkg-featured:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 50px rgba(0,0,0,0.12);
        }

        .packages-page .pkg-featured-img {
          position: relative;
          overflow: hidden;
        }

        .packages-page .pkg-featured-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .packages-page .pkg-featured:hover .pkg-featured-img img {
          transform: scale(1.06);
        }

        .packages-page .pkg-featured-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 8px 18px;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(220,38,38,0.35);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .packages-page .pkg-featured-body {
          padding: 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .packages-page .pkg-featured-duration {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff7ed;
          color: #ea580c;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 15px;
          align-self: flex-start;
        }

        .packages-page .pkg-featured-body h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .packages-page .pkg-featured-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .packages-page .pkg-includes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 25px;
        }

        .packages-page .pkg-include-tag {
          background: #f1f5f9;
          color: #334155;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .packages-page .pkg-featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
          margin-top: auto;
        }

        .packages-page .pkg-price-label {
          font-size: 0.8rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .packages-page .pkg-price {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
        }

        .packages-page .pkg-price small {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 400;
        }

        .packages-page .pkg-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 6px 15px rgba(249,115,22,0.3);
          transition: all 0.3s;
        }

        .packages-page .pkg-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(249,115,22,0.4);
        }

        /* Regular package grid */
        .packages-page .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 25px;
        }

        .packages-page .pkg-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .packages-page .pkg-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.1);
        }

        .packages-page .pkg-card-img {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .packages-page .pkg-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .packages-page .pkg-card:hover .pkg-card-img img {
          transform: scale(1.08);
        }

        .packages-page .pkg-card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .packages-page .pkg-card-duration {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(6px);
        }

        .packages-page .pkg-card-body {
          padding: 25px;
        }

        .packages-page .pkg-card-body h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .packages-page .pkg-card-subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .packages-page .pkg-card-includes {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .packages-page .pkg-card-includes span {
          background: #f8fafc;
          color: #475569;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
        }

        .packages-page .pkg-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 15px;
        }

        .packages-page .pkg-card-price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
        }

        .packages-page .pkg-card-btn {
          background: #1e293b;
          color: white;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .packages-page .pkg-card-btn:hover {
          background: #ff9500;
        }

        .packages-page .pkg-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .packages-page .pkg-empty h3 {
          font-size: 1.8rem;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .packages-page .pkg-empty p {
          color: #64748b;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .packages-page .pkg-empty a {
          display: inline-block;
          background: linear-gradient(to right, #f97316, #fb923c);
          color: white;
          padding: 14px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(249,115,22,0.3);
        }

        @media (max-width: 900px) {
          .packages-page .pkg-featured {
            grid-template-columns: 1fr;
          }

          .packages-page .pkg-featured-img {
            height: 250px;
          }

          .packages-page .pkg-featured-body {
            padding: 25px;
          }

          .packages-page .pkg-featured-body h2 {
            font-size: 1.5rem;
          }

          .packages-page .pkg-hero-content h1 {
            font-size: 2.2rem;
          }

          .packages-page .pkg-grid {
            grid-template-columns: 1fr;
          }

          .packages-page .pkg-featured-footer {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="pkg-hero">
        <div className="pkg-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="pkg-hero-content">
          <h1><span>{data.name}</span> Tour Packages</h1>
          <p>Perfectly curated multi-day itineraries with hotels, flights, meals, and guided experiences included.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: 1280, margin: '-30px auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 3 }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '16px 24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          border: '1.5px solid transparent',
          transition: 'border-color 0.2s',
        }}
          onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
          onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
        >
          <span style={{ fontSize: '1.2rem', color: '#94a3b8', flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            placeholder="Search packages by name, duration, inclusions…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#1e293b',
              fontWeight: 500,
              background: 'transparent',
            }}
          />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            <strong style={{ color: '#1e293b' }}>{filteredPackages.length}</strong> package{filteredPackages.length !== 1 ? 's' : ''}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', padding: '5px 12px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      <div className="pkg-grid-section">
        {filteredPackages.length > 0 ? (
          <>
            {/* Featured — first package */}
            <div className="pkg-featured">
              <div className="pkg-featured-img">
                <img src={packages[0].image} alt={packages[0].title} />
                {packages[0].badge && <span className="pkg-featured-badge">{packages[0].badge}</span>}
              </div>
              <div className="pkg-featured-body">
                <span className="pkg-featured-duration">⏱ {filteredPackages[0].duration}</span>
                <h2>{filteredPackages[0].title}</h2>
                <p className="pkg-featured-subtitle">{filteredPackages[0].subtitle}</p>
                <div className="pkg-includes">
                  {filteredPackages[0].includes?.map((inc, i) => (
                    <span key={i} className="pkg-include-tag">{inc}</span>
                  ))}
                </div>
                <div className="pkg-featured-footer">
                  <div>
                    <div className="pkg-price-label">Starting from</div>
                    <div className="pkg-price">{filteredPackages[0].price} <small>/person</small></div>
                  </div>
                  <Link to="/book-trip" state={{ destination: filteredPackages[0].title, country: data.name, image: filteredPackages[0].image, price: filteredPackages[0].price }} className="pkg-cta-btn">Book This Package ➔</Link>
                </div>
              </div>
            </div>

            {/* Rest of packages */}
            {filteredPackages.length > 1 && (
              <div className="pkg-grid">
                {filteredPackages.slice(1).map(pkg => (
                  <div key={pkg.id} className="pkg-card">
                    <div className="pkg-card-img">
                      <img src={pkg.image} alt={pkg.title} />
                      {pkg.badge && <span className="pkg-card-badge">{pkg.badge}</span>}
                      <span className="pkg-card-duration">⏱ {pkg.duration}</span>
                    </div>
                    <div className="pkg-card-body">
                      <h3>{pkg.title}</h3>
                      <p className="pkg-card-subtitle">{pkg.subtitle}</p>
                      <div className="pkg-card-includes">
                        {pkg.includes?.map((inc, i) => (
                          <span key={i}>{inc}</span>
                        ))}
                      </div>
                      <div className="pkg-card-footer">
                        <div className="pkg-card-price">{pkg.price}</div>
                        <Link to="/book-trip" state={{ destination: pkg.title, country: data.name, image: pkg.image, price: pkg.price }} className="pkg-card-btn">Book Now</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="pkg-empty">
            {searchQuery ? (
              <>
                <h3>No packages matching "{searchQuery}"</h3>
                <p>Try a different keyword or browse all packages.</p>
                <button onClick={() => setSearchQuery('')} style={{ display: 'inline-block', background: 'linear-gradient(to right,#f97316,#fb923c)', color: 'white', padding: '14px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Clear Search</button>
              </>
            ) : (
              <>
                <h3>Tour Packages Coming Soon!</h3>
                <p>We are crafting the ultimate multi-day packages for {data.name}.</p>
                <Link to="/enquiry">Enquire Custom Package</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
