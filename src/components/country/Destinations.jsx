import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Destinations() {
  const data = useOutletContext();
  const destinations = data.destinations || [];

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
          padding: 60px 1.5rem;
        }

        .destinations-page .dest-grid {
          display: grid;
          gap: 30px;
        }

        .destinations-page .dest-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          min-height: 320px;
        }

        .destinations-page .dest-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }

        .destinations-page .dest-card:nth-child(even) {
          direction: rtl;
        }

        .destinations-page .dest-card:nth-child(even) > * {
          direction: ltr;
        }

        .destinations-page .dest-card-img {
          position: relative;
          overflow: hidden;
        }

        .destinations-page .dest-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .destinations-page .dest-card:hover .dest-card-img img {
          transform: scale(1.08);
        }

        .destinations-page .dest-card-img .dest-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #ff9500;
          color: white;
          padding: 6px 14px;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(255,149,0,0.3);
        }

        .destinations-page .dest-card-img .dest-rating {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(0,0,0,0.7);
          color: #fbbf24;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          backdrop-filter: blur(6px);
        }

        .destinations-page .dest-card-body {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .destinations-page .dest-card-body h3 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .destinations-page .dest-card-locations {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .destinations-page .dest-card-body p {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 20px;
          font-size: 1rem;
        }

        .destinations-page .dest-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 25px;
        }

        .destinations-page .dest-highlight-tag {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .destinations-page .dest-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1e293b;
          color: white;
          padding: 12px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
          align-self: flex-start;
        }

        .destinations-page .dest-explore-btn:hover {
          background: #ff9500;
          transform: translateX(4px);
          box-shadow: 0 6px 15px rgba(255,149,0,0.3);
        }

        .destinations-page .dest-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .destinations-page .dest-empty h3 {
          font-size: 1.8rem;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .destinations-page .dest-empty p {
          color: #64748b;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .destinations-page .dest-empty a {
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
          .destinations-page .dest-card {
            grid-template-columns: 1fr;
          }

          .destinations-page .dest-card:nth-child(even) {
            direction: ltr;
          }

          .destinations-page .dest-card-img {
            height: 250px;
          }

          .destinations-page .dest-hero-content h1 {
            font-size: 2.2rem;
          }

          .destinations-page .dest-stats {
            gap: 25px;
          }

          .destinations-page .dest-card-body {
            padding: 25px;
          }

          .destinations-page .dest-card-body h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="dest-hero">
        <div className="dest-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="dest-hero-content">
          <h1>Explore <span>{data.name}</span></h1>
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
                  <img src={dest.image} alt={dest.name} />
                  {dest.badge && <span className="dest-badge">{dest.badge}</span>}
                  {dest.rating && <span className="dest-rating">★ {dest.rating}</span>}
                </div>
                <div className="dest-card-body">
                  <h3>{dest.name}</h3>
                  <div className="dest-card-locations">📍 {dest.locations}</div>
                  <p>{dest.description}</p>
                  <div className="dest-highlights">
                    {dest.highlights?.map((h, i) => (
                      <span key={i} className="dest-highlight-tag">{h}</span>
                    ))}
                  </div>
                  <Link to="/enquiry" className="dest-explore-btn">
                    Plan a Trip ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dest-empty">
            <h3>Destinations Coming Soon!</h3>
            <p>We're mapping out the best places to visit in {data.name}.</p>
            <Link to="/enquiry">Talk to an Expert</Link>
          </div>
        )}
      </div>
    </div>
  );
}
