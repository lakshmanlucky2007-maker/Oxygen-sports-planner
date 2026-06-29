import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, Trophy, DollarSign, Activity, 
  ShieldAlert, TrendingUp, Users, ChevronDown, CheckCircle2, 
  ArrowRight, ShieldCheck, HelpCircle, Award, Plus, Filter, LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';

const mockPreviews = {
  Cricket: {
    title: "8-Year-Old Cricket Athlete (Beginner)",
    budget: "₹5,000 - ₹9,000",
    savings: "₹3,500 Saved",
    phases: [
      {
        time: "Now (0-6 Months)",
        gear: "Kashmir Willow Size 4 Bat (1.1kg)",
        why: "Transitioning from plastic. Size 4 bat aligns with standard 120cm height to build proper wrist action."
      },
      {
        time: "Year 2 (12-24 Months)",
        gear: "English Willow Size 5 Bat & Moulded Pads",
        why: "Upgrading to a responsive sweet spot as player reaches 135cm height and handles faster leather balls."
      }
    ]
  },
  Football: {
    title: "12-Year-Old Football Forward (Intermediate)",
    budget: "₹8,000 - ₹12,000",
    savings: "₹4,800 Saved",
    phases: [
      {
        time: "Now (0-6 Months)",
        gear: "FG Studs with synthetic upper & Ankle shin guards",
        why: "Provides grass traction on local Hyderabad fields, protecting joint alignment during quick turns."
      },
      {
        time: "Year 2 (12-24 Months)",
        gear: "Hybrid-stitched Size 4 Training Football & Performance Cleats",
        why: "Adjusting to size 4 matches official academy regulations. Textured cleats improve spin control."
      }
    ]
  },
  Badminton: {
    title: "10-Year-Old Badminton Student (Beginner)",
    budget: "₹4,000 - ₹8,000",
    savings: "₹2,500 Saved",
    phases: [
      {
        time: "Now (0-6 Months)",
        gear: "Carbon Graphite 4U Racket & Court Shoes",
        why: "Lightweight 82g frame reduces shoulder fatigue. Court shoes prevent ankle rolls on indoor boards."
      },
      {
        time: "Year 2 (12-24 Months)",
        gear: "High-Modulus 3U Racket (24 lbs custom tension)",
        why: "Higher tension provides wrist control on clears and baseline drop shots as forearm strength solidifies."
      }
    ]
  }
};

const faqs = [
  {
    q: "How does the AI sizing and growth engine work?",
    a: "Our engine uses inputs (age, height, weight, playing level) and processes them using a growth-prediction model (matching physical development charts, e.g., 5-7cm height increase per year) coupled with GPT-4o's expert sports guidelines. It generates appropriate sizing adjustments (e.g. bat sizes, racket lengths, shoe studs) for a 2-year horizon."
  },
  {
    q: "Are the budget pricing estimates accurate for Indian markets?",
    a: "Yes. The prices are calibrated using standard local retail rates in Hyderabad, India. The standard tier matches durable entry brands (like SG Kashmir willow, Nivia studs, or Li-Ning rackets), while the premium tier covers imported professional gear (like English willow, Adidas cleats, or Yonex rackets)."
  },
  {
    q: "What is the difference between Parent Mode and Coach Mode?",
    a: "Parent Mode prioritizes cost-efficiency, safety, and gradual sizing updates to accommodate natural physical growth without unnecessary spending. Coach Mode focuses on competitive metrics, professional standards, and performance optimization to ensure the athlete is tournament-ready."
  },
  {
    q: "How does the Savings Calculator determine estimated roadmap savings?",
    a: "Purchasing wrong equipment sizes early, or double-buying due to rapid height increases, causes average family budget losses of up to 40%. The Savings Calculator tracks the optimized planned cycle against random replacement patterns to save you thousands of rupees."
  }
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activePreview, setActivePreview] = useState('Cricket');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
        {/* Dashboard Header */}
        <div className="relative overflow-hidden bg-white border border-border-default rounded-card p-6 sm:p-8 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 relative z-10 text-left">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
                Welcome back, {user.name}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                user.role === 'Coach'
                  ? 'bg-brand-secondaryLight text-brand-secondary border border-brand-secondary/10'
                  : 'bg-brand-primaryLight text-brand-primary border border-brand-primary/10'
              }`}>
                {user.role} Mode
              </span>
            </div>
            <p className="text-text-secondary text-xs sm:text-sm max-w-xl leading-relaxed">
              {user.role === 'Coach'
                ? "Optimized for squad planning. Manage athlete parameters, training standards, and customized tournament regulations."
                : "Optimized for child athlete development. Monitor growth milestones, check sizing indexes, and budget gear upgrades."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
            <Link
              to="/generate"
              className="px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-xs btn-pulse flex items-center space-x-1.5 focus:outline-none premium-btn-hover"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Athlete Roadmap</span>
            </Link>
            <Link
              to="/history"
              className="px-5 py-2.5 bg-white border border-border-default text-text-primary font-semibold text-xs rounded-xl focus:outline-none premium-btn-hover"
            >
              Saved Roadmaps
            </Link>
          </div>
        </div>

        {/* Dashboard Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Column: Primary Actions / Roster */}
          <div className="lg:col-span-8 space-y-8">
            {user.role === 'Parent' ? (
              <>
                {/* Parent Mode Checklist */}
                <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4 premium-card-hover">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="font-display font-bold text-text-primary text-sm sm:text-base flex items-center">
                      <Users className="w-4 h-4 text-brand-primary mr-2" />
                      Growth &amp; Sizing Checklist
                    </h3>
                    <span className="text-[10px] text-text-muted font-medium">Auto-renew cycle: 6 Months</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Shoe Stud Verification", status: "Due in 3 months", desc: "Ensure studs align with grass/mud density changes.", color: "bg-emerald-50 text-emerald-700 border-emerald-100/50" },
                      { title: "Racket Grip Index Check", status: "Up to date", desc: "Verify wrist diameter matches grip parameters.", color: "bg-emerald-50 text-emerald-700 border-emerald-100/50" },
                      { title: "Bat Height Alignment", status: "Review needed", desc: "Bat handle should align with kid's waist height.", color: "bg-amber-50 text-amber-700 border-amber-100/50" },
                      { title: "Weight Profile Analysis", status: "Up to date", desc: "Verify shoulder load does not exceed 10% body weight.", color: "bg-emerald-50 text-emerald-700 border-emerald-100/50" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-2 premium-card-hover">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-bold text-text-primary truncate">{item.title}</span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${item.color}`}>{item.status}</span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parent Sizing Cost Saver Card */}
                <div className="bg-gradient-to-r from-emerald-50/50 to-emerald-100/10 border border-emerald-150 rounded-card p-6 flex items-start space-x-3 shadow-xs premium-card-hover">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-brand-primary text-xs uppercase tracking-wider">
                      Savings Calculator ROI
                    </h4>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      By planning purchases over a 24-month horizon rather than reacting to sudden growth spurts, the average family saves <strong className="text-text-primary">up to 35% (approx. ₹4,200)</strong> on redundant bats, shoes, and safety accessories.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Coach Mode Squad View */}
                <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4 premium-card-hover">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="font-display font-bold text-text-primary text-sm sm:text-base flex items-center">
                      <Trophy className="w-4 h-4 text-brand-secondary mr-2" />
                      Squad &amp; Roster Sizing Manager
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center text-[10px] text-text-secondary bg-slate-50 px-2 py-0.5 rounded-md font-semibold border border-slate-100">
                        <Filter className="w-3 h-3 mr-1" /> All Players
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Vinay Kumar", sport: "🏏 Cricket", category: "U-14", details: "Height: 142cm • Bat Size: 5 • Target: Size 6 Kashmir Willow", alert: false },
                      { name: "Simran Kaur", sport: "🏸 Badminton", category: "U-12", details: "Height: 128cm • Racket Weight: 4U (83g) • Grip: G5", alert: false },
                      { name: "Rahul Deshmukh", sport: "⚽ Football", category: "U-16", details: "Height: 165cm • Studs: SG (Soft Ground) • Shoe: Size 8", alert: true }
                    ].map((player, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 premium-card-hover">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-text-primary">{player.name}</span>
                            <span className="text-[9px] font-bold text-text-secondary bg-slate-200/50 px-1.5 py-0.5 rounded border border-slate-200/25">{player.sport}</span>
                            <span className="text-[8px] font-bold text-brand-secondary bg-brand-secondaryLight px-1.5 py-0.5 rounded-full border border-brand-secondary/10">{player.category}</span>
                          </div>
                          <p className="text-[10px] text-text-secondary">{player.details}</p>
                        </div>
                        {player.alert ? (
                          <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-xl shrink-0 w-fit animate-pulse">
                            ⚠️ Sizing Alert: Cleat size-up required
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl shrink-0 w-fit">
                            ✓ Sizing Compliant
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach Academy Guidelines */}
                <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4 premium-card-hover">
                  <h4 className="font-display font-bold text-text-primary text-xs sm:text-sm uppercase tracking-wider text-text-muted">
                    Tournament Equipment Regulations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl premium-card-hover">
                      <p className="text-xs font-bold text-text-primary">🏏 Cricket Bats</p>
                      <p className="text-[10px] text-text-secondary leading-relaxed mt-2">Under-12 must use Size 4/5. Double-check blade thickness regulations under local guidelines.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl premium-card-hover">
                      <p className="text-xs font-bold text-text-primary">🏸 Badminton</p>
                      <p className="text-[10px] text-text-secondary leading-relaxed mt-2">Under-14 recommends 24 lbs max string tension to protect youth shoulders from fatigue.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl premium-card-hover">
                      <p className="text-xs font-bold text-text-primary">⚽ Football Cleats</p>
                      <p className="text-[10px] text-text-secondary leading-relaxed mt-2">Hyderabad artificial turf camps ban metal studs. Use SG/FG cleats.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Presets */}
            <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4 premium-card-hover">
              <div>
                <h3 className="font-display font-bold text-text-primary text-xs sm:text-sm uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary mr-1.5" />
                  Quick Fill Templates
                </h3>
                <p className="text-text-muted text-[10px] mt-0.5">
                  Launch the generator with pre-configured parameters:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { sport: "Cricket", title: "🏏 U-12 Kashmir Willow", path: "/generate?preset=t1" },
                  { sport: "Football", title: "⚽ U-15 Soft Ground Cleats", path: "/generate?preset=t2" },
                  { sport: "Badminton", title: "🏸 U-10 Lightweight Racket", path: "/generate?preset=t3" }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    className="w-full flex items-center justify-between p-3 border border-border-default rounded-xl text-xs font-semibold text-text-primary premium-card-hover group"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Switch roles helper card */}
            <div className="bg-slate-50 border border-slate-100 rounded-card p-5 space-y-2.5 premium-card-hover">
              <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                Need to swap modes?
              </h5>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                You can toggle between Parent Mode and Coach Mode at any time in the dropdown or Profile settings.
              </p>
              <Link 
                to="/profile"
                className="text-[10px] font-bold text-brand-primary hover:text-brand-primary/80 inline-flex items-center space-x-1 premium-btn-hover"
              >
                <span>Go to Profile Settings</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 animate-fade-in-up">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-background-primary pt-16 pb-20 border-b border-border-light">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-primaryLight border border-brand-primary/20 px-3.5 py-1.5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-wider animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen AI Athlete Sizing</span>
              </div>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[52px] leading-tight tracking-tight text-text-primary">
                Optimize Your Child's <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-accent-purple bg-clip-text text-transparent">
                  Equipment Upgrade Path
                </span>
              </h1>
              
              <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Empower your youth athlete with a customized 2-year gear roadmap. Prevent growth-related injuries, optimize skill growth, and plan budget expenses with localized AI intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/generate"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold rounded-xl btn-pulse shadow-lg shadow-brand-primary/10 text-sm premium-btn-hover"
                >
                  Create Athlete Roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                
                <Link
                  to="/generate?preset=t1"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-background-primary text-text-primary border border-border-default font-bold rounded-xl text-sm premium-btn-hover"
                >
                  View Sample
                </Link>
              </div>

              {/* Hyderabad Local Trust Stat */}
              <div className="pt-6 border-t border-border-light flex flex-wrap justify-center lg:justify-start items-center gap-6 text-xs text-text-secondary">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-brand-primary" />
                  <span>Calibrated for Hyderabad Academy standards</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-secondary" />
                  <span>Supports local pricing indices</span>
                </div>
              </div>
            </div>

            {/* Right Product Preview Placeholder (Mock UI Card) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-md bg-white rounded-card border border-border-default shadow-2xl p-6 relative animate-fade-in-up">
                <div className="absolute -top-3 -right-3 bg-accent-orange text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Live Preview
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border-light">
                    <div>
                      <h4 className="font-display font-bold text-text-primary text-sm">Oxygen Planner v1</h4>
                      <p className="text-[10px] text-text-muted">Interactive growth projection</p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  
                  {/* Mock Sizing Card */}
                  <div className="bg-background-section p-4 rounded-xl border border-border-light space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-primary">🎂 Age: 8 Years</span>
                      <span className="font-bold text-brand-secondary">📏 Height: 120 cm</span>
                    </div>
                    <div className="h-2 w-full bg-border-default rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-2/3" />
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Physical height is projected to reach <strong className="text-text-primary">132cm (+12cm)</strong> by Year 2. Gear sizes must adapt accordingly.
                    </p>
                  </div>

                  {/* Pricing Bar preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Price Tier Analysis</span>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Standard: ₹1,200</span>
                      <span className="text-brand-primary font-bold">Midrange: ₹2,500</span>
                      <span>Premium: ₹5,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand-secondary bg-brand-secondaryLight px-3 py-1 rounded-full uppercase tracking-wider">
            Simple Path
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            How It Works
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Get an optimized equipment growth plan in three simple, intuitive steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Input Athlete Profile",
              desc: "Provide basic physical metrics (age, height, weight), experience level, and budget goals.",
              icon: <Activity className="w-5 h-5" />,
              color: "border-t-brand-primary text-brand-primary bg-brand-primaryLight"
            },
            {
              step: "02",
              title: "AI Growth Mapping",
              desc: "Our model matches typical growth milestones with sizing charts for Cricket, Football, Badminton, etc.",
              icon: <Sparkles className="w-5 h-5" />,
              color: "border-t-brand-secondary text-brand-secondary bg-brand-secondaryLight"
            },
            {
              step: "03",
              title: "Unlock Sizing Roadmap",
              desc: "Retrieve your 2-year purchase roadmap with pricing options, fit checkpoints, and saving estimations.",
              icon: <Calendar className="w-5 h-5" />,
              color: "border-t-accent-purple text-accent-purple bg-accent-purpleLight"
            }
          ].map((item, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-card border border-border-default shadow-card border-t-4 ${item.color.split(' ')[0]} text-left premium-card-hover space-y-4`}>
              <div className={`w-10 h-10 rounded-lg ${item.color.slice(item.color.indexOf(' ') + 1)} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Phase {item.step}</span>
                <h3 className="font-display font-bold text-text-primary text-base mt-1">{item.title}</h3>
                <p className="text-text-secondary text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section className="bg-background-section py-16 border-y border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-brand-primary bg-brand-primaryLight px-3 py-1 rounded-full uppercase tracking-wider">
              Core Value
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
              Why Parents &amp; Coaches Choose Us
            </h2>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Engineered to save money while protecting the physical health of young athletes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Optimize Spending",
                desc: "Compare Budget, Mid-range, and Premium equipment options side-by-side to align with your seasonal wallet limits.",
                icon: <DollarSign className="w-5 h-5 text-brand-primary" />
              },
              {
                title: "Buy at the Right Time",
                desc: "Seasonal recommendations ensure you buy gear right before academy camps or winter tournaments start.",
                icon: <Calendar className="w-5 h-5 text-brand-secondary" />
              },
              {
                title: "Track Athlete Growth",
                desc: "Factored growth forecasts account for vertical height adjustments and wrist/hand strength milestones.",
                icon: <TrendingUp className="w-5 h-5 text-accent-orange" />
              },
              {
                title: "Avoid Injury Risks",
                desc: "Using gear that is too heavy or tall leads to posture collapse. Sizing validation checkpoints protect development.",
                icon: <ShieldAlert className="w-5 h-5 text-accent-purple" />
              }
            ].map((benefit, bIdx) => (
              <div key={bIdx} className="bg-white p-6 rounded-card border border-border-default shadow-card premium-card-hover space-y-3">
                <div className="w-9 h-9 rounded-lg bg-background-section border border-border-light flex items-center justify-center shadow-xs">
                  {benefit.icon}
                </div>
                <h4 className="font-display font-bold text-text-primary text-sm">{benefit.title}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXAMPLE ROADMAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-accent-orange bg-accent-orangeLight px-3 py-1 rounded-full uppercase tracking-wider">
            Interactive Tour
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Explore a Sample Roadmap
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Toggle below to see how AI structures recommendations for different categories
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center space-x-3 border-b border-border-default pb-4">
          {Object.keys(mockPreviews).map(sport => (
            <button
              key={sport}
              onClick={() => setActivePreview(sport)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all focus:outline-none premium-btn-hover ${
                activePreview === sport
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                  : 'bg-white border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary'
              }`}
            >
              {sport === 'Cricket' ? '🏏 Cricket' : sport === 'Football' ? '⚽ Football' : '🏸 Badminton'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-border-default rounded-card shadow-card p-6 max-w-3xl mx-auto animate-fade-in-up space-y-4 premium-card-hover">
          <div className="flex justify-between items-center border-b border-border-light pb-4">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">
                {mockPreviews[activePreview].title}
              </h3>
              <p className="text-text-secondary text-xs">Estimated 2-Year Cost: {mockPreviews[activePreview].budget}</p>
            </div>
            <span className="text-xs font-bold bg-brand-primaryLight text-brand-primary px-3 py-1 rounded-full">
              {mockPreviews[activePreview].savings}
            </span>
          </div>

          <div className="space-y-4">
            {mockPreviews[activePreview].phases.map((phase, pIdx) => (
              <div key={pIdx} className="bg-background-section p-4 rounded-xl border border-border-light space-y-2 premium-card-hover">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-accent-orange">📅 {phase.time}</span>
                  <span className="bg-brand-secondaryLight text-brand-secondary px-2 py-0.5 rounded text-[10px]">Upgrade Step</span>
                </div>
                <h4 className="text-text-primary text-sm font-semibold">{phase.gear}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{phase.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-accent-purple bg-accent-purpleLight px-3 py-1 rounded-full uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Trusted by the Sports Community
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Hear from academy directors, physical education coaches, and sports parents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The bat sizing guidelines corrected my player's wrist angle issues in just two weeks. Highly recommended for young league cricketers.",
              author: "Coach Ravi Kumar",
              role: "Director, Hyderabad Junior Cricket Academy",
              sport: "Cricket"
            },
            {
              quote: "The roadmap saved us from double-purchasing cleats during my daughter's rapid 10cm growth spurt. Extremely accurate estimates.",
              author: "Priya Rao",
              role: "Sports Parent, Jubilee Hills",
              sport: "Football"
            },
            {
              quote: "A comprehensive gear advisor. It explains the mechanics behind shoe spikes and court grip parameters very professionally.",
              author: "Srinivas G.",
              role: "Head Physical Trainer, Gachibowli Academy",
              sport: "Badminton"
            }
          ].map((t, tIdx) => (
            <div key={tIdx} className="bg-white p-6 rounded-card border border-border-default shadow-card flex flex-col justify-between premium-card-hover">
              <div>
                <div className="flex space-x-1 mb-4 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-text-secondary text-xs leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="border-t border-border-light pt-4 flex justify-between items-end">
                <div>
                  <h4 className="font-display font-bold text-text-primary text-xs">{t.author}</h4>
                  <p className="text-text-muted text-[10px] mt-0.5">{t.role}</p>
                </div>
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primaryLight px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.sport}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary bg-brand-primaryLight px-3 py-1 rounded-full uppercase tracking-wider flex items-center justify-center w-fit mx-auto">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>FAQ Helpdesk</span>
          </span>
          <h2 className="font-display font-bold text-3xl text-text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-sm">
            Answers to our parents' and coaches' most common questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaq === fIdx;
            return (
              <div
                key={fIdx}
                className="bg-white border border-border-default rounded-card shadow-xs overflow-hidden premium-card-hover"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(fIdx)}
                  className="w-full p-5 flex justify-between items-center text-left hover:bg-slate-50 focus:outline-none transition-colors"
                >
                  <span className="font-display font-bold text-text-primary text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-light bg-slate-50 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-accent-purple rounded-card p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-xl shadow-brand-primary/10 border border-brand-primary/20">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight">
              Ready to Upgrade Your Sizing Savy?
            </h2>
            <p className="text-white/80 text-sm max-w-lg mx-auto leading-relaxed">
              Create your player's professional 24-month roadmap with localized price catalogs and growth milestonings in under 2 minutes.
            </p>
            <div className="pt-2">
              <Link
                to="/generate"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-bold rounded-xl shadow-md text-sm premium-btn-hover"
              >
                Get Started Free &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
