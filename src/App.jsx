import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import LandingPage from './pages/LandingPage';

const LabelCropPDF = lazy(() => import('./features/label-crop'));
const MeeshoSortPDF = lazy(() => import('./features/meesho-sort'));
const AddLogoPDF = lazy(() => import('./features/add-logo'));
const AmazonSkuPDF = lazy(() => import('./features/amazon-sku'));
const Tools = lazy(() => import('./pages/Tools'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Guide = lazy(() => import('./pages/Guide'));
const GuideArticle = lazy(() => import('./pages/GuideArticle'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
        Loading…
      </span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoogleAnalytics />
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-slate-800 antialiased">
          <Toaster position="top-center" />
          <Header />

          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/label-crop" element={<LabelCropPDF />} />
                <Route path="/meesho-sort" element={<MeeshoSortPDF />} />
                <Route path="/add-logo" element={<AddLogoPDF />} />
                <Route path="/amazon-sku" element={<AmazonSkuPDF />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/guides/:slug" element={<GuideArticle />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
          <CookieConsent />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
