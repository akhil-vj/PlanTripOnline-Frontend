import { useState, useEffect, useRef } from 'react';
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

  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileClicked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="nav-item user-profile" ref={profileMenuRef}>
                <button 
                  className="nav-button profile-btn" 
                  style={{ gap: '8px' }}
                  onClick={() => setIsProfileClicked(!isProfileClicked)}
                >
                  <div className="profile-avatar">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-name" style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>{userName}</span>
                  <svg className="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div 
                  className="dropdown profile-dropdown"
                  style={{ 
                    display: isProfileClicked ? 'block' : '', 
                    right: 0, 
                    left: 'auto' 
                  }}
                  onClick={() => setIsProfileClicked(false)}
                >
                  <div className="profile-dropdown-header">
                    Signed in as <strong>{userName}</strong>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    Logout
                  </button>
                </div>
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
              <details className="mobile-dropdown user-mobile-dropdown">
                <summary className="nav-mobile-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                  <div className="profile-avatar" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {userName}
                </summary>
                <div className="mobile-dropdown-content" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <Link to="/dashboard" className="mobile-dropdown-item">Dashboard</Link>
                  <button onClick={handleLogout} className="mobile-dropdown-item" style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
                    Logout
                  </button>
                </div>
              </details>
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
