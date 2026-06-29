import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import { RefreshCw } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Generate = lazy(() => import('./pages/Generate'));
const History = lazy(() => import('./pages/History'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Premium, lightweight fallback spinner for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
        <div className="absolute w-12 h-12 border-2 border-brand-primary/20 rounded-full animate-pulse" />
      </div>
      <p className="text-text-secondary text-xs font-semibold tracking-wide animate-pulse">
        Loading premium dashboard...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background-primary text-text-primary selection:bg-brand-primaryLight selection:text-brand-primary">
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
