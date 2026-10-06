import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Transfers() {
  const data = useOutletContext();
  const transfers = data.transfers || [];

  return (
    <div className="transfers-page">
      <Helmet>
        <title>{data.name} Transfers & Transport - PlantripOnline</title>
      </Helmet>

      <style>{`
        .transfers-page {
          background: #fafaf9;
          min-height: 100vh;
        }

        .transfers-page .tf-hero {
          position: relative;
          height: 45vh;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .transfers-page .tf-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4);
          transform: scale(1.05);
        }

        .transfers-page .tf-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 0 20px;
          animation: tfFadeUp 0.8s ease;
        }

        @keyframes tfFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .transfers-page .tf-hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .transfers-page .tf-hero-content h1 span { color: #fb923c; }

        .transfers-page .tf-hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .transfers-page .tf-benefits {
          max-width: 1280px;
          margin: -35px auto 0;
          padding: 0 1.5rem;
          position: relative;
          z-index: 3;
        }

        .transfers-page .tf-benefits-inner {
          background: white;
          border-radius: 16px;
          padding: 25px 35px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .transfers-page .tf-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .transfers-page .tf-benefit-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .transfers-page .tf-benefit-text {
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
          line-height: 1.3;
        }

        .transfers-page .tf-benefit-text small {
          display: block;
          font-weight: 400;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .transfers-page .tf-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 50px 1.5rem 60px;
        }

        .transfers-page .tf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 25px;
        }

        .transfers-page .tf-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .transfers-page .tf-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.1);
        }

        .transfers-page .tf-card-img {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .transfers-page .tf-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .transfers-page .tf-card:hover .tf-card-img img {
          transform: scale(1.06);
        }

        .transfers-page .tf-card-body {
          padding: 25px;
        }

        .transfers-page .tf-card-body h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
        }

        .transfers-page .tf-route-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 15px;
          position: relative;
        }

        .transfers-page .tf-route-point {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: #334155;
          font-weight: 500;
        }

        .transfers-page .tf-route-point + .tf-route-point {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }

        .transfers-page .tf-route-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .transfers-page .tf-route-dot.from { background: #22c55e; box-shadow: 0 0 0 4px #dcfce7; }
        .transfers-page .tf-route-dot.to { background: #ef4444; box-shadow: 0 0 0 4px #fee2e2; }

        .transfers-page .tf-card-desc {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .transfers-page .tf-card-meta {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .transfers-page .tf-vehicles {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
        }

        .transfers-page .tf-vehicle-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .transfers-page .tf-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
        }

        .transfers-page .tf-card-price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
        }

        .transfers-page .tf-book-btn {
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

        .transfers-page .tf-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249,115,22,0.35);
        }

        .transfers-page .tf-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .transfers-page .tf-empty h3 { font-size: 1.8rem; color: #1e293b; margin-bottom: 10px; }
        .transfers-page .tf-empty p { color: #64748b; margin-bottom: 25px; font-size: 1.1rem; }
        .transfers-page .tf-empty a {
          display: inline-block;
          background: linear-gradient(to right, #f97316, #fb923c);
          color: white; padding: 14px 30px; border-radius: 50px;
          text-decoration: none; font-weight: 700;
          box-shadow: 0 8px 20px rgba(249,115,22,0.3);
        }

        @media (max-width: 900px) {
          .transfers-page .tf-hero-content h1 { font-size: 2.2rem; }
          .transfers-page .tf-grid { grid-template-columns: 1fr; }
          .transfers-page .tf-benefits-inner { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 550px) {
          .transfers-page .tf-benefits-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="tf-hero">
        <div className="tf-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="tf-hero-content">
          <h1><span>{data.name}</span> Transfers</h1>
          <p>Reliable private airport transfers and intercity transport with professional drivers.</p>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="tf-benefits">
        <div className="tf-benefits-inner">
          <div className="tf-benefit">
            <div className="tf-benefit-icon">🚗</div>
            <div className="tf-benefit-text">Private Vehicles<small>No sharing</small></div>
          </div>
          <div className="tf-benefit">
            <div className="tf-benefit-icon">👤</div>
            <div className="tf-benefit-text">Meet & Greet<small>Driver waits at arrivals</small></div>
          </div>
          <div className="tf-benefit">
            <div className="tf-benefit-icon">⏰</div>
            <div className="tf-benefit-text">24/7 Service<small>Any time, any day</small></div>
          </div>
          <div className="tf-benefit">
            <div className="tf-benefit-icon">💳</div>
            <div className="tf-benefit-text">Fixed Pricing<small>No hidden charges</small></div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="tf-grid-section">
        {transfers.length > 0 ? (
          <div className="tf-grid">
            {transfers.map(transfer => (
              <div key={transfer.id} className="tf-card">
                <div className="tf-card-img">
                  <img src={transfer.image} alt={transfer.title} />
                </div>
                <div className="tf-card-body">
                  <h3>{transfer.title}</h3>
                  <div className="tf-route-box">
                    <div className="tf-route-point">
                      <span className="tf-route-dot from"></span>
                      {transfer.from}
                    </div>
                    <div className="tf-route-point">
                      <span className="tf-route-dot to"></span>
                      {transfer.to}
                    </div>
                  </div>
                  <p className="tf-card-desc">{transfer.description}</p>
                  <div className="tf-card-meta">
                    <span>⏱ {transfer.duration}</span>
                  </div>
                  <div className="tf-vehicles">
                    {transfer.vehicles?.map((v, i) => (
                      <span key={i} className="tf-vehicle-tag">🚗 {v}</span>
                    ))}
                  </div>
                  <div className="tf-card-footer">
                    <div className="tf-card-price">{transfer.price}</div>
                    <Link to="/enquiry" className="tf-book-btn">Book Transfer</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tf-empty">
            <h3>Transfers Coming Soon!</h3>
            <p>We are arranging the most reliable transport options for {data.name}.</p>
            <Link to="/enquiry">Request a Transfer</Link>
          </div>
        )}
      </div>
    </div>
  );
}
