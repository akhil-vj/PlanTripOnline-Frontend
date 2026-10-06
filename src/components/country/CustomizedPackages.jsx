import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CustomizedPackages() {
  const data = useOutletContext();

  return (
    <div className="customize-page">
      <Helmet>
        <title>Customize Your Trip to {data.name} - PlantripOnline</title>
      </Helmet>

      <style>{`
        .customize-page {
          background: #0f172a;
          min-height: 100vh;
          color: white;
          overflow: hidden;
        }

        .customize-page .cz-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .customize-page .cz-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.15;
        }

        .customize-page .cz-hero-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(14,165,233,0.1) 0%, transparent 60%);
        }

        .customize-page .cz-content {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 1.5rem;
          text-align: center;
          animation: czFadeUp 1s ease;
        }

        @keyframes czFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .customize-page .cz-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(249,115,22,0.15);
          border: 1px solid rgba(249,115,22,0.3);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fb923c;
          margin-bottom: 30px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .customize-page .cz-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -2px;
        }

        .customize-page .cz-title span {
          background: linear-gradient(135deg, #f97316, #fb923c, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .customize-page .cz-subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto 50px;
        }

        .customize-page .cz-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 50px;
          text-align: left;
        }

        .customize-page .cz-feature {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 30px;
          transition: all 0.3s;
        }

        .customize-page .cz-feature:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(249,115,22,0.3);
          transform: translateY(-4px);
        }

        .customize-page .cz-feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.1));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 18px;
        }

        .customize-page .cz-feature h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }

        .customize-page .cz-feature p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .customize-page .cz-steps {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .customize-page .cz-step {
          text-align: center;
          max-width: 160px;
        }

        .customize-page .cz-step-num {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0 auto 12px;
          box-shadow: 0 6px 20px rgba(249,115,22,0.3);
        }

        .customize-page .cz-step h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
        }

        .customize-page .cz-step p {
          font-size: 0.85rem;
          color: #64748b;
        }

        .customize-page .cz-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          padding: 18px 40px;
          border-radius: 60px;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.15rem;
          box-shadow: 0 10px 30px rgba(249,115,22,0.35);
          transition: all 0.3s;
          letter-spacing: 0.3px;
        }

        .customize-page .cz-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 16px 40px rgba(249,115,22,0.45);
        }

        @media (max-width: 900px) {
          .customize-page .cz-title { font-size: 2.5rem; }
          .customize-page .cz-features { grid-template-columns: 1fr; }
          .customize-page .cz-steps { gap: 30px; }
        }
      `}</style>

      <div className="cz-hero">
        <div className="cz-hero-bg" style={{ backgroundImage: `url(${data.heroImage})` }}></div>
        <div className="cz-hero-gradient"></div>

        <div className="cz-content">
          <div className="cz-eyebrow">✨ Tailor-Made Experiences</div>

          <h1 className="cz-title">
            Your Dream<br/><span>{data.name} Trip</span>
          </h1>

          <p className="cz-subtitle">
            Don't settle for a fixed package. Our travel experts will design a fully personalized itinerary tailored to your interests, budget, and travel style.
          </p>

          <div className="cz-features">
            <div className="cz-feature">
              <div className="cz-feature-icon">🎯</div>
              <h3>100% Personalized</h3>
              <p>Every detail crafted around what you want to see, eat, and experience.</p>
            </div>
            <div className="cz-feature">
              <div className="cz-feature-icon">🤝</div>
              <h3>Local Expertise</h3>
              <p>Insider tips and off-the-beaten-path locations that only locals know.</p>
            </div>
            <div className="cz-feature">
              <div className="cz-feature-icon">💰</div>
              <h3>Flexible Budget</h3>
              <p>From budget-friendly adventures to luxury escapes — you decide.</p>
            </div>
          </div>

          <div className="cz-steps">
            <div className="cz-step">
              <div className="cz-step-num">1</div>
              <h4>Share Your Vision</h4>
              <p>Tell us what you want</p>
            </div>
            <div className="cz-step">
              <div className="cz-step-num">2</div>
              <h4>We Plan It</h4>
              <p>Experts craft your trip</p>
            </div>
            <div className="cz-step">
              <div className="cz-step-num">3</div>
              <h4>You Enjoy</h4>
              <p>Travel worry-free</p>
            </div>
          </div>

          <Link to="/enquiry" className="cz-cta-btn">
            Start Planning Now ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
