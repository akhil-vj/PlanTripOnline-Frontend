import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCountryData } from '../data';

export default function DestinationToursPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, country, countrySlug, image } = location.state || {};

  const countryData = getCountryData(countrySlug);
  const allTours = countryData?.dayTours || [];

  // Filter tours by destination name (match location field)
  const destTours = allTours.filter(
    t => t.location?.toLowerCase() === destination?.toLowerCase()
  );

  // Fallback: show all tours if none match specifically
  const tours = destTours.length > 0 ? destTours : allTours;
  const isFiltered = destTours.length > 0;

  const handleBookTour = (tour) => {
    navigate('/plan-trip', {
      state: {
        destination: tour.title,
        country,
        image: tour.image,
        highlights: tour.features,
        description: tour.description,
        rating: tour.rating,
        badge: tour.badge,
        price: tour.price,
        duration: tour.duration,
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f8', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>{destination} Tours – {country} | PlantripOnline</title>
      </Helmet>

      {/* Top Nav */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb',
          fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6
        }}>← Back to Destinations</button>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{country}</span>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#1e293b', fontWeight: 700 }}>{destination}</span>
      </div>

      {/* Hero */}
      <div style={{
        position: 'relative', height: 260, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {image && (
          <img src={image} alt={destination} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover'
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 20px' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
            {country}
          </p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
            {destination}
          </h1>
          <p style={{ marginTop: 8, opacity: 0.85, fontSize: '1rem' }}>
            {isFiltered
              ? `${tours.length} tour${tours.length !== 1 ? 's' : ''} available in ${destination}`
              : `Explore all ${tours.length} tours in ${country}`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px' }}>

        {/* Section heading */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            {isFiltered ? `Tours in ${destination}` : `All ${country} Tours`}
          </h2>
          {!isFiltered && (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
              Showing all available tours — no tours specifically tagged to {destination} yet.
            </p>
          )}
        </div>

        {tours.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '60px 20px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
            <h3 style={{ color: '#1e293b', fontSize: '1.3rem', marginBottom: 8 }}>No Tours Yet</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>We're adding tours for {destination} soon. Contact us for a custom trip!</p>
            <button
              onClick={() => navigate('/enquiry')}
              style={{
                background: 'linear-gradient(135deg, #ff9500, #ea580c)',
                color: 'white', border: 'none', padding: '12px 28px',
                borderRadius: 30, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
              }}>
              Request a Custom Tour
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22
          }}>
            {tours.map(tour => (
              <div key={tour.id} style={{
                background: 'white', borderRadius: 14,
                overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                display: 'flex', flexDirection: 'column',
                cursor: 'default'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.07)';
                }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img
                    src={tour.image} alt={tour.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  {tour.badge && (
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      background: '#ff9500', color: 'white', padding: '4px 11px',
                      borderRadius: 20, fontWeight: 700, fontSize: '0.72rem',
                      boxShadow: '0 2px 8px rgba(255,149,0,0.35)'
                    }}>{tour.badge}</span>
                  )}
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(0,0,0,0.65)', color: '#fbbf24',
                    padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem',
                    fontWeight: 600, backdropFilter: 'blur(4px)'
                  }}>★ {tour.rating} <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>({tour.reviews})</span></div>
                  <div style={{
                    position: 'absolute', bottom: 12, left: 12,
                    background: 'rgba(0,0,0,0.55)', color: 'white',
                    padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem',
                    backdropFilter: 'blur(4px)'
                  }}>{tour.duration}</div>
                </div>

                {/* Body */}
                <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📍 {tour.location}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 8, lineHeight: 1.4 }}>
                    {tour.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                    {tour.description}
                  </p>

                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {tour.features?.map((f, i) => (
                      <span key={i} style={{
                        background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd',
                        padding: '3px 9px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 500
                      }}>{f}</span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>From</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>{tour.price}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}> / person</span>
                    </div>
                    <button
                      onClick={() => handleBookTour(tour)}
                      style={{
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white', border: 'none',
                        padding: '10px 22px', borderRadius: 25,
                        fontWeight: 700, fontSize: '0.87rem', cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                        transition: 'all 0.2s', whiteSpace: 'nowrap'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)';
                      }}>
                      Book This Tour →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom trip CTA */}
        <div style={{
          marginTop: 48, background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: 16, padding: '36px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
          flexWrap: 'wrap'
        }}>
          <div style={{ color: 'white' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>
              Can't find the right tour?
            </h3>
            <p style={{ opacity: 0.7, margin: 0, fontSize: '0.9rem' }}>
              Let our travel experts build a custom itinerary just for you.
            </p>
          </div>
          <button
            onClick={() => navigate('/enquiry')}
            style={{
              background: '#ff9500', color: 'white', border: 'none',
              padding: '13px 30px', borderRadius: 30, fontWeight: 700,
              fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(255,149,0,0.4)', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ea580c'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#ff9500'; }}>
            Request Custom Trip
          </button>
        </div>
      </div>
    </div>
  );
}
