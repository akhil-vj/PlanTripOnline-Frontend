import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CountryLayout from './components/country/CountryLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import FaqPage from './pages/FaqPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'
import EnquiryPage from './pages/EnquiryPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'
import CountryPage from './pages/country/CountryPage'
import DayTours from './components/country/DayTours'
import TourPackages from './components/country/TourPackages'
import Hotels from './components/country/Hotels'
import HotelDetail from './components/country/HotelDetail'
import Destinations from './components/country/Destinations'
import DestinationDetail from './components/country/DestinationDetail'
import Transfers from './components/country/Transfers'
import CustomizedPackages from './components/country/CustomizedPackages'
import TourDetail from './components/country/TourDetail'
import PackageDetail from './components/country/PackageDetail'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth and Dashboard Routes without Header/Footer */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="user-dashboard/*" element={<UserDashboard />} />

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="enquiry" element={<EnquiryPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />

          <Route path=":country" element={<CountryLayout />}>
            <Route index element={<CountryPage />} />
            <Route path="day-tours" element={<DayTours />} />
            <Route path="tour-packages" element={<TourPackages />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="hotels/:hotelSlug" element={<HotelDetail />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:destSlug" element={<DestinationDetail />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="customized-packages" element={<CustomizedPackages />} />
            <Route path="tours/:tourSlug" element={<TourDetail />} />
            <Route path="package/:packageSlug" element={<PackageDetail />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
