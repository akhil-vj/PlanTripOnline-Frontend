import { useState, useEffect, useCallback } from 'react';
import { homeDestinations, homepageConfig } from '../../data/homeData';

export default function DestinationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use config or defaults
  const limit = homepageConfig?.displayLimits?.destinations || homeDestinations.length;
  const destinations = homeDestinations.slice(0, limit);
  const config = homepageConfig?.carousel?.positions || {
    center: { transform: 'translateX(0) translateZ(50px) scale(1.15)', zIndex: 10, opacity: 1, filter: 'grayscale(0)' },
    right1: { transform: 'translateX(380px) translateZ(-50px) scale(0.95)', zIndex: 5, opacity: 0.85, filter: 'grayscale(20%)' },
    right2: { transform: 'translateX(700px) translateZ(-150px) scale(0.85)', zIndex: 1, opacity: 0.6, filter: 'grayscale(50%)' },
    left1: { transform: 'translateX(-380px) translateZ(-50px) scale(0.95)', zIndex: 5, opacity: 0.85, filter: 'grayscale(20%)' },
    left2: { transform: 'translateX(-700px) translateZ(-150px) scale(0.85)', zIndex: 1, opacity: 0.6, filter: 'grayscale(50%)' },
    hidden: { transform: 'translateX(0) scale(0.5)', zIndex: 0, opacity: 0, filter: 'grayscale(100%)', pointerEvents: 'none' }
  };

  const getPosition = (index) => {
    const offset = (index - currentIndex + destinations.length) % destinations.length;
    const positionMap = {
      0: config.center,
      1: config.right1,
      2: config.right2,
      [destinations.length - 1]: config.left1,
      [destinations.length - 2]: config.left2
    };
    return positionMap[offset] || config.hidden;
  };

  const updateCarousel = useCallback((newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((newIndex + destinations.length) % destinations.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, homepageConfig?.carousel?.animationDuration || 800);
  }, [isAnimating, destinations.length]);

  const nextSlide = useCallback(() => updateCarousel(currentIndex + 1), [currentIndex, updateCarousel]);
  const prevSlide = useCallback(() => updateCarousel(currentIndex - 1), [currentIndex, updateCarousel]);

  useEffect(() => {
    const interval = setInterval(nextSlide, homepageConfig?.carousel?.autoplayInterval || 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentDest = destinations[currentIndex];

  return (
    <section className="popular-destinations" id="destinations">
      <div className="container">
        <h2 className="section-title section-header">Popular <span>Destinations</span></h2>
        <p className="section-subtitle">Explore our most loved locations across Southeast Asia</p>

        <div className="carousel-container">
          <div className="carousel-viewport">
            <button className="nav-arrow left" onClick={prevSlide} aria-label="Previous destination">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div className="carousel-track" id="carousel">
              {destinations.map((dest, index) => {
                const pos = getPosition(index);
                return (
                  <div 
                    key={index}
                    className="destination-card"
                    style={pos}
                    onClick={() => updateCarousel(index)}
                  >
                    <div className="destination-image">
                      <img src={dest.image} alt={dest.name} className="card-image" />
                      <div className="card-overlay"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="nav-arrow right" onClick={nextSlide} aria-label="Next destination">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div className="dots-navigation" id="dots">
            {destinations.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => updateCarousel(index)}
                aria-label={`Go to destination ${index + 1}`}
              ></button>
            ))}
          </div>

          {currentDest && (
            <div className="destination-info-display">
              <h3 className="destination-name-display" id="destName">{currentDest.name}</h3>
              <div className="destination-details">
                <div className="location-info">
                  <span>📍</span>
                  <span id="destCountry">{currentDest.country}</span>
                  <span className="separator">•</span>
                  <span id="destDescription">{currentDest.duration || '3 Days 2 Nights'}</span>
                </div>
                <div className="price-rating">
                  <div className="price" id="destPrice">From {currentDest.currency || 'MYR'} {currentDest.price || '1,299'}</div>
                  <div className="rating-badge" style={{ display: currentDest.rating ? 'flex' : 'none' }}>
                    <svg className="icon star-icon" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span id="destRating">{currentDest.rating || '4.8'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="luxury-divider">
        <div className="divider-line"></div>
      </div>
    </section>
  );
}
