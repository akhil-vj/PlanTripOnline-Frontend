import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PlanTripPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, country, image, description, highlights, badge, rating } = location.state || {};

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', num: 1 },
    { id: 'inclusions', label: 'Inclusions / Exclusions', num: 2 },
    { id: 'itinerary', label: 'Itinerary', num: 3 },
    { id: 'review', label: 'Review', num: 4 },
  ];

  const destHighlights = highlights || ['Temple visits', 'Local cuisine', 'Cultural experiences', 'Guided tour'];

  const handleBookNow = () => {
    navigate('/book-trip', {
      state: { destination, country, image, rating }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f8', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>{destination || 'Destination'} – PlantripOnline</title>
      </Helmet>

      {/* Top Nav */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 200
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb',
            fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6
          }}>← Back</button>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>{destination || 'Destination'}</span>
          {country && <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>· {country}</span>}
        </div>

        <button onClick={handleBookNow} style={{
          padding: '10px 24px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white', fontWeight: 700, fontSize: '0.95rem',
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8
        }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)'; }}>
          <span>Book Now</span>
          <span style={{ fontSize: '1.1rem' }}>→</span>
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* ─── FULL-WIDTH MAIN CONTENT ─── */}
        <div>
          {/* Hero Image */}
          {image && (
            <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 24, position: 'relative', height: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src={image} alt={destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)'
              }} />
              <div style={{ position: 'absolute', bottom: 28, left: 32, color: 'white' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {destination}
                </h1>
                {country && <p style={{ margin: '6px 0 0', opacity: 0.95, fontSize: '1.05rem', fontWeight: 500 }}>📍 {country}</p>}
              </div>
              {badge && (
                <div style={{
                  position: 'absolute', top: 20, left: 24,
                  background: '#ff9500', color: 'white', padding: '6px 16px',
                  borderRadius: 25, fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>{badge}</div>
              )}
              {rating && (
                <div style={{
                  position: 'absolute', top: 20, right: 24,
                  background: 'rgba(0,0,0,0.65)', color: '#fbbf24', padding: '7px 14px',
                  borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', backdropFilter: 'blur(8px)'
                }}>★ {rating}</div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{
            background: 'white', borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  flex: 1, padding: '18px 12px', border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.9rem', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', fontSize: '0.82rem', fontWeight: 700,
                    background: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{tab.num}</div>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '36px 40px' }}>

              {/* ── OVERVIEW TAB: Product Details ── */}
              {activeTab === 'overview' && (
                <div>
                  {/* About */}
                  <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>About This Destination</h2>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem' }}>
                      {description || `Experience the very best of ${destination}, ${country}. From breathtaking landscapes to rich cultural heritage, this destination offers an unforgettable journey filled with authentic local experiences, world-class attractions, and warm hospitality. Whether you're traveling solo, as a couple, or with family, our expertly curated trips ensure every moment is special.`}
                    </p>
                  </section>

                  {/* Highlights */}
                  <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Highlights</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                      {destHighlights.map((h, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 18px', background: '#f8fafc', borderRadius: 10,
                          border: '1px solid #e2e8f0', fontSize: '0.92rem', color: '#374151', fontWeight: 500
                        }}>
                          <span style={{ color: '#ff9500', fontSize: '1.1rem' }}>✦</span> {h}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Quick Info */}
                  <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Quick Info</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
                      {[
                        { icon: '🕐', label: 'Duration', value: 'Full Day' },
                        { icon: '👥', label: 'Group Size', value: 'Up to 15' },
                        { icon: '🗣️', label: 'Language', value: 'English' },
                        { icon: '📍', label: 'Location', value: country || 'Asia' },
                        { icon: '🎫', label: 'Tickets', value: 'Included' },
                        { icon: '🍽️', label: 'Meals', value: 'As specified' },
                      ].map((item, i) => (
                        <div key={i} style={{
                          padding: '16px', background: '#fafafa', borderRadius: 12,
                          border: '1px solid #f1f5f9', textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{item.icon}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* What to Expect */}
                  <section style={{ marginBottom: 36 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>What to Expect</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      {[
                        { step: '01', title: 'Pickup from your hotel', desc: 'Our driver will collect you from your accommodation at the scheduled time.' },
                        { step: '02', title: 'Guided sightseeing', desc: 'Explore the top attractions with an expert local guide who brings each site to life.' },
                        { step: '03', title: 'Authentic local experiences', desc: 'Enjoy curated cultural activities, cuisine, and interactions with locals.' },
                        { step: '04', title: 'Drop-off & memories', desc: 'Return comfortably to your hotel with unforgettable experiences and photos.' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #ff9500, #ea580c)',
                            color: 'white', fontWeight: 800, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>{item.step}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: 4 }}>{item.title}</div>
                            <div style={{ color: '#64748b', fontSize: '0.86rem', lineHeight: 1.6 }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Bottom CTA Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    borderRadius: 14, padding: '26px 32px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.2)', color: 'white'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Ready to experience {destination}?</h3>
                      <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Instant confirmation · Best price guarantee · Free support</p>
                    </div>
                    <button onClick={handleBookNow} style={{
                      padding: '14px 34px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #ff9500, #ea580c)',
                      color: 'white', fontWeight: 800, fontSize: '1rem',
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,149,0,0.4)',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(255,149,0,0.55)'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,149,0,0.4)'; }}>
                      Book Now ➔
                    </button>
                  </div>
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

      </div>
    </div>
  );
}
