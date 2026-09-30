import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalImages, homePageContent, featuredCountries, brandInfo } from '../../data/global';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const country = featuredCountries.find(c => lowerQuery.includes(c.name.toLowerCase()));
      
      if (country) {
        navigate(`/${country.slug}/destinations`);
      } else {
        alert(`Searching for: ${searchQuery}`);
      }
    }
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${globalImages.homeHeroBackground})` }}>
      <div className="hero-bg-text">PLANTRIPONLINE</div>
      <div className="hero-content">
        <h1 id="hero-heading">
          <span className="gradient-line">{homePageContent.hero.mainHeading}</span> <br /> <span className="gradient-line">with</span>
          {' '}
          <span className="brand">
            <span className="main plantrip">{brandInfo.displayName.part1}</span>
            <span className="accent o">{brandInfo.displayName.accent}</span>
            <span className="main nline">{brandInfo.displayName.part2}</span>
          </span>
        </h1>
        <p id="hero-subheading">{homePageContent.hero.subheading}</p>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            id="search-placeholder"
            placeholder={homePageContent.hero.searchPlaceholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" id="search-button">
            {homePageContent.hero.searchButtonText}
          </button>
        </form>
      </div>

      <div className="hero-destinations">
        <p>Popular Destinations</p>
        <div className="hero-destinations-list" id="hero-destinations-list">
          {featuredCountries.map(country => (
            <span key={country.slug}>
              <a href={`/${country.slug}`}>{country.name}</a>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
