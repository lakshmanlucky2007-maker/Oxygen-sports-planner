import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, ShieldCheck, Sparkles, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../utils/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleLogin, isAuthenticated } = useAuth();
  
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Determine redirection target (default is root dashboard /)
  const redirectUrl = searchParams.get('redirect') || '/';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is already authenticated. Redirecting to:", redirectUrl);
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const handleFirebaseGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      console.log("Triggering Firebase Google Sign-In popup...");
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log("Firebase popup success, getting ID token...");
      const idToken = await result.user.getIdToken();
      
      console.log("Forwarding Google ID Token to authentication context sync handler...");
      const syncResult = await handleGoogleLogin(idToken);
      if (syncResult.success) {
        console.log("Authentication successful, redirecting user...");
        navigate(redirectUrl);
      } else {
        console.error("Authentication sync failed:", syncResult.error);
        setLoginError(syncResult.error || 'Authentication server sync failed.');
      }
    } catch (err) {
      console.error("Firebase Login Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setLoginError('Authentication request cancelled. Please try again.');
      } else {
        setLoginError(err.message || 'Failed to authenticate your session via Firebase.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[85vh] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Column: Premium Branding panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-brand-primaryLight/30 to-brand-secondaryLight/20 rounded-3xl p-8 lg:p-12 border border-brand-primary/10 flex flex-col justify-between shadow-xs animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-primaryLight text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Sizing Intelligence</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary leading-tight">
              Plan Sizing, Gear Tiers &amp; Budget Cycles
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Join thousands of parents and professional academy coaches in Hyderabad who trust Oxygen SportAI to design safety-compliant equipment roadmaps.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white shadow-xs text-brand-primary flex items-center justify-center border border-brand-primary/10">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Academy Standards</h4>
                  <p className="text-[11px] text-text-secondary">Toggle Parent Mode for budgeting, or Coach Mode for tournament performance parameters.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white shadow-xs text-brand-secondary flex items-center justify-center border border-brand-secondary/10">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Safety Assurance</h4>
                  <p className="text-[11px] text-text-secondary">Verify correct bat handle widths, racket weight grips, and shoe stud options directly based on vertical growth metrics.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white shadow-xs text-accent-orange flex items-center justify-center border border-accent-orange/10">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Sizing &amp; Saving ROI</h4>
                  <p className="text-[11px] text-text-secondary">Calculate reactive buying overhead vs optimized roadmap periods, saving up to 35% on gear waste.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sleek Glassmorphic Login Container */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md border border-border-default rounded-3xl p-8 lg:p-12 shadow-card hover:shadow-cardHover transition-shadow duration-300 flex flex-col justify-between animate-fade-in-up">
          
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-text-primary">
                Get Started with SportAI
              </h2>
              <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                Unlock custom growth maps, timeline planners, and local catalog price integrations by registering your verified session.
              </p>
            </div>

            {/* Error alerts and loading fallbacks */}
            {loginError && (
              <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 space-y-3 text-xs text-red-600 animate-fade-in-up">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-medium">{loginError}</p>
                </div>
              </div>
            )}

            {/* Google Authentication container */}
            <div className="space-y-4 pt-2">
              <div className="text-center font-display font-bold text-xs uppercase tracking-wider text-text-muted">
                Secure Authentication Gateway
              </div>
              
              <div className="relative w-full flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleFirebaseGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-border-default rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-text-primary text-sm font-bold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.15C3.26 21.72 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.24A7.18 7.18 0 0 1 4.9 12c0-.79.13-1.57.37-2.31V6.54H1.29A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.29 5.37l3.98-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.28 1.29 5.73l3.98 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>

              <p className="text-[10px] text-text-muted text-center leading-normal max-w-xs mx-auto">
                Authorized securely via Firebase Authentication. We only read verified profile claims to sync roadmap states.
              </p>
            </div>
          </div>

          {/* Loading Overlay spinner during redirect/sync */}
          {isLoggingIn && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-center items-center space-y-4 animate-fade-in">
              <div className="relative flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-white animate-spin" />
                <div className="absolute w-14 h-14 border-2 border-white/20 rounded-full animate-pulse" />
              </div>
              <p className="text-white text-xs font-semibold tracking-wide animate-pulse">
                Synchronizing secure session parameters...
              </p>
            </div>
          )}

          {/* Footer branding */}
          <div className="text-center text-[10px] text-text-muted pt-8 border-t border-border-light mt-8">
            Secured via Google OAuth. Read our Privacy Standards.
          </div>
        </div>

      </div>
    </div>
  );
}
