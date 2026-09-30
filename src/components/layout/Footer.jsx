import { Link } from 'react-router-dom';
import { brandInfo, footerData, contactInfo, featuredCountries } from '../../data/global';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section company">
            <h3>
              <span className="brand-part1">{brandInfo.displayName.part1}</span>
              <span className="brand-accent">{brandInfo.displayName.accent}</span>
              <span className="brand-part2">{brandInfo.displayName.part2}</span>
            </h3>
            <p className="company-description">{footerData.description}</p>
            
            <div className="social-in-company">
              <h4>Follow Us</h4>
              <p className="follow-description">Stay connected for the latest updates and travel inspiration!</p>
              <div className="social-links">
                {footerData.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} className={`social-link ${link.platform.toLowerCase()}`} aria-label={`Follow us on ${link.platform}`}>
                    {/* Placeholder for SVG icons */}
                    {link.platform[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-section quick-links">
            <h4>Quick Links</h4>
            <ul className="links-list">
              <li><Link to="/"><span className="link-indicator"></span>Home</Link></li>
              <li><Link to="/about"><span className="link-indicator"></span>About Us</Link></li>
              <li><Link to="/contact"><span className="link-indicator"></span>Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section destinations">
            <h4>Top Destinations</h4>
            <ul className="links-list">
              {featuredCountries.map(country => (
                <li key={country.slug}>
                  <Link to={`/${country.slug}`}>
                    <span className="link-indicator"></span>{country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section contact">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <div className="contact-icon icon-mail">✉️</div>
                <div>
                  <p className="contact-label">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="contact-link">{contactInfo.email}</a>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon icon-phone">📞</div>
                <div>
                  <p className="contact-label">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="contact-link phone-link">{contactInfo.phoneDisplay}</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-section follow-us">
            <h4>Follow Us</h4>
            <p className="follow-description">Stay connected for the latest updates and travel inspiration!</p>
            <div className="social-links">
               {footerData.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} className={`social-link ${link.platform.toLowerCase()}`} aria-label={`Follow us on ${link.platform}`}>
                    {link.platform[0]}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <div className="copyright">
              <span>&copy; {new Date().getFullYear()}</span>
              <span>{brandInfo.name}</span>
              <span>· All rights reserved.</span>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="separator">|</span>
              <Link to="/terms">Terms of Service</Link>
              <span className="separator">|</span>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
