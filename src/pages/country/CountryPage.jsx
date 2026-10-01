import { useOutletContext, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../../styles/home.css'; // Reusing home styles for grids and hero
import '../../styles/country.css';

export default function CountryPage() {
  const data = useOutletContext();
  const { country } = useParams();

  // If no data, the layout will handle it, but just in case
  if (!data) return null;

  return (
    <div className="country-page">
      <Helmet>
        <title>{data.name} Travel & Tours - PlanTripOnline</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <section className="hero" style={{ backgroundImage: `url(${data.heroImage})` }}>
        <div className="hero-bg-text">{data.name}</div>
        <div className="hero-content">
          <h1 id="hero-heading">
            <span className="gradient-line">Explore {data.name}</span>
          </h1>
          <p id="hero-subheading">{data.tagline}</p>
        </div>
        
        <div className="hero-destinations">
          <p>DISCOVER MORE</p>
          <div className="hero-destinations-list">
            <span><a href="#destinations">Destinations</a></span>
            <span><a href="#day-tours">Day Tours</a></span>
            <span><a href="#packages">Tour Packages</a></span>
            <span><a href="#hotels">Hotels</a></span>
          </div>
        </div>
      </section>

      <section className="section bg-light" id="destinations">
        <div className="container">
          <h2 className="section-title">Top <span>Destinations</span> in {data.name}</h2>
          <p className="section-subtitle" style={{textAlign: 'center'}}>{data.description}</p>
          
          <div className="tours-grid" style={{marginTop: '2rem'}}>
            {data.destinations?.map((dest, index) => (
              <div key={index} className="tour-card">
                <div className="tour-image-container">
                  <img src={dest.image} alt={dest.name} />
                  <div className="tour-overlay"></div>
                  <div className="tour-badge">{dest.badge || 'Popular'}</div>
                  <div className="tour-content">
                    <h3 className="tour-title">{dest.name}</h3>
                    <div className="tour-footer">
                      <span className="tour-price">{dest.locations}</span>
                      <div className="tour-rating">
                        <svg className="star-icon" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="luxury-divider">
        <div className="divider-line"></div>
      </div>

      <section className="section" id="day-tours">
        <div className="container">
          <h2 className="section-title">Popular <span>Day Tours</span></h2>
          <p className="section-subtitle" style={{textAlign: 'center'}}>Handpicked experiences for unforgettable adventures</p>
          
          <div className="tours-grid" style={{marginTop: '2rem'}}>
            {data.dayTours?.slice(0, 6).map((tour, index) => (
              <div key={index} className="tour-card">
                <div className="tour-image-container">
                  <img src={tour.image} alt={tour.title} />
                  <div className="tour-overlay"></div>
                  {tour.badge && <div className="tour-badge">{tour.badge}</div>}
                  <div className="tour-content">
                    <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem'}}>📍 {tour.location}</div>
                    <h3 className="tour-title">{tour.title}</h3>
                    <div className="tour-footer">
                      <span className="tour-price">From {tour.price}</span>
                      <div className="tour-rating">
                        <svg className="star-icon" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {data.dayTours?.length > 6 && (
            <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <Link to={`/${country}/day-tours`} className="package-btn package-btn-primary" style={{display: 'inline-flex', width: 'auto', padding: '1rem 2.5rem'}}>
                View All {data.name} Tours
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="packages-section" id="packages">
        <div className="container">
          <h2 className="section-title">Tour <span>Packages</span></h2>
          <p className="section-subtitle">Multi-day itineraries tailored for you</p>
          
          <div className="packages-grid">
            {data.tourPackages?.slice(0, 4).map((pkg, index) => (
              <div key={index} className="package-card">
                <div className="package-header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                  {pkg.badge && <span style={{background: '#d97706', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold'}}>{pkg.badge}</span>}
                  <h3 className="package-title" style={{fontSize: '1.25rem'}}>{pkg.title}</h3>
                  <p style={{color: '#64748b', fontSize: '0.875rem'}}>{pkg.subtitle}</p>
                </div>
                
                <div style={{margin: '1.5rem 0', display: 'flex', gap: '1rem', color: '#1c1917', fontSize: '0.9rem'}}>
                  <div><strong>⏱ {pkg.duration}</strong></div>
                  <div><strong>💰 {pkg.price}</strong></div>
                </div>
                
                <ul style={{listStyle: 'none', marginBottom: '2rem'}}>
                  {pkg.includes?.map((item, i) => (
                    <li key={i} style={{marginBottom: '0.5rem', color: '#475569'}}>✓ {item}</li>
                  ))}
                </ul>
                
                <Link to={`/${country}/package/${pkg.id}`} className="package-btn package-btn-primary" style={{textAlign: 'center', justifyContent: 'center'}}>
                  View Itinerary
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
