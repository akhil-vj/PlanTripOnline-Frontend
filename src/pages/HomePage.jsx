import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import DestinationCarousel from '../components/home/DestinationCarousel';
import ToursGrid from '../components/home/ToursGrid';
import PackagesGrid from '../components/home/PackagesGrid';
import { homePageContent, brandInfo } from '../data/global';
import '../styles/home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <Helmet>
        <title>PlanTripOnline - Your Gateway to Southeast Asia | Travel Packages, Hotels & Tours</title>
        <meta name="description" content="Discover amazing travel packages to Thailand, Singapore, Vietnam, Indonesia & Malaysia. Book hotels, day tours, and customized trips with expert local guides." />
      </Helmet>
      
      <Hero />
      <DestinationCarousel />
      <ToursGrid />
      <PackagesGrid />
    </div>
  );
}
