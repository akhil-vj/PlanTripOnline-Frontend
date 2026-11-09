/**
 * DestinationsManager — Two-level UI
 * Level 1: Country cards grid (Thailand, Malaysia, …)
 * Level 2: Sub-destinations list for the selected country (Bangkok, Phuket, …)
 */
import { useState } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../../config/api';
import { useCountries, sanitize } from './ContentShared';
import {
  ActiveToggle, SkeletonRow, ErrorBanner, TableActions,
  SlidePanel, Field, inputStyle, SaveButton, FormMessage, ImageUpload,
} from './ContentShared';

/* ── Sub-destination form ─────────────────────────────────────────────────── */
function DestForm({ initial = {}, countryId, onSave, saving, msg }) {
  const [d, setD] = useState({
    country_id: countryId, slug: '', name: '', image: '', badge: '',
    description: '', highlights: '', is_active: true,
    ...sanitize(initial),
    highlights: Array.isArray(initial.highlights)
      ? initial.highlights.join('\n')
      : (initial.highlights || ''),
  });
  const set = k => e => setD(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = e => {
    e.preventDefault();
    onSave({ ...d, highlights: d.highlights.split('\n').filter(Boolean) });
  };
  return (
    <form onSubmit={submit}>
      <FormMessage msg={msg} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Destination Name" required>
          <input style={inputStyle} value={d.name} onChange={set('name')} required placeholder="Bangkok" />
        </Field>
        <Field label="Slug" hint="Auto-generated if blank">
          <input style={inputStyle} value={d.slug} onChange={set('slug')} placeholder="bangkok" />
        </Field>
        <Field label="Badge">
          <input style={inputStyle} value={d.badge} onChange={set('badge')} placeholder="15 Tours" />
        </Field>
      </div>
      <Field label="Image">
        <ImageUpload value={d.image} onChange={url => setD(p => ({ ...p, image: url }))} />
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={d.description} onChange={set('description')} placeholder="Thailand's vibrant capital…" />
      </Field>
      <Field label="Highlights (one per line)" hint="e.g. Grand Palace">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={d.highlights} onChange={set('highlights')} placeholder={"Grand Palace\nWat Arun\nKhao San Road"} />
      </Field>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600, marginBottom: 14 }}>
        <input type="checkbox" checked={d.is_active} onChange={set('is_active')} /> Active
      </label>
      <SaveButton saving={saving} label={initial.id ? 'Update Destination' : 'Create Destination'} />
    </form>
  );
}

/* ── Sub-destinations list for one country ────────────────────────────────── */
function SubDestinationsList({ country, onBack }) {
  const { data, loading, error, refetch } = useAdminList('/api/admin/destinations', { country_id: country.id, per_page: 100 });
  const [panel,  setPanel]  = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [search, setSearch] = useState('');

  const all = Array.isArray(data) ? data : (data?.data ?? []);
  const filtered = all.filter(d =>
    (String(d.country_id) === String(country.id) || String(d.country?.id) === String(country.id)) &&
    (!search.trim() || d.name?.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleSave(payload) {
    setSaving(true); setMsg('');
    try {
      payload.country_id = country.id;
      if (panel.mode === 'edit') {
        await adminPut(`/api/admin/destinations/${panel.item.id}`, payload);
        setMsg('✓ Destination updated!');
      } else {
        if (!payload.slug) payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await adminPost('/api/admin/destinations', payload);
        setMsg('✓ Destination created!');
      }
      refetch(); setTimeout(() => setPanel(null), 900);
    } catch (e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this destination?')) return;
    try { await adminDelete(`/api/admin/destinations/${id}`); refetch(); } catch (e) { alert(e.message); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Breadcrumb header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '8px 14px',
              fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#475569',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >← Countries</button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
              {country.flag} {country.name} — Destinations
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>
              {filtered.length} sub-destinations
            </p>
          </div>
        </div>
        <button
          onClick={() => { setMsg(''); setPanel({ mode: 'create' }); }}
          style={{
            background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none',
            borderRadius: 12, padding: '10px 20px', fontWeight: 800, fontSize: '.88rem',
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(249,115,22,.3)',
          }}
        >+ Add Destination</button>
      </div>

      <ErrorBanner error={error} onRetry={refetch} />

      {/* Search */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'flex', gap: 10,
      }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={`🔍 Search ${country.name} destinations…`}
          style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={refetch} style={{ padding: '8px 16px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>↻</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Image', 'Name', 'Badge', 'Highlights', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                : filtered.map(t => (
                  <tr key={t.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 14px' }}>
                      {t.image && <img src={t.image} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{t.name}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {t.badge && <span style={{ fontSize: '.68rem', background: '#eff6ff', color: '#2563eb', borderRadius: 50, padding: '2px 8px', fontWeight: 700 }}>{t.badge}</span>}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '.75rem', maxWidth: 200 }}>
                      {(Array.isArray(t.highlights) ? t.highlights.slice(0, 2) : []).join(', ') || '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <ActiveToggle active={t.is_active} onToggle={async () => { await adminPut(`/api/admin/destinations/${t.id}`, { is_active: !t.is_active }); refetch(); }} />
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <TableActions onEdit={() => { setMsg(''); setPanel({ mode: 'edit', item: t }); }} onDelete={() => handleDelete(t.id)} />
                    </td>
                  </tr>
                ))}
              {!loading && !filtered.length && (
                <tr>
                  <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
                    No destinations in {country.name} yet.{' '}
                    <button onClick={() => setPanel({ mode: 'create' })} style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 700, cursor: 'pointer' }}>
                      Add the first one →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide panel */}
      {panel && (
        <SlidePanel
          title={panel.mode === 'edit' ? (panel.item?.name || 'Edit Destination') : `Add Destination in ${country.name}`}
          sub={`${country.flag} ${country.name} — Destinations`}
          onClose={() => setPanel(null)}
        >
          <DestForm initial={panel.item || {}} countryId={country.id} onSave={handleSave} saving={saving} msg={msg} />
        </SlidePanel>
      )}
    </div>
  );
}

/* ── Country card grid (Level 1) ─────────────────────────────────────────── */
function CountryCards({ onSelect }) {
  const { countries, loading } = useCountries();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 140, background: '#f1f5f9', borderRadius: 18, animation: 'admPulse 1.4s ease infinite' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
      {countries.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          style={{
            background: '#fff', border: '2px solid #e2e8f0', borderRadius: 18, padding: '28px 20px',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all .18s',
            boxShadow: '0 2px 8px rgba(0,0,0,.05)',
            ':hover': { borderColor: '#f97316', boxShadow: '0 8px 24px rgba(249,115,22,.15)' },
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)'; }}
        >
          <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>{c.flag || '🌍'}</div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: 4 }}>{c.name}</div>
          <div style={{ fontSize: '.72rem', color: '#94a3b8', fontWeight: 600 }}>
            Manage destinations →
          </div>
        </button>
      ))}
      {!countries.length && (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          No countries found. Add countries via your backend first.
        </div>
      )}
    </div>
  );
}

/* ── Root component ──────────────────────────────────────────────────────── */
export default function DestinationsManager() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {!selectedCountry ? (
        <>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>📍 Destinations</h2>
            <p style={{ margin: '4px 0 0', fontSize: '.85rem', color: '#64748b' }}>
              Select a country to manage its sub-destinations (Bangkok, Phuket, Kuala Lumpur, etc.)
            </p>
          </div>
          <CountryCards onSelect={setSelectedCountry} />
        </>
      ) : (
        <SubDestinationsList
          country={selectedCountry}
          onBack={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
