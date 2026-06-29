import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Award, Trophy, KeyRound, Camera } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import AvatarModal from '../components/Auth/AvatarModal';
import RoleModal from '../components/Auth/RoleModal';

export default function Profile() {
  const { user } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Profile Settings
        </h1>
        <p className="text-text-secondary text-sm">
          Manage your verified account credentials and personal details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 flex flex-col items-center text-center space-y-5 premium-card-hover">
          <div className="relative group cursor-pointer rounded-full overflow-hidden" onClick={() => setIsAvatarModalOpen(true)}>
            <UserAvatar 
              user={user} 
              className="w-28 h-28 border-2 border-brand-primaryLight shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1.5">
              <h3 className="font-display font-bold text-text-primary text-base">{user.name}</h3>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                user.role === 'Coach' 
                  ? 'bg-purple-50 text-purple-700 border-purple-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-text-secondary text-xs mt-1">{user.email}</p>
          </div>
          <button 
            onClick={() => setIsAvatarModalOpen(true)}
            className="text-xs font-bold text-brand-primary flex items-center space-x-1.5 bg-brand-primaryLight px-3.5 py-2 rounded-xl premium-btn-hover"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Edit Avatar</span>
          </button>
        </div>

        {/* Right Side: Account details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border-default rounded-card shadow-card p-6 space-y-6 premium-card-hover">
            <h3 className="font-display font-bold text-text-primary text-sm pb-3 border-b border-border-light">
              Identity Verification Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-brand-primaryLight text-brand-primary rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Full Name</span>
                  <span className="text-xs font-bold text-text-primary">{user.name}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-brand-secondaryLight text-brand-secondary rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Email Address</span>
                  <span className="text-xs font-bold text-text-primary break-all">{user.email}</span>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-accent-purpleLight text-accent-purple rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Planner Mode</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs font-bold text-text-primary">{user.role} Mode</span>
                    <button
                      onClick={() => setIsRoleModalOpen(true)}
                      className="text-[9px] font-bold text-brand-primary bg-brand-primaryLight px-2 py-0.5 rounded-md border border-brand-primary/10 premium-btn-hover"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Joined */}
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-accent-orangeLight text-accent-orange rounded-xl">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Member Since</span>
                  <span className="text-xs font-bold text-text-primary">{user.createdAt || 'June 2026'}</span>
                </div>
              </div>
            </div>

            {/* Google unique user ID */}
            <div className="pt-4 border-t border-border-light">
              <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <KeyRound className="w-4 h-4 text-text-muted shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Google Identity ID (UID)</span>
                  <span className="text-xs font-mono font-medium text-text-secondary truncate block">{user.uid}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sizing Account Stats */}
          <div className="bg-gradient-to-r from-brand-primaryLight/40 to-brand-secondaryLight/20 border border-brand-primary/10 rounded-card p-5.5 flex items-center justify-between premium-card-hover">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-text-primary text-sm flex items-center">
                <Trophy className="w-4 h-4 text-brand-primary mr-1.5" />
                Need active planner upgrades?
              </h4>
              <p className="text-xs text-text-secondary">
                Switch modes in Settings or run a fresh generative athlete sizing roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>
      <AvatarModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
      <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </div>
  );
}
