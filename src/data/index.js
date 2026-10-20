import { thailandData } from './thailand';
import { malaysiaData } from './malaysia';

// Dummy data for countries without full data yet
const dummyCountryData = (name, slug, flag, currency, heroTitle) => ({
  name,
  slug,
  flag,
  currency,
  heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  heroTitle: heroTitle || `Explore ${name}`,
  tagline: `Discover ${name}`,
  description: `Explore the beauty of ${name} with our curated tours and packages.`,
  dayTours: [],
  destinations: [],
  hotels: [],
  tourPackages: [],
  transfers: [],
});

export const indiaData = dummyCountryData('India', 'india', '🇮🇳', 'INR', 'Incredible India');

const countryDataMap = {
  thailand: thailandData,
  malaysia: malaysiaData,
  india: indiaData,
};

export const getCountryData = (slug) => {
  return countryDataMap[slug] || null;
};
