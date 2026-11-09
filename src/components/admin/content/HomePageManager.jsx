import { useState, useEffect, useMemo } from 'react';
import {
  getHomepageConfig,
  saveHomepageConfig,
  resetHomepageConfig,
  loadAllExistingCountries,
  loadAllExistingDestinations,
  loadAllExistingDayTours,
  getSeedDestinations,
  getSeedDayTours,
  DEFAULT_CURATION,
} from '../../../services/homepageService';
import { featuredCountries } from '../../../data/global';

export default function HomePageManager() {
  // Curation state (selected IDs/keys)
  const [curation, setCuration] = useState(getHomepageConfig);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'carousel' | 'tours'
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Loaded catalogs of existing items
  const [allCountries, setAllCountries] = useState(featuredCountries);
  const [allDestinations, setAllDestinations] = useState(getSeedDestinations);
  const [allDayTours, setAllDayTours] = useState(getSeedDayTours);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'

  // Load existing records from backend + seeds on mount
  useEffect(() => {
    let mounted = true;
    setLoadingCatalog(true);

    Promise.all([
      loadAllExistingCountries(),
      loadAllExistingDestinations(),
      loadAllExistingDayTours(),
    ]).then(([countries, dests, tours]) => {
      if (!mounted) return;
      if (countries?.length) setAllCountries(countries);
      if (dests?.length) setAllDestinations(dests);
      if (tours?.length) setAllDayTours(tours);
      setLoadingCatalog(false);
    }).catch(() => {
      if (mounted) setLoadingCatalog(false);
    });

    return () => { mounted = false; };
  }, []);

  // Save handler
  function handleSave() {
    setSaving(true);
    const ok = saveHomepageConfig(curation);
    setTimeout(() => {
      setSaving(false);
      if (ok) {
        setMsg('✓ Homepage curation saved and updated live!');
        setTimeout(() => setMsg(''), 3500);
      } else {
        setMsg('⚠️ Failed to save changes.');
      }
    }, 200);
  }

  // Reset handler
  function handleReset() {
    if (!window.confirm('Reset homepage selections back to default settings?')) return;
    const defaults = resetHomepageConfig();
    setCuration(defaults);
    setMsg('✓ Reset back to factory defaults!');
    setTimeout(() => setMsg(''), 3000);
  }

  // ── Hero Countries Selection ──────────────────────────────────────────────
  const heroCountrySlugSet = useMemo(() => {
    return new Set((curation.heroCountrySlugs || []).map(s => String(s).toLowerCase().trim()));
  }, [curation.heroCountrySlugs]);

  function toggleHeroCountry(slug) {
    const s = String(slug).toLowerCase().trim();
    const current = curation.heroCountrySlugs || [];
    let updated;
    if (heroCountrySlugSet.has(s)) {
      updated = current.filter(x => String(x).toLowerCase().trim() !== s);
    } else {
      updated = [...current, s];
    }
    const newConfig = { ...curation, heroCountrySlugs: updated };
    setCuration(newConfig);
    saveHomepageConfig(newConfig);
  }

  function selectAllCountries() {
    const all = allCountries.map(c => (c.slug || c.name || '').toLowerCase().trim());
    const newConfig = { ...curation, heroCountrySlugs: all };
    setCuration(newConfig);
    saveHomepageConfig(newConfig);
  }

  function deselectAllCountries() {
    const newConfig = { ...curation, heroCountrySlugs: [] };
    setCuration(newConfig);
    saveHomepageConfig(newConfig);
  }

  // ── Carousel Destinations Selection ───────────────────────────────────────
  const carouselDestKeySet = useMemo(() => {
    return new Set((curation.carouselDestKeys || []).map(k => String(k).toLowerCase().trim()));
  }, [curation.carouselDestKeys]);

  function toggleCarouselDest(key) {
    const k = String(key).toLowerCase().trim();
    const current = curation.carouselDestKeys || [];
    let updated;
    if (carouselDestKeySet.has(k)) {
      updated = current.filter(x => String(x).toLowerCase().trim() !== k);
    } else {
      updated = [...current, k];
    }
    const newConfig = { ...curation, carouselDestKeys: updated };
    setCuration(newConfig);
    saveHomepageConfig(newConfig);
  }

  // ── Trending Day Tours Selection ──────────────────────────────────────────
  const trendingTourKeySet = useMemo(() => {
    return new Set((curation.trendingTourKeys || []).map(k => String(k).toLowerCase().trim()));
  }, [curation.trendingTourKeys]);

  function toggleTrendingTour(key) {
    const k = String(key).toLowerCase().trim();
    const current = curation.trendingTourKeys || [];
    let updated;
    if (trendingTourKeySet.has(k)) {
      updated = current.filter(x => String(x).toLowerCase().trim() !== k);
    } else {
      updated = [...current, k];
    }
    const newConfig = { ...curation, trendingTourKeys: updated };
    setCuration(newConfig);
    saveHomepageConfig(newConfig);
  }

  // ── Filtered Catalog Lists ────────────────────────────────────────────────
  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allDestinations.filter(d => {
      const matchSearch = !q || (d.name || '').toLowerCase().includes(q) || (d.country || '').toLowerCase().includes(q);
      const matchCountry = filterCountry === 'ALL' || (d.country || '').toLowerCase() === filterCountry.toLowerCase();
      const isActive = carouselDestKeySet.has(d.key);
      const matchStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' && isActive) || (filterStatus === 'INACTIVE' && !isActive);
      return matchSearch && matchCountry && matchStatus;
    });
  }, [allDestinations, search, filterCountry, filterStatus, carouselDestKeySet]);

  const filteredDayTours = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allDayTours.filter(t => {
      const matchSearch = !q || (t.title || '').toLowerCase().includes(q) || (t.country || '').toLowerCase().includes(q) || (t.location || '').toLowerCase().includes(q);
      const matchCountry = filterCountry === 'ALL' || (t.country || '').toLowerCase() === filterCountry.toLowerCase();
      const isActive = trendingTourKeySet.has(t.key);
      const matchStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' && isActive) || (filterStatus === 'INACTIVE' && !isActive);
      return matchSearch && matchCountry && matchStatus;
    });
  }, [allDayTours, search, filterCountry, filterStatus, trendingTourKeySet]);

  // Unique country names for filter tabs
  const destinationCountries = useMemo(() => {
    const set = new Set(allDestinations.map(d => d.country).filter(Boolean));
    return Array.from(set);
  }, [allDestinations]);

  const tourCountries = useMemo(() => {
    const set = new Set(allDayTours.map(t => t.country).filter(Boolean));
    return Array.from(set);
  }, [allDayTours]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        @keyframes admPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .hp-tab-btn {
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 800;
          font-size: .86rem;
          border: 1.5px solid transparent;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all .2s ease;
        }
        .hp-tab-btn.active {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
          box-shadow: 0 4px 14px rgba(15,23,42,.15);
        }
        .hp-tab-btn:not(.active) {
          background: #fff;
          color: #64748b;
          border-color: #e2e8f0;
        }
        .hp-tab-btn:not(.active):hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .hp-card-row {
          transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease;
        }
        .hp-card-row:hover {
          background: #f8fafc;
        }
      `}</style>

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '20px 24px',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.6rem' }}>🏠</span>
            <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-.4px' }}>
              Home Page Controller
            </h1>
            <span style={{
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '3px 10px',
              borderRadius: 50,
              fontSize: '.72rem',
              fontWeight: 800,
            }}>
              Live Curation
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '.84rem', color: '#64748b' }}>
            Curate what appears on the public homepage by picking from existing database records. No manual typing required.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('/', '_blank')}
            title="Open live homepage in a new tab"
            style={{
              padding: '9px 16px',
              background: '#f8fafc',
              color: '#334155',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Preview Site</span>
            <span>↗</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset selections back to default"
            style={{
              padding: '9px 16px',
              background: '#fff',
              color: '#dc2626',
              border: '1.5px solid #fee2e2',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '.82rem',
              cursor: 'pointer',
            }}
          >
            ↺ Reset Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(249,115,22,.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {saving ? 'Saving…' : '✓ Save Curation'}
          </button>
        </div>
      </div>

      {/* ── Status Message Toast ────────────────────────────────────────────── */}
      {msg && (
        <div style={{
          background: msg.includes('⚠️') ? '#fef2f2' : '#ecfdf5',
          color: msg.includes('⚠️') ? '#dc2626' : '#059669',
          border: `1.5px solid ${msg.includes('⚠️') ? '#fecaca' : '#a7f3d0'}`,
          borderRadius: 12,
          padding: '12px 18px',
          fontWeight: 700,
          fontSize: '.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span>{msg}</span>
        </div>
      )}

      {/* ── Section Navigation Tabs ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className={`hp-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => { setActiveTab('hero'); setSearch(''); setFilterCountry('ALL'); }}
        >
          <span>🏷️</span>
          <span>1. Hero Country Pills</span>
          <span style={{
            background: activeTab === 'hero' ? 'rgba(255,255,255,.2)' : '#f1f5f9',
            color: activeTab === 'hero' ? '#fff' : '#64748b',
            borderRadius: 50,
            padding: '2px 8px',
            fontSize: '.72rem',
          }}>
            {curation.heroCountrySlugs?.length || 0}
          </span>
        </button>

        <button
          className={`hp-tab-btn ${activeTab === 'carousel' ? 'active' : ''}`}
          onClick={() => { setActiveTab('carousel'); setSearch(''); setFilterCountry('ALL'); }}
        >
          <span>🎡</span>
          <span>2. Popular Destinations Carousel</span>
          <span style={{
            background: activeTab === 'carousel' ? 'rgba(255,255,255,.2)' : '#f1f5f9',
            color: activeTab === 'carousel' ? '#fff' : '#64748b',
            borderRadius: 50,
            padding: '2px 8px',
            fontSize: '.72rem',
          }}>
            {curation.carouselDestKeys?.length || 0}
          </span>
        </button>

        <button
          className={`hp-tab-btn ${activeTab === 'tours' ? 'active' : ''}`}
          onClick={() => { setActiveTab('tours'); setSearch(''); setFilterCountry('ALL'); }}
        >
          <span>⭐</span>
          <span>3. Trending Day Tours</span>
          <span style={{
            background: activeTab === 'tours' ? 'rgba(255,255,255,.2)' : '#f1f5f9',
            color: activeTab === 'tours' ? '#fff' : '#64748b',
            borderRadius: 50,
            padding: '2px 8px',
            fontSize: '.72rem',
          }}>
            {curation.trendingTourKeys?.length || 0}
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: HERO "POPULAR DESTINATIONS" COUNTRY PILLS                       */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Preview Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 18,
            padding: '20px 24px',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>
                Live Hero Section Preview
              </span>
              <span style={{ fontSize: '.75rem', color: '#f97316', fontWeight: 700 }}>
                {curation.heroCountrySlugs?.length || 0} countries active
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.88rem', fontWeight: 700, color: '#e2e8f0' }}>
                Popular Destinations:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {curation.heroCountrySlugs?.length === 0 ? (
                  <span style={{ fontSize: '.8rem', color: '#ef4444', fontStyle: 'italic' }}>
                    (None selected — Hero pill bar is currently hidden on homepage)
                  </span>
                ) : (
                  curation.heroCountrySlugs.map(slug => {
                    const found = allCountries.find(c => (c.slug || c.name || '').toLowerCase().trim() === slug.toLowerCase().trim());
                    return (
                      <span
                        key={slug}
                        style={{
                          background: 'rgba(255,255,255,.15)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255,255,255,.25)',
                          borderRadius: 50,
                          padding: '6px 14px',
                          fontSize: '.82rem',
                          fontWeight: 700,
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>{found?.flag || '🌏'}</span>
                        <span>{found?.name || slug}</span>
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Table / List of Existing Countries */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,.05)',
            border: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Pick Countries to Show in Hero Bar
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '.8rem', color: '#64748b' }}>
                  Select from existing countries in the system. Toggling on will immediately display the pill under the search bar.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={selectAllCountries}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllCountries}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#dc2626',
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Country</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Slug / Route</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Catalogue Tours</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Hero Bar Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allCountries.map(c => {
                    const slug = (c.slug || c.name || '').toLowerCase().trim();
                    const isSelected = heroCountrySlugSet.has(slug);

                    return (
                      <tr
                        key={slug}
                        className="hp-card-row"
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                        onClick={() => toggleHeroCountry(slug)}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '1.4rem' }}>{c.flag || '🌏'}</span>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '.92rem' }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: '.8rem' }}>
                          /{slug}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>
                          <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: '.75rem', fontWeight: 700 }}>
                            {c.tourCount || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          {isSelected ? (
                            <span style={{
                              background: '#dcfce7',
                              color: '#16a34a',
                              padding: '4px 12px',
                              borderRadius: 50,
                              fontSize: '.75rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                            }}>
                              <span>●</span> Displayed in Hero
                            </span>
                          ) : (
                            <span style={{
                              background: '#f1f5f9',
                              color: '#94a3b8',
                              padding: '4px 12px',
                              borderRadius: 50,
                              fontSize: '.75rem',
                              fontWeight: 700,
                            }}>
                              Hidden
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleHeroCountry(slug); }}
                            style={{
                              background: isSelected ? '#fee2e2' : '#f0fdf4',
                              color: isSelected ? '#dc2626' : '#16a34a',
                              border: `1.5px solid ${isSelected ? '#fecaca' : '#bbf7d0'}`,
                              borderRadius: 10,
                              padding: '6px 14px',
                              fontWeight: 800,
                              fontSize: '.78rem',
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✕ Hide from Hero' : '+ Show in Hero'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: POPULAR DESTINATIONS 3D CAROUSEL                                */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'carousel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Summary & Indicator */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            padding: '18px 22px',
            boxShadow: '0 2px 10px rgba(0,0,0,.04)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Pick Existing Destinations for the 3D Carousel
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '.8rem', color: '#64748b' }}>
                Click any destination to toggle on/off. Recommended: <strong>5 to 8 destinations</strong> for smooth 3D carousel circular rotation.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: curation.carouselDestKeys?.length >= 5 ? '#f0fdf4' : '#fffbeb',
                border: `1.5px solid ${curation.carouselDestKeys?.length >= 5 ? '#bbf7d0' : '#fde68a'}`,
                padding: '6px 14px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: '1rem' }}>🎡</span>
                <span style={{
                  fontWeight: 900,
                  fontSize: '.85rem',
                  color: curation.carouselDestKeys?.length >= 5 ? '#15803d' : '#b45309',
                }}>
                  {curation.carouselDestKeys?.length || 0} Destinations Selected
                </span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '12px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search destinations by city or country…"
              style={{
                flex: '1 1 220px',
                padding: '8px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.84rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={e => setFilterCountry(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.82rem',
                fontWeight: 700,
                color: '#334155',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value="ALL">All Countries</option>
              {destinationCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.82rem',
                fontWeight: 700,
                color: '#334155',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value="ALL">All Items</option>
              <option value="ACTIVE">✓ In Carousel Only ({curation.carouselDestKeys?.length || 0})</option>
              <option value="INACTIVE">○ Hidden Only</option>
            </select>
          </div>

          {/* Destinations Table */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,.05)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Image</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Destination</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Country</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Duration & Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Carousel Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                        No destinations found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDestinations.map(d => {
                      const isSelected = carouselDestKeySet.has(d.key);

                      return (
                        <tr
                          key={d.key}
                          className="hp-card-row"
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(240,253,244,.3)' : '#fff',
                          }}
                          onClick={() => toggleCarouselDest(d.key)}
                        >
                          <td style={{ padding: '12px 16px', width: 70 }}>
                            <img
                              src={d.image}
                              alt={d.name}
                              style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '.9rem' }}>{d.name}</div>
                            {d.badge && (
                              <span style={{ fontSize: '.7rem', color: '#2563eb', fontWeight: 700 }}>{d.badge}</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>
                            {d.country}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '.78rem' }}>
                            <div>{d.duration}</div>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{d.currency} {d.price}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: '#f59e0b', fontWeight: 800 }}>★ {d.rating}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            {isSelected ? (
                              <span style={{
                                background: '#dcfce7',
                                color: '#16a34a',
                                padding: '4px 12px',
                                borderRadius: 50,
                                fontSize: '.74rem',
                                fontWeight: 800,
                              }}>
                                ✓ On Carousel
                              </span>
                            ) : (
                              <span style={{
                                background: '#f1f5f9',
                                color: '#94a3b8',
                                padding: '4px 12px',
                                borderRadius: 50,
                                fontSize: '.74rem',
                                fontWeight: 700,
                              }}>
                                Hidden
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleCarouselDest(d.key); }}
                              style={{
                                background: isSelected ? '#fee2e2' : '#f0fdf4',
                                color: isSelected ? '#dc2626' : '#16a34a',
                                border: `1.5px solid ${isSelected ? '#fecaca' : '#bbf7d0'}`,
                                borderRadius: 10,
                                padding: '6px 14px',
                                fontWeight: 800,
                                fontSize: '.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              {isSelected ? '✕ Remove' : '+ Add to Carousel'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: TRENDING DAY TOURS                                              */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'tours' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Summary & Indicator */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            padding: '18px 22px',
            boxShadow: '0 2px 10px rgba(0,0,0,.04)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Pick Existing Day Tours for "Trending Day Tours"
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '.8rem', color: '#64748b' }}>
                Click any tour to toggle inclusion in the public trending section. Recommended: <strong>6 tours</strong> for a 3×2 grid.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: curation.trendingTourKeys?.length >= 6 ? '#f0fdf4' : '#fffbeb',
                border: `1.5px solid ${curation.trendingTourKeys?.length >= 6 ? '#bbf7d0' : '#fde68a'}`,
                padding: '6px 14px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <span style={{
                  fontWeight: 900,
                  fontSize: '.85rem',
                  color: curation.trendingTourKeys?.length >= 6 ? '#15803d' : '#b45309',
                }}>
                  {curation.trendingTourKeys?.length || 0} Tours Selected
                </span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '12px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search tours by title, location, or country…"
              style={{
                flex: '1 1 220px',
                padding: '8px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.84rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={e => setFilterCountry(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.82rem',
                fontWeight: 700,
                color: '#334155',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value="ALL">All Countries</option>
              {tourCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize: '.82rem',
                fontWeight: 700,
                color: '#334155',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value="ALL">All Tours</option>
              <option value="ACTIVE">✓ Trending Only ({curation.trendingTourKeys?.length || 0})</option>
              <option value="INACTIVE">○ Hidden Only</option>
            </select>
          </div>

          {/* Tours Table */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,.05)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Image</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Tour Experience</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Rating</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Homepage Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '.72rem', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDayTours.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                        No day tours found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDayTours.map(t => {
                      const isSelected = trendingTourKeySet.has(t.key);

                      return (
                        <tr
                          key={t.key}
                          className="hp-card-row"
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(240,253,244,.3)' : '#fff',
                          }}
                          onClick={() => toggleTrendingTour(t.key)}
                        >
                          <td style={{ padding: '12px 16px', width: 70 }}>
                            <img
                              src={t.image}
                              alt={t.title}
                              style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '.9rem' }}>{t.title}</div>
                            <span style={{ fontSize: '.7rem', color: '#64748b' }}>{t.type}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>
                            {t.location} • <span style={{ color: '#94a3b8' }}>{t.country}</span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                            {t.price}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: '#f59e0b', fontWeight: 800 }}>★ {t.rating}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            {isSelected ? (
                              <span style={{
                                background: '#dcfce7',
                                color: '#16a34a',
                                padding: '4px 12px',
                                borderRadius: 50,
                                fontSize: '.74rem',
                                fontWeight: 800,
                              }}>
                                ✓ In Trending
                              </span>
                            ) : (
                              <span style={{
                                background: '#f1f5f9',
                                color: '#94a3b8',
                                padding: '4px 12px',
                                borderRadius: 50,
                                fontSize: '.74rem',
                                fontWeight: 700,
                              }}>
                                Hidden
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleTrendingTour(t.key); }}
                              style={{
                                background: isSelected ? '#fee2e2' : '#f0fdf4',
                                color: isSelected ? '#dc2626' : '#16a34a',
                                border: `1.5px solid ${isSelected ? '#fecaca' : '#bbf7d0'}`,
                                borderRadius: 10,
                                padding: '6px 14px',
                                fontWeight: 800,
                                fontSize: '.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              {isSelected ? '✕ Remove' : '+ Add to Trending'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
