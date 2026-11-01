/**
 * Shared reusable components for all content manager modules.
 * useCountries, CountrySelect, ActiveToggle, SkeletonRow, SlidePanel, Field, etc.
 */
import { useState, useEffect } from 'react';
import { adminGet } from '../../../config/api';

/* ── useCountries — fetches all countries from admin API ──────────────── */
export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    adminGet('/api/admin/countries')
      .then(data => setCountries(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch(() => setCountries([]))
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading };
}

/* ── CountrySelect — dropdown fed by live API countries ───────────────── */
export function CountrySelect({ value, onChange, required = true }) {
  const { countries, loading } = useCountries();
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      style={{
        width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
        fontSize: '.88rem', outline: 'none', fontFamily: 'inherit', color: value ? '#0f172a' : '#94a3b8',
        boxSizing: 'border-box', background: '#fff',
      }}
    >
      <option value="">{loading ? 'Loading countries…' : '— Select Country —'}</option>
      {countries.map(c => (
        <option key={c.id} value={c.id}>
          {c.flag ? `${c.flag} ` : ''}{c.name}
        </option>
      ))}
    </select>
  );
}

/* ── useDestinations — fetches destinations filtered by country_id ──────── */
export function useDestinations(countryId) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryId) { setDestinations([]); return; }
    setLoading(true);
    adminGet(`/api/admin/destinations?country_id=${countryId}`)
      .then(data => setDestinations(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, [countryId]);

  return { destinations, loading };
}

/* ── DestinationSelect — filtered by selected country ────────────────────── */
export function DestinationSelect({ countryId, value, onChange, required = false }) {
  const { destinations, loading } = useDestinations(countryId);

  if (!countryId) {
    return (
      <div style={{
        fontSize: '.82rem', color: '#94a3b8', padding: '10px 12px',
        background: '#f8fafc', borderRadius: 10, border: '1.5px dashed #e2e8f0',
      }}>
        ← Select a country first
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      style={{
        width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
        fontSize: '.88rem', outline: 'none', fontFamily: 'inherit',
        color: value ? '#0f172a' : '#94a3b8', boxSizing: 'border-box', background: '#fff',
      }}
    >
      <option value="">{loading ? 'Loading destinations…' : '— Select Destination —'}</option>
      {destinations.map(d => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  );
}

/* ── CountryFilterBar — search + country filter pill row ─────────────── */
export function CountryFilterBar({ search, onSearch, countryId, onCountry, onRefresh }) {
  const { countries } = useCountries();
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '12px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'flex', gap: 10, flexWrap: 'wrap',
    }}>
      <input
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="🔍 Search…"
        style={{
          flex: '1 1 180px', padding: '8px 12px', border: '1.5px solid #e2e8f0',
          borderRadius: 10, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
        }}
      />
      <select
        value={countryId}
        onChange={e => onCountry(e.target.value)}
        style={{
          padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
          fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', color: '#0f172a', background: '#fff',
          flex: '0 0 auto',
        }}
      >
        <option value="">🌍 All Countries</option>
        {countries.map(c => (
          <option key={c.id} value={String(c.id)}>
            {c.flag ? `${c.flag} ` : ''}{c.name}
          </option>
        ))}
      </select>
      <button
        onClick={onRefresh}
        style={{
          padding: '8px 16px', background: '#f97316', color: '#fff', border: 'none',
          borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '.82rem', fontFamily: 'inherit',
        }}
      >↻</button>
    </div>
  );
}


export function ActiveToggle({ active, onToggle }) {
  return (
    <button onClick={onToggle} title={active ? 'Deactivate' : 'Activate'} style={{
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#16a34a' : '#94a3b8',
      border: 'none', borderRadius: 50, padding: '4px 12px',
      fontSize: '.72rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
    }}>{active ? '● Active' : '○ Inactive'}</button>
  );
}

export function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: 13, background: '#f1f5f9', borderRadius: 6, animation: 'admPulse 1.4s ease infinite' }} />
        </td>
      ))}
    </tr>
  );
}

export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div style={{
      background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12,
      padding: '12px 18px', color: '#dc2626', fontSize: '.85rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      ⚠️ {error}
      {onRetry && (
        <button onClick={onRetry} style={{
          background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8,
          padding: '5px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 700,
        }}>Retry</button>
      )}
    </div>
  );
}

export function TableActions({ onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={onEdit} style={{
        padding: '5px 12px', background: '#dbeafe', color: '#2563eb', border: 'none',
        borderRadius: 8, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer',
      }}>Edit</button>
      <button onClick={onDelete} style={{
        padding: '5px 10px', background: '#fee2e2', color: '#dc2626', border: 'none',
        borderRadius: 8, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer',
      }}>✕</button>
    </div>
  );
}

export function SlidePanel({ title, sub, onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
        backdropFilter: 'blur(3px)', zIndex: 300,
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '100vw',
        background: '#fff', zIndex: 301, overflowY: 'auto',
        boxShadow: '-8px 0 48px rgba(0,0,0,.15)',
        animation: 'cmsSlideIn .25s cubic-bezier(.4,0,.2,1)',
      }}>
        <style>{`@keyframes cmsSlideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}} @keyframes admPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        <div style={{
          padding: '20px 24px', background: 'linear-gradient(135deg,#0f172a,#1e293b)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,.08)',
        }}>
          <div>
            <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{sub}</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>{title}</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 10,
            width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: '1.3rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </>
  );
}

/** Standard form field wrapper */
export function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6,
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: '.88rem', outline: 'none', fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
};

export const selectStyle = { ...inputStyle };

export function SaveButton({ saving, label = 'Save Changes', icon = '💾' }) {
  return (
    <button type="submit" disabled={saving} style={{
      width: '100%', padding: '13px', marginTop: 8,
      background: 'linear-gradient(135deg,#f97316,#fb923c)',
      border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: '.9rem',
      cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      opacity: saving ? .7 : 1, boxShadow: '0 4px 14px rgba(249,115,22,.35)',
    }}>
      {saving ? 'Saving…' : `${icon} ${label}`}
    </button>
  );
}

export function FormMessage({ msg }) {
  if (!msg) return null;
  const ok = msg.startsWith('✓');
  return (
    <div style={{
      fontSize: '.82rem', fontWeight: 600, padding: '10px 14px', borderRadius: 10,
      marginBottom: 12, background: ok ? '#dcfce7' : '#fee2e2',
      color: ok ? '#16a34a' : '#dc2626', border: `1px solid ${ok ? '#bbf7d0' : '#fca5a5'}`,
    }}>{msg}</div>
  );
}
