import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, ShieldCheck, Sparkles, Moon, HelpCircle } from 'lucide-react';

// iOS Apple-style premium Toggle Switch
const ToggleSwitch = ({ checked, onChange, ariaLabel }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-label={ariaLabel}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary/25 ${
        checked ? 'bg-brand-primary' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default function Settings() {
  const { user, updateRole, showToast } = useAuth();
  const [plannerMode, setPlannerMode] = useState(user?.role || 'Parent');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSaveSettings = async () => {
    if (user) {
      const result = await updateRole(plannerMode);
      if (result.success) {
        showToast('Settings saved and profile synced successfully!', 'success');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 bg-brand-primaryLight text-brand-primary rounded-xl">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">
            Settings Dashboard
          </h1>
          <p className="text-text-secondary text-sm">
            Customize layout styles, defaults, and security configurations
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Planner defaults */}
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 space-y-6 premium-card-hover">
          <div>
            <h3 className="font-display font-bold text-text-primary text-base">Planner Preferences</h3>
            <p className="text-text-secondary text-[11px]">Select your target criteria standards when generating roadmaps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent mode selection */}
            <button
              onClick={() => setPlannerMode('Parent')}
              className={`p-4 rounded-xl border text-left relative premium-card-hover ${
                plannerMode === 'Parent'
                  ? 'border-brand-primary bg-brand-primaryLight/15 ring-2 ring-brand-primary/10 shadow-xs'
                  : 'border-border-default bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-text-primary">👪 Parent Mode</span>
                {plannerMode === 'Parent' && (
                  <span className="w-2.5 h-2.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Prioritizes cost-efficiency, durable standard tiers, and gradual size-up intervals to save money.
              </p>
            </button>

            {/* Coach mode selection */}
            <button
              onClick={() => setPlannerMode('Coach')}
              className={`p-4 rounded-xl border text-left relative premium-card-hover ${
                plannerMode === 'Coach'
                  ? 'border-brand-secondary bg-indigo-50/40 ring-2 ring-brand-secondary/10 shadow-xs'
                  : 'border-border-default bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-text-primary">🏆 Coach Mode</span>
                {plannerMode === 'Coach' && (
                  <span className="w-2.5 h-2.5 bg-brand-secondary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                )}
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Prioritizes elite competition grades, regulatory weights, and performance milestones for professional training.
              </p>
            </button>
          </div>
        </div>

        {/* UI / Layout Customization */}
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 space-y-4 premium-card-hover">
          <div>
            <h3 className="font-display font-bold text-text-primary text-base">UI &amp; Visual Styles</h3>
            <p className="text-text-secondary text-[11px]">Adjust layout view parameters for readability</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Option 1: Email updates */}
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-text-primary block">Roadmap Updates</span>
                <span className="text-[10px] text-text-secondary block">Notify when sports regulations update shoe/stud details.</span>
              </div>
              <ToggleSwitch 
                checked={enableNotifications} 
                onChange={setEnableNotifications} 
                ariaLabel="Toggle roadmap updates notification"
              />
            </div>

            {/* Option 2: High Contrast */}
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-text-primary block flex items-center">
                  <Moon className="w-3.5 h-3.5 mr-1" /> High Contrast
                </span>
                <span className="text-[10px] text-text-secondary block">Sharpen contrast ratios for outdoor direct-sunlight reading.</span>
              </div>
              <ToggleSwitch 
                checked={highContrast} 
                onChange={setHighContrast} 
                ariaLabel="Toggle high contrast mode"
              />
            </div>
          </div>
        </div>

        {/* Security & Token session details */}
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 space-y-4 premium-card-hover">
          <div>
            <h3 className="font-display font-bold text-text-primary text-base flex items-center">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-primary mr-1.5" />
              Security &amp; Session Active Logs
            </h3>
            <p className="text-text-secondary text-[11px]">Details about your encrypted Google Identity session</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2.5 text-xs font-mono text-text-secondary leading-normal">
            <div className="flex justify-between">
              <span>Token Protocol:</span>
              <span className="font-bold text-text-primary">Google OAuth 2.0 (JWT)</span>
            </div>
            <div className="flex justify-between">
              <span>Session Lifetime:</span>
              <span className="font-bold text-brand-primary">1 Hour (Auto-Refresh on load)</span>
            </div>
            <div className="flex justify-between">
              <span>Encryption Algorithm:</span>
              <span className="font-bold text-text-primary">RS256 Signature (Google Public Keys)</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-brand-primary text-white font-bold text-xs rounded-btn shadow-md focus:outline-none premium-btn-hover"
          >
            Save Settings Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
