import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlayerForm from '../components/InputForm/PlayerForm';
import TemplatePresets from '../components/InputForm/TemplatePresets';
import RoadmapDisplay from '../components/Output/RoadmapDisplay';
import useGenerate from '../hooks/useGenerate';
import { HelpCircle, RefreshCw, Trophy, Check, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const { isLoading, roadmap, generationId, playerProfile, error, generate, reset } = useGenerate();
  
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Read URL query parameter for preset pre-fill
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      async function loadPreset() {
        try {
          const res = await api.getTemplates();
          if (res.success && res.templates) {
            const matched = res.templates.find(t => t.id === presetId);
            if (matched) {
              setSelectedPreset(matched.data);
            }
          }
        } catch (e) {
          console.warn('Failed to pre-fill preset from URL query:', e);
        }
      }
      loadPreset();
    }
  }, [searchParams]);

  // Loading steps animation
  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : 4));
      }, 1000); // Shift loading step every 1s
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFormSubmit = async (formData) => {
    try {
      await generate(formData);
    } catch (err) {
      // Errors handled by hook
    }
  };

  const handleSelectPreset = (presetData) => {
    setSelectedPreset(presetData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      
      {/* 1. INPUT PHASE (STEP 1: HIDE RESULTS ENTIRELY) */}
      {!roadmap && !isLoading && !error && (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight">
              Plan Your Equipment Upgrade
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Answer a few questions to build a personalized 2-year growth roadmap with Hyderabad local pricing and performance benchmarks.
            </p>
          </div>

          {/* Quick Fill Pills */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-xs premium-card-hover">
            <TemplatePresets onSelectPreset={handleSelectPreset} />
          </div>
          
          {/* Main Input Form Panel */}
          <div className="bg-white border border-border-default rounded-card shadow-card p-6 sm:p-8 premium-card-hover">
            <PlayerForm 
              onSubmit={handleFormSubmit} 
              isLoading={isLoading} 
              presetData={selectedPreset} 
            />
          </div>
        </div>
      )}

      {/* 2. LOADING STATE */}
      {isLoading && (
        <div className="max-w-xl mx-auto py-12 space-y-6">
          {/* Skeleton Header */}
          <div className="bg-white rounded-card border border-border-default shadow-card p-6 space-y-4 text-left">
            <div className="h-5 w-1/3 rounded-lg skeleton-shimmer" />
            <div className="h-8 w-3/4 rounded-lg skeleton-shimmer" />
            <div className="flex space-x-2 pt-1">
              <div className="h-5 w-14 rounded-full skeleton-shimmer" />
              <div className="h-5 w-20 rounded-full skeleton-shimmer" />
              <div className="h-5 w-24 rounded-full skeleton-shimmer" />
            </div>
          </div>

          {/* Progress Steps Card */}
          <div className="bg-white border border-border-default rounded-card shadow-card p-6 space-y-6 text-left">
            <div className="flex items-center space-x-3 pb-4 border-b border-border-light">
              <div className="relative flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-brand-primary animate-spin" />
                <div className="absolute w-8 h-8 border border-brand-primary/30 rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <h4 className="font-display font-bold text-text-primary text-sm">
                  Generating Roadmap...
                </h4>
                <p className="text-text-secondary text-[11px]">
                  Please wait while SportAI builds your custom 2-year plan.
                </p>
              </div>
            </div>

            {/* Horizontal Progress Track */}
            <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-500 ease-out"
                style={{ width: `${((loadingStep + 1) / 5) * 100}%` }}
              />
            </div>

            {/* 5-Step Progress Checklist */}
            <div className="space-y-3 pt-1">
              {[
                { id: 0, label: 'Analyzing athlete profile & inputs' },
                { id: 1, label: 'Evaluating physical growth milestones' },
                { id: 2, label: 'Matching equipment upgrades to skill level' },
                { id: 3, label: 'Optimizing budget & Hyderabad pricing tiers' },
                { id: 4, label: 'Assembling chronological upgrade timeline' }
              ].map(step => {
                const isCompleted = loadingStep > step.id;
                const isActive = loadingStep === step.id;
                return (
                  <div 
                    key={step.id} 
                    className={`flex items-center space-x-3 text-xs transition-all duration-305 ${
                      isActive ? 'text-brand-primary font-bold' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : isActive 
                          ? 'border-brand-primary bg-brand-primaryLight text-brand-primary' 
                          : 'border-border-default bg-slate-50 text-text-muted'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                      ) : (
                        <span className="font-mono text-[9px]">{step.id + 1}</span>
                      )}
                    </div>
                    <span className="flex-1">{step.label}</span>
                    {isActive && (
                      <span className="text-[10px] text-brand-primary animate-pulse font-normal">Processing...</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. ERROR STATE */}
      {error && (
        <div className="max-w-md mx-auto bg-white border border-border-default rounded-card shadow-card p-6 text-center space-y-4 py-8">
          <div className="w-12 h-12 bg-rose-50 text-error rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h3 className="font-display font-bold text-error text-lg">
            Generation Failed
          </h3>
          <p className="text-text-secondary text-xs max-w-sm mx-auto leading-relaxed">
            {error}
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-btn premium-btn-hover"
          >
            Reset &amp; Try Again
          </button>
        </div>
      )}

      {/* 4. SUCCESS STATE (STEP 2: FULL-WIDTH AI-GENERATED REPORT) */}
      {!isLoading && roadmap && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Action Bar */}
          <div className="flex justify-start">
            <button
              onClick={reset}
              className="px-4 py-2 border border-border-default text-text-secondary hover:text-text-primary font-bold text-xs rounded-btn flex items-center space-x-1.5 shadow-xs premium-btn-hover"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Inputs</span>
            </button>
          </div>

          {/* Unified AI Report Output */}
          <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden p-6 sm:p-8 premium-card-hover">
            <RoadmapDisplay
              layout="all"
              generationId={generationId}
              playerProfile={playerProfile}
              roadmapData={roadmap}
              onRegenerate={() => handleFormSubmit(playerProfile)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
