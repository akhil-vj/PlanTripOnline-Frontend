import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Destinations() {
  const data = useOutletContext();
  const destinations = data.destinations || [];

  return (
    <div className="section">
      <Helmet>
        <title>{data.name} Destinations - PlantripOnline</title>
      </Helmet>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Explore {data.name}</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Discover the most beautiful regions, cities, and islands in {data.name}.
          </p>
        </div>

        {destinations.length > 0 ? (
          <div className="destinations-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {destinations.map(dest => (
              <div key={dest.id} className="destination-card" style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ position: 'relative', height: '250px' }}>
                  <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{dest.name}</h3>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>📍 {dest.locations}</div>
                  </div>
                  {dest.badge && (
                    <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff9500', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {dest.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '25px' }}>
                  <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
                    {dest.description}
                  </p>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <strong style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#333' }}>Top Highlights:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {dest.highlights?.map((h, i) => (
                        <span key={i} style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>{h}</span>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={`/enquiry`} style={{ display: 'block', textAlign: 'center', background: '#1c1917', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.3s' }}>
                    Plan Trip to {dest.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Destinations Coming Soon!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>We are mapping out the best places to visit in {data.name}.</p>
            <Link to="/enquiry" style={{ display: 'inline-block', background: '#ff9500', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
              Talk to an Expert
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
