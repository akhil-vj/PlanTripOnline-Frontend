/**
 * homepageService.js
 * Manages public Homepage curation by selecting/toggling EXISTING items
 * from the database and system catalogue:
 * 
 * 1. Hero "Popular Destinations" Country Pills ([Thailand] [Malaysia] [India])
 * 2. Popular Destinations 3D Carousel Cards
 * 3. Trending Day Tours Grid Cards
 *
 * Persists selected IDs / slugs in localStorage and dispatches reactive events.
 */

import { useState, useEffect } from 'react';
import { featuredCountries } from '../data/global';
import { homeDestinations, homeTours } from '../data/homeData';
import { ThailandDestinations, ThailandDayTours } from '../data/thailand';
import { MalaysiaDestinations, MalaysiaDayTours } from '../data/malaysia';
import { adminGet } from '../config/api';

const STORAGE_KEY = 'plantrip_homepage_curation_v2';
const EVENT_NAME = 'plantrip_homepage_changed';

// ── Default Curations (picked from existing seeds) ──────────────────────────
export const DEFAULT_CURATION = {
  heroCountrySlugs: ['thailand', 'malaysia', 'india'],
  carouselDestKeys: [
    'kuala lumpur',
    'langkawi',
    'penang',
    'cameron highlands',
    'bangkok',
    'phuket',
    'chiang mai',
    'kerala',
  ],
  trendingTourKeys: [
    'petronas towers sky deck experience',
    'langkawi island hopping & snorkeling',
    'genting highlands cable car & theme park',
    'bangkok temple & city tour',
    'pattaya beach & islands',
    'chiang mai mountain trek',
  ],
};

// ── Master Catalog Builders (Combines Seed Data & Live API) ─────────────────

/**
 * Normalizes a destination record into a consistent shape
 */
function normalizeDest(d, fallbackCountry = '') {
  const name = d.name || d.title || '';
  const country = d.country?.name || d.country || fallbackCountry || 'Southeast Asia';
  const slug = d.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const key = name.toLowerCase().trim();

  return {
    key,
    id: d.id || `dest-${slug}`,
    name,
    country,
    slug,
    image: d.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
    price: d.price || '1,200',
    currency: d.currency || (country.toLowerCase() === 'thailand' ? 'THB' : country.toLowerCase() === 'india' ? 'INR' : 'MYR'),
    duration: d.duration || '3 Days 2 Nights',
    rating: parseFloat(d.rating) || 4.8,
    badge: d.badge || '',
    highlights: Array.isArray(d.highlights) ? d.highlights : [],
    description: d.description || '',
    visible: true,
  };
}

/**
 * Normalizes a tour record into a consistent shape
 */
function normalizeTour(t, fallbackCountry = '') {
  const title = t.title || t.name || '';
  const country = t.country?.name || t.country || fallbackCountry || 'Southeast Asia';
  const location = t.location || t.city || country;
  const slug = t.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const key = title.toLowerCase().trim();

  return {
    key,
    id: t.id || `tour-${slug}`,
    title,
    country,
    location,
    slug,
    image: t.image || 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200',
    price: t.price ? (String(t.price).startsWith('$') || String(t.price).includes(' ') ? t.price : `USD ${t.price}`) : 'USD 99',
    rating: parseFloat(t.rating) || 4.8,
    type: t.badge || t.type || 'Full Day Tour',
    badge: t.badge || '',
    duration: t.duration || '⏱ Full Day',
    features: Array.isArray(t.features) ? t.features : [],
    visible: true,
  };
}

/**
 * Collects all seed destinations into a single deduplicated list
 */
export function getSeedDestinations() {
  const map = new Map();

  homeDestinations.forEach(d => {
    const norm = normalizeDest(d, d.country);
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  MalaysiaDestinations.forEach(d => {
    const norm = normalizeDest(d, 'Malaysia');
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  ThailandDestinations.forEach(d => {
    const norm = normalizeDest(d, 'Thailand');
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  return Array.from(map.values());
}

/**
 * Collects all seed day tours into a single deduplicated list
 */
export function getSeedDayTours() {
  const map = new Map();

  homeTours.forEach(t => {
    const norm = normalizeTour(t, t.country);
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  MalaysiaDayTours.forEach(t => {
    const norm = normalizeTour(t, 'Malaysia');
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  ThailandDayTours.forEach(t => {
    const norm = normalizeTour(t, 'Thailand');
    if (!map.has(norm.key)) map.set(norm.key, norm);
  });

  return Array.from(map.values());
}

/**
 * Load all existing countries from backend API + fallback seed data
 */
export async function loadAllExistingCountries() {
  const map = new Map();

  // Add default featured countries first
  featuredCountries.forEach(c => {
    const slug = (c.slug || c.name || '').toLowerCase().trim();
    map.set(slug, {
      id: c.id || `country-${slug}`,
      name: c.name,
      slug,
      flag: c.flag || '🌏',
      tourCount: c.tourCount || '10+',
      packageCount: c.packageCount || '5',
      description: c.description || '',
    });
  });

  // Fetch live countries from backend if available
  try {
    const res = await adminGet('/api/admin/countries');
    const list = Array.isArray(res) ? res : (res?.data || []);
    list.forEach(c => {
      const slug = (c.slug || c.name || '').toLowerCase().trim();
      const existing = map.get(slug) || {};
      map.set(slug, {
        ...existing,
        ...c,
        slug,
        flag: c.flag || existing.flag || '🌏',
        name: c.name || existing.name,
        id: c.id || existing.id,
      });
    });
  } catch {
    // Silently continue with seeds if offline or unauthenticated
  }

  return Array.from(map.values());
}

/**
 * Load all existing destinations from backend API + seed data
 */
export async function loadAllExistingDestinations() {
  const map = new Map();

  // Load seeds first
  getSeedDestinations().forEach(d => map.set(d.key, d));

  // Merge backend destinations
  try {
    const res = await adminGet('/api/admin/destinations');
    const list = Array.isArray(res) ? res : (res?.data || []);
    list.forEach(d => {
      const norm = normalizeDest(d);
      map.set(norm.key, { ...map.get(norm.key), ...norm });
    });
  } catch {
    // Silently continue with seeds
  }

  return Array.from(map.values());
}

/**
 * Load all existing day tours from backend API + seed data
 */
export async function loadAllExistingDayTours() {
  const map = new Map();

  // Load seeds first
  getSeedDayTours().forEach(t => map.set(t.key, t));

  // Merge backend day tours
  try {
    const res = await adminGet('/api/admin/day-tours');
    const list = Array.isArray(res) ? res : (res?.data || []);
    list.forEach(t => {
      const norm = normalizeTour(t);
      map.set(norm.key, { ...map.get(norm.key), ...norm });
    });
  } catch {
    // Silently continue with seeds
  }

  return Array.from(map.values());
}

// ── Storage Operations ──────────────────────────────────────────────────────

export function getHomepageConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CURATION;
    const parsed = JSON.parse(raw);
    return {
      heroCountrySlugs: Array.isArray(parsed.heroCountrySlugs)
        ? parsed.heroCountrySlugs
        : DEFAULT_CURATION.heroCountrySlugs,
      carouselDestKeys: Array.isArray(parsed.carouselDestKeys)
        ? parsed.carouselDestKeys
        : DEFAULT_CURATION.carouselDestKeys,
      trendingTourKeys: Array.isArray(parsed.trendingTourKeys)
        ? parsed.trendingTourKeys
        : DEFAULT_CURATION.trendingTourKeys,
    };
  } catch (e) {
    console.error('Failed to parse homepage curation:', e);
    return DEFAULT_CURATION;
  }
}

export function saveHomepageConfig(curation) {
  try {
    const clean = {
      heroCountrySlugs: Array.isArray(curation.heroCountrySlugs)
        ? curation.heroCountrySlugs
        : DEFAULT_CURATION.heroCountrySlugs,
      carouselDestKeys: Array.isArray(curation.carouselDestKeys)
        ? curation.carouselDestKeys
        : DEFAULT_CURATION.carouselDestKeys,
      trendingTourKeys: Array.isArray(curation.trendingTourKeys)
        ? curation.trendingTourKeys
        : DEFAULT_CURATION.trendingTourKeys,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new Event(EVENT_NAME));
    return true;
  } catch (e) {
    console.error('Failed to save homepage curation:', e);
    return false;
  }
}

export function resetHomepageConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
    return DEFAULT_CURATION;
  } catch (e) {
    console.error('Failed to reset homepage curation:', e);
    return DEFAULT_CURATION;
  }
}

// ── Resolution for Public Views ─────────────────────────────────────────────

/**
 * Resolves active Hero Countries given selected slugs and available countries
 */
export function resolveActiveHeroCountries(slugs = DEFAULT_CURATION.heroCountrySlugs, all = featuredCountries) {
  if (!Array.isArray(slugs)) return featuredCountries;
  if (slugs.length === 0) return [];
  const resolved = [];
  
  // Keep order defined by slugs
  slugs.forEach(slug => {
    const match = all.find(c => (c.slug || c.name || '').toLowerCase().trim() === String(slug).toLowerCase().trim());
    if (match) {
      resolved.push({ ...match, visible: true });
    }
  });

  return resolved;
}

/**
 * Resolves active Carousel Destinations given selected keys and available destinations
 */
export function resolveActiveCarouselDestinations(keys = DEFAULT_CURATION.carouselDestKeys, all = getSeedDestinations()) {
  if (!Array.isArray(keys)) return all.slice(0, 8);
  if (keys.length === 0) return [];
  const resolved = [];

  keys.forEach(k => {
    const match = all.find(d => (d.key || d.name || '').toLowerCase().trim() === String(k).toLowerCase().trim());
    if (match) {
      resolved.push({ ...match, visible: true });
    }
  });

  return resolved;
}

/**
 * Resolves active Trending Tours given selected keys and available tours
 */
export function resolveActiveTrendingTours(keys = DEFAULT_CURATION.trendingTourKeys, all = getSeedDayTours()) {
  if (!Array.isArray(keys)) return all.slice(0, 6);
  if (keys.length === 0) return [];
  const resolved = [];

  keys.forEach(k => {
    const match = all.find(t => (t.key || t.title || '').toLowerCase().trim() === String(k).toLowerCase().trim());
    if (match) {
      resolved.push({ ...match, visible: true });
    }
  });

  return resolved;
}

// ── Reactive Hook for Consumers ─────────────────────────────────────────────

export function useHomepageConfig() {
  const [curation, setCuration] = useState(getHomepageConfig);
  const [countriesMaster, setCountriesMaster] = useState(featuredCountries);
  const [destinationsMaster, setDestinationsMaster] = useState(getSeedDestinations);
  const [toursMaster, setToursMaster] = useState(getSeedDayTours);

  // Load masters asynchronously in background to include any new db entries
  useEffect(() => {
    let mounted = true;

    loadAllExistingCountries().then(list => {
      if (mounted && list?.length) setCountriesMaster(list);
    });
    loadAllExistingDestinations().then(list => {
      if (mounted && list?.length) setDestinationsMaster(list);
    });
    loadAllExistingDayTours().then(list => {
      if (mounted && list?.length) setToursMaster(list);
    });

    return () => { mounted = false; };
  }, []);

  // Sync with localStorage updates across tabs/events
  useEffect(() => {
    function handleUpdate() {
      setCuration(getHomepageConfig());
    }
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Resolved public objects
  const heroCountries = resolveActiveHeroCountries(curation.heroCountrySlugs, countriesMaster);
  const carouselDestinations = resolveActiveCarouselDestinations(curation.carouselDestKeys, destinationsMaster);
  const trendingTours = resolveActiveTrendingTours(curation.trendingTourKeys, toursMaster);

  return {
    ...curation,
    heroCountries,
    carouselDestinations,
    trendingTours,
    countriesMaster,
    destinationsMaster,
    toursMaster,
  };
}
