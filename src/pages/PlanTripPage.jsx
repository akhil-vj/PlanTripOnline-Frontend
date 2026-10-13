import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PlanTripPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, country, image, description, highlights, badge, rating } = location.state || {};

  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', telephone: '', countryCode: '+91',
    email: '', whatsapp: '', whatsappCode: '+91',
    date: '', adults: '0', children: '0',
    pickUp: '', dropPoint: '', promoCode: '',
    nationality: 'India', displayRate: 'Book Now',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const tabs = [
    { id: 'overview', label: 'Overview', num: 1 },
    { id: 'inclusions', label: 'Inclusions / Exclusions', num: 2 },
    { id: 'itinerary', label: 'Itinerary', num: 3 },
    { id: 'review', label: 'Review', num: 4 },
  ];

  const destHighlights = highlights || ['Temple visits', 'Local cuisine', 'Cultural experiences', 'Guided tour'];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f8', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>{destination || 'Destination'} – PlantripOnline</title>
      </Helmet>

      {/* Top Nav */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 200
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb',
          fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6
        }}>← Back</button>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: '#1e293b', fontWeight: 700 }}>{destination || 'Destination'}</span>
        {country && <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>· {country}</span>}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px', display: 'grid', gridTemplateColumns: '1fr 330px', gap: 24, alignItems: 'start' }}>

        {/* ─── LEFT PANEL ─── */}
        <div>
          {/* Hero Image */}
          {image && (
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 20, position: 'relative', height: 280 }}>
              <img src={image} alt={destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)'
              }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, color: 'white' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {destination}
                </h1>
                {country && <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '0.95rem' }}>📍 {country}</p>}
              </div>
              {badge && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: '#ff9500', color: 'white', padding: '5px 14px',
                  borderRadius: 25, fontWeight: 700, fontSize: '0.8rem'
                }}>{badge}</div>
              )}
              {rating && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(0,0,0,0.6)', color: '#fbbf24', padding: '6px 12px',
                  borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', backdropFilter: 'blur(6px)'
                }}>★ {rating}</div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{
            background: 'white', borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  flex: 1, padding: '15px 8px', border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.8rem', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', fontSize: '0.78rem', fontWeight: 700,
                    background: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{tab.num}</div>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: 28 }}>

              {/* ── OVERVIEW TAB: Product Details ── */}
              {activeTab === 'overview' && (
                <div>
                  {/* About */}
                  <section style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>About This Destination</h2>
                    <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' }}>
                      {description || `Experience the very best of ${destination}, ${country}. From breathtaking landscapes to rich cultural heritage, this destination offers an unforgettable journey filled with authentic local experiences, world-class attractions, and warm hospitality. Whether you're traveling solo, as a couple, or with family, our expertly curated trips ensure every moment is special.`}
                    </p>
                  </section>

                  {/* Highlights */}
                  <section style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Highlights</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {destHighlights.map((h, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', background: '#f8fafc', borderRadius: 8,
                          border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#374151', fontWeight: 500
                        }}>
                          <span style={{ color: '#ff9500', fontSize: '1rem' }}>✦</span> {h}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Quick Info */}
                  <section style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Quick Info</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {[
                        { icon: '🕐', label: 'Duration', value: 'Full Day' },
                        { icon: '👥', label: 'Group Size', value: 'Up to 15' },
                        { icon: '🗣️', label: 'Language', value: 'English' },
                        { icon: '📍', label: 'Location', value: country || 'Asia' },
                        { icon: '🎫', label: 'Tickets', value: 'Included' },
                        { icon: '🍽️', label: 'Meals', value: 'As specified' },
                      ].map((item, i) => (
                        <div key={i} style={{
                          padding: '14px', background: '#fafafa', borderRadius: 10,
                          border: '1px solid #f1f5f9', textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{item.icon}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* What to Expect */}
                  <section>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>What to Expect</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[
                        { step: '01', title: 'Pickup from your hotel', desc: 'Our driver will collect you from your accommodation at the scheduled time.' },
                        { step: '02', title: 'Guided sightseeing', desc: 'Explore the top attractions with an expert local guide who brings each site to life.' },
                        { step: '03', title: 'Authentic local experiences', desc: 'Enjoy curated cultural activities, cuisine, and interactions with locals.' },
                        { step: '04', title: 'Drop-off & memories', desc: 'Return comfortably to your hotel with unforgettable experiences and photos.' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #ff9500, #ea580c)',
                            color: 'white', fontWeight: 800, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>{item.step}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginBottom: 2 }}>{item.title}</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* ── INCLUSIONS / EXCLUSIONS ── */}
              {activeTab === 'inclusions' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <div>
                    <h3 style={{ color: '#15803d', fontWeight: 700, fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#dcfce7', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                      Inclusions
                    </h3>
                    {['Professional English-speaking guide', 'Entrance fees to all listed sites', 'Air-conditioned vehicle transport', 'Bottled water & light refreshments', 'Hotel pickup & drop-off service', 'All applicable taxes & fees'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, color: '#374151', fontSize: '0.9rem', alignItems: 'flex-start' }}>
                        <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 style={{ color: '#dc2626', fontWeight: 700, fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#fee2e2', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✗</span>
                      Exclusions
                    </h3>
                    {['Personal expenses & shopping', 'Gratuities for guide (optional)', 'Meals unless specified', 'International travel insurance', 'Visa & immigration fees', 'Optional activity upgrades'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, color: '#374151', fontSize: '0.9rem', alignItems: 'flex-start' }}>
                        <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✗</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ITINERARY ── */}
              {activeTab === 'itinerary' && (
                <div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Day-by-Day Itinerary</h2>
                  {[
                    { day: 'Day 1', title: 'Arrival & Welcome', time: 'Morning – Evening', desc: 'Arrive at your destination. Our representative will meet you at the airport and transfer you to your hotel. After settling in, enjoy a welcome briefing with your tour guide covering the schedule, safety tips, and local customs. Evening free for rest.' },
                    { day: 'Day 2', title: 'Cultural Exploration', time: 'Full Day', desc: 'Full-day sightseeing covering the main cultural landmarks, temples, and historic sites. Enjoy a traditional lunch at a local restaurant, followed by visits to local markets and scenic viewpoints. Evening entertainment as per the local culture.' },
                    { day: 'Day 3', title: 'Leisure & Departure', time: 'Morning – Afternoon', desc: 'Morning at leisure to explore nearby areas or relax at your hotel. Optional activities available. After lunch, transfer to the airport for your onward journey. Our team will assist with luggage and departure formalities.' },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 6 }}>
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                          borderRadius: 8, padding: '5px 12px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap'
                        }}>{item.day}</div>
                        {i < arr.length - 1 && <div style={{ width: 2, height: 40, background: '#e2e8f0', marginTop: 6, marginBottom: 6 }} />}
                      </div>
                      <div style={{ paddingBottom: 20, borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{item.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 10 }}>{item.time}</span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── REVIEW ── */}
              {activeTab === 'review' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{rating || '4.8'}</div>
                      <div style={{ color: '#f59e0b', fontSize: '1.3rem', margin: '6px 0' }}>★★★★★</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Based on 324 reviews</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[['Excellent', 78], ['Good', 18], ['Average', 3], ['Poor', 1]].map(([label, pct]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', minWidth: 64 }}>{label}</span>
                          <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: 32 }}>{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { name: 'Arun M.', rating: 5, comment: 'Absolutely amazing experience! The guide was knowledgeable and friendly. Everything was perfectly organised.', date: 'October 2026', trip: 'Kuala Lumpur Tour' },
                    { name: 'Sarah L.', rating: 5, comment: 'Seamless booking and professional service. The cultural tour made our trip truly unforgettable. Will definitely book again.', date: 'September 2026', trip: 'Penang Experience' },
                    { name: 'Alisha R.', rating: 4, comment: 'The trip was seamless and beautiful! The guides were knowledgeable and the accommodations were perfect.', date: 'August 2026', trip: 'Langkawi Trip' },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '18px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb' }}>
                            {r.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{r.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.trip} · {r.date}</div>
                          </div>
                        </div>
                        <div style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div style={{ position: 'sticky', top: 72, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Book Now Button */}
          <button onClick={() => setShowBookingModal(true)} style={{
            width: '100%', padding: '15px 0', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white', fontWeight: 800, fontSize: '1.05rem',
            cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
            transition: 'all 0.2s', letterSpacing: '0.3px'
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(37,99,235,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.35)'; }}>
            Book Now
          </button>

          {/* Booking Summary */}
          <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Booking Summary</h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
              {image && <img src={image} alt={destination} style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
              <div>
                <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', lineHeight: 1.4, margin: 0 }}>{destination || 'Destination'}</p>
                {country && <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0' }}>{country}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}><span>Adult Amount</span><span>₹ 0.00</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}><span>Child Amount</span><span>₹ 0.00</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: 14, marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>Total (USD)</span>
              <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.2rem' }}>$ 0.00</span>
            </div>
            <button onClick={() => setShowBookingModal(true)} style={{
              width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
              background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', marginBottom: 10, transition: 'background 0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#2563eb'; }}>
              Go to Payment Online
            </button>
            <button onClick={() => setShowBookingModal(true)} style={{
              width: '100%', padding: '13px 0', borderRadius: 10,
              background: 'white', color: '#2563eb', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', border: '2px solid #2563eb', transition: 'all 0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; }}>
              Continue with Offline
            </button>
          </div>

          {/* Help Card */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', borderRadius: 14, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', opacity: 0.7, marginBottom: 6 }}>Need help planning?</p>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Talk to our travel experts</p>
            <a href="tel:+60106661747" style={{ display: 'block', background: '#ff9500', color: 'white', padding: '10px 0', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>📞 Call Us Now</a>
          </div>
        </div>
      </div>

      {/* ─── BOOKING FORM MODAL ─── */}
      {showBookingModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, backdropFilter: 'blur(4px)'
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowBookingModal(false); }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: 36,
            maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease'
          }}>
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Traveller Details</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' }}>{destination} · {country}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} style={{
                background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36,
                cursor: 'pointer', fontSize: '1.1rem', color: '#64748b', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>First Name <R /></label><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter first name" style={inputStyle} /></div>
              <div><label style={labelStyle}>Last Name <R /></label><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter last name" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Telephone <R /></label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select name="countryCode" value={form.countryCode} onChange={handleChange} style={{ ...inputStyle, width: 75, padding: '10px 6px', flexShrink: 0 }}>
                    <option>+91</option><option>+60</option><option>+66</option><option>+1</option><option>+44</option>
                  </select>
                  <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Phone number" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>Email ID <R /></label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email address" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>WhatsApp No. <R /></label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select name="whatsappCode" value={form.whatsappCode} onChange={handleChange} style={{ ...inputStyle, width: 75, padding: '10px 6px', flexShrink: 0 }}>
                    <option>+91</option><option>+60</option><option>+66</option><option>+1</option><option>+44</option>
                  </select>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp number" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>Select Date</label><input name="date" type="date" value={form.date} onChange={handleChange} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Adult <R /></label>
                <select name="adults" value={form.adults} onChange={handleChange} style={inputStyle}>{[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}</select>
              </div>
              <div>
                <label style={labelStyle}>Child <R /></label>
                <select name="children" value={form.children} onChange={handleChange} style={inputStyle}>{[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}</select>
              </div>
            </div>

            {/* Row 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Pick Up</label>
                <select name="pickUp" value={form.pickUp} onChange={handleChange} style={inputStyle}><option value="">Select hotel name</option><option>Hotel Lobby</option><option>Airport</option><option>City Center</option></select>
              </div>
              <div>
                <label style={labelStyle}>Drop Point</label>
                <select name="dropPoint" value={form.dropPoint} onChange={handleChange} style={inputStyle}><option value="">Select hotel name</option><option>Hotel Lobby</option><option>Airport</option><option>City Center</option></select>
              </div>
            </div>

            {/* Nationality */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Country / Nationality <R /></label>
              <select name="nationality" value={form.nationality} onChange={handleChange} style={{ ...inputStyle, maxWidth: 260 }}>
                <option>India</option><option>Malaysia</option><option>Thailand</option>
                <option>United Kingdom</option><option>United States</option><option>Australia</option><option>Other</option>
              </select>
            </div>

            {/* Promo Code */}
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <label style={{ ...labelStyle, marginBottom: 0, minWidth: 160, whiteSpace: 'nowrap' }}>Promotion Code (If any)</label>
              <input name="promoCode" value={form.promoCode} onChange={handleChange} placeholder="Enter promotion code" style={{ ...inputStyle, flex: 1 }} />
              <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
            </div>

            {/* CTAs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button style={{ padding: '14px 0', borderRadius: 10, border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                Go to Payment Online
              </button>
              <button style={{ padding: '14px 0', borderRadius: 10, background: 'white', color: '#2563eb', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: '2px solid #2563eb' }}>
                Continue with Offline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function R() { return <span style={{ color: '#ef4444' }}>*</span>; }

const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.9rem', color: '#1e293b', background: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
