import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Hotels() {
  const data = useOutletContext();
  const hotels = data.hotels || [];

  const categories = ['all', ...new Set(hotels.map(h => h.category).filter(Boolean))];

  return (
    <div className="hotels-page">
      <Helmet>
        <title>{data.name} Hotels & Resorts - PlantripOnline</title>
      </Helmet>

      <style>{`
        .hotels-page {
          background: #fafaf9;
          min-height: 100vh;
        }

        .hotels-page .ht-hero {
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

        .hotels-page .ht-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4);
          transform: scale(1.05);
        }

        .hotels-page .ht-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
          animation: htFadeUp 0.8s ease;
        }

        @keyframes htFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hotels-page .ht-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .hotels-page .ht-hero-content h1 span { color: #fb923c; }

        .hotels-page .ht-hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hotels-page .ht-categories {
          max-width: 1280px;
          margin: -30px auto 0;
          padding: 0 1.5rem;
          position: relative;
          z-index: 3;
        }

        .hotels-page .ht-categories-inner {
          background: white;
          border-radius: 16px;
          padding: 18px 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .hotels-page .ht-cat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
          margin-right: 5px;
        }

        .hotels-page .ht-cat-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
          cursor: default;
        }

        .hotels-page .ht-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 1.5rem 60px;
        }

        .hotels-page .ht-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 25px;
        }

        .hotels-page .ht-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .hotels-page .ht-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.1);
        }

        .hotels-page .ht-card-img {
          position: relative;
          height: 230px;
          overflow: hidden;
        }

        .hotels-page .ht-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .hotels-page .ht-card:hover .ht-card-img img {
          transform: scale(1.08);
        }

        .hotels-page .ht-card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #0284c7, #0ea5e9);
          color: white;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(2,132,199,0.3);
        }

        .hotels-page .ht-card-stars {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(0,0,0,0.7);
          color: #fbbf24;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          backdrop-filter: blur(6px);
          letter-spacing: 2px;
        }

        .hotels-page .ht-card-rating {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(6px);
        }

        .hotels-page .ht-card-body {
          padding: 25px;
        }

        .hotels-page .ht-card-location {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .hotels-page .ht-card-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
        }

        .hotels-page .ht-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .hotels-page .ht-amenity {
          background: #f0f9ff;
          color: #0369a1;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          border: 1px solid #bae6fd;
        }

        .hotels-page .ht-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
        }

        .hotels-page .ht-price-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hotels-page .ht-card-price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
        }

        .hotels-page .ht-card-price small {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 400;
        }

        .hotels-page .ht-book-btn {
          background: #1e293b;
          color: white;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .hotels-page .ht-book-btn:hover {
          background: #ff9500;
        }

        .hotels-page .ht-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .hotels-page .ht-empty h3 { font-size: 1.8rem; color: #1e293b; margin-bottom: 10px; }
        .hotels-page .ht-empty p { color: #64748b; margin-bottom: 25px; font-size: 1.1rem; }
        .hotels-page .ht-empty a {
          display: inline-block;
          background: linear-gradient(to right, #f97316, #fb923c);
          color: white; padding: 14px 30px; border-radius: 50px;
          text-decoration: none; font-weight: 700;
          box-shadow: 0 8px 20px rgba(249,115,22,0.3);
        }

        @media (max-width: 900px) {
          .hotels-page .ht-hero-content h1 { font-size: 2.2rem; }
          .hotels-page .ht-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="ht-hero">
        <div className="ht-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="ht-hero-content">
          <h1><span>{data.name}</span> Hotels & Resorts</h1>
          <p>From 5-star luxury resorts to charming boutique stays — find the perfect accommodation for your trip.</p>
        </div>
      </div>

      {/* Category Bar */}
      <div className="ht-categories">
        <div className="ht-categories-inner">
          <span className="ht-cat-label">Categories:</span>
          {categories.filter(c => c !== 'all').map((cat, i) => (
            <span key={i} className="ht-cat-tag">{cat}</span>
          ))}
          <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            <strong style={{ color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>{hotels.length}</strong> properties
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="ht-grid-section">
        {hotels.length > 0 ? (
          <div className="ht-grid">
            {hotels.map(hotel => (
              <div key={hotel.id} className="ht-card">
                <div className="ht-card-img">
                  <img src={hotel.image} alt={hotel.title} />
                  {hotel.badge && <span className="ht-card-badge">{hotel.badge}</span>}
                  <span className="ht-card-stars">{Array(Number(hotel.stars) || 0).fill('★').join('')}</span>
                  {hotel.rating && <span className="ht-card-rating">★ {hotel.rating} · {hotel.reviews}</span>}
                </div>
                <div className="ht-card-body">
                  <div className="ht-card-location">📍 {hotel.location}</div>
                  <h3>{hotel.title}</h3>
                  <div className="ht-amenities">
                    {hotel.amenities?.map((a, i) => (
                      <span key={i} className="ht-amenity">{a}</span>
                    ))}
                  </div>
                  <div className="ht-card-footer">
                    <div>
                      <div className="ht-price-label">Starting from</div>
                      <div className="ht-card-price">{hotel.price} <small>/night</small></div>
                    </div>
                    <Link to="/enquiry" className="ht-book-btn">Enquire</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ht-empty">
            <h3>Hotels Coming Soon!</h3>
            <p>We are curating the best stays in {data.name}.</p>
            <Link to="/enquiry">Enquire Accommodation</Link>
          </div>
        )}
      </div>
    </div>
  );
}
