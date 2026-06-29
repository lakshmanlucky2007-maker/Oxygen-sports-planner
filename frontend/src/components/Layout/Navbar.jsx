import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, User, Trophy, LogOut, ChevronDown, Settings, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar';
import AvatarModal from '../Auth/AvatarModal';
import RoleModal from '../Auth/RoleModal';
import { createPortal } from 'react-dom';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleChosen = localStorage.getItem(`oxygen_role_chosen_${user.uid}`);
      if (!roleChosen) {
        setIsRoleModalOpen(true);
      }
    }
  }, [isAuthenticated, user]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    `relative py-1.5 px-3 text-xs font-semibold transition-all duration-250 nav-glow-hover ${
      isActive
        ? 'text-brand-primary font-bold active'
        : 'text-text-secondary hover:text-brand-primary'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? 'text-brand-primary bg-brand-primaryLight font-bold'
        : 'text-text-secondary hover:text-brand-primary hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Left Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-sm shadow-brand-primary/15 group-hover:scale-105 transition-transform duration-200">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base text-text-primary tracking-tight group-hover:text-brand-primary transition-colors">
                Growth Gear <span className="text-brand-primary font-medium bg-brand-primaryLight/70 px-2 py-0.5 rounded-full text-[10px] ml-0.5">AI</span>
              </span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/generate" className={linkClass}>
              Generate Roadmap
            </NavLink>
            <NavLink to="/history" className={linkClass}>
              History
            </NavLink>
          </div>

          {/* Right Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center px-3 py-1.5 border border-border-default hover:border-slate-300 text-text-secondary hover:text-text-primary font-semibold text-xs rounded-xl transition-all duration-200 shadow-sm bg-white"
            >
              Admin
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1.5 p-1 hover:bg-slate-100/70 rounded-xl transition-all duration-200 focus:outline-none"
                  aria-label="User menu"
                >
                  <UserAvatar 
                    user={user} 
                    className="w-7 h-7 rounded-lg border border-brand-primary/10 shadow-xs"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 z-40 w-56 bg-white border border-border-default rounded-2xl shadow-dropdown p-2.5 space-y-1 animate-scale-up">
                      <div className="border-b border-border-light pb-2.5 mb-1 px-1.5 pt-1">
                        <div className="flex items-center space-x-2.5">
                          <UserAvatar 
                            user={user} 
                            className="w-8 h-8 rounded-lg border border-brand-primary/15 shadow-inner"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1.5">
                              <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
                              <span className={`text-[7.5px] font-bold px-1.5 py-0.5 rounded-full ${
                                user.role === 'Coach' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <NavLink 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 text-xs font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-primaryLight/35 p-2 px-3 rounded-xl transition-all duration-200 hover:translate-x-1"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary" />
                        <span>My Profile</span>
                      </NavLink>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setIsAvatarModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2 text-xs font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-primaryLight/35 p-2 px-3 rounded-xl transition-all duration-200 hover:translate-x-1 text-left"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Avatar</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setIsRoleModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2 text-xs font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-primaryLight/35 p-2 px-3 rounded-xl transition-all duration-200 hover:translate-x-1 text-left"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Change Mode</span>
                      </button>

                      <NavLink 
                        to="/settings" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 text-xs font-semibold text-text-secondary hover:text-brand-primary hover:bg-brand-primaryLight/35 p-2 px-3 rounded-xl transition-all duration-200 hover:translate-x-1"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings</span>
                      </NavLink>

                      <div className="border-t border-border-light pt-1 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left text-xs font-bold text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 hover:translate-x-1 flex items-center space-x-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all duration-200 btn-active-feedback shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu Icon (Mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs md:hidden animate-fade-in" onClick={toggleMenu} />
      )}

      {/* Mobile Drawer Content */}
      {isOpen && (
        <div className="fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-2xl transition-all duration-300 md:hidden flex flex-col animate-slide-in-right">
          <div className="p-4 border-b border-border-light flex justify-between items-center bg-slate-50/50">
            <span className="font-display font-bold text-text-primary text-sm">Navigation</span>
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-slate-100 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-1.5 flex-grow overflow-y-auto">
            <NavLink to="/" className={mobileLinkClass} onClick={toggleMenu}>
              Home
            </NavLink>
            <NavLink to="/generate" className={mobileLinkClass} onClick={toggleMenu}>
              Generate Roadmap
            </NavLink>
            <NavLink to="/history" className={mobileLinkClass} onClick={toggleMenu}>
              History
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/profile" className={mobileLinkClass} onClick={toggleMenu}>
                  My Profile
                </NavLink>
                <button
                  onClick={() => {
                    toggleMenu();
                    setIsAvatarModalOpen(true);
                  }}
                  className="w-full text-left block py-2.5 px-4 text-sm font-semibold rounded-xl text-text-secondary hover:text-brand-primary hover:bg-slate-50 transition-all"
                >
                  Edit Avatar
                </button>
                <button
                  onClick={() => {
                    toggleMenu();
                    setIsRoleModalOpen(true);
                  }}
                  className="w-full text-left block py-2.5 px-4 text-sm font-semibold rounded-xl text-text-secondary hover:text-brand-primary hover:bg-slate-50 transition-all"
                >
                  Change Planner Mode
                </button>
                <NavLink to="/settings" className={mobileLinkClass} onClick={toggleMenu}>
                  Settings
                </NavLink>
              </>
            )}
            
            <div className="border-t border-border-light my-4 pt-4 space-y-2.5">
              <Link
                to="/admin"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-border-default text-text-secondary hover:text-text-primary font-semibold text-xs rounded-xl transition-all duration-200 bg-white"
                onClick={toggleMenu}
              >
                Admin Dashboard
              </Link>

              {isAuthenticated ? (
                <div className="bg-slate-50/70 rounded-2xl p-3.5 space-y-3.5 border border-border-light">
                  <div className="flex items-center space-x-2.5">
                    <UserAvatar 
                      user={user} 
                      className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-text-primary truncate max-w-[100px]">{user.name}</p>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                          user.role === 'Coach' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[9px] text-text-muted truncate max-w-[130px]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 focus:outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {createPortal(
        <AvatarModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />,
        document.body
      )}
      {createPortal(
        <RoleModal 
          isOpen={isRoleModalOpen} 
          onClose={() => setIsRoleModalOpen(false)} 
          isDismissible={!!localStorage.getItem(user ? `oxygen_role_chosen_${user.uid}` : '')} 
        />,
        document.body
      )}
    </nav>
  );
}
