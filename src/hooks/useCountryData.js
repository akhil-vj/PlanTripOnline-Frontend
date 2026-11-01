/**
 * useCountryData — fetches a country's full data bundle from the real API.
 * Falls back to the local static JS file if the API is unreachable.
 *
 * Usage:
 *   const { data, loading, error } = useCountryData('thailand');
 *
 * The returned `data` shape mirrors the static data files:
 *   { name, slug, flag, heroImage, heroTitle, tagline, description,
 *     dayTours, destinations, hotels, tourPackages, transfers }
 */
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

// ── Static fallback imports ──────────────────────────────────────────────────
import { thailandData }  from '../data/thailand';
import { malaysiaData }  from '../data/malaysia';

const STATIC_FALLBACKS = {
  thailand: thailandData,
  malaysia: malaysiaData,
};

function normaliseCountry(raw) {
  // Map API response fields to the shape the frontend components expect
  return {
    id:          raw.id,
    name:        raw.name,
    slug:        raw.slug,
    flag:        raw.flag        || '🌍',
    currency:    raw.currency    || 'USD',
    heroImage:   raw.hero_image  || raw.heroImage || '',
    heroTitle:   raw.hero_title  || raw.heroTitle || raw.name,
    tagline:     raw.tagline     || '',
    description: raw.description || '',
    dayTours:    normaliseTours(raw.day_tours    || raw.dayTours    || []),
    destinations:normaliseDests(raw.destinations || []),
    hotels:      normaliseHotels(raw.hotels      || []),
    tourPackages:normalisePkgs(raw.tour_packages || raw.tourPackages|| []),
    transfers:   normaliseTrfs(raw.transfers     || []),
  };
}

function normaliseTours(arr) {
  return arr.map(t => ({
    id:          t.slug || t.id,
    title:       t.title,
    location:    t.location || '',
    image:       t.image || '',
    badge:       t.badge || '',
    duration:    t.duration || '',
    description: t.description || '',
    features:    Array.isArray(t.features) ? t.features : [],
    rating:      t.rating || 0,
    reviews:     t.reviews_count ?? t.reviews ?? 0,
    price:       t.price ? `$${t.price}` : '',
    is_active:   t.is_active !== false,
    is_featured: !!t.is_featured,
  }));
}

function normaliseDests(arr) {
  return arr.map(d => ({
    id:          d.slug || d.id,
    name:        d.name,
    image:       d.image || '',
    badge:       d.badge || '',
    rating:      d.rating || 0,
    locations:   d.locations || '',
    description: d.description || '',
    highlights:  Array.isArray(d.highlights) ? d.highlights : [],
  }));
}

function normaliseHotels(arr) {
  return arr.map(h => ({
    id:          h.slug || h.id,
    title:       h.title,
    location:    h.location || '',
    image:       h.image || '',
    category:    h.category || 'upscale',
    stars:       String(h.stars || '4'),
    destination: h.destination || '',
    badge:       h.badge || '',
    rating:      h.rating || 0,
    reviews:     h.reviews_count ? `${h.reviews_count}+ reviews` : (h.reviews || ''),
    price:       h.price ? `$${h.price}` : '',
    amenities:   Array.isArray(h.amenities) ? h.amenities : [],
  }));
}

function normalisePkgs(arr) {
  return arr.map(p => ({
    id:       p.slug || p.id,
    title:    p.title,
    subtitle: p.subtitle || '',
    image:    p.image || '',
    badge:    p.badge || '',
    duration: p.duration || '',
    price:    p.price ? `$${Number(p.price).toLocaleString()}` : '',
    includes: Array.isArray(p.includes) ? p.includes : [],
  }));
}

function normaliseTrfs(arr) {
  return arr.map(t => ({
    id:          t.slug || t.id,
    title:       t.title,
    from:        t.from_location || t.from || '',
    to:          t.to_location   || t.to   || '',
    duration:    t.duration || '',
    price:       t.price ? `From $${t.price}` : '',
    image:       t.image || '',
    vehicles:    Array.isArray(t.vehicles) ? t.vehicles : [],
    description: t.description || '',
  }));
}

export default function useCountryData(slug) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true); setError('');

    async function load() {
      try {
        // 1️⃣ Try real API — GET /api/countries/{slug}
        const res = await fetch(`${API_BASE_URL}/api/countries/${slug}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const raw = await res.json();

        // 2️⃣ Fetch sub-resources in parallel
        const [tours, dests, hotels, pkgs, trfs] = await Promise.all([
          fetch(`${API_BASE_URL}/api/countries/${slug}/day-tours`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/countries/${slug}/destinations`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/countries/${slug}/hotels`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/countries/${slug}/tour-packages`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/countries/${slug}/transfers`).then(r => r.json()).catch(() => []),
        ]);

        if (!cancelled) {
          setData(normaliseCountry({
            ...raw,
            day_tours:    Array.isArray(tours) ? tours : (tours.data ?? []),
            destinations: Array.isArray(dests) ? dests : (dests.data ?? []),
            hotels:       Array.isArray(hotels) ? hotels : (hotels.data ?? []),
            tour_packages:Array.isArray(pkgs) ? pkgs : (pkgs.data ?? []),
            transfers:    Array.isArray(trfs) ? trfs : (trfs.data ?? []),
          }));
        }
      } catch {
        // 3️⃣ Fallback to static data
        const fallback = STATIC_FALLBACKS[slug];
        if (fallback && !cancelled) {
          setData(fallback);
          setError(''); // silent fallback — no user-visible error
        } else if (!cancelled) {
          setError(`Could not load data for "${slug}".`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, error };
}
