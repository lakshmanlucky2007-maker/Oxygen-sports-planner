import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { auth, signOut as firebaseSignOut } from '../utils/firebase';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT Decode failed:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    let timer;
    const checkAuth = () => {
      const savedUser = localStorage.getItem('oxygen_user');
      const savedToken = localStorage.getItem('oxygen_google_token');
      
      if (savedUser && savedToken) {
        const decoded = parseJwt(savedToken);
        if (decoded) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            console.warn('Session expired on page load. Logging out.');
            logout();
          } else {
            setUser(JSON.parse(savedUser));
            
            // Set auto-logout timer
            const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
            timer = setTimeout(() => {
              showToast('Your session has expired. Please log in again.', 'error');
              logout();
            }, timeUntilExpiry);
          }
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleGoogleLogin = async (idToken) => {
    setLoading(true);
    try {
      // Client-side Token Verification (exp, aud, iss)
      const decoded = parseJwt(idToken);
      if (!decoded) {
        throw new Error('Firebase ID Token could not be parsed.');
      }

      const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'growth-gear-ai';
      if (decoded.aud !== PROJECT_ID) {
        throw new Error('Invalid audience: token does not match Firebase project ID.');
      }
      if (decoded.iss !== `https://securetoken.google.com/${PROJECT_ID}`) {
        throw new Error('Invalid issuer: token is not issued by Firebase securetoken.');
      }
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token has already expired.');
      }

      // Sync token with Express backend
      const syncRes = await api.loginSync(idToken);
      if (syncRes.success) {
        // Save original Google picture claim
        if (decoded.picture) {
          localStorage.setItem('oxygen_google_avatar', decoded.picture);
        }

        const userData = {
          uid: syncRes.user.uid,
          email: syncRes.user.email,
          name: syncRes.user.name,
          avatar: syncRes.user.avatar,
          role: syncRes.user.role || 'Parent',
          createdAt: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };

        setUser(userData);
        localStorage.setItem('oxygen_user', JSON.stringify(userData));
        localStorage.setItem('oxygen_google_token', syncRes.token);
        
        showToast(`Welcome back, ${userData.name}!`, 'success');
        
        // Auto-logout after token expiry
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
        setTimeout(() => {
          showToast('Your session has expired. Please log in again.', 'error');
          logout();
        }, timeUntilExpiry);

        return { success: true, user: userData };
      } else {
        throw new Error(syncRes.message || 'Failed to sync session with server');
      }
    } catch (err) {
      console.error('Firebase Google Sign-In Error:', err);
      showToast(err.message || 'Failed to log in with Firebase Google Auth', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (newAvatarUrl) => {
    try {
      const response = await api.updateAvatar(newAvatarUrl);
      if (response.success) {
        const updatedUser = { ...user, avatar: response.avatar };
        setUser(updatedUser);
        localStorage.setItem('oxygen_user', JSON.stringify(updatedUser));
        showToast('Profile avatar updated successfully!', 'success');
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update avatar');
      }
    } catch (err) {
      console.error('Update Avatar error:', err);
      showToast(err.message || 'Error updating profile avatar', 'error');
      return { success: false, error: err.message };
    }
  };

  const updateRole = async (newRole) => {
    try {
      const response = await api.updateRole(newRole);
      if (response.success) {
        const updatedUser = { ...user, role: response.role };
        setUser(updatedUser);
        localStorage.setItem('oxygen_user', JSON.stringify(updatedUser));
        showToast(`Switched to ${response.role} Mode!`, 'success');
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update planner mode');
      }
    } catch (err) {
      console.error('Update Role error:', err);
      showToast(err.message || 'Error updating planner mode', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('oxygen_user');
    localStorage.removeItem('oxygen_google_token');
    localStorage.removeItem('oxygen_google_avatar');
    
    // Clear role chosen state so that next login prompts them again
    if (user) {
      localStorage.removeItem(`oxygen_role_chosen_${user.uid}`);
    }
    
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Firebase Auth sign out error:', err);
    }
    
    // Clear Google auto-select triggers
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      handleGoogleLogin, 
      logout, 
      updateAvatar,
      updateRole,
      isAuthenticated: !!user,
      showToast
    }}>
      {children}

      {/* Global Toast Notification Portal */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-white border border-border-default shadow-cardHover rounded-xl p-4 min-w-[280px] max-w-sm animate-slide-in-right">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
            toast.type === 'error' ? 'bg-red-500 shadow-md shadow-red-200' : 'bg-green-500 shadow-md shadow-green-200'
          }`}>
            {toast.type === 'error' ? '✕' : '✓'}
          </div>
          <div className="flex-1 pr-2">
            <h5 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">{toast.type}</h5>
            <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-text-muted hover:text-text-primary text-xs font-bold p-1 rounded-full hover:bg-slate-100 focus:outline-none transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
