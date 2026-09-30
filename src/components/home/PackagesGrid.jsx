import { useNavigate } from 'react-router-dom';
import { featuredCountries } from '../../data/global';

export default function PackagesGrid() {
  const navigate = useNavigate();

  const handleButtonClick = (url) => {
    navigate(url);
  };

  return (
    <section className="section packages-section">
      <div className="container">
        <h2 className="section-title">Choose Your <span>Journey</span></h2>
        <p className="section-subtitle" style={{ color: '#cbd5e1' }}>Select a destination and start planning</p>
        <div className="packages-grid" id="packages-container">
          {featuredCountries.map((country, index) => {
            const slug = country.slug;
            return (
              <div key={index} className="package-card">
                <div className="package-header">
                  <div className="package-emoji">{country.flag}</div>
                  <h3 className="package-title">{country.name}</h3>
                </div>
                <div className="package-buttons">
                  <button 
                    className="package-btn package-btn-primary"
                    onClick={() => handleButtonClick(`/${slug}/day-tours`)}
                  >
                    <span className="btn-label">Day Tours</span>
                    <span className="btn-info">{country.tourCount || '10+'} Tours</span>
                  </button>
                  <button 
                    className="package-btn package-btn-secondary"
                    onClick={() => handleButtonClick(`/${slug}/tour-packages`)}
                  >
                    <span className="btn-label">Tour Packages</span>
                    <span className="btn-info">{country.packageCount || '5+'} Packages</span>
                  </button>
                  <button 
                    className="package-btn package-btn-secondary"
                    onClick={() => handleButtonClick(`/${slug}/customized-packages`)}
                  >
                    <span className="btn-label">Customize Trip</span>
                    <span className="btn-custom-label">Plan Your Trip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
