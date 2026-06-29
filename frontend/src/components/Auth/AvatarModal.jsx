import React, { useState, useEffect } from 'react';
import { X, Check, Camera, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_TEMPLATES, getInitialsAvatar } from '../../utils/avatarTemplates';

export default function AvatarModal({ isOpen, onClose }) {
  const { user, updateAvatar } = useAuth();
  
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setSelectedAvatar(user.avatar || '');
    }
    // Load original Google avatar from localStorage if saved
    const savedGoogleAvatar = localStorage.getItem('oxygen_google_avatar');
    if (savedGoogleAvatar) {
      setGoogleAvatar(savedGoogleAvatar);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const initialsAvatar = getInitialsAvatar(user.name);

  // Filter templates based on gender tab
  const filteredTemplates = AVATAR_TEMPLATES.filter(tpl => {
    if (activeTab === 'all') return true;
    return tpl.gender === activeTab;
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateAvatar(selectedAvatar);
      if (result.success) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to save avatar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getTemplateSvgUri = (svgString) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white border border-border-default rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scale-up">
        
        {/* Left Side: Avatar Preview and Actions */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-border-light p-6 flex flex-col items-center justify-between text-center">
          <div className="w-full space-y-4">
            <h3 className="font-display font-bold text-text-primary text-base">
              Avatar Preview
            </h3>
            
            <div className="relative group mx-auto w-32 h-32">
              <div className="w-full h-full rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center relative transition-transform duration-300 hover:scale-105">
                <img 
                  src={selectedAvatar || initialsAvatar} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-xl shadow-md border border-white">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-display font-bold text-text-primary text-sm truncate">
                {user.name}
              </h4>
              <p className="text-[10px] text-text-muted truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="w-full space-y-2 mt-6 md:mt-0">
            <button
              onClick={handleSave}
              disabled={isSaving || selectedAvatar === user.avatar}
              className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Avatar</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-border-default rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Side: Grid Selection */}
        <div className="flex-1 p-6 flex flex-col justify-between max-h-[85vh] md:max-h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-border-light shrink-0">
            <div>
              <h3 className="font-display font-bold text-text-primary text-lg">
                Choose an Avatar
              </h3>
              <p className="text-text-secondary text-xs mt-0.5">
                Select from our modern styles, initials, or Google photo.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1.5 py-3 border-b border-border-light overflow-x-auto shrink-0">
            {['all', 'male', 'female', 'neutral'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-brand-primaryLight text-brand-primary shadow-xs'
                    : 'text-text-secondary hover:bg-slate-100'
                }`}
              >
                {tab === 'all' ? 'All Styles' : `${tab} avatars`}
              </button>
            ))}
          </div>

          {/* Grid Content */}
          <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Special Options Section */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Initials Option */}
              <button
                onClick={() => setSelectedAvatar(initialsAvatar)}
                className={`relative flex items-center space-x-3 p-2.5 rounded-2xl border transition-all duration-200 ${
                  selectedAvatar === initialsAvatar
                    ? 'border-brand-primary bg-brand-primaryLight/20 ring-2 ring-brand-primary/20'
                    : 'border-border-default hover:border-slate-300 bg-white hover:scale-[1.01]'
                }`}
              >
                <img 
                  src={initialsAvatar} 
                  alt="Initials Avatar" 
                  className="w-10 h-10 rounded-xl shadow-xs"
                />
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-text-primary">Use Initials</p>
                  <p className="text-[9px] text-text-muted truncate">Name-based colors</p>
                </div>
                {selectedAvatar === initialsAvatar && (
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-brand-primary rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                )}
              </button>

              {/* Google Option (If Available) */}
              {googleAvatar && (
                <button
                  onClick={() => setSelectedAvatar(googleAvatar)}
                  className={`relative flex items-center space-x-3 p-2.5 rounded-2xl border transition-all duration-200 ${
                    selectedAvatar === googleAvatar
                      ? 'border-brand-primary bg-brand-primaryLight/20 ring-2 ring-brand-primary/20'
                      : 'border-border-default hover:border-slate-300 bg-white hover:scale-[1.01]'
                  }`}
                >
                  <img 
                    src={googleAvatar} 
                    alt="Google Profile" 
                    className="w-10 h-10 rounded-xl shadow-xs object-cover"
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-text-primary">Google Photo</p>
                    <p className="text-[9px] text-text-muted truncate">Original account picture</p>
                  </div>
                  {selectedAvatar === googleAvatar && (
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-brand-primary rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                  )}
                </button>
              )}
            </div>

            {/* Custom SVG Templates */}
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5">
                Modern Flat Illustrations
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filteredTemplates.map(tpl => {
                  const svgUri = getTemplateSvgUri(tpl.svg);
                  const isSelected = selectedAvatar === svgUri;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedAvatar(svgUri)}
                      className={`relative group p-1 rounded-2xl border bg-white flex flex-col items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primaryLight/25 ring-2 ring-brand-primary/20 scale-102'
                          : 'border-border-default hover:border-slate-300 hover:scale-105'
                      }`}
                      title={tpl.label}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden">
                        <img 
                          src={svgUri} 
                          alt={tpl.label} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
