import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleModal({ isOpen, onClose, isDismissible = true }) {
  const { user, updateRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState('Parent');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && user.role && user.role !== 'NOT_SET') {
      setSelectedRole(user.role);
    } else {
      setSelectedRole('Parent');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateRole(selectedRole);
      if (result.success) {
        localStorage.setItem(`oxygen_role_chosen_${user.uid}`, 'true');
        onClose();
      }
    } catch (err) {
      console.error('Failed to update planner mode:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      {/* Modal Box */}
      <div className="bg-white border border-border-default rounded-card shadow-2xl w-full max-w-2xl h-[530px] max-h-[85vh] overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-border-light flex justify-between items-center bg-slate-50/20 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-brand-primaryLight text-brand-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Planner Customization</span>
            </div>
            <h3 className="font-display font-bold text-text-primary text-xl">
              Select Your Planner Mode
            </h3>
            <p className="text-text-secondary text-xs">
              Tailor roadmaps, dashboards, and metrics to your specific role.
            </p>
          </div>
          {isDismissible && (
            <button 
              onClick={onClose} 
              disabled={isSaving}
              className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content: Parent vs Coach Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto bg-white">
          {/* Parent Mode Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('Parent')}
            className={`p-6 rounded-2xl border-2 text-left flex flex-col justify-between h-full relative group outline-none premium-card-hover ${
              selectedRole === 'Parent'
                ? 'border-brand-primary bg-emerald-50/10 shadow-[0_0_20px_rgba(16,185,129,0.1)] ring-2 ring-brand-primary/10'
                : 'border-border-default bg-white'
            }`}
          >
            <div className="space-y-4 w-full">
              {/* Illustration SVG for Parent Mode */}
              <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="35" cy="45" r="12" stroke="currentColor" strokeWidth="3" />
                  <path d="M15 80C15 65 22 58 35 58C48 58 55 65 55 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="65" cy="52" r="8" stroke="currentColor" strokeWidth="3" />
                  <path d="M50 80C50 70 56 66 65 66C74 66 80 70 80 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {selectedRole === 'Parent' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-text-primary text-sm flex items-center justify-between">
                  <span>Parent Mode</span>
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Focus on nurturing athlete growth stages, safety sizing limits, and local savings cycles.
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 w-full text-[10px] text-text-secondary">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-primary rounded-full" />
                  <span>Physical growth spurts mapping</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-primary rounded-full" />
                  <span>Cost-efficiency purchasing planner</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-primary rounded-full" />
                  <span>Joint safety checks &amp; sizing advisory</span>
                </li>
              </ul>
            </div>
          </button>

          {/* Coach Mode Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('Coach')}
            className={`p-6 rounded-2xl border-2 text-left flex flex-col justify-between h-full relative group outline-none premium-card-hover ${
              selectedRole === 'Coach'
                ? 'border-brand-secondary bg-indigo-50/10 shadow-[0_0_20px_rgba(79,70,229,0.1)] ring-2 ring-brand-secondary/10'
                : 'border-border-default bg-white'
            }`}
          >
            <div className="space-y-4 w-full">
              {/* Illustration SVG for Coach Mode */}
              <div className="w-full h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand-secondary" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 30H70V45C70 56 61 65 50 65C39 65 30 56 30 45V30Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M30 38H18V48C18 52 22 55 26 55H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M70 38H82V48C82 52 78 55 74 55H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M50 65V80" stroke="currentColor" strokeWidth="3" />
                  <path d="M35 80H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {selectedRole === 'Coach' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-secondary flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-text-primary text-sm flex items-center justify-between">
                  <span>Coach Mode</span>
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Manage multiple roster players. Access squad regulatory weight profiles and tournament specs.
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 w-full text-[10px] text-text-secondary">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-secondary rounded-full" />
                  <span>Squad player metrics profiles</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-secondary rounded-full" />
                  <span>Academy regulatory weight logs</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 bg-brand-secondary rounded-full" />
                  <span>Coach-specific squad dashboards</span>
                </li>
              </ul>
            </div>
          </button>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-border-light bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
          {isDismissible && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 bg-white border border-border-default text-slate-700 font-semibold text-xs rounded-xl premium-btn-hover"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 premium-btn-hover ${
              selectedRole === 'Coach'
                ? 'bg-brand-secondary shadow-brand-secondary/15'
                : 'bg-brand-primary shadow-brand-primary/15'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Planner Mode</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
