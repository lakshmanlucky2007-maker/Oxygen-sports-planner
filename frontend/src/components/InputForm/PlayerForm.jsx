import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, Sparkles, AlertCircle, ChevronDown, ChevronUp, Check, Ruler, Dumbbell,
  ArrowRight, ShieldCheck, Activity, Settings
} from 'lucide-react';

const sportsList = [
  { name: 'Cricket', emoji: '🏏' },
  { name: 'Football', emoji: '⚽' },
  { name: 'Badminton', emoji: '🏸' },
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Athletics', emoji: '🏃' },
  { name: 'Swimming', emoji: '🏊' },
  { name: 'Hockey', emoji: '🏑' }
];

const goalsList = [
  'Improve Power',
  'Better Control',
  'Tournament Ready',
  'School Team',
  'Academy Level',
  'Comfort & Fit'
];

export default function PlayerForm({ onSubmit, isLoading, presetData }) {
  const [formData, setFormData] = useState({
    sport: 'Cricket',
    playerName: 'Athlete',
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    level: 'Beginner',
    experience: '',
    currentEquipment: 'Standard beginner training equipment.',
    budgetMin: 5000,
    budgetMax: 15000,
    goals: [],
    coachName: '',
    planningMode: 'Parent'
  });

  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [charCount, setCharCount] = useState(36); // length of default equipment string

  // Auto fill preset details if provided
  useEffect(() => {
    if (presetData) {
      setFormData(prev => ({
        ...prev,
        ...presetData,
        playerName: presetData.playerName || 'Athlete',
        goals: presetData.goals || [],
        coachName: presetData.coachName || '',
        planningMode: presetData.planningMode || 'Parent',
        weight: presetData.weight || '',
        experience: presetData.experience || '',
        currentEquipment: presetData.currentEquipment || 'Standard beginner training equipment.'
      }));
      if (presetData.currentEquipment) {
        setCharCount(presetData.currentEquipment.length);
      }
    }
  }, [presetData]);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Height unit toggle
  const toggleHeightUnit = () => {
    setFormData(prev => {
      const currentHeight = parseFloat(prev.height);
      if (isNaN(currentHeight)) {
        return { ...prev, heightUnit: prev.heightUnit === 'cm' ? 'ft' : 'cm' };
      }
      
      let newHeight = '';
      if (prev.heightUnit === 'cm') {
        newHeight = (currentHeight / 30.48).toFixed(1);
      } else {
        newHeight = Math.round(currentHeight * 30.48).toString();
      }

      return {
        ...prev,
        height: newHeight,
        heightUnit: prev.heightUnit === 'cm' ? 'ft' : 'cm'
      };
    });
  };

  // Character limit description handler
  const handleEquipmentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setFormData(prev => ({ ...prev, currentEquipment: text }));
      setCharCount(text.length);
    }
  };

  // Goals multi-select toggle
  const toggleGoal = (goal) => {
    setFormData(prev => {
      const exists = prev.goals.includes(goal);
      const newGoals = exists 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal];
      return { ...prev, goals: newGoals };
    });
  };

  // Form validation
  const validateForm = () => {
    const tempErrors = {};
    
    // Player Name
    if (!formData.playerName || !formData.playerName.trim()) {
      tempErrors.playerName = 'Player name is required';
    }

    // Age
    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      tempErrors.age = 'Age is required';
    } else if (ageNum < 6 || ageNum > 25) {
      tempErrors.age = 'Age must be between 6 and 25 years';
    }

    // Height
    const heightNum = parseFloat(formData.height);
    if (!formData.height || isNaN(heightNum)) {
      tempErrors.height = 'Height is required';
    } else {
      if (formData.heightUnit === 'cm') {
        if (heightNum < 60 || heightNum > 250) {
          tempErrors.height = 'Height must be between 60cm and 250cm';
        }
      } else {
        if (heightNum < 2.0 || heightNum > 8.2) {
          tempErrors.height = 'Height must be between 2.0ft and 8.2ft';
        }
      }
    }

    // Weight
    if (formData.weight !== undefined && formData.weight !== '') {
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum) || weightNum < 10 || weightNum > 150) {
        tempErrors.weight = 'Weight must be between 10kg and 150kg';
      }
    }

    // Current Equipment
    if (!formData.currentEquipment || formData.currentEquipment.length < 10) {
      tempErrors.currentEquipment = 'Current equipment details must be at least 10 characters';
    }

    // Budget
    if (parseInt(formData.budgetMin) > parseInt(formData.budgetMax)) {
      tempErrors.budget = 'Min budget cannot exceed max budget';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // If validation fails in collapsed sections, expand them
      if (errors.playerName || errors.currentEquipment || errors.weight) {
        setShowAdvanced(true);
      }
    }
  };

  // Helper values for sliders
  const isCm = formData.heightUnit === 'cm';
  const minHeight = isCm ? 60 : 2.0;
  const maxHeight = isCm ? 250 : 8.2;
  const heightStep = isCm ? 1 : 0.1;
  const currentHeightVal = parseFloat(formData.height);
  const sliderHeightVal = isNaN(currentHeightVal) ? (isCm ? 140 : 4.5) : currentHeightVal;

  const minWeight = 10;
  const maxWeight = 150;
  const weightStep = 1;
  const currentWeightVal = parseFloat(formData.weight);
  const sliderWeightVal = isNaN(currentWeightVal) ? 45 : currentWeightVal;

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-left">
      
      {/* 1. PLANNER MODE SELECTOR */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
          Planner Mode
        </label>
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-1.5 rounded-2xl border border-border-light">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, planningMode: 'Parent' }))}
            className={`py-3 px-4 rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center premium-card-hover ${
              formData.planningMode === 'Parent'
                ? 'bg-white text-brand-primary border-brand-primary ring-2 ring-brand-primary/10 shadow-sm font-extrabold'
                : 'bg-transparent text-text-secondary border border-transparent'
            }`}
          >
            <span>👪 Parent Mode</span>
            <span className="text-[9px] font-normal text-text-muted mt-0.5">Safety &amp; Savings Focus</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, planningMode: 'Coach' }))}
            className={`py-3 px-4 rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center premium-card-hover ${
              formData.planningMode === 'Coach'
                ? 'bg-white text-brand-secondary border-brand-secondary ring-2 ring-brand-secondary/10 shadow-sm font-extrabold'
                : 'bg-transparent text-text-secondary border border-transparent'
            }`}
          >
            <span>🏆 Coach Mode</span>
            <span className="text-[9px] font-normal text-text-muted mt-0.5">Elite Performance Focus</span>
          </button>
        </div>
      </div>

      {/* 2. SPORT SELECTOR */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
          Primary Sport
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {sportsList.map(sport => {
            const selected = formData.sport === sport.name;
            return (
              <button
                key={sport.name}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sport: sport.name }))}
                className={`py-2 px-3 rounded-xl border text-center flex items-center justify-center space-x-1.5 premium-card-hover ${
                  selected
                    ? 'border-brand-primary bg-brand-primaryLight/35 text-brand-primary ring-1 ring-brand-primary font-bold shadow-xs'
                    : 'border-border-default bg-white text-text-secondary'
                }`}
              >
                <span className="text-sm">{sport.emoji}</span>
                <span className="text-xs">{sport.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. AGE & HEIGHT ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Age Selector */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
            Player Age <span className="text-error">*</span>
          </label>
          <input
            id="age"
            type="number"
            name="age"
            min="6"
            max="25"
            placeholder="e.g. 10"
            value={formData.age}
            onChange={handleChange}
            className={`block w-full px-4 py-3 text-text-primary bg-white border rounded-input shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 text-sm ${
              errors.age ? 'border-error ring-1 ring-error' : 'border-border-default'
            }`}
          />
          {errors.age && (
            <p className="text-xs text-error flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.age}</span>
            </p>
          )}
        </div>

        {/* Height Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="height" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
              Height <span className="text-error">*</span>
            </label>
            <button
              type="button"
              onClick={toggleHeightUnit}
              className="text-[10px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors uppercase"
            >
              Use {isCm ? 'FT' : 'CM'}
            </button>
          </div>
          <div className="relative flex rounded-input bg-white border border-border-default shadow-xs focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary overflow-hidden">
            <input
              id="height"
              type="number"
              name="height"
              step="0.1"
              placeholder={isCm ? 'e.g. 140' : 'e.g. 4.6'}
              value={formData.height}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-transparent text-text-primary text-sm focus:outline-none"
            />
            <span className="px-3 bg-slate-50 border-l border-border-default text-text-secondary text-xs font-bold flex items-center">
              {formData.heightUnit.toUpperCase()}
            </span>
          </div>
          
          {/* Slider Underneath */}
          <div className="flex items-center space-x-3.5 pt-1">
            <input
              type="range"
              min={minHeight}
              max={maxHeight}
              step={heightStep}
              value={sliderHeightVal}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
              aria-label="Height adjustment slider"
            />
            <span className="text-[10px] text-text-muted font-mono whitespace-nowrap min-w-[50px] text-right">
              {minHeight}-{maxHeight} {formData.heightUnit}
            </span>
          </div>

          {errors.height && (
            <p className="text-xs text-error flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.height}</span>
            </p>
          )}
        </div>
      </div>

      {/* 4. LEVEL */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
          Playing Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'Beginner', label: 'Beginner', emoji: '🌱' },
            { id: 'Intermediate', label: 'Intermediate', emoji: '⚡' },
            { id: 'Advanced', label: 'Advanced', emoji: '🏆' }
          ].map(lvl => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, level: lvl.id }))}
              className={`py-3 rounded-xl border text-center font-bold text-xs premium-card-hover ${
                formData.level === lvl.id
                  ? 'border-brand-primary bg-brand-primaryLight/20 text-brand-primary ring-1 ring-brand-primary shadow-xs'
                  : 'border-border-default bg-white text-text-secondary'
              }`}
            >
              <span className="inline-block mr-1.5">{lvl.emoji}</span>
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. BUDGET SLIDERS */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
            Yearly Upgrade Budget
          </label>
          <span className="text-xs font-bold text-brand-primary bg-brand-primaryLight px-2.5 py-0.5 rounded-full font-mono">
            ₹{formData.budgetMin.toLocaleString('en-IN')} - ₹{formData.budgetMax.toLocaleString('en-IN')}
          </span>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-border-light">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-text-secondary">
              <span>Min Budget: ₹{formData.budgetMin.toLocaleString('en-IN')}</span>
              <span>₹0</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={formData.budgetMin}
              name="budgetMin"
              onChange={handleChange}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
              aria-label="Minimum budget range slider"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-text-secondary">
              <span>Max Budget: ₹{formData.budgetMax.toLocaleString('en-IN')}</span>
              <span>₹50,000</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={formData.budgetMax}
              name="budgetMax"
              onChange={handleChange}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
              aria-label="Maximum budget range slider"
            />
          </div>
          {errors.budget && (
            <p className="text-[10px] text-error font-semibold flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.budget}</span>
            </p>
          )}
        </div>
      </div>

      {/* 6. FOCUS AREAS */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
          Focus Areas
        </label>
        <div className="flex flex-wrap gap-2">
          {goalsList.map(goal => {
            const selected = formData.goals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center space-x-1.5 focus:outline-none focus-chip-hover ${
                  selected
                    ? 'bg-accent-orangeLight border-accent-orange text-accent-orange shadow-xs font-bold'
                    : 'bg-white border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary'
                }`}
              >
                {selected && <Check className="w-3 h-3 text-accent-orange" />}
                <span>{goal}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. COLLAPSIBLE ADVANCED OPTIONS */}
      <div className="border border-border-default rounded-2xl bg-white overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 flex justify-between items-center text-left transition-colors focus:outline-none"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Advanced Options</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-4 space-y-4 border-t border-border-light animate-fade-in-up">
            {/* Player Name */}
            <div>
              <label htmlFor="playerName" className="block text-xs font-semibold text-text-secondary mb-1">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                name="playerName"
                placeholder="Defaults to 'Athlete'"
                value={formData.playerName}
                onChange={handleChange}
                className={`block w-full px-3 py-2 text-sm text-text-primary bg-white border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary`}
              />
              {errors.playerName && (
                <p className="mt-1 text-xs text-error flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.playerName}</span>
                </p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-xs font-semibold text-text-secondary mb-1">
                Weight (KG)
              </label>
              <div className="relative flex rounded-lg bg-white border border-border-default overflow-hidden">
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  placeholder="e.g. 40"
                  value={formData.weight}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm text-text-primary bg-transparent focus:outline-none"
                />
                <span className="px-3 bg-slate-50 border-l border-border-default text-text-secondary text-xs font-bold flex items-center">
                  KG
                </span>
              </div>
              
              {/* Slider for Weight */}
              <div className="flex items-center space-x-3.5 pt-1.5">
                <input
                  type="range"
                  min={minWeight}
                  max={maxWeight}
                  step={weightStep}
                  value={sliderWeightVal}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
                  aria-label="Weight adjustment slider"
                />
                <span className="text-[10px] text-text-muted font-mono whitespace-nowrap min-w-[50px] text-right">
                  {minWeight}-{maxWeight} kg
                </span>
              </div>
              {errors.weight && (
                <p className="mt-1 text-xs text-error flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.weight}</span>
                </p>
              )}
            </div>

            {/* Current Equipment Description */}
            <div>
              <label htmlFor="currentEquipment" className="block text-xs font-semibold text-text-secondary mb-1">
                Current Equipment Setup Description
              </label>
              <textarea
                id="currentEquipment"
                rows={3}
                placeholder="Details of gear currently used..."
                value={formData.currentEquipment}
                onChange={handleEquipmentChange}
                className="block w-full px-3 py-2 text-xs text-text-primary bg-white border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              <div className="text-[9px] text-right text-text-muted pt-1">
                {charCount} / 500 characters
              </div>
              {errors.currentEquipment && (
                <p className="mt-1 text-xs text-error flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.currentEquipment}</span>
                </p>
              )}
            </div>

            {/* Coach / Parent Name */}
            <div>
              <label htmlFor="coachName" className="block text-xs font-semibold text-text-secondary mb-1">
                Requestor / Coach Name
              </label>
              <input
                id="coachName"
                type="text"
                name="coachName"
                placeholder="e.g. Coach Ravi"
                value={formData.coachName}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm text-text-primary bg-white border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-xs font-semibold text-text-secondary mb-1">
                Athlete Experience
              </label>
              <input
                id="experience"
                type="text"
                name="experience"
                placeholder="e.g. 2 years academy, schools squad"
                value={formData.experience}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm text-text-primary bg-white border border-border-default rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. SUBMIT ACTION BUTTON */}
      <div className="pt-2 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md focus:outline-none premium-btn-hover ${
            isLoading 
              ? 'bg-brand-primary/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-primary to-brand-primary/90 btn-pulse'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-extrabold uppercase tracking-wide">Generate Equipment Roadmap</span>
        </button>
      </div>

    </form>
  );
}
