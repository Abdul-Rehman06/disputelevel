import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from './layouts/SiteLayout';
import { legacyRedirects } from './utils/routes';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const PricingLandPage = lazy(() => import('./pages/PricingLandPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const TradelinesPage = lazy(() => import('./pages/TradelinesPage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CreditInfoPage = lazy(() => import('./pages/CreditInfoPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));

export default function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/pricing-land" element={<PricingLandPage />} />
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="partners" element={<PartnersPage />} />
              <Route path="tradelines" element={<TradelinesPage />} />
              <Route path="consultation" element={<ConsultationPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="credit-info" element={<CreditInfoPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="success-stories" element={<SuccessStoriesPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="sitemap" element={<SitemapPage />} />
              {Object.entries(legacyRedirects)
                .filter(([, target]) => target !== '/pricing-land')
                .map(([legacy, clean]) => <Route key={legacy} path={legacy} element={<Navigate to={clean} replace />} />)}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/pricing-land.html" element={<Navigate to="/pricing-land" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
