// Legacy constants.js - now loads from new organized structure
// This file is kept for backward compatibility

// Load global constants
document.write('<script src="constants/global.js"></script>');
document.write('<script src="constants/packages.js"></script>');

// Note: This is a temporary bridge file
// Pages should be updated to load constants/global.js and constants/packages.js directly

const gallery = images.gallery;

const services = [
  { icon: 'Mail', title: 'Email Support', description: 'info@plantriponline.com Response within 24 hours or less' },
  { icon: 'Phone', title: 'Call or WhatsApp', description: '+60106661747 WhatsApp available 24/7' },
  { icon: 'Globe', title: 'Follow Us Online', description: '@tictoursthailand TicTours Travel TicTours Trips' },
];

const offices = [
  { 
    title: 'Thailand Office', 
    address: 'Bangkok, Thailand', 
    mapSrc: 'https://www.thailandselftours.com/images/Maps/Bangkok-central-map.png',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8037258235813!2d100.58340297455838!3d13.730329797791342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29face0fe1c5f%3A0x946b2c52565971a8!2sTIC%20Holidays%20Co.%2C%20Ltd!5e0!3m2!1sen!2sin!4v1760425553469!5m2!1sen!2sin'
  },
  { 
    title: 'Malaysia Office', 
    address: 'Kuala Lumpur, Malaysia', 
    mapSrc: 'https://images.mapsofworld.com/malaysia/kuala-lumpur-map.gif',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.968414009103!2d101.74160738491821!3d3.161160650012506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc374b36465787%3A0xa278f30e45c2ecb6!2sTIC%20Holidays%20SDN.%20BHD!5e0!3m2!1sen!2sin!4v1760425638175!5m2!1sen!2sin'
  },
  { 
    title: 'India Office', 
    address: 'Kochi, Kerala', 
    mapSrc: 'https://www.researchgate.net/publication/353865493/figure/fig2/AS:1056195095842816@1628827942691/Map-of-Kochi-Kerala-India.jpg',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.87403894727!2d76.3088994745088!3d10.027251872566273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080da789b465e1%3A0x17d5b462b95c2f5e!2sEurasia%20Holidays!5e0!3m2!1sen!2sin!4v1760425678415!5m2!1sen!2sin'
  },
];

const whatWeOffer = [
  { icon: 'Plane', title: 'Visa & Trip Support', description: 'Travel Insurance' },
  { icon: 'MapPin', title: 'Custom Itineraries', description: 'For 4-8 hour Quotes' },
  { icon: 'Ticket', title: 'Flight Booking & Airport Transfer', description: '' },
  { icon: 'CalendarCheck', title: 'Free Digital Itinerary Consultation', description: '' },
  { icon: 'Smartphone', title: '24/7 Travel Support', description: '' },
  { icon: 'Users', title: 'Group Tour Coordination', description: '' },
];

const categories = [
  { image: 'https://www.asiakingtravel.com/cuploads/files/06-Romantic-Dinner-1024x768%20(1).jpg', title: 'Romantic & Honeymoon Tours', description: 'Longbeach Luxury Honeymoon, Island Villa Stay.' },
  { image: 'https://static.ffx.io/images/$zoom_0.12248865845755022%2C$multiply_0.9921%2C$ratio_1.5%2C$width_756%2C$x_0%2C$y_0/t_crop_custom/q_86%2Cf_auto/91b9ce9f8f0d4a748d6d153bee00ed32c9373e7b', title: 'Family-Friendly Holidays', description: 'Serenity Lagoon Adventure, Genting Highlands Theme Park.' },
  { image: 'https://i.natgeofe.com/n/5b6ed6d6-5566-4f36-9dca-054cc04e8064/resized-GettyImages-1400065452.jpg', title: 'Nature & Wildlife Tours', description: 'Taman Negara Safari, Orangutan Sanctuary, River Cruise.' },
  { image: 'https://www.trailsofindochina.com/wp-content/uploads/2019/07/discovery-malaysia-rich-culture-history-header.jpg', title: 'Cultural & Historical Trails', description: 'Malacca Arts & Food, Penang Art Walk.' },
];

const popularDestinations = [
  {
    image: 'https://www.pelago.com/img/products/MY-Malaysia/petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host/f294c996-674c-45b2-81c1-3dedf833f9fd_petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host.jpg',
    title: 'Petronas Towers Sky Deck Experience',
    description: 'Take on top of the world with stunning city views from KL\'s crown jewel.',
    location: 'Kuala Lumpur',
    tags: ['Sunset views', 'Indoor photo spots'],
    price: '$45.00',
  },
  {
    image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg',
    title: 'Langkawi Island Hopping & Snorkeling',
    description: 'Jump from island to island, soak in the sun, and swim with vibrant sea life.',
    location: 'Langkawi',
    tags: ['Island hopping', 'Coral reefs', 'Private beach time'],
    price: '$65.00',
  },
  {
    image: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_720/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/yv7ytfhwlwu4knavune5/AwanaSkywayGondolaCableCarandSkytropolisIndoorThemeParkComboPackageinGentingHighlands-KlookIndia.jpg',
    title: 'Genting Highlands Cable Car & Theme Park',
    description: 'Perfect for families, couples, or thrill-seekers looking to chill in the clouds.',
    location: 'Genting Highlands',
    tags: ['Indoor & outdoor theme park', 'Snow World'],
    price: '$55.00',
  },
  {
    image: 'https://www.agoda.com/wp-content/uploads/2024/07/Penang-Malaysia-George-Town-1244x700.jpg',
    title: 'Cultural Street Food Walk',
    description: 'Taste Penang\'s award-famous street food while exploring colorful alleys.',
    location: 'Penang',
    tags: ['Local eats', 'Street art', 'Local guide'],
    price: '$35.00',
  },
];

const mustVisitDestinations = [
  {
    image: 'https://dynamic-media.tacdn.com/media/photo-o/2e/c1/b5/a7/caption.jpg?w=1100&h=800&s=1',
    title: 'Bangkok Temple & City Tour',
    description: 'Explore the Grand Palace, Wat Pho, and vibrant Bangkok streets.',
    location: 'Bangkok',
    duration: '3 Days',
    price: '$49.99',
  },
  {
    image: 'https://www.royalwingsuites.com/wp-content/uploads/2023/02/feat-attraction-island-hopping-coral-and-koh-pai.jpg',
    title: 'Pattaya Beach & Islands',
    description: 'Sun, sand, and sea with island hopping adventures.',
    location: 'Pattaya',
    duration: '2-3 Days',
    price: '$79.99',
  },
  {
    image: 'https://s3-cdn.designerjourneys.com/blog/wp-content/uploads/2017/12/07075435/Chiang-Mai-1.jpg',
    title: 'Chiang Mai Mountain Trek',
    description: 'Discover mountains, temples, and hill tribe villages.',
    location: 'Chiang Mai',
    duration: '2-3 hours',
    price: '$89.99',
  },
  {
    image: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=400,height=265,dpr=2/tour_img/c2d0b839973359e5a39ae3d996b5834334de34078c3d12d03c419fe47766c95d.jpeg',
    title: 'Floating Market Adventure',
    description: 'Experience traditional Thai floating markets and local culture.',
    location: 'Bangkok',
    duration: '4-5 hours',
    price: '$39.99',
  },
  {
    image: 'https://www.asiakingtravel.com/cuploads/files/AyutthayaHistoricalPark3.jpg',
    title: 'Ayutthaya Historical Park',
    description: 'Ancient temples and UNESCO World Heritage site exploration.',
    location: 'Ayutthaya',
    duration: '3 hours',
    price: '$59.99',
  },
  {
    image: 'https://travel-buddies.com/wp-content/uploads/2024/10/1_evening-food-tour-by-tuktuk-view-sunset-around-angkor-wat.jpg',
    title: 'Evening Food Tour',
    description: 'Taste authentic Thai cuisine with a local food expert.',
    location: 'Bangkok',
    duration: '3-4 hours',
    price: '$45.99',
  },
];

const historicalHeritage = [
  { image: 'https://whc.unesco.org/document/198484/t=4by3', title: 'Malacca Heritage', description: 'Colonial site with rich history.' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Skyline_of_George_Town%2C_Penang_at_night_Nov2024-29-17.jpg', title: 'George Town', description: 'Cultural melting pot with stunning architecture.' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Batu_Caves_stairs_2022-05.jpg', title: 'Batu Caves', description: 'Sacred Hindu shrine in limestone caves.' },
];

const scenicNatural = [
  { image: 'https://dynamic-media.tacdn.com/media/photo-o/2f/ba/bd/d9/caption.jpg?w=700&h=500&s=1', title: 'Cameron Highlands', description: 'Tea plantations, cool climate.' },
  { image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Mount_kinabalu_01.png', title: 'Kinabalu Park', description: 'Mount Kinabalu climb.' },
  { image: 'https://www.legalnomads.com/wp-content/uploads/2009/11/IMG_4320.jpg', title: 'Perhentian Islands', description: 'Crystal clear waters.' },
];

const featuredExperiences = [
  {
    image: 'https://i.pinimg.com/736x/00/2b/b1/002bb1c5aa0d0d36bb44585d1cd10cfb.jpg',
    title: 'Beach Paradise',
    description: 'Experience pristine beaches and crystal-clear waters'
  },
  {
    image: 'https://static.businessworld.in/Untitled%20design%20-%202024-05-28T112901.389_20240528112939_original_image_27.webp',
    title: 'Cultural Heritage',
    description: 'Explore vibrant cities and rich traditions'
  },
  {
    image: 'https://cdn.junglelodges.com/uploads/2025/06/548A7183-HDR-1-copy2-scaled_935x518_acf_cropped.jpg',
    title: 'Nature Adventures',
    description: 'Discover lush rainforests and wildlife'
  },
];

const reviews = [
  {
    name: 'Alisha R.',
    text: 'The Langkawi trip was seamless and beautiful! The guides were knowledgeable and the accommodations were perfect.',
    trip: 'Langkawi Trip'
  },
  {
    name: 'Arun M.',
    text: 'Easy booking and professional service. The cultural tours made our experience unforgettable.',
    trip: 'Kuala Lumpur Tour'
  },
  {
    name: 'Sarah L.',
    text: 'Amazing food tours and historical sites. Plantrip made our cultural experience unforgettable.',
    trip: 'Penang Experience'
  },
];

const aboutContent = 'PlantripOnline is a trusted name in travel, dedicated to Malaysia-specialized tour experiences. With a presence in Thailand and India, we combine local knowledge with global hospitality to offer affordable, luxury, and custom tour packages for couples, families, and groups.';

const whyTravel = [
  { icon: 'Globe', title: 'Local Expertise', description: 'We know Malaysia like the back of our hand.' },
  { icon: 'Utensils', title: 'Unique Experiences', description: 'From food in Penang to anything you can imagine.' },
  { icon: 'Shield', title: 'Safe & Comfortable', description: 'Your comfort is our language.' },
];

const special = [
  { icon: 'Calendar', title: 'Live Itineraries', description: 'Plan on the go.' },
  { icon: 'Camera', title: 'Photo & Drone', description: 'Capture memories, not just places.' },
  { icon: 'Leaf', title: 'Eco & Ethical Travel', description: 'Support local communities.' },
  { icon: 'PartyPopper', title: 'Festival Trips', description: 'Join cultural celebrations.' },
  { icon: 'Gift', title: 'Cultural Souvenir Gifts', description: 'For all your loved ones.' },
];

const mainHeroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop';

const mainDestinations = [
  {
    name: 'Bangkok',
    country: 'Thailand',
    nights: '3 nights + flight',
    price: '$533',
    image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR0FKha8f6Iqy1N8equBS_8XuXGlo_iyFVRsd7yJTexqSN6CUIKQZwjVJDqzUe9iVSehH5qE3GBPhYKj2etPpJT2Hu94wUpuSbdXjt0PQ'
  },
  {
    name: 'Pattaya',
    country: 'Thailand',
    nights: '3 nights',
    price: '$416',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop'
  },
  {
    name: 'Langkawi',
    country: 'Malaysia',
    nights: '3 nights',
    price: '$345',
    image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg'
  },
  {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    nights: '3 nights + flight',
    price: '$276',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop'
  }
];

const mainTours = [
  {
    title: 'Phi Phi Island Tour',
    type: 'Full Day Tour',
    price: '$65',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&h=300&fit=crop'
  },
  {
    title: 'Chao Phraya River Cruise',
    type: 'Evening Tour',
    price: '$55',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1563492065213-f15d6087cd27?w=500&h=300&fit=crop'
  },
  {
    title: 'Nong Nooch Garden',
    type: 'Half Day Tour',
    price: '$45',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=500&h=300&fit=crop'
  }
];

const tourPackages = {
  thailand: {
    dayTours: 63,
    fixedPackages: 227
  },
  malaysia: {
    dayTours: 52,
    fixedPackages: 189
  }
};

const homeHeroBackground = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600';

const homeDestinations = [
  {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
    price: '1,200',
    currency: 'MYR',
    duration: '3 Days 2 Nights',
    rating: 4.8
  },
  {
    name: 'Langkawi',
    country: 'Malaysia',
    image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg',
    price: '1,500',
    currency: 'MYR',
    duration: '4 Days 3 Nights',
    rating: 4.9
  },
  {
    name: 'Penang',
    country: 'Malaysia',
    image: 'https://www.agoda.com/wp-content/uploads/2024/07/Penang-Malaysia-George-Town-1244x700.jpg',
    price: '1,100',
    currency: 'MYR',
    duration: '3 Days 2 Nights',
    rating: 4.7
  },
  {
    name: 'Cameron Highlands',
    country: 'Malaysia',
    image: 'https://dynamic-media.tacdn.com/media/photo-o/2f/ba/bd/d9/caption.jpg?w=700&h=500&s=1',
    price: '900',
    currency: 'MYR',
    duration: '2 Days 1 Night',
    rating: 4.6
  },
  {
    name: 'Malacca',
    country: 'Malaysia',
    image: 'https://whc.unesco.org/document/198484/t=4by3',
    price: '850',
    currency: 'MYR',
    duration: '2 Days 1 Night',
    rating: 4.5
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR0FKha8f6Iqy1N8equBS_8XuXGlo_iyFVRsd7yJTexqSN6CUIKQZwjVJDqzUe9iVSehH5qE3GBPhYKj2etPpJT2Hu94wUpuSbdXjt0PQ',
    price: '8,500',
    currency: 'THB',
    duration: '3 Days 2 Nights',
    rating: 4.7
  },
  {
    name: 'Phuket',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
    price: '10,000',
    currency: 'THB',
    duration: '4 Days 3 Nights',
    rating: 4.8
  },
  {
    name: 'Chiang Mai',
    country: 'Thailand',
    image: 'https://static.independent.co.uk/2025/08/29/14/57/iStock-2181663837.jpeg?quality=75&width=1368&crop=3%3A2%2Csmart&auto=webp',
    price: '7,500',
    currency: 'THB',
    duration: '3 Days 2 Nights',
    rating: 4.9
  },
  {
    name: 'Krabi',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    price: '9,500',
    currency: 'THB',
    duration: '4 Days 3 Nights',
    rating: 4.8
  },
  {
    name: 'Phi Phi Island',
    country: 'Thailand',
    image: 'https://thaiholidayplanner.com/wp-content/uploads/2023/06/Thai-Holiday-Planner-Blog-Thailand-green-tropical-island-Cover.jpg',
    price: '11,000',
    currency: 'THB',
    duration: '3 Days 2 Nights',
    rating: 4.9
  },
  {
    name: 'Kerala',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    price: '15,000',
    currency: 'INR',
    duration: '3 Days 2 Nights',
    rating: 4.9
  },
  {
    name: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    price: '12,000',
    currency: 'INR',
    duration: '4 Days 3 Nights',
    rating: 4.8
  },
  {
    name: 'Rajasthan',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    price: '18,000',
    currency: 'INR',
    duration: '5 Days 4 Nights',
    rating: 4.7
  }
];

const homeTours = [
  {
    title: 'Petronas Towers Sky Deck Experience',
    type: 'Half Day Tour',
    price: 'MYR 180',
    rating: 4.8,
    image: 'https://www.pelago.com/img/products/MY-Malaysia/petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host/f294c996-674c-45b2-81c1-3dedf833f9fd_petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host.jpg',
    country: 'Malaysia'
  },
  {
    title: 'Langkawi Island Hopping & Snorkeling',
    type: 'Full Day Tour',
    price: 'MYR 260',
    rating: 4.9,
    image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg',
    country: 'Malaysia'
  },
  {
    title: 'Genting Highlands Cable Car & Theme Park',
    type: 'Full Day Tour',
    price: 'MYR 220',
    rating: 4.7,
    image: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_720/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/yv7ytfhwlwu4knavune5/AwanaSkywayGondolaCableCarandSkytropolisIndoorThemeParkComboPackageinGentingHighlands-KlookIndia.jpg',
    country: 'Malaysia'
  },
  {
    title: 'Bangkok Temple & City Tour',
    type: 'Full Day Tour',
    price: 'THB 1,950',
    rating: 4.8,
    image: 'https://dynamic-media.tacdn.com/media/photo-o/2e/c1/b5/a7/caption.jpg?w=1100&h=800&s=1',
    country: 'Thailand'
  },
  {
    title: 'Pattaya Beach & Islands',
    type: 'Full Day Tour',
    price: 'THB 3,200',
    rating: 4.7,
    image: 'https://www.royalwingsuites.com/wp-content/uploads/2023/02/feat-attraction-island-hopping-coral-and-koh-pai.jpg',
    country: 'Thailand'
  },
  {
    title: 'Chiang Mai Mountain Trek',
    type: 'Half Day Tour',
    price: 'THB 3,600',
    rating: 4.9,
    image: 'https://s3-cdn.designerjourneys.com/blog/wp-content/uploads/2017/12/07075435/Chiang-Mai-1.jpg',
    country: 'Thailand'
  }
];

const featuredCountries = [
  { name: 'Malaysia' },
  { name: 'Thailand' },
  { name: 'India' }
];

const navigationCountries = ['Thailand', 'Malaysia', 'India'];

const hotelLocations = [
  { name: 'Thailand Hotels', country: 'Thailand' },
  { name: 'Malaysia Hotels', country: 'Malaysia' },
  { name: 'India Hotels', country: 'India' }
];

const navigationItems = [
  { name: 'Destinations', hasDropdown: true, type: 'countries' },
  { name: 'Day Tours', hasDropdown: true, type: 'countries' },
  { name: 'Tour Packages', hasDropdown: true, type: 'countries' },
  { name: 'Customize Trip', hasDropdown: true, type: 'countries' },
  { name: 'Hotels', hasDropdown: true, type: 'hotels' }
];

const uiText = {
  loginButton: 'Login',
  searchButton: 'Search Now',
};

const contactInfo = {
  phone: '+60106661747',
  email: 'info@plantriponline.com',
  emailSupport: 'info@plantriponline.com'
};

const brandInfo = {
  name: 'PlantripOnline',
  shortName: 'Plantrip',
  displayName: {
    part1: 'Plantrip',
    accent: 'O',
    part2: 'nline'
  }
};

const footerData = {
  companyInfo: {
    description: "Your trusted partner for unforgettable Malaysian adventures. Explore, experience, and enjoy with us!"
  },
  sectionTitles: {
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    followUs: 'Follow Us'
  },
  contactDetails: {
    email: {
      label: 'Email',
      value: 'info@plantriponline.com',
      href: 'mailto:info@plantriponline.com'
    },
    phone: {
      label: 'Phone',
      value: '+60106661747',
      href: 'tel:+60106661747'
    },
    location: {
      label: 'Location',
      line1: 'T I C Holidays Co. Ltd.',
      line2: 'Kuala Lumpur, Malaysia.'
    }
  },
  followUsText: "Stay connected for the latest updates and travel inspiration!",
  bottomLinks: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Sitemap', href: '#' }
  ]
};

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Tour Packages', path: '/packages' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

const socialLinks = [
  { platform: 'Facebook', icon: 'Facebook', url: '#', ariaLabel: 'Facebook' },
  { platform: 'Instagram', icon: 'Instagram', url: '#', ariaLabel: 'Instagram' },
  { platform: 'Twitter', icon: 'Twitter', url: '#', ariaLabel: 'Twitter' }
];

const homePageContent = {
  hero: {
    mainHeading: "Discover the Magic of Asia",
    brandName: "PlantripOnline",
    subheading: "Explore Thailand & Malaysia with our curated packages",
    searchPlaceholder: "Search for a location...",
    searchButtonText: "Search Now",
    destinationsLabel: "Explore our destinations"
  },
  popularDestinations: {
    title: "Popular",
    titleBold: "Destinations",
    subtitle: "Discover serene places that will restore your inner peace"
  },
  popularTours: {
    title: "Popular",
    titleBold: "Tours",
    subtitle: "Handpicked experiences for the perfect adventure"
  },
  tourPackages: {
    title: "Choose Your",
    titleBold: "Journey",
    subtitle: "Flexible packages designed for your perfect escape",
    thailand: {
      emoji: '🇹🇭',
      name: 'Thailand',
      dayTours: '50+ Tours',
      fixedPackages: '18 Packages',
      customizedLabel: 'Popular choice'
    },
    malaysia: {
      emoji: '🇲🇾',
      name: 'Malaysia',
      dayTours: '35+ Tours',
      fixedPackages: '18 Packages',
      customizedLabel: 'Popular choice'
    },
    buttons: {
      dayTours: 'Day Tours',
      fixedPackages: 'Tour Packages',
      customizedPackages: 'Customize Trip'
    }
  }
};

const heroHeadingStyles = {
  mainText: {
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(to bottom, #4B5563 0%, #9CA3AF 40%, #E5E7EB 80%, #FFFFFF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 600,
    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
    lineHeight: '1.2'
  },
  brandText: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
    lineHeight: '1.2',
    letterSpacing: '-0.015em'
  },
  brandColors: {
    main: '#FFFFFF',
    accent: '#FB923C'
  },
  destinationsLabelColor: {
    color: 'rgba(0, 0, 0, 0.7)'
  }
};