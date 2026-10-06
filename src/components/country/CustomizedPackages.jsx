import { useOutletContext, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CustomizedPackages() {
  const data = useOutletContext();

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Helmet>
        <title>Customize Your Trip to {data.name} - PlantripOnline</title>
      </Helmet>
      
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', padding: '60px 40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px', lineHeight: 1.2 }}>
            Craft Your Perfect <br/>
            <span style={{ color: '#ff9500' }}>{data.name}</span> Experience
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 40px' }}>
            Don't see exactly what you're looking for? Our travel experts can design a fully customized itinerary tailored to your specific interests, budget, and travel style.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', marginBottom: '40px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#334155', marginBottom: '10px', fontSize: '1.1rem' }}>🎯 Tailor-Made</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>100% personalized itineraries built around what you want to see and do.</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#334155', marginBottom: '10px', fontSize: '1.1rem' }}>🤝 Local Expertise</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Insider knowledge and local connections to give you the best experience.</p>
            </div>
          </div>
          
          <Link to="/enquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(to right, #f97316, #fb923c)', color: 'white', padding: '16px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)', transition: 'transform 0.2s' }}>
            Start Planning Now ➔
          </Link>
          
        </div>
      </div>
    </div>
  );
}
