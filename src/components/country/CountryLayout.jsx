import { Outlet, useParams, Navigate } from 'react-router-dom';
import useCountryData from '../../hooks/useCountryData';

// Known app routes that must NEVER be treated as country slugs
const APP_ROUTES = new Set([
  'admin-dashboard', 'user-dashboard', 'login', 'signup', 'logout',
  'enquiry', 'plan-trip', 'destination-tours', 'book-trip',
  'forgot-password', 'about', 'contact', 'faq', 'privacy', 'terms',
  'cookies', 'not-found', 'undefined', 'null',
]);

export default function CountryLayout() {
  const { country } = useParams();

  // Hard guard — redirect app routes that leaked into /:country
  if (!country || APP_ROUTES.has(country)) {
    return <Navigate to="/" replace />;
  }

  return <CountryLoader slug={country} />;
}

function CountryLoader({ slug }) {
  const { data, loading, error } = useCountryData(slug);

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16,
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #f1f5f9', borderTopColor: '#f97316',
          animation: 'spin .8s linear infinite',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ color: '#94a3b8', fontSize: '.9rem', fontWeight: 500 }}>
          Loading destination…
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        minHeight: '50vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 12,
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>
        <div style={{ fontSize: '3rem' }}>🌍</div>
        <h2 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
          {error || 'Country not found'}
        </h2>
        <p style={{ color: '#64748b', margin: 0 }}>
          The destination "<strong>{slug}</strong>" is not available yet.
        </p>
        <button onClick={() => window.history.back()} style={{
          marginTop: 8, padding: '10px 24px', background: '#f97316',
          color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700,
          cursor: 'pointer', fontSize: '.9rem',
        }}>← Go Back</button>
      </div>
    );
  }

  return (
    <div className="country-layout">
      <Outlet context={data} />
    </div>
  );
}
