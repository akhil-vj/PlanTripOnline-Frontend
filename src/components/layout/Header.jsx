import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { brandInfo, contactInfo, featuredCountries } from '../../data/global';
import '../../styles/header.css'; // We'll create this later

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    if (token) {
      setIsLoggedIn(true);
      setUserName(storedName || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">
              <span className="logo-white">{brandInfo.displayName.part1}</span>
              <span className="logo-accent">{brandInfo.displayName.accent}</span>
              <span className="logo-white">{brandInfo.displayName.part2}</span>
            </span>
          </Link>

          <nav className="nav-desktop">
            {/* Desktop Navigation Items */}
            <div className="nav-item">
              <button className="nav-button">
                <span>Destinations</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/destinations`} className="dropdown-item">
                    {country.name} Destinations
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="nav-item">
              <button className="nav-button">
                <span>Day Tours</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/day-tours`} className="dropdown-item">
                    {country.name} Day Tours
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-item">
              <button className="nav-button">
                <span>Transfers</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/transfers`} className="dropdown-item">
                    {country.name} Transfers
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-item">
              <button className="nav-button">
                <span>Tour Packages</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/tour-packages`} className="dropdown-item">
                    {country.name} Tour Packages
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-item">
              <button className="nav-button">
                <span>Customize Trip</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/customized-packages`} className="dropdown-item">
                    {country.name} Trip
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-item">
              <button className="nav-button">
                <span>Hotels</span>
                <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className="dropdown">
                {featuredCountries.map(country => (
                  <Link key={country.slug} to={`/${country.slug}/hotels`} className="dropdown-item">
                    {country.name} Hotels
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="header-right">
            <button className="enquire-button" onClick={() => navigate('/enquiry')}>
              Enquire
            </button>
            {isLoggedIn ? (
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="user-name" style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>Hi, {userName}</span>
                <button className="login-button" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff9500' }}>
                  <span className="login-button-text">Logout</span>
                  <div className="login-button-shine"></div>
                </button>
              </div>
            ) : (
              <button className="login-button" onClick={() => navigate('/login')}>
                <span className="login-button-text">Login</span>
                <div className="login-button-shine"></div>
              </button>
            )}
          </div>

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <svg className="menu-icon" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`nav-mobile ${mobileMenuOpen ? 'active' : ''}`}>
           {/* Basic implementation for now */}
           <div className="nav-mobile-item"><button className="nav-mobile-button">Destinations</button></div>
           <div className="nav-mobile-item"><button className="nav-mobile-button">Day Tours</button></div>
           <div className="nav-mobile-item"><button className="nav-mobile-button">Transfers</button></div>
           <div className="nav-mobile-item"><button className="nav-mobile-button">Tour Packages</button></div>
           <div className="nav-mobile-item"><button className="nav-mobile-button">Customize Trip</button></div>
           <div className="nav-mobile-item"><button className="nav-mobile-button">Hotels</button></div>
           <div className="mobile-login-section">
              <button className="mobile-enquire-button" onClick={() => navigate('/enquiry')}>Enquire</button>
              {isLoggedIn ? (
                <>
                  <div style={{ color: 'white', textAlign: 'center', margin: '15px 0', fontSize: '1.1rem', fontWeight: 500 }}>Hi, {userName}</div>
                  <button className="mobile-login-button" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff9500' }}>
                      <span className="login-button-text">Logout</span>
                      <div className="login-button-shine"></div>
                  </button>
                </>
              ) : (
                <button className="mobile-login-button" onClick={() => navigate('/login')}>
                    <span className="login-button-text">Login</span>
                    <div className="login-button-shine"></div>
                </button>
              )}
           </div>
        </div>
      </div>
    </header>
  );
}
