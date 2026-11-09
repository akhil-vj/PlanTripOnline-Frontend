import { useState } from 'react';
import { useAdminList } from '../../../hooks/useAdminApi';
import { adminPost, adminPut, adminDelete } from '../../../config/api';
import {
  ActiveToggle, SkeletonRow, ErrorBanner, TableActions, EmptyState,
  SlidePanel, Field, inputStyle, SaveButton, FormMessage, sanitize,
} from './ContentShared';
import { invalidateCountriesCache } from './ContentShared';

/* ── CountryForm ─────────────────────────────────────────────────────── */
function CountryForm({ initial = {}, onSave, saving, msg }) {
  const [d, setD] = useState({
    name: '', slug: '', flag: '', currency_code: '', currency_symbol: '',
    description: '', is_active: true,
    ...sanitize(initial),
  });

  const set = k => e =>
    setD(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = e => {
    e.preventDefault();
    const payload = { ...d };
    if (!payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    onSave(payload);
  };

  return (
    <form onSubmit={submit}>
      <FormMessage msg={msg} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Country Name" required>
          <input
            style={inputStyle}
            value={d.name}
            onChange={set('name')}
            required
            placeholder="Thailand"
          />
        </Field>
        <Field label="Slug" hint="Auto-generated from name if blank">
          <input
            style={inputStyle}
            value={d.slug}
            onChange={set('slug')}
            placeholder="thailand"
          />
        </Field>
        <Field label="Flag Emoji">
          <input
            style={inputStyle}
            value={d.flag}
            onChange={set('flag')}
            placeholder="🇹🇭"
          />
        </Field>
        <Field label="Currency Code">
          <input
            style={inputStyle}
            value={d.currency_code}
            onChange={set('currency_code')}
            placeholder="THB"
          />
        </Field>
        <Field label="Currency Symbol">
          <input
            style={inputStyle}
            value={d.currency_symbol}
            onChange={set('currency_symbol')}
            placeholder="฿"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          value={d.description}
          onChange={set('description')}
          placeholder="Brief description of the country…"
        />
      </Field>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}>
          <input type="checkbox" checked={d.is_active} onChange={set('is_active')} />
          Active
        </label>
      </div>

      <SaveButton saving={saving} label={initial.id ? 'Update Country' : 'Create Country'} icon="🌍" />
    </form>
  );
}

/* ── CountriesManager ────────────────────────────────────────────────── */
export default function CountriesManager() {
  const { data, loading, error, refetch } = useAdminList('/api/admin/countries', { per_page: 100 });
  const [panel,  setPanel]  = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [search, setSearch] = useState('');

  const all = Array.isArray(data) ? data : (data?.data ?? []);

  const filtered = all.filter(c => {
    if (!search.trim()) return true;
    return [c.name, c.slug, c.currency_code].join(' ').toLowerCase().includes(search.toLowerCase());
  });

  async function handleSave(payload) {
    setSaving(true); setMsg('');
    try {
      if (panel.mode === 'edit') {
        await adminPut(`/api/admin/countries/${panel.item.id}`, payload);
        setMsg('✓ Country updated!');
      } else {
        await adminPost('/api/admin/countries', payload);
        setMsg('✓ Country created!');
      }
      invalidateCountriesCache();
      refetch();
      setTimeout(() => setPanel(null), 900);
    } catch (e) {
      setMsg(`⚠️ ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this country? This may affect tours, hotels, and other linked content.')) return;
    try {
      await adminDelete(`/api/admin/countries/${id}`);
      invalidateCountriesCache();
      refetch();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleToggle(c) {
    try {
      await adminPut(`/api/admin/countries/${c.id}`, { is_active: !c.is_active });
      invalidateCountriesCache();
      refetch();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>🌍 Countries</h2>
          <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#64748b' }}>
            {filtered.length} of {all.length} countries
          </p>
        </div>
        <button
          onClick={() => { setMsg(''); setPanel({ mode: 'create' }); }}
          style={{
            background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff',
            border: 'none', borderRadius: 12, padding: '10px 20px',
            fontWeight: 800, fontSize: '.88rem', cursor: 'pointer',
            fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(249,115,22,.3)',
          }}
        >
          + Add Country
        </button>
      </div>

      <ErrorBanner error={error} onRetry={refetch} />

      {/* Search + refresh bar */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'flex', gap: 10, flexWrap: 'wrap',
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, slug or currency…"
          style={{
            flex: '1 1 200px', padding: '8px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 10, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={refetch}
          title="Refresh"
          style={{
            padding: '8px 16px', background: '#f97316', color: '#fff', border: 'none',
            borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '.82rem', fontFamily: 'inherit',
          }}
        >↻</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Flag', 'Name', 'Slug', 'Currency', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left', fontWeight: 700,
                    color: '#64748b', fontSize: '.68rem', textTransform: 'uppercase',
                    letterSpacing: '.5px', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                : filtered.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    {/* Flag */}
                    <td style={{ padding: '12px 14px', fontSize: '1.5rem', lineHeight: 1 }}>
                      {c.flag || '—'}
                    </td>
                    {/* Name */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                    </td>
                    {/* Slug */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '.72rem', background: '#f1f5f9', color: '#475569',
                        borderRadius: 50, padding: '3px 10px', fontWeight: 600, fontFamily: 'monospace',
                      }}>{c.slug}</span>
                    </td>
                    {/* Currency */}
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {c.currency_code
                        ? <span style={{ fontWeight: 600 }}>{c.currency_symbol} {c.currency_code}</span>
                        : '—'}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <ActiveToggle active={c.is_active} onToggle={() => handleToggle(c)} />
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '12px 14px' }}>
                      <TableActions
                        onEdit={() => { setMsg(''); setPanel({ mode: 'edit', item: c }); }}
                        onDelete={() => handleDelete(c.id)}
                      />
                    </td>
                  </tr>
                ))
              }
              {!loading && !filtered.length && (
                <EmptyState
                  icon="🌍"
                  title="No countries found"
                  action="Add the first country →"
                  onAction={() => { setMsg(''); setPanel({ mode: 'create' }); }}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SlidePanel */}
      {panel && (
        <SlidePanel
          title={panel.mode === 'edit' ? (panel.item?.name || 'Edit Country') : 'Add New Country'}
          sub="Countries Manager"
          onClose={() => setPanel(null)}
        >
          <CountryForm
            initial={panel.item || {}}
            onSave={handleSave}
            saving={saving}
            msg={msg}
          />
        </SlidePanel>
      )}
    </div>
  );
}
