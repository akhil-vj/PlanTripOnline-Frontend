# PlanTripOnline — Frontend Developer Documentation

> **Repo:** `akhil-vj/PlanTripOnline-Frontend`  
> **Stack:** React 19 + Vite 8 + React Router v7  
> **Backend API:** `http://backend.plantriponline.com` (Laravel)  
> **Last Updated:** October 2026

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Project Overview](#2-project-overview)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Routing Architecture](#5-routing-architecture)
6. [Page Status & Build Progress](#6-page-status--build-progress)
7. [Components Reference](#7-components-reference)
8. [Data Layer](#8-data-layer)
9. [Styling Guide](#9-styling-guide)
10. [Backend API Integration](#10-backend-api-integration)
11. [How To: Add a New Country](#11-how-to-add-a-new-country)
12. [How To: Build a Placeholder Page](#12-how-to-build-a-placeholder-page)
13. [Common Gotchas & Known Issues](#13-common-gotchas--known-issues)
14. [Scripts & Commands](#14-scripts--commands)
15. [Git Workflow](#15-git-workflow)

---

## 1. Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v9+

### Setup

```bash
git clone https://github.com/akhil-vj/PlanTripOnline-Frontend.git
cd PlanTripOnline-Frontend
npm install
npm run dev
```

App runs at **`http://localhost:5173`**

### Key URLs to Test

| URL | What It Shows |
|-----|---------------|
| `http://localhost:5173` | Homepage |
| `http://localhost:5173/thailand` | Thailand country page (only country with real data) |
| `http://localhost:5173/login` | Login page |
| `http://localhost:5173/signup` | Signup page |
| `http://localhost:5173/enquiry` | Travel enquiry form |
| `http://localhost:5173/forgot-password` | Password reset page |
| `http://localhost:5173/admin-dashboard` | Admin dashboard (shell) |
| `http://localhost:5173/user-dashboard` | User dashboard (shell) |

---

## 2. Project Overview

PlanTripOnline is a **travel agency website** for browsing tours, hotels, destinations, and packages across Southeast Asia. It is the **frontend only** — the backend is a separate Laravel application.

### Business Context

- Operated by **TIC Holidays Co., Ltd** (Thailand), **TIC Holidays Sdn. Bhd** (Malaysia), and **Eurasia Holidays** (India)
- Offices in **Bangkok**, **Kuala Lumpur**, and **Kochi**
- Primary focus: Thailand & Malaysia tourism
- Contact: `info@plantriponline.com` | `+60 10 666 1747`

### What Users Can Do

- Browse destinations, day tours, tour packages, hotels, and transfers by country
- Submit travel enquiries
- Create accounts (signup/login)
- View dashboards (user and admin — currently shells)

---

## 3. Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.8 | UI framework |
| Vite | 8.3.0 | Build tool, dev server (HMR) |
| React Router DOM | 7.18.4 | Client-side routing |
| react-helmet-async | 3.0.0 | Per-page `<title>` and `<meta>` tags (SEO) |
| oxlint | 1.81.0 | JavaScript/JSX linter |
| Vanilla CSS | — | All styling (no Tailwind, no CSS frameworks) |
| Google Fonts | — | Poppins (300–900 weights) |

**No state management library** — all state is local (`useState`/`useEffect`). No Redux, Zustand, or Context API wrappers.

---

## 4. Project Structure

```
src/
├── main.jsx                    # Entry point — wraps App with BrowserRouter & HelmetProvider
├── App.jsx                     # All route definitions
├── App.css                     # App-level styles
├── index.css                   # CSS reset and base styles
│
├── pages/                      # One file per route (page-level components)
│   ├── HomePage.jsx            # ✅ Built
│   ├── LoginPage.jsx           # ✅ Built (single-file with embedded CSS)
│   ├── SignupPage.jsx          # ✅ Built (single-file with embedded CSS)
│   ├── ForgotPasswordPage.jsx  # ✅ Built (single-file with embedded CSS)
│   ├── EnquiryPage.jsx         # ✅ Built (single-file with embedded CSS)
│   ├── AdminDashboard.jsx      # ⚠️ Shell (static fake data)
│   ├── UserDashboard.jsx       # ⚠️ Shell (static fake data)
│   ├── AboutPage.jsx           # ❌ Placeholder
│   ├── ContactPage.jsx         # ❌ Placeholder
│   ├── FaqPage.jsx             # ❌ Placeholder
│   ├── PrivacyPage.jsx         # ❌ Placeholder
│   ├── TermsPage.jsx           # ❌ Placeholder
│   ├── CookiesPage.jsx         # ❌ Placeholder
│   ├── NotFoundPage.jsx        # ❌ Placeholder
│   ├── Auth.module.css         # CSS Module (used by dashboard pages)
│   ├── Dashboard.module.css    # CSS Module (used by dashboard pages)
│   └── country/
│       └── CountryPage.jsx     # ✅ Built (country landing page)
│
├── components/
│   ├── ScrollToTop.jsx         # Scrolls to top on route change
│   ├── layout/
│   │   ├── Layout.jsx          # Wraps pages with Header + Footer
│   │   ├── Header.jsx          # ✅ Navigation bar (desktop + mobile)
│   │   └── Footer.jsx          # ✅ Site footer
│   ├── home/
│   │   ├── Hero.jsx            # ✅ Homepage hero banner
│   │   ├── DestinationCarousel.jsx  # ✅ Scrollable destination cards
│   │   ├── ToursGrid.jsx       # ✅ Featured tours grid
│   │   └── PackagesGrid.jsx    # ✅ Featured packages grid
│   └── country/
│       ├── CountryLayout.jsx   # Loads country data, passes via Outlet context
│       ├── DayTours.jsx        # ❌ Placeholder
│       ├── TourPackages.jsx    # ❌ Placeholder
│       ├── Hotels.jsx          # ❌ Placeholder
│       ├── HotelDetail.jsx     # ❌ Placeholder
│       ├── Destinations.jsx    # ❌ Placeholder
│       ├── DestinationDetail.jsx  # ❌ Placeholder
│       ├── Transfers.jsx       # ❌ Placeholder
│       ├── CustomizedPackages.jsx  # ❌ Placeholder
│       ├── TourDetail.jsx      # ❌ Placeholder
│       └── PackageDetail.jsx   # ❌ Placeholder
│
├── data/                       # All static/mock data (no database)
│   ├── global.js               # Brand, contact, offices, navigation, reviews, footer
│   ├── homeData.js             # Homepage-specific content
│   ├── thailand.js             # Full Thailand data (tours, hotels, destinations, transfers)
│   ├── constants.js            # Legacy constants (from old HTML version — mostly unused)
│   └── index.js                # Country data router: getCountryData(slug)
│
├── config/
│   └── api.js                  # Backend API base URL and fetch helper
│
└── styles/                     # External CSS files
    ├── globals.css             # Shared CSS variables
    ├── home.css                # Homepage styles
    ├── header.css              # Header/nav styles
    ├── footer.css              # Footer styles
    └── country.css             # Country page styles
```

---

## 5. Routing Architecture

Defined in `src/App.jsx`. Uses React Router v7 nested routes.

### Route Groups

**Standalone pages** (no Header/Footer):
```
/login                    → LoginPage
/signup                   → SignupPage
/admin-dashboard/*        → AdminDashboard
/user-dashboard/*         → UserDashboard
```

**Layout-wrapped pages** (with Header + Footer):
```
/                         → HomePage
/about                    → AboutPage
/contact                  → ContactPage
/faq                      → FaqPage
/privacy                  → PrivacyPage
/terms                    → TermsPage
/cookies                  → CookiesPage
/enquiry                  → EnquiryPage
/forgot-password          → ForgotPasswordPage
/*                        → NotFoundPage (404)
```

**Country routes** (nested under `<CountryLayout>`):
```
/:country                           → CountryPage
/:country/day-tours                 → DayTours
/:country/tour-packages             → TourPackages
/:country/hotels                    → Hotels
/:country/hotels/:hotelSlug         → HotelDetail
/:country/destinations              → Destinations
/:country/destinations/:destSlug    → DestinationDetail
/:country/transfers                 → Transfers
/:country/customized-packages       → CustomizedPackages
/:country/tours/:tourSlug           → TourDetail
/:country/package/:packageSlug      → PackageDetail
```

### Layout Wrappers

| Wrapper | File | What It Does |
|---------|------|-------------|
| `<Layout>` | `components/layout/Layout.jsx` | Renders `<Header>` + `<Outlet>` + `<Footer>` |
| `<CountryLayout>` | `components/country/CountryLayout.jsx` | Reads `:country` param, calls `getCountryData(slug)`, passes data to children via `useOutletContext()` |
| `<ScrollToTop>` | `components/ScrollToTop.jsx` | Scrolls window to top on every route change |

### How Country Pages Get Their Data

```
URL: /thailand/day-tours

1. CountryLayout reads useParams() → { country: 'thailand' }
2. Calls getCountryData('thailand') → returns thailandData object
3. Passes data via <Outlet context={data} />
4. DayTours component reads data via useOutletContext()
```

---

## 6. Page Status & Build Progress

### ✅ Fully Built

| Page | File | Notes |
|------|------|-------|
| Homepage | `pages/HomePage.jsx` | Hero, carousel, tours grid, packages grid |
| Login | `pages/LoginPage.jsx` | Single-file (CSS embedded). Eye-tracking animation on password toggle |
| Signup | `pages/SignupPage.jsx` | Single-file (CSS embedded). Dual password fields with eye animation |
| Forgot Password | `pages/ForgotPasswordPage.jsx` | Single-file (CSS embedded). Email form + success state |
| Enquiry | `pages/EnquiryPage.jsx` | Single-file (CSS embedded). Full travel enquiry form |
| Country Landing | `pages/country/CountryPage.jsx` | Destinations, day tours, tour packages sections. **Only Thailand has real data.** |
| Header | `components/layout/Header.jsx` | Desktop nav with dropdowns, mobile hamburger menu, login/logout state |
| Footer | `components/layout/Footer.jsx` | Contact info, social links, quick links |

### ⚠️ Partially Built (Functional but Incomplete)

| Page | File | What's Missing |
|------|------|---------------|
| Admin Dashboard | `pages/AdminDashboard.jsx` | Static fake stats. No real CRUD, no real data, sidebar links go nowhere |
| User Dashboard | `pages/UserDashboard.jsx` | Shows "0 trips". No profile editing, no trip management |

### ❌ Placeholder Pages (Show "Coming Soon")

All of these are one-liner components like:
```jsx
export default function AboutPage() {
  return <div className='section'><div className='container'><h1>AboutPage</h1><p>Coming Soon</p></div></div>;
}
```

**Static pages:** AboutPage, ContactPage, FaqPage, PrivacyPage, TermsPage, CookiesPage, NotFoundPage

**Country sub-pages:** DayTours, TourPackages, Hotels, HotelDetail, Destinations, DestinationDetail, Transfers, CustomizedPackages, TourDetail, PackageDetail

---

## 7. Components Reference

### Layout Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Layout` | `components/layout/Layout.jsx` | Simple wrapper: `<Header />` + `<Outlet />` + `<Footer />` |
| `Header` | `components/layout/Header.jsx` | Responsive nav. Reads `featuredCountries` from `global.js` for dropdown menus. Checks `localStorage` for login state |
| `Footer` | `components/layout/Footer.jsx` | Reads `brandInfo`, `contactInfo`, `footerData` from `global.js` |

### Home Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Hero` | `components/home/Hero.jsx` | Full-width hero with gradient text, search bar |
| `DestinationCarousel` | `components/home/DestinationCarousel.jsx` | Horizontally scrollable destination cards. Uses `homeDestinations` from `constants.js` |
| `ToursGrid` | `components/home/ToursGrid.jsx` | 3-column grid of featured tours |
| `PackagesGrid` | `components/home/PackagesGrid.jsx` | Thailand/Malaysia package comparison cards |

### Country Components

| Component | Location | Description |
|-----------|----------|-------------|
| `CountryLayout` | `components/country/CountryLayout.jsx` | Data provider. Loads country data by URL slug, renders 404 if invalid |
| All others | `components/country/*.jsx` | **All placeholders** — need to be built |

---

## 8. Data Layer

**All data is hardcoded in `src/data/` files.** There is no database connection for content. The backend API is only used for auth (login/signup).

### Files

| File | What It Exports |
|------|----------------|
| `global.js` | `brandInfo`, `contactInfo`, `offices`, `featuredCountries`, `navigationItems`, `globalImages`, `homePageContent`, `aboutContent`, `reviews`, `footerData`, `formatCurrency()` |
| `thailand.js` | `ThailandDayTours[]`, `ThailandDestinations[]`, `ThailandHotels[]`, `ThailandTourPackages[]`, `ThailandTransfers[]`, `thailandData` (combined object) |
| `index.js` | `getCountryData(slug)` — returns country data object or `null` |
| `homeData.js` | Homepage-specific tour/destination data |
| `constants.js` | **Legacy file** from old HTML version. Some data is still read by home components but this file should eventually be deprecated |

### Country Data Shape

Every country data object follows this shape (see `thailand.js` for the full example):

```js
{
  name: 'Thailand',           // Display name
  slug: 'thailand',           // URL slug
  flag: '🇹🇭',               // Emoji flag
  currency: 'THB',            // Currency code
  heroImage: 'https://...',   // Hero background image URL
  tagline: 'Land of Smiles',  // Short tagline
  description: '...',         // Paragraph description

  dayTours: [
    {
      id: 'tour-grand-palace',
      title: 'Grand Palace & Wat Pho Tour',
      location: 'Bangkok',
      image: 'https://...',
      badge: 'Bestseller',        // Optional badge text
      duration: '⏱ 4 hours',
      description: '...',
      features: ['🎫 Skip the Line', '👥 Small Group'],
      rating: 4.9,
      reviews: 324,
      price: '$45'
    },
    // ...
  ],

  destinations: [
    {
      id: 'bangkok',
      name: 'Bangkok',
      image: 'https://...',
      badge: '15 Tours',
      rating: 4.8,
      locations: '12 Locations',
      description: '...',
      highlights: ['Grand Palace', 'Chatuchak Market']
    },
    // ...
  ],

  hotels: [
    {
      id: 'siam-bangkok',
      title: 'The Siam Bangkok',
      location: 'Bangkok - Riverside',
      image: 'https://...',
      category: 'luxury',          // luxury | boutique | upscale | mid-range
      stars: '5',
      destination: 'Bangkok',
      badge: 'Featured',
      rating: 4.9,
      reviews: '250+ reviews',
      price: '$380',
      amenities: ['🏊 Pool', '🍽️ Restaurant', '💆 Spa']
    },
    // ...
  ],

  tourPackages: [
    {
      id: 'best-of-thailand',
      title: 'Best of Thailand - 7 Days',
      subtitle: 'Bangkok • Chiang Mai • Phuket',
      image: 'https://...',
      badge: 'Most Popular',
      duration: '7D/6N',
      price: '$1,299',
      includes: ['🏨 Hotels', '✈️ Flights', '🍽️ Meals']
    },
    // ...
  ],

  transfers: [
    {
      id: 'bkk-airport-city',
      title: 'Bangkok Airport to City',
      from: 'Suvarnabhumi Airport',
      to: 'Bangkok City Center',
      duration: '45-60 min',
      price: 'From $25',
      image: 'https://...',
      vehicles: ['Sedan', 'SUV', 'Van'],
      description: '...'
    },
    // ...
  ]
}
```

### Countries with Real Data vs Dummy

| Country | Slug | Data Status |
|---------|------|------------|
| 🇹🇭 Thailand | `thailand` | ✅ Full (9 tours, 6 destinations, 6 hotels, 6 packages, 3 transfers) |
| 🇲🇾 Malaysia | `malaysia` | ❌ Dummy (empty arrays) |
| 🇸🇬 Singapore | `singapore` | ❌ Dummy (empty arrays) |
| 🇻🇳 Vietnam | `vietnam` | ❌ Dummy (empty arrays) |
| 🇮🇩 Indonesia | `indonesia` | ❌ Dummy (empty arrays) |

---

## 9. Styling Guide

### Three CSS Approaches in Use

The project uses **three different CSS approaches** depending on when the component was built:

| Approach | Used By | How It Works |
|----------|---------|-------------|
| **External `.css` files** | Homepage, Header, Footer, Country pages | Import CSS file at top of component: `import '../styles/home.css'` |
| **CSS Modules** (`.module.css`) | Admin/User Dashboard | Import as `styles` object: `import styles from './Dashboard.module.css'` then use `className={styles.someClass}` |
| **Embedded `<style>` in JSX** | Login, Signup, Forgot Password, Enquiry | CSS written inside `<style>{...}</style>` tag directly in the component JSX. **This is the preferred pattern for auth/form pages** |

### CSS Naming Convention

For components using external CSS, class names are **scoped by parent class** to avoid conflicts:

```css
/* ✅ Correct — scoped under page class */
.login-page .back-button { ... }
.login-page .form-group { ... }

/* ❌ Avoid — global class names that could conflict */
.back-button { ... }
.form-group { ... }
```

### Key CSS Files

| File | What It Styles |
|------|---------------|
| `src/index.css` | CSS reset, base `body` styles, font imports |
| `src/App.css` | App-level wrapper styles |
| `src/styles/globals.css` | Shared CSS variables and utilities |
| `src/styles/home.css` | Homepage hero, tour cards, destination cards, package cards, carousel |
| `src/styles/header.css` | Desktop nav, dropdowns, mobile menu, scroll behavior |
| `src/styles/footer.css` | Footer layout, links, social icons |
| `src/styles/country.css` | Country page hero, section overrides |

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Orange | `#ff9500` | Buttons, accents, links, highlights |
| Dark Blue/Gray | `#2c3e50` / `rgba(44, 62, 80)` | Auth page backgrounds |
| Dark Text | `#1c1917` | Headings |
| Light Background | `#f5f5f4` / `#fafaf9` | Page backgrounds |

---

## 10. Backend API Integration

### Configuration

The API base URL and a fetch helper are defined in `src/config/api.js`:

```js
export const API_BASE_URL = 'http://backend.plantriponline.com';

export const apiFetch = async (endpoint, options = {}) => {
  return await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });
};
```

### Known API Endpoints

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/api/login` | POST | LoginPage | User login. Body: `{ email, password }`. Returns `{ token }` |
| `/api/register` | POST | SignupPage | User signup. Body: `{ name, email, country, phone, password, password_confirmation }`. Returns `{ token }` |

### Auth Flow

1. On login/signup success, the token is stored in `localStorage.setItem('token', data.token)`
2. `Header.jsx` reads `localStorage.getItem('token')` on mount to determine login state
3. Logout removes the token: `localStorage.removeItem('token')`
4. **Admin shortcut:** Username `admin` + password `plantrip@123` navigates directly to `/admin-dashboard` (hardcoded, no API call)

> **Note:** Most of the site's content (tours, hotels, etc.) is hardcoded in `src/data/` files, NOT fetched from the API. Only auth endpoints are actually called.

---

## 11. How To: Add a New Country

Example: Adding **Malaysia** with real data.

### Step 1: Create the data file

Create `src/data/malaysia.js` following the same structure as `thailand.js`:

```js
export const MalaysiaDayTours = [
  { id: 'tour-petronas', title: 'Petronas Towers Tour', ... },
  // ...
];

export const MalaysiaDestinations = [ ... ];
export const MalaysiaHotels = [ ... ];
export const MalaysiaTourPackages = [ ... ];
export const MalaysiaTransfers = [ ... ];

export const malaysiaData = {
  name: 'Malaysia',
  slug: 'malaysia',
  flag: '🇲🇾',
  currency: 'MYR',
  heroImage: 'https://...',
  tagline: 'Truly Asia',
  description: '...',
  dayTours: MalaysiaDayTours,
  destinations: MalaysiaDestinations,
  hotels: MalaysiaHotels,
  tourPackages: MalaysiaTourPackages,
  transfers: MalaysiaTransfers,
};
```

### Step 2: Register it in the data index

Update `src/data/index.js`:

```js
import { thailandData } from './thailand';
import { malaysiaData } from './malaysia';  // ← Add this

const countryDataMap = {
  thailand: thailandData,
  malaysia: malaysiaData,  // ← Replace the dummy
  // ...
};
```

### Step 3: Done

No routing changes needed — the `/:country` route already handles any country slug. `CountryLayout` will automatically load the data.

---

## 12. How To: Build a Placeholder Page

All placeholder pages currently look like this:

```jsx
export default function AboutPage() {
  return <div className='section'><div className='container'><h1>AboutPage</h1><p>Coming Soon</p></div></div>;
}
```

### To build one out:

1. Add `react-helmet-async` for SEO:
```jsx
import { Helmet } from 'react-helmet-async';
```

2. Use the section/container pattern from `home.css`:
```jsx
<section className="section">
  <div className="container">
    <h2 className="section-title">About <span>Us</span></h2>
    {/* Content here */}
  </div>
</section>
```

3. For auth/form pages, use the **single-file pattern** with embedded `<style>` (see `LoginPage.jsx` as the reference implementation).

4. For content pages, use the **external CSS** approach (add a new file in `src/styles/` if needed).

---

## 13. Common Gotchas & Known Issues

### ⚠️ Git Merge Conflicts

This project has had merge conflicts from multiple developers working on the same files. **Always pull before pushing:**

```bash
git pull origin main
# Resolve any conflicts
git add .
git commit -m "your message"
git push
```

If you see `<<<<<<< HEAD` or `=======` or `>>>>>>>` markers in a `.jsx` file, Vite will crash with a `PARSE_ERROR: Encountered diff marker` error. You must manually remove all conflict markers.

### ⚠️ CSS Conflicts

Because some components use global CSS class names (like `.form-group`, `.container`, `.section`), styles from one page can leak into another. The auth pages avoid this by scoping all styles under their parent class (e.g., `.login-page .form-group`).

### ⚠️ `constants.js` is Legacy

`src/data/constants.js` contains a `document.write()` call on line 5 that was from the old HTML version. This file is partially used by some home components but should be gradually replaced by `global.js` and `homeData.js`.

### ⚠️ Two Versions of Auth Logic

Some auth pages have been worked on by different developers at different times. You may find:
- **Version A:** Demo-only (shows `alert('Login clicked')`)
- **Version B:** Real API calls to `backend.plantriponline.com`

Make sure each page uses one consistent approach.

### ⚠️ Images Are External URLs

All images are loaded from external URLs (Unsplash, Klook, Agoda, etc.). If any of these URLs break, the images will disappear. Consider downloading critical images to `public/assets/` for reliability.

---

## 14. Scripts & Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot module replacement (HMR) |
| `npm run build` | Production build → outputs to `dist/` |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run oxlint on all source files |

---

## 15. Git Workflow

### Repository

- **Remote:** `https://github.com/akhil-vj/PlanTripOnline-Frontend.git`
- **Branch:** `main`

### Before You Start Working

```bash
git pull origin main
```

### After Making Changes

```bash
git add .
git commit -m "Descriptive commit message"
git pull origin main    # Always pull before push to avoid conflicts
git push origin main
```

### Commit Message Format

Use descriptive messages:
```
✅ Good: "Build out Malaysia country data with 8 tours and 5 hotels"
✅ Good: "Fix merge conflict in LoginPage.jsx"
✅ Good: "Add About page with company info and office maps"
❌ Bad:  "update"
❌ Bad:  "fix"
❌ Bad:  "changes"
```
