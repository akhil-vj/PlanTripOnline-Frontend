import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function DayTours() {
  const data = useOutletContext();
  const tours = data.dayTours || [];

  return (
    <div className="daytours-page">
      <Helmet>
        <title>{data.name} Day Tours - PlantripOnline</title>
      </Helmet>

      <style>{`
        .daytours-page {
          background: #fafaf9;
          min-height: 100vh;
        }

        .daytours-page .dt-hero {
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

        .daytours-page .dt-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.45);
          transform: scale(1.05);
        }

        .daytours-page .dt-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
          animation: dtFadeUp 0.8s ease;
        }

        @keyframes dtFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .daytours-page .dt-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .daytours-page .dt-hero-content h1 span { color: #fb923c; }

        .daytours-page .dt-hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .daytours-page .dt-filter-bar {
          max-width: 1280px;
          margin: -30px auto 0;
          padding: 0 1.5rem;
          position: relative;
          z-index: 3;
        }

        .daytours-page .dt-filter-inner {
          background: white;
          border-radius: 16px;
          padding: 20px 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .daytours-page .dt-filter-count {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }

        .daytours-page .dt-filter-count strong {
          color: #1e293b;
          font-weight: 800;
          font-size: 1.3rem;
        }

        .daytours-page .dt-filter-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .daytours-page .dt-filter-tag {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: default;
        }

        .daytours-page .dt-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 1.5rem 60px;
        }

        .daytours-page .dt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 25px;
        }

        .daytours-page .dt-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .daytours-page .dt-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.1);
        }

        .daytours-page .dt-card-img {
          position: relative;
          height: 230px;
          overflow: hidden;
        }

        .daytours-page .dt-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .daytours-page .dt-card:hover .dt-card-img img {
          transform: scale(1.08);
        }

        .daytours-page .dt-card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #ff9500, #ea580c);
          color: white;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(234,88,12,0.3);
        }

        .daytours-page .dt-card-duration {
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

        .daytours-page .dt-card-rating {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: rgba(0,0,0,0.7);
          color: #fbbf24;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(6px);
        }

        .daytours-page .dt-card-body {
          padding: 25px;
        }

        .daytours-page .dt-card-location {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .daytours-page .dt-card-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .daytours-page .dt-card-desc {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .daytours-page .dt-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .daytours-page .dt-card-features span {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .daytours-page .dt-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
        }

        .daytours-page .dt-card-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
        }

        .daytours-page .dt-card-price small {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 400;
        }

        .daytours-page .dt-book-btn {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          padding: 10px 24px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(249,115,22,0.25);
          transition: all 0.3s;
        }

        .daytours-page .dt-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249,115,22,0.35);
        }

        .daytours-page .dt-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .daytours-page .dt-empty h3 { font-size: 1.8rem; color: #1e293b; margin-bottom: 10px; }
        .daytours-page .dt-empty p { color: #64748b; margin-bottom: 25px; font-size: 1.1rem; }
        .daytours-page .dt-empty a {
          display: inline-block;
          background: linear-gradient(to right, #f97316, #fb923c);
          color: white; padding: 14px 30px; border-radius: 50px;
          text-decoration: none; font-weight: 700;
          box-shadow: 0 8px 20px rgba(249,115,22,0.3);
        }

        @media (max-width: 900px) {
          .daytours-page .dt-hero-content h1 { font-size: 2.2rem; }
          .daytours-page .dt-grid { grid-template-columns: 1fr; }
          .daytours-page .dt-filter-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Hero */}
      <div className="dt-hero">
        <div className="dt-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="dt-hero-content">
          <h1><span>{data.name}</span> Day Tours</h1>
          <p>Handpicked local experiences — from temple visits and street food walks to island adventures and jungle treks.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dt-filter-bar">
        <div className="dt-filter-inner">
          <div className="dt-filter-count">
            <strong>{tours.length}</strong> tours available
          </div>
          <div className="dt-filter-tags">
            {[...new Set(tours.map(t => t.location))].map((loc, i) => (
              <span key={i} className="dt-filter-tag">📍 {loc}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="dt-grid-section">
        {tours.length > 0 ? (
          <div className="dt-grid">
            {tours.map(tour => (
              <div key={tour.id} className="dt-card">
                <div className="dt-card-img">
                  <img src={tour.image} alt={tour.title} />
                  {tour.badge && <span className="dt-card-badge">{tour.badge}</span>}
                  <span className="dt-card-duration">{tour.duration}</span>
                  {tour.rating && <span className="dt-card-rating">★ {tour.rating} ({tour.reviews})</span>}
                </div>
                <div className="dt-card-body">
                  <div className="dt-card-location">📍 {tour.location}</div>
                  <h3>{tour.title}</h3>
                  <p className="dt-card-desc">{tour.description}</p>
                  <div className="dt-card-features">
                    {tour.features?.map((f, i) => <span key={i}>{f}</span>)}
                  </div>
                  <div className="dt-card-footer">
                    <div className="dt-card-price">{tour.price} <small>/person</small></div>
                    <Link to="/enquiry" className="dt-book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dt-empty">
            <h3>Day Tours Coming Soon!</h3>
            <p>We are curating the best local experiences in {data.name}.</p>
            <Link to="/enquiry">Enquire Custom Tour</Link>
          </div>
        )}
      </div>
    </div>
  );
}
