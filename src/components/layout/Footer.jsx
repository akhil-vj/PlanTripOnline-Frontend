import { Link } from 'react-router-dom';
import { brandInfo, footerData, contactInfo, featuredCountries } from '../../data/global';

/* ---------- inline icons ---------- */
function SocialIcon({ platform }) {
  const p = platform.toLowerCase();
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (p.includes('instagram'))
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </svg>
    );
  if (p.includes('facebook'))
    return (
      <svg {...common} fill="currentColor">
        <path d="M14 8h2V5h-2.5C11.3 5 10 6.4 10 8.6V11H8v3h2v6h3v-6h2.2l.5-3H13V8.8c0-.5.3-.8 1-.8z" />
      </svg>
    );
  if (p.includes('youtube'))
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9l5 3-5 3z" fill="currentColor" />
      </svg>
    );
  if (p.includes('tiktok'))
    return (
      <svg {...common} fill="currentColor">
        <path d="M16 3c.3 2.3 1.7 3.8 4 4v3c-1.5 0-2.8-.5-4-1.3V15a6 6 0 11-6-6v3.2A2.9 2.9 0 1013 15V3h3z" />
      </svg>
    );
  if (p.includes('twitter') || p === 'x')
    return (
      <svg {...common} fill="currentColor">
        <path d="M17.5 3h3l-6.6 7.5L21.5 21h-6l-4.7-6.2L5.4 21h-3l7-8L2.5 3h6.1l4.2 5.7L17.5 3zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5z" />
      </svg>
    );
  return <span>{platform[0]}</span>;
}

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <style>{`
        .footer { position:relative; margin-top:90px; background:#14263f;
          background-image:linear-gradient(180deg, #14263f 0%, #0b1a30 100%); color:#fff; }
        .footer *, .footer *::before, .footer *::after { box-sizing:border-box; }

        /* Mountain silhouette on the top edge */
        .footer .footer-mountains { position:absolute; left:0; bottom:calc(100% - 2px); width:100%; height:100px;
          display:block; pointer-events:none; }
        .footer .ridge-back  { fill:#3b5573; opacity:.55; }
        .footer .ridge-mid   { fill:#243d5c; }
        .footer .ridge-front { fill:#14263f; }

        .footer .footer-container { max-width:1180px; margin:0 auto; padding:40px 1.5rem 22px; }

        /* Grid: brand takes the free space, other columns fit their content */
        .footer .footer-grid { display:grid; grid-template-columns:minmax(220px,1fr) auto auto auto auto; align-items:stretch; }
        .footer .footer-section { padding:0 30px; }
        .footer .footer-section:first-child { padding-left:0; padding-right:40px; }
        .footer .footer-section:last-child { padding-right:0; }
        .footer .footer-section + .footer-section { border-left:1px solid rgba(255,255,255,.1); }

        .footer h4 { font-size:1rem; font-weight:700; margin:4px 0 16px; color:#fff; }

        /* Brand */
        .footer .company h3 { font-size:1.7rem; font-weight:800; letter-spacing:-.5px; margin:0 0 12px; line-height:1.1; }
        .footer .brand-accent { color:#ff8a1f; }
        .footer .company-description { color:rgba(255,255,255,.82); font-size:.92rem; line-height:1.55; margin:0; max-width:280px; }

        /* Link lists */
        .footer .links-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
        .footer .links-list a, .footer .footer-bottom-links a { color:rgba(255,255,255,.85); text-decoration:none; font-size:.92rem; transition:color .2s; }
        .footer .links-list a:hover, .footer .footer-bottom-links a:hover { color:#ff9a2e; }

        /* Contact */
        .footer .contact-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px; }
        .footer .contact-item { display:flex; align-items:center; gap:12px; }
        .footer .contact-icon { width:38px; height:38px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
          border-radius:10px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:#fff; }
        .footer .contact-link { color:rgba(255,255,255,.9); text-decoration:none; font-size:.9rem; white-space:nowrap; transition:color .2s; }
        .footer .contact-link:hover { color:#ff9a2e; }

        /* Social */
        .footer .social-links { display:flex; gap:10px; flex-wrap:wrap; }
        .footer .social-link { width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:10px;
          background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.22); color:#fff; text-decoration:none; font-weight:700;
          transition:background .25s, border-color .25s, transform .25s, box-shadow .25s; }
        /* Per-platform brand colours on hover */
        .footer .social-link.facebook:hover  { background:#1877F2; border-color:#1877F2; box-shadow:0 6px 18px rgba(24,119,242,.5); transform:translateY(-3px); }
        .footer .social-link.instagram:hover { background:linear-gradient(135deg,#833ab4,#fd1d1d,#f7b733); border-color:transparent; box-shadow:0 6px 18px rgba(253,29,29,.45); transform:translateY(-3px); }
        .footer .social-link.youtube:hover   { background:#FF0000; border-color:#FF0000; box-shadow:0 6px 18px rgba(255,0,0,.5); transform:translateY(-3px); }
        .footer .social-link.tiktok:hover    { background:#010101; border-color:#69C9D0; box-shadow:0 6px 18px rgba(105,201,208,.4); transform:translateY(-3px); }
        .footer .social-link.twitter:hover,
        .footer .social-link.x:hover         { background:#000; border-color:#555; box-shadow:0 6px 18px rgba(0,0,0,.55); transform:translateY(-3px); }

        /* Bottom bar */
        .footer .footer-bottom { margin-top:34px; border-top:1px solid rgba(255,255,255,.12); padding-top:18px; }
        .footer .footer-bottom-content { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
        .footer .copyright { color:rgba(255,255,255,.8); font-size:.85rem; }
        .footer .footer-bottom-links { display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
        .footer .footer-bottom-links a { font-size:.85rem; }
        .footer .separator { color:rgba(255,255,255,.55); }

        /* Responsive */
        @media (max-width:1000px) {
          .footer .footer-grid { grid-template-columns:repeat(2, minmax(0,1fr)); row-gap:34px; }
          .footer .footer-section, .footer .footer-section:first-child, .footer .footer-section:last-child { padding:0; }
          .footer .footer-section + .footer-section { border-left:none; }
          .footer .company-description { max-width:none; }
        }
        @media (max-width:560px) {
          .footer { margin-top:70px; }
          .footer .footer-mountains { height:64px; }
          .footer .footer-grid { grid-template-columns:1fr; }
          .footer .footer-bottom-content { flex-direction:column; align-items:flex-start; }
          .footer .contact-link { white-space:normal; word-break:break-word; }
        }
      `}</style>

      {/* Mountain silhouette */}
      <svg className="footer-mountains" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="ridge-front"
          d="M0 86 C120 70, 220 84, 340 74 S560 62, 680 76 S900 88, 1020 76 S1260 64, 1440 78 L1440 100 L0 100 Z" />
      </svg>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section company">
            <h3>
              <span className="brand-part1">{brandInfo.displayName.part1}</span>
              <span className="brand-accent">{brandInfo.displayName.accent}</span>
              <span className="brand-part2">{brandInfo.displayName.part2}</span>
            </h3>
            <p className="company-description">{footerData.description}</p>
          </div>

          {/* Quick links */}
          <div className="footer-section quick-links">
            <h4>Quick Links</h4>
            <ul className="links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="footer-section destinations">
            <h4>Top Destinations</h4>
            <ul className="links-list">
              {featuredCountries.map(country => (
                <li key={country.slug}>
                  <Link to={`/${country.slug}`}>{country.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section contact">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon"><MailIcon /></span>
                <a href={`mailto:${contactInfo.email}`} className="contact-link">{contactInfo.email}</a>
              </li>
              <li className="contact-item">
                <span className="contact-icon"><PhoneIcon /></span>
                <a href={`tel:${contactInfo.phone}`} className="contact-link">{contactInfo.phoneDisplay}</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-section follow-us">
            <h4>Follow Us</h4>
            <div className="social-links">
              {footerData.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className={`social-link ${link.platform.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              &copy; {new Date().getFullYear()} {brandInfo.name}. All rights reserved.
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