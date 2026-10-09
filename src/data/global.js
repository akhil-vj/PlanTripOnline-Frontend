// Brand & Global Data
export const brandInfo = {
  name: 'PlantripOnline',
  shortName: 'Plantrip',
  displayName: { part1: 'Plantrip', accent: 'O', part2: 'nline' }
};

export const contactInfo = {
  phone: '+60106661747',
  phoneDisplay: '+60 10 666 1747',
  email: 'info@plantriponline.com',
  whatsapp: '+60106661747'
};

export const offices = [
  { title: 'Thailand Office', address: 'Bangkok, Thailand', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8037258235813!2d100.58340297455838!3d13.730329797791342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29face0fe1c5f%3A0x946b2c52565971a8!2sTIC%20Holidays%20Co.%2C%20Ltd!5e0!3m2!1sen!2sin!4v1760425553469!5m2!1sen!2sin' },
  { title: 'Malaysia Office', address: 'Kuala Lumpur, Malaysia', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.968414009103!2d101.74160738491821!3d3.161160650012506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc374b36465787%3A0xa278f30e45c2ecb6!2sTIC%20Holidays%20SDN.%20BHD!5e0!3m2!1sen!2sin!4v1760425638175!5m2!1sen!2sin' },
  { title: 'India Office', address: 'Kochi, Kerala', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.87403894727!2d76.3088994745088!3d10.027251872566273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080da789b465e1%3A0x17d5b462b95c2f5e!2sEurasia%20Holidays!5e0!3m2!1sen!2sin!4v1760425678415!5m2!1sen!2sin' }
];

export const featuredCountries = [
  { name: 'Thailand', slug: 'thailand', flag: '🇹🇭', tourCount: '15+', packageCount: '8' },
  { name: 'Malaysia', slug: 'malaysia', flag: '🇲🇾', tourCount: '12+', packageCount: '6' },
  { name: 'India', slug: 'india', flag: '🇮🇳', tourCount: '10+', packageCount: '5' }
];

export const navigationItems = [
  { name: 'Destinations', path: 'destinations' },
  { name: 'Day Tours', path: 'day-tours' },
  { name: 'Transfers', path: 'transfers' },
  { name: 'Tour Packages', path: 'tour-packages' },
  { name: 'Customize Trip', path: 'customized-packages' },
  { name: 'Hotels', path: 'hotels' }
];

export const globalImages = {
  contactHero: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop&q=80',
  aboutHero: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&h=600&fit=crop',
  missionHero: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=600&fit=crop',
  homeHeroBackground: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
};

export const homePageContent = {
  hero: {
    mainHeading: "Discover the Magic of Asia",
    subheading: "Explore Thailand & Malaysia with our curated packages",
    searchPlaceholder: "Search for a location...",
    searchButtonText: "Search Now",
  }
};

export const aboutContent = 'PlantripOnline is a trusted name in travel, dedicated to Malaysia-specialized tour experiences. With a presence in Thailand and India, we combine local knowledge with global hospitality to offer affordable, luxury, and custom tour packages for couples, families, and groups.';

export const reviews = [
  { name: 'Alisha R.', text: 'The Langkawi trip was seamless and beautiful! The guides were knowledgeable and the accommodations were perfect.', trip: 'Langkawi Trip' },
  { name: 'Arun M.', text: 'Easy booking and professional service. The cultural tours made our experience unforgettable.', trip: 'Kuala Lumpur Tour' },
  { name: 'Sarah L.', text: 'Amazing food tours and historical sites. Plantrip made our cultural experience unforgettable.', trip: 'Penang Experience' }
];

export const footerData = {
  description: "Your trusted partner for unforgettable travel adventures. Explore, experience, and enjoy with us!",
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/TICTours.BKK/' },
    { platform: 'Instagram', url: 'https://www.instagram.com/tictoursthailand/?hl=en' },
    { platform: 'Twitter', url: 'https://x.com/tictoursindia' }
  ]
};

export function formatCurrency(amount, currency) {
  const symbols = { MYR: 'RM', THB: '฿', INR: '₹' };
  return `${symbols[currency] || currency} ${Number(amount).toLocaleString()}`;
}
