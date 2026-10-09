import { thailandData } from './thailand';

// Dummy data for other countries for now to allow routing to work
const dummyCountryData = (name, slug, flag, currency) => ({
  name,
  slug,
  flag,
  currency,
  heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  tagline: `Discover ${name}`,
  description: `Explore the beauty of ${name} with our curated tours and packages.`,
  dayTours: [],
  destinations: [],
  hotels: [],
  tourPackages: [],
  transfers: [],
});

export const malaysiaData = dummyCountryData('Malaysia', 'malaysia', '🇲🇾', 'MYR');
export const indiaData = dummyCountryData('India', 'india', '🇮🇳', 'INR');

const countryDataMap = {
  thailand: thailandData,
  malaysia: malaysiaData,
  india: indiaData,
};

export const getCountryData = (slug) => {
  return countryDataMap[slug] || null;
};
