import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center space-y-4 bg-background-primary">
        <div className="relative flex items-center justify-center animate-fade-in-up">
          <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
          <div className="absolute w-12 h-12 border-2 border-brand-primary/20 rounded-full animate-pulse" />
        </div>
        <p className="text-text-secondary text-xs font-semibold tracking-wide animate-pulse">
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save target path to redirect back after successful sign-in
    const targetPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${targetPath}`} replace />;
  }

  return children;
}
