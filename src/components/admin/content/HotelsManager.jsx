import { useState } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../../config/api';
import {
  ActiveToggle, SkeletonRow, ErrorBanner, TableActions,
  SlidePanel, Field, inputStyle, selectStyle, SaveButton, FormMessage,
  CountrySelect, CountryFilterBar, DestinationSelect,
} from './ContentShared';

function HotelForm({ initial = {}, onSave, saving, msg }) {
  const [d, setD] = useState({
    country_id: '', slug: '', title: '', location: '', image: '', badge: '',
    category: 'upscale', stars: '4', destination: '', price: '',
    amenities: '', description: '', is_active: true, is_featured: false,
    ...initial,
    amenities: Array.isArray(initial.amenities) ? initial.amenities.join('\n') : (initial.amenities || ''),
  });
  const set = k => e => setD(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = e => {
    e.preventDefault();
    onSave({ ...d, price: parseFloat(d.price) || 0, amenities: d.amenities.split('\n').filter(Boolean) });
  };
  return (
    <form onSubmit={submit}>
      <FormMessage msg={msg} />
      <Field label="Country" required>
        <CountrySelect value={d.country_id} onChange={v => setD(p => ({ ...p, country_id: v, destination_id: '' }))} />
      </Field>
      <Field label="Destination City" hint="Which city is this hotel in?">
        <DestinationSelect countryId={d.country_id} value={d.destination_id} onChange={v => setD(p => ({ ...p, destination_id: v }))} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Hotel Name" required><input style={inputStyle} value={d.title} onChange={set('title')} required placeholder="The Siam Bangkok" /></Field>
        <Field label="Slug"><input style={inputStyle} value={d.slug} onChange={set('slug')} placeholder="siam-bangkok" /></Field>
        <Field label="Destination City"><input style={inputStyle} value={d.destination} onChange={set('destination')} placeholder="Bangkok" /></Field>
        <Field label="Location / Area"><input style={inputStyle} value={d.location} onChange={set('location')} placeholder="Bangkok - Riverside" /></Field>
        <Field label="Category">
          <select style={selectStyle} value={d.category} onChange={set('category')}>
            {['budget', 'mid-range', 'upscale', 'luxury', 'boutique'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Stars">
          <select style={selectStyle} value={d.stars} onChange={set('stars')}>{['1','2','3','4','5'].map(s => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Price per night (USD)" required><input style={inputStyle} type="number" step="0.01" value={d.price} onChange={set('price')} required placeholder="380" /></Field>
        <Field label="Badge"><input style={inputStyle} value={d.badge} onChange={set('badge')} placeholder="Featured" /></Field>
      </div>
      <Field label="Image URL">
        <input style={inputStyle} value={d.image} onChange={set('image')} placeholder="https://..." />
        {d.image && <img src={d.image} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10, marginTop: 8 }} onError={e => e.target.style.display = 'none'} />}
      </Field>
      <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={d.description} onChange={set('description')} /></Field>
      <Field label="Amenities (one per line)" hint="e.g. 🏊 Pool">
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={d.amenities} onChange={set('amenities')} placeholder={"🏊 Pool\n🍽️ Restaurant\n💆 Spa\n📶 WiFi"} />
      </Field>
      <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}><input type="checkbox" checked={d.is_active} onChange={set('is_active')} /> Active</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}><input type="checkbox" checked={d.is_featured} onChange={set('is_featured')} /> Featured</label>
      </div>
      <SaveButton saving={saving} label={initial.id ? 'Update Hotel' : 'Create Hotel'} />
    </form>
  );
}

export default function HotelsManager() {
  const { data, loading, error, refetch } = useAdminList('/api/admin/hotels', { per_page: 100 });
  const [panel,     setPanel]     = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [search,    setSearch]    = useState('');
  const [countryId, setCountryId] = useState('');

  const all = Array.isArray(data) ? data : (data?.data ?? []);
  const filtered = all.filter(t => {
    const matchCountry = !countryId || String(t.country_id) === countryId || String(t.country?.id) === countryId;
    const matchSearch  = !search.trim() || [t.title, t.location, t.destination].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  async function handleSave(payload) {
    setSaving(true); setMsg('');
    try {
      if (panel.mode === 'edit') {
        await adminPut(`/api/admin/hotels/${panel.item.id}`, payload);
        setMsg('✓ Hotel updated!');
      } else {
        if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await adminPost('/api/admin/hotels', payload);
        setMsg('✓ Hotel created!');
      }
      refetch(); setTimeout(() => setPanel(null), 900);
    } catch (e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this hotel?')) return;
    try { await adminDelete(`/api/admin/hotels/${id}`); refetch(); } catch (e) { alert(e.message); }
  }

  const categoryColors = { luxury: '#7c3aed', boutique: '#db2777', upscale: '#2563eb', 'mid-range': '#16a34a', budget: '#64748b' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>🏨 Hotels</h2>
          <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>{filtered.length} of {all.length} hotels</p>
        </div>
        <button onClick={() => { setMsg(''); setPanel({ mode: 'create' }); }} style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 800, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(249,115,22,.3)' }}>+ Add Hotel</button>
      </div>
      <ErrorBanner error={error} onRetry={refetch} />
      <CountryFilterBar search={search} onSearch={setSearch} countryId={countryId} onCountry={setCountryId} onRefresh={refetch} />
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['Image', 'Hotel', 'Country', 'Category', 'Stars', 'Price/Night', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                : filtered.map(t => (
                  <tr key={t.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 14px' }}>{t.image && <img src={t.image} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.title}</div>
                      {t.badge && <span style={{ fontSize: '.68rem', background: '#fff7ed', color: '#ea580c', borderRadius: 50, padding: '2px 8px', fontWeight: 700 }}>{t.badge}</span>}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '.75rem', background: '#f1f5f9', color: '#475569', borderRadius: 50, padding: '3px 10px', fontWeight: 700 }}>{t.country?.flag} {t.country?.name || '—'}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '.72rem', background: `${categoryColors[t.category] || '#64748b'}18`, color: categoryColors[t.category] || '#64748b', borderRadius: 50, padding: '3px 10px', fontWeight: 700, textTransform: 'capitalize' }}>{t.category}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#f59e0b', fontWeight: 700 }}>{'★'.repeat(parseInt(t.stars) || 0)}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>${t.price}</td>
                    <td style={{ padding: '10px 14px' }}><ActiveToggle active={t.is_active} onToggle={async () => { await adminPut(`/api/admin/hotels/${t.id}`, { is_active: !t.is_active }); refetch(); }} /></td>
                    <td style={{ padding: '10px 14px' }}><TableActions onEdit={() => { setMsg(''); setPanel({ mode: 'edit', item: t }); }} onDelete={() => handleDelete(t.id)} /></td>
                  </tr>
                ))}
              {!loading && !filtered.length && (<tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No hotels found.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {panel && (
        <SlidePanel title={panel.mode === 'edit' ? (panel.item?.title || 'Edit Hotel') : 'Add New Hotel'} sub="Hotels Manager" onClose={() => setPanel(null)}>
          <HotelForm initial={panel.item || {}} onSave={handleSave} saving={saving} msg={msg} />
        </SlidePanel>
      )}
    </div>
  );
}
