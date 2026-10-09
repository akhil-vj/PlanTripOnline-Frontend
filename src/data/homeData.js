export const homeDestinations = [
  { name: 'Kuala Lumpur', country: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', price: '1,200', currency: 'MYR', duration: '3 Days 2 Nights', rating: 4.8 },
  { name: 'Langkawi', country: 'Malaysia', image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg', price: '1,500', currency: 'MYR', duration: '4 Days 3 Nights', rating: 4.9 },
  { name: 'Penang', country: 'Malaysia', image: 'https://www.agoda.com/wp-content/uploads/2024/07/Penang-Malaysia-George-Town-1244x700.jpg', price: '1,100', currency: 'MYR', duration: '3 Days 2 Nights', rating: 4.7 },
  { name: 'Cameron Highlands', country: 'Malaysia', image: 'https://dynamic-media.tacdn.com/media/photo-o/2f/ba/bd/d9/caption.jpg?w=700&h=500&s=1', price: '900', currency: 'MYR', duration: '2 Days 1 Night', rating: 4.6 },
  { name: 'Bangkok', country: 'Thailand', image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR0FKha8f6Iqy1N8equBS_8XuXGlo_iyFVRsd7yJTexqSN6CUIKQZwjVJDqzUe9iVSehH5qE3GBPhYKj2etPpJT2Hu94wUpuSbdXjt0PQ', price: '8,500', currency: 'THB', duration: '3 Days 2 Nights', rating: 4.7 },
  { name: 'Phuket', country: 'Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800', price: '10,000', currency: 'THB', duration: '4 Days 3 Nights', rating: 4.8 },
  { name: 'Chiang Mai', country: 'Thailand', image: 'https://static.independent.co.uk/2025/08/29/14/57/iStock-2181663837.jpeg?quality=75&width=1368&crop=3%3A2%2Csmart&auto=webp', price: '7,500', currency: 'THB', duration: '3 Days 2 Nights', rating: 4.9 },
  { name: 'Kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', price: '15,000', currency: 'INR', duration: '3 Days 2 Nights', rating: 4.9 },
];

export const homeTours = [
  { title: 'Petronas Towers Sky Deck Experience', type: 'Half Day Tour', price: 'MYR 180', rating: 4.8, image: 'https://www.pelago.com/img/products/MY-Malaysia/petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host/f294c996-674c-45b2-81c1-3dedf833f9fd_petronas-twin-tower-skybridge-view-dining-experience-tour-with-local-host.jpg', country: 'Malaysia' },
  { title: 'Langkawi Island Hopping & Snorkeling', type: 'Full Day Tour', price: 'MYR 260', rating: 4.9, image: 'https://www.travelanddestinations.com/wp-content/uploads/2023/02/Cenang-Beach-in-Langkawi.jpg', country: 'Malaysia' },
  { title: 'Genting Highlands Cable Car & Theme Park', type: 'Full Day Tour', price: 'MYR 220', rating: 4.7, image: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_720/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/yv7ytfhwlwu4knavune5/AwanaSkywayGondolaCableCarandSkytropolisIndoorThemeParkComboPackageinGentingHighlands-KlookIndia.jpg', country: 'Malaysia' },
  { title: 'Bangkok Temple & City Tour', type: 'Full Day Tour', price: 'THB 1,950', rating: 4.8, image: 'https://dynamic-media.tacdn.com/media/photo-o/2e/c1/b5/a7/caption.jpg?w=1100&h=800&s=1', country: 'Thailand' },
  { title: 'Pattaya Beach & Islands', type: 'Full Day Tour', price: 'THB 3,200', rating: 4.7, image: 'https://www.royalwingsuites.com/wp-content/uploads/2023/02/feat-attraction-island-hopping-coral-and-koh-pai.jpg', country: 'Thailand' },
  { title: 'Chiang Mai Mountain Trek', type: 'Half Day Tour', price: 'THB 3,600', rating: 4.9, image: 'https://s3-cdn.designerjourneys.com/blog/wp-content/uploads/2017/12/07075435/Chiang-Mai-1.jpg', country: 'Thailand' }
];

export const homepageConfig = {
  displayLimits: { destinations: 8, tours: 6, packages: 4 },
  carousel: {
    animationDuration: 800, swipeThreshold: 50, autoplayInterval: 5000,
    positions: {
      center: { transform: 'translateX(0) translateZ(50px) scale(1.15)', zIndex: 10, opacity: 1, filter: 'grayscale(0)' },
      right1: { transform: 'translateX(380px) translateZ(-50px) scale(0.95)', zIndex: 5, opacity: 0.85, filter: 'grayscale(20%)' },
      right2: { transform: 'translateX(700px) translateZ(-150px) scale(0.85)', zIndex: 1, opacity: 0.6, filter: 'grayscale(50%)' },
      left1: { transform: 'translateX(-380px) translateZ(-50px) scale(0.95)', zIndex: 5, opacity: 0.85, filter: 'grayscale(20%)' },
      left2: { transform: 'translateX(-700px) translateZ(-150px) scale(0.85)', zIndex: 1, opacity: 0.6, filter: 'grayscale(50%)' },
      hidden: { transform: 'translateX(0) scale(0.5)', zIndex: 0, opacity: 0, filter: 'grayscale(100%)', pointerEvents: 'none' }
    }
  }
};
