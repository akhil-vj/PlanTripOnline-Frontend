import { homeTours } from '../../data/homeData';

export default function ToursGrid() {
  return (
    <section className="tours-section">
      <div className="container">
        <h2 className="section-title">Trending <span>Day Tours</span></h2>
        <p className="section-subtitle">Handpicked experiences across Southeast Asia</p>
        <div className="tours-grid" id="tours-container">
          {homeTours.map((tour, index) => (
            <div key={index} className="tour-card">
              <div className="tour-image-container">
                <img src={tour.image} alt={tour.title} />
                <div className="tour-overlay"></div>
                <div className="tour-badge">{tour.type || 'Tour'}</div>
                <div className="tour-content">
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
      </div>
    </section>
  );
}
