import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, ArrowRight, Clipboard, Download, 
  Share2, RefreshCw, AlertCircle, Sparkles, BookOpen, 
  HelpCircle, ChevronDown, ChevronUp, DollarSign,
  Check, Info, Shield, ShoppingBag, Trophy, Activity
} from 'lucide-react';
import { exportPDF } from '../../utils/exportPDF';
import RatingWidget from './RatingWidget';

const AnimatedCounter = ({ value, duration = 650, formatter = (val) => val }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseInt(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <>{formatter(count)}</>;
};

const SIZING_GUIDES = {
  bat: {
    title: "🏏 Cricket Bat Sizing Guide",
    steps: [
      "Stand the bat vertically next to the player's leg.",
      "The top of the handle should reach the player's hip joint/hip bone.",
      "To check weight: The player should hold the bat straight out horizontally with their dominant hand for 10 seconds. If their wrist shakes, the bat is too heavy."
    ],
    sizes: [
      { range: "Under 4'0\" (122 cm)", size: "Size 2 or 3" },
      { range: "4'0\" - 4'3\" (122-130 cm)", size: "Size 4" },
      { range: "4'3\" - 4'6\" (130-137 cm)", size: "Size 5" },
      { range: "4'6\" - 4'9\" (137-144 cm)", size: "Size 6" },
      { range: "4'9\" - 5'0\" (144-150 cm)", size: "Harrow" },
      { range: "Over 5'0\" (150 cm+)", size: "Short Handle (SH)" }
    ]
  },
  racket: {
    title: "🏸 Racket Sizing & Grip Guide",
    steps: [
      "Hold the racket handle in a standard shakehand grip.",
      "There should be index-finger-width space between the fingertips and the palm.",
      "Weight check: Swing in a figure-8 motion. If you feel any pull in the shoulder, use a lighter frame (e.g. 4U/80g instead of 3U/85g)."
    ],
    sizes: [
      { range: "Ages 6-8", size: "Junior Racket (21 - 23 inches)" },
      { range: "Ages 9-11", size: "Junior Racket (25 inches)" },
      { range: "Ages 12+", size: "Standard Adult Racket (27 inches)" }
    ]
  },
  shoe: {
    title: "👟 Court Shoe & Spike Sizing",
    steps: [
      "Always measure with sports socks on, preferably in the afternoon when feet are slightly expanded.",
      "There should be a thumb-width of space (approx 1-1.5cm) between the longest toe and the front of the shoe.",
      "Make sure the heel doesn't slip when walking/running. If it slips, it can cause blisters on wooden/grassy outfields."
    ]
  },
  glove: {
    title: "🛡️ Gloves & Protection Sizing",
    steps: [
      "Measure from the base of the wrist to the tip of the middle finger.",
      "Gloves should have about 1cm of breathing space at the fingertips when clenched.",
      "Shin guards should cover from 2 inches above the ankle joint up to 2 inches below the kneecap."
    ]
  },
  ball: {
    title: "⚽ Sports Ball Size Regulations",
    sizes: [
      { range: "Football (Under 8)", size: "Size 3 ball" },
      { range: "Football (Ages 9-11)", size: "Size 4 ball" },
      { range: "Football (Ages 12+)", size: "Size 5 ball (Adult)" },
      { range: "Basketball (Ages 6-8)", size: "Size 5 ball" },
      { range: "Basketball (Ages 9-11)", size: "Size 6 ball" },
      { range: "Basketball (Ages 12+)", size: "Size 7 ball (Adult)" }
    ]
  }
};

const getSizingGuideKey = (equipmentName) => {
  const name = equipmentName.toLowerCase();
  if (name.includes('bat') || name.includes('willow')) return 'bat';
  if (name.includes('racket') || name.includes('racquet')) return 'racket';
  if (name.includes('shoe') || name.includes('boot') || name.includes('cleat') || name.includes('spike')) return 'shoe';
  if (name.includes('glove') || name.includes('guard') || name.includes('helmet') || name.includes('protect')) return 'glove';
  if (name.includes('ball')) return 'ball';
  return null;
};

const getEquipmentIcon = (name) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('bat') || lowercaseName.includes('willow') || lowercaseName.includes('racket') || lowercaseName.includes('racquet')) {
    if (lowercaseName.includes('bat') || lowercaseName.includes('willow')) {
      return (
        <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L7.5 19.5 3 21l1.5-4.5Z" />
          <path d="m15 6 3 3" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="15" cy="9" r="6" />
          <path d="m10.5 13.5-6 6" />
          <path d="m3.5 20.5 1.5-1.5" />
          <path d="M12 6c1.5 1.5 1.5 4.5 0 6M18 6c-1.5 1.5-1.5 4.5 0 6M12 9h6M13.5 6h3" />
        </svg>
      );
    }
  }
  if (lowercaseName.includes('shoe') || lowercaseName.includes('boot') || lowercaseName.includes('cleat') || lowercaseName.includes('spike')) {
    return <Activity className="w-4 h-4 text-brand-secondary" />;
  }
  if (lowercaseName.includes('glove') || lowercaseName.includes('guard') || lowercaseName.includes('helmet') || lowercaseName.includes('protect') || lowercaseName.includes('shield')) {
    return <Shield className="w-4 h-4 text-accent-purple" />;
  }
  if (lowercaseName.includes('ball') || lowercaseName.includes('shuttle') || lowercaseName.includes('cork')) {
    return (
      <svg className="w-4 h-4 text-accent-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6.2 6.2c2.4 2.4 2.4 6.4 0 8.8" />
        <path d="M17.8 6.2c-2.4 2.4-2.4 6.4 0 8.8" />
      </svg>
    );
  }
  if (lowercaseName.includes('bag') || lowercaseName.includes('kit') || lowercaseName.includes('cover')) {
    return <ShoppingBag className="w-4 h-4 text-brand-primary" />;
  }
  return <Activity className="w-4 h-4 text-text-muted" />;
};

const getPriority = (equipmentName) => {
  const name = equipmentName.toLowerCase();
  if (
    name.includes('bat') || name.includes('willow') ||
    name.includes('racket') || name.includes('racquet') ||
    name.includes('shoe') || name.includes('boot') || name.includes('cleat') || name.includes('spike') ||
    name.includes('helmet') || name.includes('shin') || name.includes('guard')
  ) {
    return { label: 'High Priority', color: 'bg-rose-50 text-rose-600 border-rose-100/70' };
  }
  if (name.includes('glove') || name.includes('protect') || name.includes('ball') || name.includes('shuttle')) {
    return { label: 'Medium Priority', color: 'bg-amber-50 text-amber-600 border-amber-100/70' };
  }
  return { label: 'Standard Priority', color: 'bg-indigo-50 text-indigo-600 border-indigo-100/70' };
};

const parseBudgetNumbers = (budgetStr) => {
  if (!budgetStr) return { min: 5000, max: 12000 };
  const cleanStr = budgetStr.replace(/,/g, '');
  const matches = cleanStr.match(/₹\s*([0-9]+)/g) || cleanStr.match(/([0-9]+)/g);
  if (matches && matches.length >= 2) {
    const minVal = parseInt(matches[0].replace(/[^0-9]/g, '')) || 5000;
    const maxVal = parseInt(matches[1].replace(/[^0-9]/g, '')) || 12000;
    return { min: minVal, max: maxVal };
  } else if (matches && matches.length === 1) {
    const val = parseInt(matches[0].replace(/[^0-9]/g, '')) || 8000;
    return { min: Math.round(val * 0.7), max: val };
  }
  return { min: 6000, max: 15000 };
};

// Parser to split long AI paragraphs into short summary + bullet benefits
const parseReason = (reason) => {
  if (!reason) return { summary: '', bullets: [] };
  const sentences = reason.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  if (sentences.length === 0) return { summary: '', bullets: [] };
  
  const summary = sentences[0] + '.';
  const bullets = sentences.slice(1).map(s => s + '.');
  return { summary, bullets };
};

const renderPriceTiers = (options) => {
  if (!options || (!options.budget && !options.midrange && !options.premium)) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5 text-[9px] text-text-muted font-bold uppercase tracking-wider">
        <ShoppingBag className="w-3.5 h-3.5 text-brand-primary" />
        <span>Hyderabad Market Options</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {options.budget && (
          <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 hover:border-slate-200/50 rounded-xl p-2.5 px-3.5 transition-all duration-150 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Budget
                </span>
                <p className="text-xs font-semibold text-text-primary truncate mt-0.5 leading-tight">{options.budget.name}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 shrink-0 ml-2">{options.budget.price}</span>
          </div>
        )}

        {options.midrange && (
          <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 hover:border-slate-200/50 rounded-xl p-2.5 px-3.5 transition-all duration-150 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] font-bold text-brand-primary bg-brand-primaryLight px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Mid-Range
                </span>
                <p className="text-xs font-semibold text-text-primary truncate mt-0.5 leading-tight">{options.midrange.name}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-brand-primary shrink-0 ml-2">{options.midrange.price}</span>
          </div>
        )}

        {options.premium && (
          <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 hover:border-slate-200/50 rounded-xl p-2.5 px-3.5 transition-all duration-150 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Premium
                </span>
                <p className="text-xs font-semibold text-text-primary truncate mt-0.5 leading-tight">{options.premium.name}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-purple-600 shrink-0 ml-2">{options.premium.price}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const renderPriceBar = (budgetStr, premiumStr, buyTiming) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[9px] text-text-muted font-bold uppercase tracking-wider">
        <div className="flex items-center space-x-1.5">
          <DollarSign className="w-3.5 h-3.5 text-brand-primary" />
          <span>Price Spectrum</span>
        </div>
        {buyTiming && (
          <span className="text-accent-orange font-bold bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-full">
            📅 {buyTiming}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-xl p-2.5 px-3.5 shadow-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Standard Tier
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-600 shrink-0 ml-2">{budgetStr}</span>
        </div>

        <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-xl p-2.5 px-3.5 shadow-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <div>
              <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Premium Tier
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-purple-600 shrink-0 ml-2">{premiumStr}</span>
        </div>
      </div>
    </div>
  );
};

const UpgradeCard = ({
  upg,
  idx,
  yearKey,
  isExpanded,
  onToggleExpand,
  activeFitGuide,
  onToggleFitGuide,
}) => {
  const guideKey = getSizingGuideKey(upg.equipment);
  const { summary, bullets } = parseReason(upg.reason);

  return (
    <div 
      className={`bg-white border rounded-xl premium-card-hover group ${
        isExpanded ? 'border-brand-primary ring-2 ring-brand-primary/5 shadow-cardHover' : 'border-border-default'
      }`}
    >
      {/* Collapsed Header */}
      <div 
        onClick={onToggleExpand}
        className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer select-none gap-4 hover:bg-slate-50/40 transition-colors duration-150 text-left animate-fade-in"
      >
        {/* Left: Icon, Name, Priority/Status tags */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            {getEquipmentIcon(upg.equipment)}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="font-display font-bold text-text-primary text-sm tracking-tight truncate">
              {upg.equipment}
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-bold bg-brand-primaryLight text-brand-primary px-1.5 py-0.5 rounded uppercase tracking-wide border border-brand-primary/10">
                Size Up
              </span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${getPriority(upg.equipment).color}`}>
                {getPriority(upg.equipment).label}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Upgrade Path (Current -> Recommended) */}
        <div className="flex items-center space-x-3 text-xs bg-slate-50/70 border border-slate-100 rounded-lg p-1.5 px-3 self-start md:self-auto min-w-0 max-w-full transition-all duration-200 group-hover:border-brand-primary/20">
          <span className="text-text-secondary truncate font-medium max-w-[120px]">{upg.current || 'None'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="text-brand-primary font-bold truncate max-w-[150px]">{upg.recommended}</span>
        </div>

        {/* Right: View Details Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="text-xs font-bold text-brand-primary transition-colors flex items-center space-x-1 focus:outline-none bg-brand-primaryLight/30 hover:bg-brand-primaryLight/50 p-1.5 px-3 rounded-lg border border-brand-primary/10 premium-btn-hover group-hover:bg-brand-primaryLight/60 group-hover:border-brand-primary/20"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Expanded Content with smooth CSS animation */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1200px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 md:p-5 space-y-5 bg-white text-left animate-fade-in">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Upgrade Reason & Benefits + Upgrade Path */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Upgrade Reason</span>
                  <p className="text-xs font-semibold text-text-primary leading-relaxed bg-slate-50 border border-slate-100/50 rounded-xl p-3.5">
                    {summary}
                  </p>
                </div>

                {bullets.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Key Benefits</span>
                    <ul className="space-y-1.5 pl-0.5">
                      {bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start text-xs text-text-secondary leading-relaxed">
                          <span className="mr-2 mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Visual Vertical Upgrade Path */}
              <div className="bg-slate-50/70 border border-slate-100/70 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Current Setup</span>
                  <span className="text-xs font-semibold text-text-secondary block px-3.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm font-mono">
                    {upg.current || "None"}
                  </span>
                </div>
                
                <div className="my-2 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 border border-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Recommended Setup</span>
                  <span className="text-xs font-bold text-brand-primary block px-4 py-1.5 bg-brand-primaryLight border border-brand-primary/20 rounded-lg shadow-xs font-mono">
                    {upg.recommended}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Tiers & Fit Check */}
            <div className="space-y-4">
              {/* Product Options */}
              {upg.options ? (
                renderPriceTiers(upg.options)
              ) : (
                renderPriceBar(upg.priceRangeBudget, upg.priceRangePremium, upg.buyTiming)
              )}

              {/* Fit Check & Sizing Guide */}
              {upg.fitIndicator && (
                <div className="space-y-2 text-left">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Fit Check &amp; Sizing</span>
                  
                  <div className="text-xs text-text-secondary leading-relaxed bg-brand-primaryLight/20 border border-brand-primary/10 rounded-xl p-3.5 flex items-start space-x-2.5">
                    <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-brand-primary block text-[11px] mb-0.5">Physical Sizing Check</span>
                      <span>{upg.fitIndicator}</span>
                    </div>
                  </div>

                  {guideKey && (
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => onToggleFitGuide(upg.equipment)}
                        className="text-[11px] font-bold text-brand-primary hover:text-brand-primary/80 flex items-center space-x-1.5 transition-colors focus:outline-none bg-slate-50 hover:bg-slate-100/80 border border-slate-100 p-2 px-3 rounded-lg shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{activeFitGuide === upg.equipment ? 'Hide Sizing Help' : 'View Sizing & Fit Guide'}</span>
                      </button>
                      
                      {activeFitGuide === upg.equipment && (
                        <div className="mt-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-left animate-fade-in-up space-y-3">
                          <h5 className="font-semibold text-text-primary text-xs flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                            <span>{SIZING_GUIDES[guideKey].title}</span>
                          </h5>
                          <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-text-secondary">
                            {SIZING_GUIDES[guideKey].steps?.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ul>
                          {SIZING_GUIDES[guideKey].sizes && (
                            <div className="mt-2.5 overflow-hidden rounded-lg border border-slate-200 bg-white">
                              <table className="w-full text-[10px] text-text-secondary border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="p-2 text-left font-bold text-text-primary">Player Height/Age</th>
                                    <th className="p-2 text-left font-bold text-text-primary">Recommended Size</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {SIZING_GUIDES[guideKey].sizes.map((row, rIdx) => (
                                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}>
                                      <td className="p-2 border-t border-slate-200">{row.range}</td>
                                      <td className="p-2 border-t border-slate-200 font-bold text-text-primary">{row.size}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function RoadmapDisplay({ generationId, playerProfile, roadmapData, onRegenerate, layout = 'all' }) {
  const [copyToast, setCopyToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  
  // Collapse state for Year 1 and Year 2 segments
  const [y1Collapsed, setY1Collapsed] = useState(false);
  const [y2Collapsed, setY2Collapsed] = useState(false);

  // Sizing guide interactive states
  const [activeFitGuide, setActiveFitGuide] = useState(null);

  // Sizing waste rate state for ROI calculator
  const [wasteRate, setWasteRate] = useState(35);

  // Upgrade cards accordion expand/collapse state
  const [expandedUpgrades, setExpandedUpgrades] = useState({});

  // Sizing Checklist & ROI expansion states
  const [roiExpanded, setRoiExpanded] = useState(false);
  const [fullChecklistExpanded, setFullChecklistExpanded] = useState(false);

  const toggleUpgradeExpand = (key) => {
    setExpandedUpgrades(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getChecklistStats = () => {
    let total = 0;
    let completed = 0;
    let reviewsNeeded = 0;
    const upcoming = [];

    // Year 1
    if (roadmapData.year1) {
      if (roadmapData.year1.milestones) {
        roadmapData.year1.milestones.forEach((m, idx) => {
          total++;
          const isChecked = !!checkedItems.year1?.milestones?.[idx];
          if (isChecked) completed++;
          else {
            reviewsNeeded++;
            if (upcoming.length < 2) {
              upcoming.push({ text: m, phase: 'Phase 1 Milestone', priority: 'High' });
            }
          }
        });
      }
      if (roadmapData.year1.keepCurrentItems) {
        roadmapData.year1.keepCurrentItems.forEach((k, idx) => {
          total++;
          const isChecked = !!checkedItems.year1?.keeps?.[idx];
          if (isChecked) completed++;
          else {
            reviewsNeeded++;
            if (upcoming.length < 2) {
              upcoming.push({ text: k, phase: 'Phase 1 Keep', priority: 'Standard' });
            }
          }
        });
      }
    }

    // Year 2
    if (roadmapData.year2) {
      if (roadmapData.year2.milestones) {
        roadmapData.year2.milestones.forEach((m, idx) => {
          total++;
          const isChecked = !!checkedItems.year2?.milestones?.[idx];
          if (isChecked) completed++;
          else {
            reviewsNeeded++;
            if (upcoming.length < 2) {
              upcoming.push({ text: m, phase: 'Phase 2 Milestone', priority: 'High' });
            }
          }
        });
      }
      if (roadmapData.year2.keepCurrentItems) {
        roadmapData.year2.keepCurrentItems.forEach((k, idx) => {
          total++;
          const isChecked = !!checkedItems.year2?.keeps?.[idx];
          if (isChecked) completed++;
          else {
            reviewsNeeded++;
            if (upcoming.length < 2) {
              upcoming.push({ text: k, phase: 'Phase 2 Keep', priority: 'Standard' });
            }
          }
        });
      }
    }

    const score = total > 0 ? Math.round((completed / total) * 100) : 100;
    return { total, completed, reviewsNeeded, upcoming, score };
  };


  // Interactive Checklist states
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap_checklist_${generationId}`);
      return saved ? JSON.parse(saved) : { year1: { milestones: {}, keeps: {} }, year2: { milestones: {}, keeps: {} } };
    } catch (e) {
      return { year1: { milestones: {}, keeps: {} }, year2: { milestones: {}, keeps: {} } };
    }
  });

  // Keep state sync in case generationId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`roadmap_checklist_${generationId}`);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({ year1: { milestones: {}, keeps: {} }, year2: { milestones: {}, keeps: {} } });
      }
    } catch (e) {
      // Fallback
    }
  }, [generationId]);

  const toggleCheck = (year, type, idx) => {
    const updated = { ...checkedItems };
    if (!updated[year]) updated[year] = { milestones: {}, keeps: {} };
    if (!updated[year][type]) updated[year][type] = {};
    updated[year][type][idx] = !updated[year][type][idx];
    
    setCheckedItems(updated);
    try {
      localStorage.setItem(`roadmap_checklist_${generationId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFitGuide = (equipName) => {
    if (activeFitGuide === equipName) {
      setActiveFitGuide(null);
    } else {
      setActiveFitGuide(equipName);
    }
  };

  const { sport, age, level, height, heightUnit, coachName, playerName } = playerProfile;
  const mode = playerProfile.planningMode || roadmapData.planningMode || 'Parent';
  const weight = playerProfile.weight || playerProfile.playerWeight || roadmapData.playerWeight || '';
  const experience = playerProfile.experience || playerProfile.playerExperience || roadmapData.playerExperience || '';

  // Formats the entire roadmap details into clean Markdown text
  const getRoadmapText = () => {
    let text = `# Oxygen Sports AI Equipment Roadmap\n`;
    if (playerName) text += `Player Name: ${playerName}\n`;
    text += `Player: ${age}yo ${level} ${sport} (Height: ${height}${heightUnit})\n`;
    if (coachName) text += `Requested By: ${coachName}\n`;
    text += `Summary: ${roadmapData.summary}\n\n`;

    // Year 1
    if (roadmapData.year1) {
      text += `## ${roadmapData.year1.period}\n`;
      text += `Note: ${roadmapData.year1.ageNote}\n\n`;
      roadmapData.year1.upgrades.forEach(u => {
        text += `- **${u.equipment}**: Current: ${u.current} -> Upgrade: ${u.recommended}\n`;
        text += `  Why: ${u.reason}\n`;
        text += `  Price: ${u.priceRangeBudget} (Budget) / ${u.priceRangePremium} (Premium)\n`;
        text += `  When to buy: ${u.buyTiming}\n`;
        text += `  Fit check: ${u.fitIndicator}\n\n`;
      });
    }

    // Year 2
    if (roadmapData.year2) {
      text += `## ${roadmapData.year2.period}\n`;
      text += `Note: ${roadmapData.year2.ageNote}\n\n`;
      roadmapData.year2.upgrades.forEach(u => {
        text += `- **${u.equipment}**: Current: ${u.current} -> Upgrade: ${u.recommended}\n`;
        text += `  Why: ${u.reason}\n`;
        text += `  Price: ${u.priceRangeBudget} (Budget) / ${u.priceRangePremium} (Premium)\n`;
        text += `  When to buy: ${u.buyTiming}\n`;
        text += `  Fit check: ${u.fitIndicator}\n\n`;
      });
    }

    if (roadmapData.coachNotes) {
      text += `## Coach Notes\n${roadmapData.coachNotes}\n\n`;
    }
    text += `Total Budget: ${roadmapData.totalBudgetEstimate}\n`;
    text += `Next review age: ${roadmapData.nextReviewAge}\n`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      const text = getRoadmapText();
      await navigator.clipboard.writeText(text);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch (err) {
      alert('Could not copy to clipboard');
    }
  };

  const handleShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/history/${generationId}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch (err) {
      alert('Could not copy link');
    }
  };

  const handleDownloadPDF = () => {
    exportPDF({
      sport,
      age,
      level,
      height,
      heightUnit,
      coachName,
      playerName,
      roadmap: roadmapData,
      createdAt: new Date().toISOString()
    });
  };

  // renderPriceBar has been moved to file-level

  return (
    <div className="roadmap-output animate-fade-in-up space-y-7">
      
      {layout !== 'timeline' && (
        <>
      
      {/* Output Header Card */}
      <div className="bg-white rounded-card overflow-hidden text-left">
        <div className="p-1">
          <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondaryLight px-3 py-1 rounded-full uppercase tracking-wider border border-brand-secondary/10">
            AI Upgrade Plan
          </span>
          <h2 className="font-display font-extrabold text-text-primary text-2xl sm:text-3xl mt-4 tracking-tight leading-tight">
            {playerName ? `${playerName}'s ` : ''}{sport} Upgrade Roadmap
          </h2>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
              🏃 {sport}
            </span>
            <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
              🎂 {age} Yrs
            </span>
            <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
              📏 {height} {heightUnit}
            </span>
            <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
              ⚡ {level} Level
            </span>
            {mode && (
              <span className={`text-xs font-bold border px-3 py-1 rounded-full ${
                mode === 'Coach' 
                  ? 'bg-purple-50/70 text-purple-700 border-purple-200' 
                  : 'bg-emerald-50/70 text-emerald-700 border-emerald-200'
              }`}>
                🛡️ {mode} Focus Mode
              </span>
            )}
            {weight && (
              <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
                ⚖️ {weight} kg
              </span>
            )}
            {experience && (
              <span className="text-xs font-semibold bg-background-primary border border-border-default px-3 py-1 rounded-full">
                🎓 {experience}
              </span>
            )}
          </div>

          <p className="text-text-secondary text-sm mt-5 italic border-l-2 border-brand-primary pl-4 leading-relaxed">
            &ldquo;{roadmapData.summary}&rdquo;
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={handleCopyText}
          className="flex-1 min-w-[125px] py-2.5 px-3 bg-white border border-border-default hover:border-brand-primary text-text-secondary hover:text-brand-primary font-bold text-xs rounded-btn flex items-center justify-center space-x-1.5 shadow-xs btn-active-feedback premium-btn-hover"
        >
          <Clipboard className="w-4 h-4" />
          <span>{copyToast ? 'Copied!' : 'Copy Text'}</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          className="flex-1 min-w-[125px] py-2.5 px-3 bg-white border border-border-default hover:border-brand-secondary text-text-secondary hover:text-brand-secondary font-bold text-xs rounded-btn flex items-center justify-center space-x-1.5 shadow-xs btn-active-feedback premium-btn-hover"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={handleShareLink}
          className="flex-1 min-w-[125px] py-2.5 px-3 bg-white border border-border-default hover:border-accent-orange text-text-secondary hover:text-accent-orange font-bold text-xs rounded-btn flex items-center justify-center space-x-1.5 shadow-xs btn-active-feedback premium-btn-hover"
        >
          <Share2 className="w-4 h-4" />
          <span>{shareToast ? 'Link Copied!' : 'Share Plan'}</span>
        </button>

        <button
          onClick={onRegenerate}
          className="flex-1 min-w-[125px] py-2.5 px-3 bg-white border border-border-default hover:border-brand-primary text-text-secondary hover:text-brand-primary font-bold text-xs rounded-btn flex items-center justify-center space-x-1.5 shadow-xs btn-active-feedback premium-btn-hover"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* STRIPE-STYLE ROI & SAVINGS WIDGET */}
      {(() => {
        const budgetNums = parseBudgetNumbers(roadmapData.totalBudgetEstimate);
        const plannedMin = budgetNums.min;
        const plannedMax = budgetNums.max;
        
        const unplannedMin = Math.round(plannedMin * (1 + wasteRate / 100));
        const unplannedMax = Math.round(plannedMax * (1 + wasteRate / 100));
        
        const savingsMin = unplannedMin - plannedMin;
        const savingsMax = unplannedMax - plannedMax;

        const { total, completed, reviewsNeeded, upcoming, score } = getChecklistStats();

        return (
          <div className="space-y-6">
            {/* 1. GROWTH HEALTH & SIZING CHECKLIST */}
            <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden text-left premium-card-hover">
              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3.5 gap-3">
                  <div>
                     <h3 className="font-display font-bold text-text-primary text-base flex items-center space-x-2">
                       <CheckCircle className="w-5 h-5 text-brand-secondary" />
                       <span>Growth Health &amp; Sizing Checklist</span>
                     </h3>
                     <p className="text-text-secondary text-xs mt-0.5">
                       Verify essential sizes and developmental milestones for {sport} upgrades.
                     </p>
                  </div>
                  <span className="text-[10px] text-text-muted font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    Review Interval: 6 Months
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Scorecard Widget */}
                  <div className="bg-gradient-to-br from-slate-50 to-white hover:from-brand-secondaryLight/30 hover:to-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-3 premium-card-hover">
                    <div>
                      <span className="text-[9px] font-bold text-brand-secondary uppercase tracking-wider block">
                        Growth Health Score
                      </span>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-2xl font-black text-text-primary font-mono tracking-tight"><AnimatedCounter value={score} />%</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded">
                          Stable
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <div className="flex justify-between">
                        <span>Checks Done:</span>
                        <strong className="text-text-primary font-semibold">{completed} of {total}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Due Reviews:</span>
                        <strong className="text-text-primary font-semibold">{reviewsNeeded}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Priority Actions */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      Immediate Sizing Action Items
                    </span>
                    <div className="space-y-2">
                      {upcoming.length > 0 ? (
                        upcoming.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-3 bg-slate-50/50 border border-slate-100 rounded-lg p-2.5">
                            <span className="mt-0.5 w-4 h-4 rounded bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 text-[10px] font-bold">
                              !
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-text-primary leading-tight block">{item.text}</span>
                              <span className="text-[9px] text-text-muted font-medium block">
                                {item.phase} • Priority: {item.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-2.5 bg-emerald-50/20 border border-emerald-100/40 rounded-lg p-3 text-xs text-emerald-700 font-medium">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>All player equipment sizing metrics are fully verified!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Details Drawer */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setFullChecklistExpanded(!fullChecklistExpanded)}
                    className="w-full text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center justify-between transition-colors focus:outline-none bg-slate-50 hover:bg-slate-100/50 p-2.5 px-3.5 rounded-lg border border-slate-100 shadow-xs"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>{fullChecklistExpanded ? 'Hide Complete Checklist' : 'Expand Sizing Checklist Details'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${fullChecklistExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    fullChecklistExpanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50/30 border border-slate-100 rounded-xl p-4">
                      {roadmapData.year1 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider border-b border-slate-200/50 pb-1 flex justify-between">
                            <span>{roadmapData.year1.period || 'Phase 1'}</span>
                          </h4>
                          <div className="space-y-3.5">
                            {roadmapData.year1.milestones?.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Milestones</span>
                                <ul className="space-y-2">
                                  {roadmapData.year1.milestones.map((m, i) => {
                                    const isChecked = !!checkedItems.year1?.milestones?.[i];
                                    return (
                                      <li key={i} className="flex items-start space-x-2.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleCheck('year1', 'milestones', i)}
                                          className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all duration-150 focus:outline-none ${
                                            isChecked
                                              ? 'bg-brand-secondary border-brand-secondary text-white'
                                              : 'border-slate-300 hover:border-brand-secondary bg-white'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </button>
                                        <span className={`text-xs text-text-secondary transition-all leading-normal ${
                                          isChecked ? 'line-through text-text-muted italic' : ''
                                        }`}>
                                          {m}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            {roadmapData.year1.keepCurrentItems?.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-slate-150">
                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Items to Keep</span>
                                <ul className="space-y-2">
                                  {roadmapData.year1.keepCurrentItems.map((k, i) => {
                                    const isChecked = !!checkedItems.year1?.keeps?.[i];
                                    return (
                                      <li key={i} className="flex items-start space-x-2.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleCheck('year1', 'keeps', i)}
                                          className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all duration-150 focus:outline-none ${
                                            isChecked
                                              ? 'bg-brand-secondary border-brand-secondary text-white'
                                              : 'border-slate-300 hover:border-brand-secondary bg-white'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </button>
                                        <span className={`text-xs text-text-secondary transition-all leading-normal ${
                                          isChecked ? 'line-through text-text-muted italic' : ''
                                        }`}>
                                          {k}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {roadmapData.year2 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider border-b border-slate-200/50 pb-1 flex justify-between">
                            <span>{roadmapData.year2.period || 'Phase 2'}</span>
                          </h4>
                          <div className="space-y-3.5">
                            {roadmapData.year2.milestones?.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Milestones</span>
                                <ul className="space-y-2">
                                  {roadmapData.year2.milestones.map((m, i) => {
                                    const isChecked = !!checkedItems.year2?.milestones?.[i];
                                    return (
                                      <li key={i} className="flex items-start space-x-2.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleCheck('year2', 'milestones', i)}
                                          className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all duration-150 focus:outline-none ${
                                            isChecked
                                              ? 'bg-brand-primary border-brand-primary text-white'
                                              : 'border-slate-300 hover:border-brand-primary bg-white'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </button>
                                        <span className={`text-xs text-text-secondary transition-all leading-normal ${
                                          isChecked ? 'line-through text-text-muted italic' : ''
                                        }`}>
                                          {m}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            {roadmapData.year2.keepCurrentItems?.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-slate-150">
                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Items to Keep</span>
                                <ul className="space-y-2">
                                  {roadmapData.year2.keepCurrentItems.map((k, i) => {
                                    const isChecked = !!checkedItems.year2?.keeps?.[i];
                                    return (
                                      <li key={i} className="flex items-start space-x-2.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleCheck('year2', 'keeps', i)}
                                          className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all duration-150 focus:outline-none ${
                                            isChecked
                                              ? 'bg-brand-primary border-brand-primary text-white'
                                              : 'border-slate-300 hover:border-brand-primary bg-white'
                                          }`}
                                        >
                                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </button>
                                        <span className={`text-xs text-text-secondary transition-all leading-normal ${
                                          isChecked ? 'line-through text-text-muted italic' : ''
                                        }`}>
                                          {k}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ROI & FINANCIAL SUMMARY CARD */}
            <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden text-left premium-card-hover">
              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3.5 gap-3">
                  <div>
                    <h3 className="font-display font-bold text-text-primary text-base flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      <span>Roadmap Savings &amp; ROI</span>
                    </h3>
                    <p className="text-text-secondary text-xs mt-0.5">
                      Compare planned equipment sizing purchases vs. reactive gear shopping over 24 months.
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-full">
                    Plan ROI: <AnimatedCounter value={wasteRate} />% Savings
                  </span>
                </div>

                {/* Stripe-style statistic cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Average Savings */}
                  <div className="bg-gradient-to-br from-slate-50 to-white hover:from-emerald-50/30 hover:to-white border border-slate-100 rounded-xl p-4.5 flex flex-col justify-between premium-card-hover">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">
                        Estimated Savings
                      </span>
                      <div className="text-xl font-bold text-emerald-600 mt-2 font-mono tracking-tight">
                        ₹<AnimatedCounter value={savingsMin} formatter={val => val.toLocaleString('en-IN')} /> - ₹<AnimatedCounter value={savingsMax} formatter={val => val.toLocaleString('en-IN')} />
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2 block leading-snug">
                      Average family savings by scheduling upgrades during seasonal windows.
                    </span>
                  </div>

                  {/* Card 2: Savings Percentage */}
                  <div className="bg-gradient-to-br from-slate-50 to-white hover:from-brand-primaryLight/30 hover:to-white border border-slate-100 rounded-xl p-4.5 flex flex-col justify-between premium-card-hover">
                    <div>
                      <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider block">
                        Savings Percentage
                      </span>
                      <div className="text-xl font-bold text-text-primary mt-2 font-mono tracking-tight">
                        <AnimatedCounter value={wasteRate} />% Saved
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2 block leading-snug">
                      Reduces wrist strain and premature wear by matching correct size.
                    </span>
                  </div>

                  {/* Card 3: Spending Comparison */}
                  <div className="bg-gradient-to-br from-slate-50 to-white hover:from-indigo-50/30 hover:to-white border border-slate-100 rounded-xl p-4.5 sm:col-span-2 lg:col-span-1 flex flex-col justify-between premium-card-hover">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                        Spending Comparison
                      </span>
                      <div className="text-xs font-semibold text-text-secondary mt-2 space-y-1.5 bg-white border border-slate-100 rounded-lg p-2.5 font-mono">
                        <div className="flex justify-between text-red-500">
                          <span>Without Roadmap:</span>
                          <span>₹<AnimatedCounter value={unplannedMin} formatter={val => val.toLocaleString('en-IN')} /></span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-100 pt-1.5">
                          <span>With Roadmap:</span>
                          <span>₹<AnimatedCounter value={plannedMin} formatter={val => val.toLocaleString('en-IN')} /></span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-2 block leading-snug">
                      Optimized local market standard vs. premium price tiers.
                    </span>
                  </div>
                </div>

                {/* Collapsible details slider panel */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setRoiExpanded(!roiExpanded)}
                    className="w-full text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center justify-between transition-colors focus:outline-none bg-slate-50 hover:bg-slate-100/50 p-2.5 px-3.5 rounded-lg border border-slate-100 shadow-xs premium-btn-hover"
                  >
                    <span className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{roiExpanded ? 'Hide Sizing Risk Adjuster' : 'Adjust Risk Profile & View Insights'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${roiExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    roiExpanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 space-y-4">
                      {/* Risk Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-text-primary">Sizing Error &amp; Wear Risk:</span>
                          <span className="text-brand-primary">{wasteRate}% risk rate</span>
                        </div>
                        
                        <div className="flex items-center space-x-3.5">
                          <input
                            type="range"
                            min="15"
                            max="50"
                            value={wasteRate}
                            onChange={(e) => setWasteRate(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
                            aria-label="Sizing error and wear risk slider"
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-text-muted font-bold uppercase tracking-wider">
                          <span>Low Risk (15%)</span>
                          <span>High Risk (50%)</span>
                        </div>
                      </div>

                      {/* Concise Insights */}
                      <div className="text-xs text-text-secondary leading-relaxed bg-white border border-slate-100 rounded-lg p-3">
                        <strong className="text-text-primary block mb-0.5">Why does this happen?</strong>
                        Without a structured roadmap, families buy wrong equipment sizes out-of-season, leading to wrist strain and redundant mid-cycle replacements.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}


        </>
      )}

      {layout !== 'summary' && (
        <>
          {/* ROADMAP TIMELINE */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 text-left">
{/* YEAR 1 SECTION */}
        <div className="relative pl-12 animate-fade-in-up">
          {/* Timeline Node */}
          <div className="absolute left-3.5 top-1.5 w-5 h-5 rounded-full border-4 border-slate-200 bg-white flex items-center justify-center z-10 shadow-sm transition-all duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
          </div>

          <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden premium-card-hover">
            <button
              onClick={() => setY1Collapsed(!y1Collapsed)}
              className="w-full p-4.5 flex justify-between items-center bg-slate-50/30 hover:bg-slate-50/60 text-left transition-colors focus:outline-none border-b border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-brand-secondaryLight/50 text-brand-secondary flex items-center justify-center shrink-0 border border-brand-secondary/10">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-secondary uppercase tracking-wider bg-brand-secondaryLight px-1.5 py-0.5 rounded border border-brand-secondary/10">
                      Phase 1
                    </span>
                    <span className="text-xs font-medium text-text-muted">
                      {roadmapData.year1?.upgrades?.length || 0} upgrades recommended
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-sm mt-0.5">
                    {roadmapData.year1?.period || 'YEAR 1 (0-12 MONTHS)'}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-text-muted font-medium hidden sm:inline">
                  {y1Collapsed ? 'Expand phase' : 'Collapse phase'}
                </span>
                <div className="p-1 rounded-md bg-white border border-slate-100 shadow-sm text-text-secondary">
                  {y1Collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {!y1Collapsed && (
              <div className="p-5 space-y-5">
                {roadmapData.year1?.ageNote && (
                  <p className="text-xs text-text-secondary italic bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center space-x-2">
                    <span className="text-base">🌱</span>
                    <span>{roadmapData.year1.ageNote}</span>
                  </p>
                )}

                {/* Equipment Upgrades Collapsible Accordion List */}
                <div className="space-y-3">
                  {roadmapData.year1?.upgrades?.map((upg, idx) => {
                    const expandKey = `year1_${idx}`;
                    return (
                      <UpgradeCard
                        key={idx}
                        upg={upg}
                        idx={idx}
                        yearKey="year1"
                        isExpanded={!!expandedUpgrades[expandKey]}
                        onToggleExpand={() => toggleUpgradeExpand(expandKey)}
                        activeFitGuide={activeFitGuide}
                        onToggleFitGuide={toggleFitGuide}
                      />
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* YEAR 2 SECTION */}
        <div className="relative pl-12 animate-fade-in-up">
          {/* Timeline Node */}
          <div className="absolute left-3.5 top-1.5 w-5 h-5 rounded-full border-4 border-slate-200 bg-white flex items-center justify-center z-10 shadow-sm transition-all duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          </div>

          <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
            <button
              onClick={() => setY2Collapsed(!y2Collapsed)}
              className="w-full p-4.5 flex justify-between items-center bg-slate-50/30 hover:bg-slate-50/60 text-left transition-colors focus:outline-none border-b border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primaryLight/50 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primaryLight px-1.5 py-0.5 rounded border border-brand-primary/10">
                      Phase 2
                    </span>
                    <span className="text-xs font-medium text-text-muted">
                      {roadmapData.year2?.upgrades?.length || 0} upgrades recommended
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-sm mt-0.5">
                    {roadmapData.year2?.period || 'YEAR 2 (12-24 MONTHS)'}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-text-muted font-medium hidden sm:inline">
                  {y2Collapsed ? 'Expand phase' : 'Collapse phase'}
                </span>
                <div className="p-1 rounded-md bg-white border border-slate-100 shadow-sm text-text-secondary">
                  {y2Collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {!y2Collapsed && (
              <div className="p-5 space-y-5">
                {roadmapData.year2?.ageNote && (
                  <p className="text-xs text-text-secondary italic bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center space-x-2">
                    <span className="text-base">⚡</span>
                    <span>{roadmapData.year2.ageNote}</span>
                  </p>
                )}

                {/* Equipment Upgrades Collapsible Accordion List */}
                <div className="space-y-3">
                  {roadmapData.year2?.upgrades?.map((upg, idx) => {
                    const expandKey = `year2_${idx}`;
                    return (
                      <UpgradeCard
                        key={idx}
                        upg={upg}
                        idx={idx}
                        yearKey="year2"
                        isExpanded={!!expandedUpgrades[expandKey]}
                        onToggleExpand={() => toggleUpgradeExpand(expandKey)}
                        activeFitGuide={activeFitGuide}
                        onToggleFitGuide={toggleFitGuide}
                      />
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Coach Notes Card */}
      {roadmapData.coachNotes && (
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 border-l-4 border-l-accent-purple premium-card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent-purpleLight text-accent-purple flex items-center justify-center shadow-xs">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-display font-bold text-text-primary text-base">
              Coach &amp; Parent Advisory Notes
            </h3>
          </div>
          <div className="space-y-3 text-left">
            {roadmapData.coachNotes.split('\n').filter(line => line.trim()).map((note, nIdx) => (
              <div key={nIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start space-x-3">
                <span className="text-lg leading-none mt-0.5 text-accent-purple">💬</span>
                <p className="text-text-secondary text-xs leading-relaxed font-medium">
                  {note.replace(/^-\s*/, '')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-r from-brand-primaryLight/50 to-brand-secondaryLight/20 border border-brand-primary/10 rounded-card p-5.5 flex flex-col sm:flex-row justify-between items-center gap-4 premium-card-hover text-left">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-110">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-text-primary text-sm">
              Estimated 2-Year Budget
            </h4>
            <p className="text-text-secondary text-xs">
              Based on local Hyderabad sports market ranges
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-center sm:items-end">
          <span className="font-mono text-lg font-bold text-brand-primary">
            {roadmapData.totalBudgetEstimate}
          </span>
          <span className="text-[10px] font-semibold text-text-muted mt-1">
            Next Sizing Review at age {roadmapData.nextReviewAge || `${age + 2} yrs`}
          </span>
        </div>
      </div>

      {/* Rating Widget */}
      <RatingWidget generationId={generationId} />
      
        </>
      )}

    </div>
  );
}
