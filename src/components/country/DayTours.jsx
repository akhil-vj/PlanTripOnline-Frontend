import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function DayTours() {
  const data = useOutletContext();
  const tours = data.dayTours || [];

  return (
    <div className="section">
      <Helmet>
        <title>{data.name} Day Tours - PlantripOnline</title>
      </Helmet>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data.name} Day Tours</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Discover the best local experiences and guided tours in {data.name}.
          </p>
        </div>

        {tours.length > 0 ? (
          <div className="tours-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {tours.map(tour => (
              <div key={tour.id} className="tour-card" style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {tour.badge && (
                    <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff9500', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {tour.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
                    <span>📍 {tour.location}</span>
                    <span>{tour.duration}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 'bold' }}>{tour.title}</h3>
                  <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '15px', lineHeight: 1.5 }}>
                    {tour.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {tour.features?.map((f, i) => (
                      <span key={i} style={{ background: '#f5f5f4', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', color: '#444' }}>{f}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#ff9500' }}>{tour.price}</div>
                    <Link to={`/enquiry`} style={{ background: '#ff9500', color: 'white', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>More Tours Coming Soon!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>We are currently updating our amazing tour selections for {data.name}.</p>
            <Link to="/enquiry" style={{ display: 'inline-block', background: '#ff9500', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
              Enquire Custom Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
