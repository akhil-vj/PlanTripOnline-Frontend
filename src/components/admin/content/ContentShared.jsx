/**
 * Shared reusable components & hooks for all admin content manager modules.
 * - useCountries      (cached, single fetch per session)
 * - useDestinations   (filtered by country_id)
 * - CountrySelect / DestinationSelect / CountryFilterBar
 * - ActiveToggle, SkeletonRow, ErrorBanner, TableActions
 * - SlidePanel, Field, SaveButton, FormMessage
 */
import { useState, useEffect, useRef } from 'react';
import { adminGet } from '../../../config/api';

/* ── Module-level country cache (shared across all manager instances) ─── */
let _countriesCache = null;
let _countriesPromise = null;

function fetchCountriesOnce() {
  if (_countriesCache) return Promise.resolve(_countriesCache);
  if (_countriesPromise) return _countriesPromise;
  _countriesPromise = adminGet('/api/admin/countries')
    .then(data => {
      _countriesCache = Array.isArray(data) ? data : (data?.data ?? []);
      return _countriesCache;
    })
    .catch(() => {
      _countriesPromise = null; // allow retry on next mount
      return [];
    });
  return _countriesPromise;
}

/* ── useCountries — returns cached country list ───────────────────────── */
export function useCountries() {
  const [countries, setCountries] = useState(_countriesCache ?? []);
  const [loading,   setLoading]   = useState(!_countriesCache);

  useEffect(() => {
    if (_countriesCache) return; // already cached
    let alive = true;
    setLoading(true);
    fetchCountriesOnce().then(list => {
      if (alive) { setCountries(list); setLoading(false); }
    });
    return () => { alive = false; };
  }, []);

  return { countries, loading };
}

/* ── CountrySelect — dropdown fed by cached countries ────────────────── */
export function CountrySelect({ value, onChange, required = true }) {
  const { countries, loading } = useCountries();
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
      <option value="">{loading ? 'Loading countries…' : '— Select Country —'}</option>
      {countries.map(c => (
        <option key={c.id} value={c.id}>
          {c.flag ? `${c.flag} ` : ''}{c.name}
        </option>
      ))}
    </select>
  );
}

/* ── useDestinations — fetches destinations for a given country_id ────── */
export function useDestinations(countryId) {
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!countryId) { setDestinations([]); return; }
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    adminGet(`/api/admin/destinations?country_id=${countryId}`)
      .then(data => {
        if (!controller.signal.aborted) {
          setDestinations(Array.isArray(data) ? data : (data?.data ?? []));
        }
      })
      .catch(() => { if (!controller.signal.aborted) setDestinations([]); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [countryId]);

  return { destinations, loading };
}

/* ── DestinationSelect — filtered by selected country ───────────────── */
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
          fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
          color: '#0f172a', background: '#fff', flex: '0 0 auto',
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

/* ── ActiveToggle ─────────────────────────────────────────────────────── */
export function ActiveToggle({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={active ? 'Click to deactivate' : 'Click to activate'}
      style={{
        background: active ? '#dcfce7' : '#f1f5f9',
        color: active ? '#16a34a' : '#94a3b8',
        border: 'none', borderRadius: 50, padding: '4px 12px',
        fontSize: '.72rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {active ? '● Active' : '○ Inactive'}
    </button>
  );
}

/* ── SkeletonRow ─────────────────────────────────────────────────────── */
export function SkeletonRow({ cols = 5 }) {
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

/* ── ErrorBanner ─────────────────────────────────────────────────────── */
export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div style={{
      background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12,
      padding: '12px 18px', color: '#dc2626', fontSize: '.85rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    }}>
      <span>⚠️ {error}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8,
          padding: '5px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 700, flexShrink: 0,
        }}>Retry</button>
      )}
    </div>
  );
}

/* ── TableActions ────────────────────────────────────────────────────── */
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

/* ── SlidePanel ──────────────────────────────────────────────────────── */
export function SlidePanel({ title, sub, onClose, children }) {
  /* Close on Escape key */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
          backdropFilter: 'blur(3px)', zIndex: 300,
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '100vw',
        background: '#fff', zIndex: 301, overflowY: 'auto',
        boxShadow: '-8px 0 48px rgba(0,0,0,.18)',
        animation: 'cmsSlideIn .22s cubic-bezier(.4,0,.2,1)',
      }}>
        <style>{`
          @keyframes cmsSlideIn { from { transform: translateX(60px); opacity: 0; } to { transform: none; opacity: 1; } }
          @keyframes admPulse   { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        `}</style>
        {/* Header */}
        <div style={{
          padding: '20px 24px', background: 'linear-gradient(135deg,#0f172a,#1e293b)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,.08)', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div>
            {sub && <div style={{ fontSize: '.66rem', color: 'rgba(255,255,255,.38)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>{sub}</div>}
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>{title}</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 10,
            width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: '1.3rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </>
  );
}

/* ── Field ───────────────────────────────────────────────────────────── */
export function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: '.71rem', fontWeight: 700, color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6,
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

/* ── Shared style objects ─────────────────────────────────────────────── */
export const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: '.88rem', outline: 'none', fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
};

export const selectStyle = { ...inputStyle };

/* ── SaveButton ───────────────────────────────────────────────────────── */
export function SaveButton({ saving, label = 'Save Changes', icon = '💾' }) {
  return (
    <button type="submit" disabled={saving} style={{
      width: '100%', padding: '13px', marginTop: 8,
      background: 'linear-gradient(135deg,#f97316,#fb923c)',
      border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: '.9rem',
      cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      opacity: saving ? .7 : 1, boxShadow: '0 4px 14px rgba(249,115,22,.35)',
      transition: 'opacity .15s',
    }}>
      {saving ? '⏳ Saving…' : `${icon} ${label}`}
    </button>
  );
}

/* ── FormMessage ─────────────────────────────────────────────────────── */
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

/* ── EmptyState ──────────────────────────────────────────────────────── */
export function EmptyState({ icon = '📭', title = 'Nothing here yet', action, onAction }) {
  return (
    <tr>
      <td colSpan={99} style={{ padding: '56px 24px', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{icon}</div>
        <div style={{ fontWeight: 700, color: '#475569', marginBottom: action ? 14 : 0 }}>{title}</div>
        {action && onAction && (
          <button onClick={onAction} style={{
            background: 'none', border: 'none', color: '#f97316',
            fontWeight: 700, cursor: 'pointer', fontSize: '.88rem',
          }}>{action}</button>
        )}
      </td>
    </tr>
  );
}
