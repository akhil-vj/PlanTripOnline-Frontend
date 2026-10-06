import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { brandInfo, contactInfo, featuredCountries } from '../../data/global';
import '../../styles/header.css';

// Known country slugs for detection
const COUNTRY_SLUGS = featuredCountries.map(c => c.slug);

// Navigation items config
const NAV_ITEMS = [
  { label: 'Destinations', path: 'destinations' },
  { label: 'Day Tours', path: 'day-tours' },
  { label: 'Transfers', path: 'transfers' },
  { label: 'Tour Packages', path: 'tour-packages' },
  { label: 'Customize Trip', path: 'customized-packages' },
  { label: 'Hotels', path: 'hotels' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we're on a country page
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentCountrySlug = COUNTRY_SLUGS.includes(pathSegments[0]) ? pathSegments[0] : null;
  const currentCountry = currentCountrySlug
    ? featuredCountries.find(c => c.slug === currentCountrySlug)
    : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

          {/* Country Indicator Badge — shows when on a country page */}
          {currentCountry && (
            <Link to={`/${currentCountrySlug}`} className="country-badge">
              <span className="country-badge-name">{currentCountry.name}</span>
            </Link>
          )}

          <nav className="nav-desktop">
            {NAV_ITEMS.map(item => (
              <div className="nav-item" key={item.path}>
                {currentCountrySlug ? (
                  /* COUNTRY MODE: Direct link, no dropdown */
                  <Link
                    to={`/${currentCountrySlug}/${item.path}`}
                    className={`nav-button nav-link ${
                      location.pathname === `/${currentCountrySlug}/${item.path}` ? 'nav-active' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  /* HOMEPAGE MODE: Show dropdown with all countries */
                  <>
                    <button className="nav-button">
                      <span>{item.label}</span>
                      <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div className="dropdown">
                      {featuredCountries.map(country => (
                        <Link key={country.slug} to={`/${country.slug}/${item.path}`} className="dropdown-item">
                          {country.flag} {country.name} {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="header-right">
            <button className="enquire-button" onClick={() => navigate('/enquiry')}>
              Enquire
            </button>
            {isLoggedIn ? (
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="user-name" style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>Hi, {userName}</span>
                <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
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
          {/* Country indicator on mobile */}
          {currentCountry && (
            <div className="mobile-country-indicator">
              <span>Exploring {currentCountry.name}</span>
            </div>
          )}

          {NAV_ITEMS.map(item => (
            <div className="nav-mobile-item" key={item.path}>
              {currentCountrySlug ? (
                /* COUNTRY MODE: Direct link */
                <Link
                  to={`/${currentCountrySlug}/${item.path}`}
                  className={`nav-mobile-button nav-mobile-link ${
                    location.pathname === `/${currentCountrySlug}/${item.path}` ? 'nav-mobile-active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                /* HOMEPAGE MODE: Show country list */
                <details className="mobile-dropdown">
                  <summary className="nav-mobile-button">{item.label}</summary>
                  <div className="mobile-dropdown-content">
                    {featuredCountries.map(country => (
                      <Link key={country.slug} to={`/${country.slug}/${item.path}`} className="mobile-dropdown-item">
                        {country.flag} {country.name}
                      </Link>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}

          <div className="mobile-login-section">
            <button className="mobile-enquire-button" onClick={() => navigate('/enquiry')}>Enquire</button>
            {isLoggedIn ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '15px 0' }}>
                  <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>Hi, {userName}</span>
                  <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
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
