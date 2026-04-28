import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieBanner from './components/CookieBanner';

// Landing eagerly loaded (initial route, must paint fast).
import Landing from './pages/Landing';
// Other routes are code-split: each becomes its own chunk.
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminServices = lazy(() => import('./pages/AdminServices'));
const Galerie = lazy(() => import('./pages/Galerie'));
const Impressum = lazy(() => import('./pages/Impressum'));
const Datenschutz = lazy(() => import('./pages/Datenschutz'));
const AGB = lazy(() => import('./pages/AGB'));

const RouteSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0B]">
    <div className="w-8 h-8 border-4 border-white/20 border-t-[#E10600] rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<RouteSpinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/booking" element={<BookingFlow />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <CookieBanner />
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App