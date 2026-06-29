import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { api } from '../../utils/api';

const fallbackPresets = [
  {
    id: "t1",
    label: "8yo Cricketer (Beginner)",
    emoji: "🏏",
    color: "green",
    data: {
      sport: "Cricket",
      age: 8,
      height: 120,
      heightUnit: "cm",
      level: "Beginner",
      currentEquipment: "Plastic training bat 1kg, cheap cotton gloves, canvas shoes size 3",
      budgetMin: 3000,
      budgetMax: 10000,
      goals: ["School Team", "Improve Power"],
      coachName: ""
    }
  },
  {
    id: "t2",
    label: "12yo Footballer (Intermediate)",
    emoji: "⚽",
    color: "blue",
    data: {
      sport: "Football",
      age: 12,
      height: 148,
      heightUnit: "cm",
      level: "Intermediate",
      currentEquipment: "Decathlon rubber studs, synthetic shinguards, standard size 4 ball",
      budgetMin: 5000,
      budgetMax: 15000,
      goals: ["Better Control", "Academy Level"],
      coachName: ""
    }
  },
  {
    id: "t3",
    label: "10yo Badminton (Beginner)",
    emoji: "🏸",
    color: "orange",
    data: {
      sport: "Badminton",
      age: 10,
      height: 135,
      heightUnit: "cm",
      level: "Beginner",
      currentEquipment: "Alloy steel racket, plastic Yonex shuttlecocks, regular running shoes",
      budgetMin: 4000,
      budgetMax: 12000,
      goals: ["Better Control", "Comfort & Fit"],
      coachName: ""
    }
  },
  {
    id: "t4",
    label: "15yo Track (Advanced)",
    emoji: "🏃",
    color: "purple",
    data: {
      sport: "Athletics",
      age: 15,
      height: 165,
      heightUnit: "cm",
      level: "Advanced",
      currentEquipment: "Normal trainers without spikes, worn out running shorts",
      budgetMin: 10000,
      budgetMax: 30000,
      goals: ["Tournament Ready", "Improve Power"],
      coachName: ""
    }
  }
];

export default function TemplatePresets({ onSelectPreset }) {
  const [presets, setPresets] = useState(fallbackPresets);

  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await api.getTemplates();
        if (res.success && res.templates && res.templates.length > 0) {
          setPresets(res.templates.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not load templates from API, using defaults');
      }
    }
    loadPresets();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5 text-text-muted">
        <Zap className="w-3.5 h-3.5 text-warning fill-warning" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Quick Fill Presets</span>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.data)}
            className="bg-white px-3.5 py-1.5 rounded-full border border-border-default hover:border-brand-primary text-xs font-semibold shadow-xs flex items-center space-x-1.5 premium-card-hover group"
          >
            <span role="img" aria-label={preset.label}>{preset.emoji}</span>
            <span className="text-text-primary group-hover:text-brand-primary transition-colors">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
