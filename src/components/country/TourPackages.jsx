import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function TourPackages() {
  const data = useOutletContext();
  const packages = data.tourPackages || [];

  return (
    <div className="section">
      <Helmet>
        <title>{data.name} Tour Packages - PlantripOnline</title>
      </Helmet>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data.name} Tour Packages</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Multi-day itineraries carefully designed for the perfect holiday.
          </p>
        </div>

        {packages.length > 0 ? (
          <div className="packages-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {packages.map(pkg => (
              <div key={pkg.id} className="package-card" style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pkg.badge && (
                    <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#dc2626', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{ color: '#ff9500', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
                    ⏱ {pkg.duration}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '5px', fontWeight: 'bold', color: '#1c1917' }}>{pkg.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>{pkg.subtitle}</p>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px', textTransform: 'uppercase' }}>Includes:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {pkg.includes?.map((inc, i) => (
                        <span key={i} style={{ background: '#f5f5f4', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#444' }}>{inc}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Price</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1c1917' }}>{pkg.price}</div>
                    </div>
                    <Link to={`/enquiry`} style={{ background: '#1c1917', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Packages Coming Soon!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>We are crafting the ultimate multi-day packages for {data.name}.</p>
            <Link to="/enquiry" style={{ display: 'inline-block', background: '#ff9500', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
              Enquire Custom Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
