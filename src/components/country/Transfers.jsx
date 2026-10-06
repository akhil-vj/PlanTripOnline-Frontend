import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Transfers() {
  const data = useOutletContext();
  const transfers = data.transfers || [];

  return (
    <div className="section">
      <Helmet>
        <title>{data.name} Airport Transfers & Transport - PlantripOnline</title>
      </Helmet>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data.name} Transfers</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Reliable airport transfers and private intercity transport.
          </p>
        </div>

        {transfers.length > 0 ? (
          <div className="transfers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {transfers.map(transfer => (
              <div key={transfer.id} className="transfer-card" style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={transfer.image} alt={transfer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '15px', fontWeight: 'bold', color: '#1c1917' }}>{transfer.title}</h3>
                  
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.9rem', color: '#475569' }}>
                      <span style={{ color: '#ff9500' }}>📍 From:</span> {transfer.from}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                      <span style={{ color: '#0ea5e9' }}>📍 To:</span> {transfer.to}
                    </div>
                  </div>

                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                    {transfer.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <span>⏱ {transfer.duration}</span>
                    <span>🚗 {transfer.vehicles?.join(', ')}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1c1917' }}>{transfer.price}</div>
                    <Link to={`/enquiry`} style={{ background: '#ff9500', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>
                      Book Transfer
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Transfers Coming Soon!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>We are arranging the most reliable transport options for {data.name}.</p>
            <Link to="/enquiry" style={{ display: 'inline-block', background: '#ff9500', color: 'white', padding: '12px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' }}>
              Request a Transfer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
