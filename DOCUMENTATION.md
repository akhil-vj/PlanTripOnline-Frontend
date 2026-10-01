# PlanTripOnline – Frontend Documentation

> **Version:** 0.0.0  
> **Brand:** PlantripOnline (by Eurasia Holidays / TIC Holidays)  
> **Contact:** info@plantriponline.com | +60 10 666 1747

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Routing Architecture](#4-routing-architecture)
5. [Pages](#5-pages)
6. [Components](#6-components)
7. [Data Layer](#7-data-layer)
8. [Styling System](#8-styling-system)
9. [Supported Countries](#9-supported-countries)
10. [Getting Started](#10-getting-started)
11. [Scripts](#11-scripts)

---

## 1. Project Overview

**PlanTripOnline** is a travel booking and discovery platform focused on **Southeast Asian tourism** — primarily Thailand and Malaysia. It is the **frontend** of the PlanTripOnline web application, designed to let users:

- Browse travel destinations across Southeast Asian countries
- Explore day tours, tour packages, hotels, and transfers
- Request customized travel packages
- Submit enquiries and contact the agency
- Create accounts and manage their trips

The platform is operated by **Eurasia Holidays** (India) in association with **TIC Holidays Co., Ltd** (Thailand) and **TIC Holidays Sdn. Bhd** (Malaysia), with offices in **Bangkok**, **Kuala Lumpur**, and **Kochi**.

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core UI framework |
| **Vite 8** | Build tool and dev server (with HMR) |
| **React Router DOM v7** | Client-side routing |
| **React Helmet Async** | SEO — dynamic `<head>` management per page |
| **Vanilla CSS** | All styling (no Tailwind or CSS frameworks) |
| **Google Fonts (Poppins)** | Typography |
| **Oxlint** | Fast JavaScript/JSX linter |

---

## 3. Project Structure

```
PlanTripOnline-Frontend/
├── index.html                  # App HTML entry point (favicon, fonts, root div)
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── .oxlintrc.json              # Linting rules
│
├── public/
│   └── assets/                 # Static assets (favicon, images)
│
└── src/
    ├── main.jsx                # React entry — renders <App> with Router & HelmetProvider
    ├── App.jsx                 # Route definitions
    ├── App.css                 # App-level styles
    ├── index.css               # Global CSS reset and base styles
    │
    ├── pages/                  # Top-level page components (one per route)
    │   ├── HomePage.jsx
    │   ├── AboutPage.jsx
    │   ├── ContactPage.jsx
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── FaqPage.jsx
    │   ├── PrivacyPage.jsx
    │   ├── TermsPage.jsx
    │   ├── CookiesPage.jsx
    │   ├── EnquiryPage.jsx
    │   ├── ForgotPasswordPage.jsx
    │   ├── NotFoundPage.jsx
    │   └── country/
    │       └── CountryPage.jsx  # Country landing page (e.g. /thailand)
    │
    ├── components/             # Reusable UI components
    │   ├── ScrollToTop.jsx     # Scrolls window to top on route change
    │   ├── layout/
    │   │   ├── Layout.jsx      # Main layout wrapper (Header + Outlet + Footer)
    │   │   ├── Header.jsx      # Site-wide navigation bar
    │   │   └── Footer.jsx      # Site-wide footer
    │   ├── home/               # Components used only on the HomePage
    │   │   ├── Hero.jsx
    │   │   ├── DestinationCarousel.jsx
    │   │   ├── ToursGrid.jsx
    │   │   └── PackagesGrid.jsx
    │   └── country/            # Components for country-specific pages
    │       ├── CountryLayout.jsx
    │       ├── DayTours.jsx
    │       ├── TourPackages.jsx
    │       ├── TourDetail.jsx
    │       ├── PackageDetail.jsx
    │       ├── Hotels.jsx
    │       ├── HotelDetail.jsx
    │       ├── Destinations.jsx
    │       ├── DestinationDetail.jsx
    │       ├── Transfers.jsx
    │       └── CustomizedPackages.jsx
    │
    ├── data/                   # Static data / mock data layer
    │   ├── global.js           # Brand info, contact, offices, navigation, reviews
    │   ├── homeData.js         # Homepage-specific content
    │   ├── constants.js        # Shared constants used across the app
    │   ├── thailand.js         # Full travel data for Thailand
    │   └── index.js            # Data router — maps country slugs to data objects
    │
    └── styles/                 # Feature-scoped CSS files
        ├── globals.css         # Shared global variables and utilities
        ├── home.css            # Styles for the Home page
        ├── header.css          # Styles for the Header component
        └── footer.css          # Styles for the Footer component
```

---

## 4. Routing Architecture

The app uses **React Router DOM v7** with a nested route structure.

```
/                                         → HomePage
/about                                    → AboutPage
/contact                                  → ContactPage
/login                                    → LoginPage
/signup                                   → SignupPage
/faq                                      → FaqPage
/privacy                                  → PrivacyPage
/terms                                    → TermsPage
/cookies                                  → CookiesPage
/enquiry                                  → EnquiryPage
/forgot-password                          → ForgotPasswordPage
/*                                        → NotFoundPage (404)

/:country                                 → CountryPage
/:country/day-tours                       → DayTours
/:country/tour-packages                   → TourPackages
/:country/hotels                          → Hotels
/:country/hotels/:hotelSlug              → HotelDetail
/:country/destinations                    → Destinations
/:country/destinations/:destSlug         → DestinationDetail
/:country/transfers                       → Transfers
/:country/customized-packages             → CustomizedPackages
/:country/tours/:tourSlug                → TourDetail
/:country/package/:packageSlug           → PackageDetail
```

### Layout Wrappers

- **`<Layout>`** — wraps all routes. Contains the shared `<Header>` and `<Footer>`.
- **`<CountryLayout>`** — wraps all `/:country/*` routes. Loads country-specific data using the URL slug and provides it to child pages.
- **`<ScrollToTop>`** — utility component that auto-scrolls to the top of the window on every navigation event.

---

## 5. Pages

| Page | Path | Description |
|---|---|---|
| **HomePage** | `/` | Hero section, destination carousel, tours grid, packages grid |
| **AboutPage** | `/about` | Company information, mission, offices |
| **ContactPage** | `/contact` | Contact form and office locations with Google Maps embeds |
| **LoginPage** | `/login` | User login form |
| **SignupPage** | `/signup` | New user registration form |
| **FaqPage** | `/faq` | Frequently asked questions |
| **PrivacyPage** | `/privacy` | Privacy policy |
| **TermsPage** | `/terms` | Terms and conditions |
| **CookiesPage** | `/cookies` | Cookie policy |
| **EnquiryPage** | `/enquiry` | Travel enquiry submission form |
| **ForgotPasswordPage** | `/forgot-password` | Password reset flow |
| **NotFoundPage** | `/*` | 404 error page |
| **CountryPage** | `/:country` | Country landing page (hero, highlights, navigation tabs) |

---

## 6. Components

### Layout Components (`src/components/layout/`)

| Component | Description |
|---|---|
| `Layout.jsx` | Renders `<Header>`, `<Outlet>` (page content), and `<Footer>` |
| `Header.jsx` | Responsive navigation bar with country dropdown and mobile menu |
| `Footer.jsx` | Footer with links, social media, contact info, and office addresses |

### Home Components (`src/components/home/`)

| Component | Description |
|---|---|
| `Hero.jsx` | Full-width hero banner with search bar and tagline |
| `DestinationCarousel.jsx` | Scrollable carousel showing featured countries/destinations |
| `ToursGrid.jsx` | Grid layout displaying featured day tours |
| `PackagesGrid.jsx` | Grid layout displaying featured tour packages |

### Country Components (`src/components/country/`)

| Component | Description |
|---|---|
| `CountryLayout.jsx` | Fetches country data by slug; renders tabs and nested child pages |
| `DayTours.jsx` | Lists all day tours for the selected country |
| `TourPackages.jsx` | Lists all multi-day tour packages |
| `TourDetail.jsx` | Detailed view of a single day tour |
| `PackageDetail.jsx` | Detailed view of a single tour package |
| `Hotels.jsx` | Lists hotels available for the selected country |
| `HotelDetail.jsx` | Detailed view of a single hotel |
| `Destinations.jsx` | Lists travel destinations within the country |
| `DestinationDetail.jsx` | Detailed view of a single destination |
| `Transfers.jsx` | Lists airport and city transfer options |
| `CustomizedPackages.jsx` | Form to request a custom-built travel package |

### Utility Components

| Component | Description |
|---|---|
| `ScrollToTop.jsx` | Listens to route changes and scrolls `window` to the top |

---

## 7. Data Layer

All data is currently **static (mock data)** stored in `src/data/`. This allows the frontend to be fully functional without a backend during development.

### `global.js`
Core brand and site-wide data:
- `brandInfo` — name, shortName, displayName
- `contactInfo` — phone, email, WhatsApp number
- `offices` — Thailand, Malaysia, India office addresses with Google Maps embed URLs
- `featuredCountries` — list of supported countries with slug, flag emoji, tour/package counts
- `navigationItems` — sub-navigation links for country pages
- `globalImages` — hero and section background image URLs
- `homePageContent` — hero headings and search placeholder text
- `aboutContent` — company description paragraph
- `reviews` — customer testimonial objects
- `footerData` — footer description and social media links
- `formatCurrency(amount, currency)` — helper to format prices in MYR, THB, SGD, VND, IDR

### `thailand.js`
Full structured data for **Thailand** including:
- Country meta (name, slug, flag, currency, hero image, tagline, description)
- `dayTours[]` — array of day tour objects
- `destinations[]` — city and attraction objects
- `hotels[]` — hotel listings with details
- `tourPackages[]` — multi-day package objects with itineraries
- `transfers[]` — airport and city transfer options

### `index.js`
Acts as the **data router**. Exports a `getCountryData(slug)` function that returns the data object for a given country slug. Countries other than Thailand (Malaysia, Singapore, Vietnam, Indonesia) currently use a `dummyCountryData()` placeholder until their real data is populated.

### `homeData.js`
Homepage-specific content — featured tours and packages shown on the home page.

### `constants.js`
Shared constants used across multiple components.

---

## 8. Styling System

The app uses **Vanilla CSS** with no external CSS framework.

| File | Scope |
|---|---|
| `src/index.css` | Global CSS reset, base styles, CSS custom properties |
| `src/App.css` | App-level layout styles |
| `src/styles/globals.css` | Shared utility classes and CSS variables |
| `src/styles/home.css` | Styles specific to the Home page and its components |
| `src/styles/header.css` | Header/navigation styles (desktop + mobile responsive) |
| `src/styles/footer.css` | Footer layout and styles |

**Typography:** Google Fonts — `Poppins` (weights: 300, 400, 500, 600, 700, 900)

---

## 9. Supported Countries

| Country | Slug | Currency | Status |
|---|---|---|---|
| 🇹🇭 Thailand | `thailand` | THB (฿) | ✅ Full data |
| 🇲🇾 Malaysia | `malaysia` | MYR (RM) | 🔄 Placeholder |
| 🇸🇬 Singapore | `singapore` | SGD (S$) | 🔄 Placeholder |
| 🇻🇳 Vietnam | `vietnam` | VND (₫) | 🔄 Placeholder |
| 🇮🇩 Indonesia | `indonesia` | IDR (Rp) | 🔄 Placeholder |

---

## 10. Getting Started

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd PlanTripOnline-Frontend

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The app will start on `http://localhost:5173` by default (Vite default port).

### Building for Production

```bash
npm run build
```

Output is placed in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 11. Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start local development server with HMR |
| `build` | `vite build` | Build for production (output: `dist/`) |
| `preview` | `vite preview` | Serve the production build locally |
| `lint` | `oxlint` | Run the Oxlint linter on source files |

---

## Company & Offices

| Office | Location |
|---|---|
| 🇹🇭 Thailand Office | Bangkok, Thailand — TIC Holidays Co., Ltd |
| 🇲🇾 Malaysia Office | Kuala Lumpur, Malaysia — TIC Holidays Sdn. Bhd |
| 🇮🇳 India Office | Kochi, Kerala — Eurasia Holidays |

**Social Media:**
- [Facebook](https://www.facebook.com/TICTours.BKK/)
- [Instagram](https://www.instagram.com/tictoursthailand/)
- [Twitter/X](https://x.com/tictoursindia)
