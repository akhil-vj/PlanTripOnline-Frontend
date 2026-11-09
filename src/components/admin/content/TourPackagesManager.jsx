import { useState, useRef } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../../config/api';
import {
  ActiveToggle, SkeletonRow, ErrorBanner, TableActions,
  SlidePanel, Field, inputStyle, SaveButton, FormMessage,
  CountrySelect, CountryFilterBar, DestinationSelect, ImageUpload, sanitize,
} from './ContentShared';

/* ── CSV parser ───────────────────────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur); cur = ''; }
      else { cur += ch; }
    }
    vals.push(cur);
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim()]));
  });
}

function PackageForm({ initial = {}, onSave, saving, msg }) {
  const [d, setD] = useState({
    country_id: '', slug: '', title: '', subtitle: '', image: '', badge: '',
    duration: '', price: '', includes: '', description: '', is_active: true, is_featured: false,
    ...sanitize(initial),
    includes: Array.isArray(initial.includes) ? initial.includes.join('\n') : (initial.includes || ''),
  });
  const set = k => e => setD(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = e => {
    e.preventDefault();
    onSave({ ...d, price: parseFloat(d.price) || 0, includes: d.includes.split('\n').filter(Boolean) });
  };
  return (
    <form onSubmit={submit}>
      <FormMessage msg={msg} />
      <Field label="Country" required>
        <CountrySelect value={d.country_id} onChange={v => setD(p => ({ ...p, country_id: v, destination_id: '' }))} />
      </Field>
      <Field label="Destination City" hint="Which destination does this package cover?">
        <DestinationSelect countryId={d.country_id} value={d.destination_id} onChange={v => setD(p => ({ ...p, destination_id: v }))} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title" required><input style={inputStyle} value={d.title} onChange={set('title')} required placeholder="Best of Thailand 7 Days" /></Field>
        <Field label="Slug"><input style={inputStyle} value={d.slug} onChange={set('slug')} placeholder="best-of-thailand-7d" /></Field>
        <Field label="Badge"><input style={inputStyle} value={d.badge} onChange={set('badge')} placeholder="Most Popular" /></Field>
        <Field label="Price (USD)" required><input style={inputStyle} type="number" step="0.01" value={d.price} onChange={set('price')} required placeholder="1299" /></Field>
        <Field label="Duration"><input style={inputStyle} value={d.duration} onChange={set('duration')} placeholder="7D/6N" /></Field>
      </div>
      <Field label="Subtitle"><input style={inputStyle} value={d.subtitle} onChange={set('subtitle')} placeholder="Bangkok • Chiang Mai • Phuket" /></Field>
      <Field label="Image">
        <ImageUpload value={d.image} onChange={url => setD(p => ({ ...p, image: url }))} />
      </Field>
      <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={d.description} onChange={set('description')} /></Field>
      <Field label="Includes (one per line)" hint="e.g. 🏨 Hotels">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={d.includes} onChange={set('includes')} placeholder={"🏨 Hotels\n✈️ Flights\n🍽️ Meals"} />
      </Field>
      <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}><input type="checkbox" checked={d.is_active} onChange={set('is_active')} /> Active</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}><input type="checkbox" checked={d.is_featured} onChange={set('is_featured')} /> Featured</label>
      </div>
      <SaveButton saving={saving} label={initial.id ? 'Update Package' : 'Create Package'} />
    </form>
  );
}

export default function TourPackagesManager() {
  const { data, loading, error, refetch } = useAdminList('/api/admin/tour-packages', { per_page: 100 });
  const [panel,     setPanel]     = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [search,    setSearch]    = useState('');
  const [countryId, setCountryId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef(null);

  const all = Array.isArray(data) ? data : (data?.data ?? []);
  const filtered = all.filter(t => {
    const matchCountry = !countryId || String(t.country_id) === countryId || String(t.country?.id) === countryId;
    const matchSearch  = !search.trim() || t.title?.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  async function handleSave(payload) {
    setSaving(true); setMsg('');
    try {
      if (panel.mode === 'edit') {
        await adminPut(`/api/admin/tour-packages/${panel.item.id}`, payload);
        setMsg('✓ Package updated!');
      } else {
        if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await adminPost('/api/admin/tour-packages', payload);
        setMsg('✓ Package created!');
      }
      refetch(); setTimeout(() => setPanel(null), 900);
    } catch (e) { setMsg(`⚠️ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this package?')) return;
    try { await adminDelete(`/api/admin/tour-packages/${id}`); refetch(); } catch (e) { alert(e.message); }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setImporting(true); setImportMsg('');
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) { setImportMsg('⚠️ No data rows found in CSV'); setImporting(false); return; }
      let ok = 0, fail = 0;
      for (const row of rows) {
        try {
          const payload = {
            title: row.title || '', slug: row.slug || '',
            subtitle: row.subtitle || '', badge: row.badge || '',
            price: parseFloat(row.price) || 0, duration: row.duration || '',
            description: row.description || '', image: row.image || '',
            country_id: row.country_id || '', destination_id: row.destination_id || '',
            is_active: row.is_active !== 'false' && row.is_active !== '0',
            is_featured: row.is_featured === 'true' || row.is_featured === '1',
            includes: row.includes ? row.includes.split('|').filter(Boolean) : [],
          };
          if (!payload.slug && payload.title) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await adminPost('/api/admin/tour-packages', payload);
          ok++;
        } catch (_) { fail++; }
      }
      setImportMsg(`✓ Imported ${ok} package${ok !== 1 ? 's' : ''}${fail ? ` — ${fail} failed` : ''}`);
      refetch();
    } catch (err) {
      setImportMsg(`⚠️ ${err.message || 'Import failed'}`);
    } finally { setImporting(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>📦 Tour Packages</h2>
          <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>{filtered.length} of {all.length} packages</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            title="CSV columns: title, slug, subtitle, badge, price, duration, description, image, country_id, destination_id, is_active, is_featured, includes (pipe-separated)"
            style={{ padding: '10px 18px', background: importing ? '#e2e8f0' : '#fff', color: importing ? '#94a3b8' : '#0f172a', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 700, fontSize: '.82rem', cursor: importing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {importing ? '⏳ Importing…' : '📥 Import CSV'}
          </button>
          <button onClick={() => { setMsg(''); setPanel({ mode: 'create' }); }} style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 800, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(249,115,22,.3)' }}>+ Add Package</button>
        </div>
      </div>
      {importMsg && (
        <div style={{ padding: '10px 16px', borderRadius: 10, fontSize: '.83rem', fontWeight: 600,
          background: importMsg.startsWith('✓') ? '#dcfce7' : '#fef9c3',
          color: importMsg.startsWith('✓') ? '#16a34a' : '#a16207',
          border: `1px solid ${importMsg.startsWith('✓') ? '#bbf7d0' : '#fde68a'}` }}>
          {importMsg}
          <button onClick={() => setImportMsg('')} style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, color: 'inherit' }}>✕</button>
        </div>
      )}
      <ErrorBanner error={error} onRetry={refetch} />
      <CountryFilterBar search={search} onSearch={setSearch} countryId={countryId} onCountry={setCountryId} onRefresh={refetch} />
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['Image', 'Title', 'Country', 'Duration', 'Price', 'Badge', 'Status', 'Actions'].map(h => (
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
                      <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>{t.subtitle}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '.75rem', background: '#f1f5f9', color: '#475569', borderRadius: 50, padding: '3px 10px', fontWeight: 700 }}>{t.country?.flag} {t.country?.name || '—'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{t.duration || '—'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>${t.price}</td>
                    <td style={{ padding: '10px 14px' }}>{t.badge && <span style={{ fontSize: '.68rem', background: '#fff7ed', color: '#ea580c', borderRadius: 50, padding: '2px 8px', fontWeight: 700 }}>{t.badge}</span>}</td>
                    <td style={{ padding: '10px 14px' }}><ActiveToggle active={t.is_active} onToggle={async () => { await adminPut(`/api/admin/tour-packages/${t.id}`, { is_active: !t.is_active }); refetch(); }} /></td>
                    <td style={{ padding: '10px 14px' }}><TableActions onEdit={() => { setMsg(''); setPanel({ mode: 'edit', item: t }); }} onDelete={() => handleDelete(t.id)} /></td>
                  </tr>
                ))}
              {!loading && !filtered.length && (<tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No packages found.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {panel && (
        <SlidePanel title={panel.mode === 'edit' ? (panel.item?.title || 'Edit Package') : 'Add Tour Package'} sub="Tour Packages Manager" onClose={() => setPanel(null)}>
          <PackageForm initial={panel.item || {}} onSave={handleSave} saving={saving} msg={msg} />
        </SlidePanel>
      )}
    </div>
  );
}
