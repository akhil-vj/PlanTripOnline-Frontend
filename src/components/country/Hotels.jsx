import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Hotels() {
  const data = useOutletContext();
  const hotels = data.hotels || [];

  return (
    <div className="section">
      <Helmet>
        <title>{data.name} Hotels & Resorts - PlantripOnline</title>
      </Helmet>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data.name} Hotels</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Find the perfect stay for your trip, from luxury resorts to boutique gems.
          </p>
        </div>

        {hotels.length > 0 ? (
          <div className="hotels-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {hotels.map(hotel => (
              <div key={hotel.id} className="hotel-card" style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={hotel.image} alt={hotel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {hotel.badge && (
                    <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {hotel.badge}
                    </span>
                  )}
                  <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: '#ff9500' }}>
                    {Array(Number(hotel.stars) || 0).fill('⭐').join('')}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '8px' }}>
                    📍 {hotel.location}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '15px', fontWeight: 'bold', color: '#1c1917' }}>{hotel.title}</h3>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {hotel.amenities?.map((a, i) => (
                      <span key={i} style={{ background: '#f5f5f4', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#444' }}>{a}</span>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Starting from</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1c1917' }}>{hotel.price}</div>
                    </div>
                    <Link to={`/enquiry`} style={{ background: '#1c1917', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Hotels Coming Soon!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>We are curating the best stays in {data.name}.</p>
            <Link to="/enquiry" style={{ display: 'inline-block', background: '#ff9500', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
              Enquire Accommodation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
