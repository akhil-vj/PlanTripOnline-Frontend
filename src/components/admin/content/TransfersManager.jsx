import { useState } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../../config/api';
import {
  ActiveToggle, SkeletonRow, ErrorBanner, TableActions,
  SlidePanel, Field, inputStyle, SaveButton, FormMessage,
  CountrySelect, CountryFilterBar, DestinationSelect,
} from './ContentShared';

function TransferForm({ initial = {}, onSave, saving, msg }) {
  const [d, setD] = useState({
    country_id: '', slug: '', title: '', from_location: '', to_location: '',
    duration: '', price: '', image: '', vehicles: '', description: '', is_active: true,
    ...initial,
    vehicles: Array.isArray(initial.vehicles) ? initial.vehicles.join(', ') : (initial.vehicles || ''),
  });
  const set = k => e => setD(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = e => {
    e.preventDefault();
    onSave({ ...d, price: parseFloat(d.price) || 0, vehicles: d.vehicles.split(',').map(v => v.trim()).filter(Boolean) });
  };
  return (
    <form onSubmit={submit}>
      <FormMessage msg={msg} />
      <Field label="Country" required>
        <CountrySelect value={d.country_id} onChange={v => setD(p => ({ ...p, country_id: v, destination_id: '' }))} />
      </Field>
      <Field label="Destination City" hint="Which city is this transfer route in?">
        <DestinationSelect countryId={d.country_id} value={d.destination_id} onChange={v => setD(p => ({ ...p, destination_id: v }))} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title" required><input style={inputStyle} value={d.title} onChange={set('title')} required placeholder="Bangkok Airport to City" /></Field>
        <Field label="Slug"><input style={inputStyle} value={d.slug} onChange={set('slug')} placeholder="bkk-airport-city" /></Field>
        <Field label="From Location" required><input style={inputStyle} value={d.from_location} onChange={set('from_location')} required placeholder="Suvarnabhumi Airport" /></Field>
        <Field label="To Location" required><input style={inputStyle} value={d.to_location} onChange={set('to_location')} required placeholder="Bangkok City Center" /></Field>
        <Field label="Duration"><input style={inputStyle} value={d.duration} onChange={set('duration')} placeholder="45-60 min" /></Field>
        <Field label="Base Price (USD)" required><input style={inputStyle} type="number" step="0.01" value={d.price} onChange={set('price')} required placeholder="25" /></Field>
        <Field label="Vehicles (comma separated)" hint="e.g. Sedan, SUV, Van"><input style={inputStyle} value={d.vehicles} onChange={set('vehicles')} placeholder="Sedan, SUV, Van" /></Field>
      </div>
      <Field label="Image URL">
        <input style={inputStyle} value={d.image} onChange={set('image')} placeholder="https://..." />
        {d.image && <img src={d.image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginTop: 8 }} onError={e => e.target.style.display = 'none'} />}
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={d.description} onChange={set('description')} placeholder="Comfortable airport transfer with meet & greet service." />
      </Field>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600, marginBottom: 14 }}><input type="checkbox" checked={d.is_active} onChange={set('is_active')} /> Active</label>
      <SaveButton saving={saving} label={initial.id ? 'Update Transfer' : 'Create Transfer'} />
    </form>
  );
}

export default function TransfersManager() {
  const { data, loading, error, refetch } = useAdminList('/api/admin/transfers', { per_page: 100 });
  const [panel,     setPanel]     = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [search,    setSearch]    = useState('');
  const [countryId, setCountryId] = useState('');

  const all = Array.isArray(data) ? data : (data?.data ?? []);
  const filtered = all.filter(t => {
    const matchCountry = !countryId || String(t.country_id) === countryId || String(t.country?.id) === countryId;
    const matchSearch  = !search.trim() || [t.title, t.from_location, t.to_location].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  async function handleSave(payload) {
    setSaving(true); setMsg('');
    try {
      if (panel.mode === 'edit') {
        await adminPut(`/api/admin/transfers/${panel.item.id}`, payload);
        setMsg('✓ Transfer updated!');
      } else {
        if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await adminPost('/api/admin/transfers', payload);
        setMsg('✓ Transfer created!');
      }
      refetch(); setTimeout(() => setPanel(null), 900);
    } catch (e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this transfer?')) return;
    try { await adminDelete(`/api/admin/transfers/${id}`); refetch(); } catch (e) { alert(e.message); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>🚗 Transfers</h2>
          <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>{filtered.length} of {all.length} routes</p>
        </div>
        <button onClick={() => { setMsg(''); setPanel({ mode: 'create' }); }} style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 800, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(249,115,22,.3)' }}>+ Add Transfer</button>
      </div>
      <ErrorBanner error={error} onRetry={refetch} />
      <CountryFilterBar search={search} onSearch={setSearch} countryId={countryId} onCountry={setCountryId} onRefresh={refetch} />
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['Image', 'Route', 'Country', 'From → To', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                : filtered.map(t => (
                  <tr key={t.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 14px' }}>{t.image && <img src={t.image} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a', maxWidth: 140 }}>{t.title}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '.75rem', background: '#f1f5f9', color: '#475569', borderRadius: 50, padding: '3px 10px', fontWeight: 700 }}>{t.country?.flag} {t.country?.name || '—'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#475569', fontSize: '.78rem' }}>
                      <span style={{ fontWeight: 600 }}>{t.from_location}</span>
                      <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                      <span style={{ fontWeight: 600 }}>{t.to_location}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{t.duration || '—'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>From ${t.price}</td>
                    <td style={{ padding: '10px 14px' }}><ActiveToggle active={t.is_active} onToggle={async () => { await adminPut(`/api/admin/transfers/${t.id}`, { is_active: !t.is_active }); refetch(); }} /></td>
                    <td style={{ padding: '10px 14px' }}><TableActions onEdit={() => { setMsg(''); setPanel({ mode: 'edit', item: t }); }} onDelete={() => handleDelete(t.id)} /></td>
                  </tr>
                ))}
              {!loading && !filtered.length && (<tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No transfers found.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {panel && (
        <SlidePanel title={panel.mode === 'edit' ? (panel.item?.title || 'Edit Transfer') : 'Add Transfer Route'} sub="Transfers Manager" onClose={() => setPanel(null)}>
          <TransferForm initial={panel.item || {}} onSave={handleSave} saving={saving} msg={msg} />
        </SlidePanel>
      )}
    </div>
  );
}
