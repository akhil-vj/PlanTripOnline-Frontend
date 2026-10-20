import { useOutletContext, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Destinations() {
  const data = useOutletContext();
  const destinations = data.destinations || [];
  const navigate = useNavigate();

  return (
    <div className="destinations-page">
      <Helmet>
        <title>{data.name} Destinations - PlantripOnline</title>
      </Helmet>

      <style>{`
        .destinations-page {
          background: #fafaf9;
          min-height: 100vh;
        }

        .destinations-page .dest-hero {
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

        .destinations-page .dest-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.5);
          transform: scale(1.05);
        }

        .destinations-page .dest-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
          animation: destFadeUp 0.8s ease;
        }

        @keyframes destFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .destinations-page .dest-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .destinations-page .dest-hero-content h1 span {
          color: #fb923c;
        }

        .destinations-page .dest-hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .destinations-page .dest-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 30px;
        }

        .destinations-page .dest-stat {
          text-align: center;
        }

        .destinations-page .dest-stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #fb923c;
          display: block;
        }

        .destinations-page .dest-stat-label {
          font-size: 0.85rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .destinations-page .dest-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 1.5rem;
        }

        .destinations-page .dest-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .destinations-page .dest-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          transition: transform 0.25s, box-shadow 0.25s;
          display: flex;
          flex-direction: column;
        }

        .destinations-page .dest-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.13);
        }

        .destinations-page .dest-card-img {
          position: relative;
          overflow: hidden;
          height: 180px;
          flex-shrink: 0;
        }

        .destinations-page .dest-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .destinations-page .dest-card:hover .dest-card-img img {
          transform: scale(1.07);
        }

        .destinations-page .dest-card-img .dest-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ff9500;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          box-shadow: 0 2px 8px rgba(255,149,0,0.3);
        }

        .destinations-page .dest-card-img .dest-rating {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.65);
          color: #fbbf24;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .destinations-page .dest-card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .destinations-page .dest-card-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .destinations-page .dest-card-locations {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .destinations-page .dest-card-body p {
          color: #64748b;
          line-height: 1.55;
          margin-bottom: 12px;
          font-size: 0.83rem;
          flex: 1;
        }

        .destinations-page .dest-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
        }

        .destinations-page .dest-highlight-tag {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 3px 9px;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 500;
        }

        .destinations-page .dest-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1e293b;
          color: white;
          padding: 9px 18px;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all 0.25s;
          align-self: flex-start;
        }

        .destinations-page .dest-explore-btn:hover {
          background: #ff9500;
          transform: translateX(3px);
          box-shadow: 0 4px 12px rgba(255,149,0,0.3);
        }

        .destinations-page .dest-empty {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          grid-column: 1 / -1;
        }

        .destinations-page .dest-empty h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .destinations-page .dest-empty p {
          color: #64748b;
          margin-bottom: 20px;
          font-size: 1rem;
        }

        @media (max-width: 1024px) {
          .destinations-page .dest-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .destinations-page .dest-grid {
            grid-template-columns: 1fr;
          }

          .destinations-page .dest-hero-content h1 {
            font-size: 2rem;
          }

          .destinations-page .dest-stats {
            gap: 20px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="dest-hero">
        <div className="dest-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="dest-hero-content">
          <h1>{data.heroTitle || `Explore ${data.name}`}</h1>
          <p>Discover the most captivating destinations, from bustling cities to serene islands and ancient temples.</p>
          <div className="dest-stats">
            <div className="dest-stat">
              <span className="dest-stat-number">{destinations.length}</span>
              <span className="dest-stat-label">Destinations</span>
            </div>
            <div className="dest-stat">
              <span className="dest-stat-number">{data.dayTours?.length || 0}+</span>
              <span className="dest-stat-label">Day Tours</span>
            </div>
            <div className="dest-stat">
              <span className="dest-stat-number">{data.hotels?.length || 0}+</span>
              <span className="dest-stat-label">Hotels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="dest-grid-section">
        {destinations.length > 0 ? (
          <div className="dest-grid">
            {destinations.map(dest => (
              <div key={dest.id} className="dest-card">
                <div className="dest-card-img">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  {dest.badge && <span className="dest-badge">{dest.badge}</span>}
                  {dest.rating && <span className="dest-rating">★ {dest.rating}</span>}
                </div>
                <div className="dest-card-body">
                  <h3>{dest.name}</h3>
                  <div className="dest-card-locations">📍 {dest.locations}</div>
                  <p>{dest.description}</p>
                  <div className="dest-highlights">
                    {dest.highlights?.slice(0, 3).map((h, i) => (
                      <span key={i} className="dest-highlight-tag">{h}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/destination-tours', { state: { destination: dest.name, country: data.name, countrySlug: data.slug, image: dest.image } })}
                    className="dest-explore-btn">
                    Plan a Trip ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dest-empty">
            <h3>Destinations Coming Soon!</h3>
            <p>We're mapping out the best places to visit in {data.name}.</p>
            <button onClick={() => navigate('/plan-trip', { state: { destination: data.name, country: data.name } })} style={{ display: 'inline-block', background: 'linear-gradient(to right, #f97316, #fb923c)', color: 'white', padding: '14px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 8px 20px rgba(249,115,22,0.3)' }}>Talk to an Expert</button>
          </div>
        )}
      </div>
    </div>
  );
}
