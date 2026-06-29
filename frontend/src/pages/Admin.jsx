import React, { useState, useEffect } from 'react';
import { 
  Trophy, ShieldCheck, BarChart3, LineChart as LucideLineChart, 
  TrendingUp, Calendar, Clock, Trash2, Eye, Key, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Activity, Plus, RefreshCw, X
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, 
  PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ReferenceLine 
} from 'recharts';
import { api } from '../utils/api';
import RoadmapDisplay from '../components/Output/RoadmapDisplay';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background-card border border-border-default p-3.5 rounded-xl shadow-card">
        <p className="text-xs font-bold text-text-primary mb-1">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} className="text-xs font-semibold" style={{ color: item.color || item.fill }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Sport distribution pie chart colors
const sportColorsMap = {
  Cricket: '#16A34A',     // Green
  Football: '#2563EB',    // Blue
  Badminton: '#F97316',   // Orange
  Basketball: '#7C3AED',  // Purple
  Tennis: '#0D9488',      // Teal
  Athletics: '#EF4444',   // Red
  Swimming: '#06B6D4',    // Cyan
  Hockey: '#F59E0B'       // Amber
};
const defaultColors = ['#16A34A', '#2563EB', '#F97316', '#7C3AED', '#0D9488', '#EF4444'];

export default function Admin() {
  const [pin, setPin] = useState(() => sessionStorage.getItem('admin_pin') || '');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Analytics State
  const [data, setData] = useState(null);
  
  // Selected generation detail state (for View Modal)
  const [selectedGenId, setSelectedGenId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Sorting state for recent generations
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Sidebar navigation selection
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAnalytics = async (inputPin) => {
    setIsLoading(true);
    setPinError('');
    try {
      const result = await api.getAnalytics(inputPin);
      if (result.success) {
        setData(result);
        setIsAuthorized(true);
        sessionStorage.setItem('admin_pin', inputPin);
      }
    } catch (err) {
      setPinError('Invalid Admin PIN. Please try again.');
      setIsAuthorized(false);
      sessionStorage.removeItem('admin_pin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pin) {
      fetchAnalytics(pin);
    }
    return () => {
      sessionStorage.removeItem('admin_pin');
    };
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim().length === 4) {
      fetchAnalytics(pin);
    } else {
      setPinError('PIN must be 4 digits.');
    }
  };

  const handleDeleteGen = async (id) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        await api.deleteHistory(id);
        // Refresh analytics
        fetchAnalytics(pin);
        if (selectedGenId === id) {
          closeModal();
        }
      } catch (err) {
        alert('Could not delete generation');
      }
    }
  };

  const openModal = async (id) => {
    setSelectedGenId(id);
    setIsDetailLoading(true);
    try {
      const res = await api.getHistoryDetail(id);
      if (res.success) {
        setDetailData(res.data);
      }
    } catch (err) {
      alert('Failed to load detail');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedGenId(null);
    setDetailData(null);
  };

  // Sort function for the table columns
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedGenerations = () => {
    if (!data || !data.recentGenerations) return [];
    
    const items = [...data.recentGenerations];
    items.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null ratings
      if (sortConfig.key === 'rating') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return items;
  };

  // PIN Gate screen
  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-background-card border border-border-default shadow-card rounded-card p-8 w-full max-w-md text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-primary" />
          
          <div className="w-14 h-14 bg-brand-primaryLight text-brand-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Key className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-text-primary text-xl">
              Admin Portal
            </h2>
            <p className="text-text-secondary text-xs">
              Enter the 4-digit PIN configured in your backend `.env` file
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative max-w-[180px] mx-auto">
              <input
                type="password"
                maxLength={4}
                pattern="\d{4}"
                placeholder="••••"
                value={pin}
                disabled={isLoading}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[1em] font-mono font-bold text-2xl py-3 px-4 border border-border-default rounded-input focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            {pinError && (
              <p className="text-xs text-error font-semibold flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || pin.length !== 4}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-btn transition-colors btn-active-feedback disabled:opacity-40"
            >
              {isLoading ? 'Verifying PIN...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary flex items-center space-x-2">
            <Activity className="w-8 h-8 text-brand-primary" />
            <span>Admin Analytics Dashboard</span>
          </h1>
          <p className="text-text-secondary text-sm">
            Oxygen Sports AI usage metrics, quality stats & system health
          </p>
        </div>
        
        {/* Logout / Reload buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchAnalytics(pin)}
            className="p-2 border border-border-default rounded-lg bg-background-card text-text-secondary hover:text-brand-primary hover:bg-background-section transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_pin');
              setIsAuthorized(false);
              setPin('');
            }}
            className="px-4 py-2 border border-error hover:bg-error hover:text-white text-error font-bold text-xs rounded-btn transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Stats Cards Row (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Plans */}
        <div className="bg-background-card rounded-card border border-border-default border-t-4 border-t-brand-primary shadow-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 bg-brand-primaryLight text-brand-primary rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Total Plans
            </span>
            <span className="text-2xl font-bold text-text-primary block font-mono">
              {data.totalGenerations}
            </span>
            <span className="text-[10px] font-bold text-success flex items-center">
              <Plus className="w-3 h-3" />
              {data.todayGenerations} today
            </span>
          </div>
        </div>

        {/* Avg Quality */}
        <div className="bg-background-card rounded-card border border-border-default border-t-4 border-t-warning shadow-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 text-warning rounded-full flex items-center justify-center border border-warning/10">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Avg Quality
            </span>
            <span className="text-2xl font-bold text-text-primary block font-mono">
              {data.avgRating} / 5.0
            </span>
            <span className="text-[10px] font-bold text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              High User Score
            </span>
          </div>
        </div>

        {/* Top Sport */}
        <div className="bg-background-card rounded-card border border-border-default border-t-4 border-t-brand-secondary shadow-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 bg-brand-secondaryLight text-brand-secondary rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Top Sport
            </span>
            <span className="text-base font-bold text-text-primary block leading-tight truncate max-w-[140px]">
              {data.topSport}
            </span>
            <span className="text-[10px] font-semibold text-text-secondary">
              Most requested roadmap
            </span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-background-card rounded-card border border-border-default border-t-4 border-t-accent-purple shadow-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent-purpleLight text-accent-purple rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Avg Response
            </span>
            <span className="text-2xl font-bold text-text-primary block font-mono">
              {((data.avgResponseTimeMs || 3000) / 1000).toFixed(2)}s
            </span>
            <span className="text-[10px] font-bold text-brand-primary flex items-center">
              <Clock className="w-3 h-3 mr-0.5" />
              API Healthy
            </span>
          </div>
        </div>

        {/* Google Users */}
        <div className="bg-background-card rounded-card border border-border-default border-t-4 border-t-brand-secondary shadow-card p-5 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-brand-secondary rounded-full flex items-center justify-center border border-brand-secondary/10">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Google Users
            </span>
            <span className="text-2xl font-bold text-text-primary block font-mono">
              {data.totalGoogleUsers || 0}
            </span>
            <span className="text-[10px] font-semibold text-text-secondary">
              {data.totalEmailUsers || 0} Email Users
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Quality trend & generations counts charts */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quality Score Trend (Line Chart) */}
          <div className="bg-background-card border border-border-default rounded-card shadow-card p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">
                Quality Score Trend (Last 14 Days)
              </h3>
              <p className="text-text-secondary text-xs">
                Line plots daily average 5-star ratings; threshold line set at 4.0
              </p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.qualityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <ReferenceLine y={4.0} stroke="#F97316" strokeDasharray="3 3" label={{ value: 'Target 4.0', fill: '#F97316', fontSize: 10, position: 'top' }} />
                  <Line 
                    type="monotone" 
                    name="Avg Rating"
                    dataKey="avgRating" 
                    stroke="#16A34A" 
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#16A34A', strokeWidth: 2, fill: '#FFFFFF' }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily counts (Bar Chart) */}
          <div className="bg-background-card border border-border-default rounded-card shadow-card p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">
                Generations Per Day (Last 7 Days)
              </h3>
              <p className="text-text-secondary text-xs">
                Bar plot daily generated roadmaps count
              </p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Generations" fill="#2563EB" radius={[4, 4, 0, 0]}>
                    {data.dailyCounts.map((entry, index) => {
                      // Color weekend bars light purple
                      const date = new Date(entry.date);
                      const day = date.getDay();
                      const isWeekend = day === 0 || day === 6; // Sunday or Saturday
                      return (
                        <Cell key={`cell-${index}`} fill={isWeekend ? '#C084FC' : '#2563EB'} />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Side: Sport distribution donut & Age Progress bars */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Sport Distribution (Pie/Donut) */}
          <div className="bg-background-card border border-border-default rounded-card shadow-card p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">
                Sport Distribution
              </h3>
              <p className="text-text-secondary text-xs">
                Donut chart segmenting generated sports
              </p>
            </div>
            
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sportDistribution}
                    nameKey="sport"
                    dataKey="count"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    label={false}
                  >
                    {data.sportDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sportColorsMap[entry.sport] || defaultColors[index % defaultColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Circle Center Label */}
              <div className="absolute text-center">
                <span className="text-text-muted text-[10px] font-bold uppercase block">Total</span>
                <span className="text-text-primary text-xl font-bold font-mono leading-none">{data.totalGenerations}</span>
              </div>
            </div>

            {/* Custom Legend details below */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.sportDistribution.slice(0, 6).map((entry, index) => {
                const color = sportColorsMap[entry.sport] || defaultColors[index % defaultColors.length];
                return (
                  <div key={entry.sport} className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="truncate text-text-secondary font-medium">{entry.sport} ({entry.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Group Breakdown */}
          <div className="bg-background-card border border-border-default rounded-card shadow-card p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-text-primary text-base">
                Age Group Breakdown
              </h3>
              <p className="text-text-secondary text-xs">
                Athlete age classification segment analysis
              </p>
            </div>
            
            <div className="space-y-4 pt-2">
              {data.ageGroups.map(group => {
                let colorClass = 'bg-brand-primary';
                if (group.group.includes('Teen')) colorClass = 'bg-brand-secondary';
                if (group.group.includes('Senior')) colorClass = 'bg-accent-purple';

                return (
                  <div key={group.group} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-text-secondary">
                      <span>{group.group}</span>
                      <span>{group.count} ({group.percentage}%)</span>
                    </div>
                    {/* Custom progress bar */}
                    <div className="w-full bg-border-light h-3.5 rounded-full overflow-hidden border border-border-default">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Recent Generations Table */}
      <div className="bg-background-card border border-border-default rounded-card shadow-card mt-8 overflow-hidden">
        <div className="p-5 border-b border-border-default bg-background-section flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-display font-bold text-text-primary text-base">
              Recent Generations
            </h3>
            <p className="text-text-secondary text-xs">
              List of the 10 most recent roadmap builds
            </p>
          </div>
          <span className="text-[10px] font-bold bg-brand-primaryLight text-brand-primary px-3 py-1 rounded-full uppercase">
            Realtime feed
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-default">
            <thead className="bg-background-section text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
              <tr>
                <th onClick={() => requestSort('sport')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Sport</th>
                <th onClick={() => requestSort('playerName')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Athlete</th>
                <th onClick={() => requestSort('age')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Age</th>
                <th onClick={() => requestSort('level')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Level</th>
                <th onClick={() => requestSort('rating')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Rating</th>
                <th onClick={() => requestSort('provider')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Provider</th>
                <th onClick={() => requestSort('responseTimeMs')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Response Time</th>
                <th onClick={() => requestSort('createdAt')} className="px-6 py-3.5 cursor-pointer hover:bg-border-light select-none">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background-card divide-y divide-border-light text-sm text-text-secondary">
              {sortedGenerations().map((row, idx) => {
                const date = new Date(row.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-background-card' : 'bg-background-section/40'}>
                    <td className="px-6 py-3 font-semibold text-text-primary">{row.sport}</td>
                    <td className="px-6 py-3 font-medium text-text-primary">{row.playerName || 'N/A'}</td>
                    <td className="px-6 py-3">{row.age} yrs</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.level === 'Beginner' ? 'bg-brand-primaryLight text-brand-primary' :
                        row.level === 'Intermediate' ? 'bg-brand-secondaryLight text-brand-secondary' :
                        'bg-accent-purpleLight text-accent-purple'
                      }`}>
                        {row.level}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {row.rating ? (
                        <span className="text-warning font-bold">⭐ {row.rating}</span>
                      ) : (
                        <span className="text-text-muted text-xs">Unrated</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        row.provider === 'GOOGLE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.provider}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{((row.responseTimeMs || 3000) / 1000).toFixed(2)}s</td>
                    <td className="px-6 py-3 text-xs">{date}</td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={() => openModal(row.id)}
                        className="p-1.5 text-brand-primary hover:bg-brand-primaryLight rounded transition-colors"
                        title="View Full Roadmap"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGen(row.id)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prompt Quality Table */}
      <div className="bg-background-card border border-border-default rounded-card shadow-card mt-8 overflow-hidden mb-12">
        <div className="p-5 border-b border-border-default bg-background-section">
          <h3 className="font-display font-bold text-text-primary text-base">
            AI Prompt Version Control (A/B Quality)
          </h3>
          <p className="text-text-secondary text-xs">
            Performance comparison metrics across system prompt deployments
          </p>
        </div>
        
        <table className="min-w-full divide-y divide-border-default">
          <thead className="bg-background-section text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Prompt Version</th>
              <th className="px-6 py-3.5">Avg Rating</th>
              <th className="px-6 py-3.5">Tests Run</th>
              <th className="px-6 py-3.5">Created Date</th>
              <th className="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="bg-background-card divide-y divide-border-light text-sm text-text-secondary">
            {data.promptQuality && data.promptQuality.map((row) => (
              <tr key={row.promptVersion}>
                <td className="px-6 py-3.5 font-semibold text-text-primary font-mono text-xs">{row.promptVersion}</td>
                <td className="px-6 py-3.5 font-bold text-warning">⭐ {row.avgScore || 'N/A'}</td>
                <td className="px-6 py-3.5 font-mono">{row.testsRun} generates</td>
                <td className="px-6 py-3.5 text-xs">{new Date(row.date).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-3.5 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    row.status === 'Active' ? 'bg-brand-primaryLight text-brand-primary' : 'bg-border-light text-text-muted'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay Sheet */}
      {selectedGenId && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0" onClick={closeModal} />
          
          <div className="relative bg-background-primary w-full sm:max-w-3xl h-[85vh] sm:h-[90vh] rounded-t-card sm:rounded-card shadow-2xl flex flex-col z-10 animate-slide-in-right sm:animate-fade-in-up">
            
            <div className="p-4 border-b border-border-default flex justify-between items-center bg-background-section rounded-t-card sm:rounded-t-card">
              <div>
                <h3 className="font-display font-bold text-text-primary text-base">Saved Equipment Roadmap</h3>
                <p className="text-text-secondary text-xs">Admin Detailed View</p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full text-text-secondary hover:text-brand-primary hover:bg-background-section"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {isDetailLoading ? (
                <div className="h-full flex flex-col justify-center items-center">
                  <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
                </div>
              ) : detailData ? (
                <RoadmapDisplay
                  generationId={detailData.id}
                  playerProfile={{
                    sport: detailData.sport,
                    age: detailData.age,
                    height: detailData.height,
                    heightUnit: detailData.heightUnit,
                    level: detailData.level,
                    coachName: detailData.coachName,
                    playerName: detailData.playerName || ''
                  }}
                  roadmapData={detailData.roadmap}
                  onRegenerate={() => {}}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
