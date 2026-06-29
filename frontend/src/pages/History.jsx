import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHistory from '../hooks/useHistory';
import { 
  Search, Calendar, Trash2, Eye, RefreshCw, X, 
  ChevronLeft, ChevronRight, Clipboard, Award, ShieldAlert,
  Frown, ArrowRight
} from 'lucide-react';
import { api } from '../utils/api';
import RoadmapDisplay from '../components/Output/RoadmapDisplay';

const sportColors = {
  Cricket: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Football: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Badminton: 'bg-amber-50 text-amber-700 border-amber-100',
  Athletics: 'bg-purple-50 text-purple-700 border-purple-100',
  Tennis: 'bg-teal-50 text-teal-700 border-teal-100',
  default: 'bg-slate-50 text-slate-700 border-slate-100'
};

const sportEmojis = {
  Cricket: '🏏',
  Football: '⚽',
  Badminton: '🏸',
  Athletics: '🏃',
  Tennis: '🎾',
  Basketball: '🏀',
  Swimming: '🏊',
  Hockey: '🏑'
};

export default function History() {
  const navigate = useNavigate();
  const {
    historyList,
    total,
    page,
    pages,
    isLoading,
    error,
    filters,
    fetchHistory,
    updateFilters,
    deleteItem
  } = useHistory();

  // Search input local state
  const [searchQuery, setSearchQuery] = useState(filters.search);
  
  // Selected history item detail for modal
  const [selectedId, setSelectedId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  // Escape key handler for modal close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (selectedId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleSportFilter = (sport) => {
    updateFilters({ sport });
  };

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this equipment roadmap?')) {
      const deleted = await deleteItem(id);
      if (deleted && selectedId === id) {
        closeModal();
      }
    }
  };

  const openModal = async (id) => {
    setSelectedId(id);
    setIsDetailLoading(true);
    setDetailData(null);
    try {
      const res = await api.getHistoryDetail(id);
      if (res.success && res.data) {
        setDetailData(res.data);
      } else {
        alert('Could not fetch roadmap details');
      }
    } catch (err) {
      alert(err.message || 'Error loading roadmap');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setDetailData(null);
  };

  const renderModal = () => {
    if (!selectedId) return null;

    return (
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4"
      >
        {/* Background Click Close */}
        <div className="absolute inset-0" onClick={closeModal} />

        {/* Modal Sheet Content */}
        <div className="relative bg-background-primary w-full sm:max-w-3xl h-[85vh] sm:h-[90vh] rounded-t-card sm:rounded-card shadow-2xl flex flex-col z-10 animate-slide-in-right sm:animate-fade-in-up">
          
          {/* Header */}
          <div className="p-4 border-b border-border-default flex justify-between items-center bg-white rounded-t-card sm:rounded-t-card">
            <div>
              <h3 id="modal-title" className="font-display font-bold text-text-primary text-base">
                Saved Equipment Roadmap
              </h3>
              <p className="text-text-secondary text-[10px]">
                Generated Archive details
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-full text-text-secondary hover:text-brand-primary hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
            {isDetailLoading ? (
              <div className="h-full flex flex-col justify-center items-center space-y-3">
                <RefreshCw className="w-7 h-7 text-brand-primary animate-spin" />
                <span className="text-text-secondary text-sm font-semibold">
                  Retrieving roadmap parameters...
                </span>
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
                onRegenerate={async () => {
                  if (window.confirm('Regenerating will submit this profile as a new entry. Proceed?')) {
                    closeModal();
                    navigate(`/generate?preset=t1`);
                  }
                }}
              />
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-text-secondary">
                <ShieldAlert className="w-10 h-10 text-error mb-2" />
                <span>Roadmap data could not be parsed.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up space-y-6">
      
      {/* Header Title */}
      <div>
        <h1 className="font-display font-bold text-3xl text-text-primary flex items-center space-x-2.5">
          <Calendar className="w-7 h-7 text-brand-primary" />
          <span>Generation History</span>
        </h1>
        <p className="text-text-secondary text-sm">
          All roadmaps generated &mdash; click any entry to inspect or print
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex shadow-xs rounded-input bg-white border border-border-default overflow-hidden max-w-3xl focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all">
        <span className="pl-3.5 flex items-center text-text-muted">
          <Search className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          placeholder="Search by sport, requestor name, or equipment descriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-3 pr-4 py-3 bg-transparent text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
        />
        <button
          type="submit"
          className="px-5 bg-brand-primary text-white font-bold text-xs premium-btn-hover"
        >
          Search
        </button>
      </form>

      {/* Filters & Sorting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-4">
        {/* Sport filter chips scrollable */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0">
          {['All', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Athletics'].map((sport) => {
            const active = filters.sport === sport;
            return (
              <button
                key={sport}
                onClick={() => handleSportFilter(sport)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap focus-chip-hover ${
                  active
                    ? 'bg-brand-primaryLight/50 border-brand-primary text-brand-primary font-bold'
                    : 'bg-white border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary'
                }`}
              >
                {sport === 'All' ? '⚡ All Sports' : `${sportEmojis[sport] || '🏆'} ${sport}`}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-xs font-semibold text-text-secondary whitespace-nowrap">
            Sort By:
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={handleSortChange}
            className="bg-white border border-border-default rounded-lg px-2.5 py-1.5 text-xs text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main List Display */}
      {isLoading ? (
        <div className="bg-white border border-border-default rounded-card shadow-card divide-y divide-border-light">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
                <div className="h-4 w-16 rounded skeleton-shimmer" />
              </div>
              <div className="h-4 w-1/3 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-3/4 rounded-lg skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/20 rounded-card p-6 text-center text-error font-semibold">
          {error}
        </div>
      ) : historyList.length === 0 ? (
        // Empty State
        <div className="bg-white border border-border-default rounded-card p-8 text-center max-w-xl mx-auto shadow-card premium-card-hover">
          <div className="w-14 h-14 bg-brand-primaryLight text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Clipboard className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-text-primary text-base">
            No roadmaps generated yet
          </h3>
          <p className="text-text-secondary text-xs mt-1.5 mb-5">
            Fill in player profiles and build growth cycles to save them here.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="px-6 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-btn premium-btn-hover"
          >
            Generate Roadmap &rarr;
          </button>
        </div>
      ) : (
        // Minimalist Borderless List Feed
        <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden divide-y divide-border-light">
          {historyList.map((item) => {
            const tagClass = sportColors[item.sport] || sportColors.default;
            const emoji = sportEmojis[item.sport] || '🏆';
            const formattedDate = new Date(item.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={item.id}
                onClick={() => openModal(item.id)}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer group gap-4 premium-card-hover"
              >
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${tagClass}`}>
                      <span>{emoji}</span>
                      <span>{item.sport}</span>
                    </span>

                    <span className="text-[10px] text-text-muted">
                      📅 {formattedDate}
                    </span>

                    {item.rating ? (
                      <span className="text-[10px] font-bold text-warning bg-amber-50 px-1.5 py-0.5 rounded border border-warning/15">
                        ⭐ {item.rating}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-display font-bold text-text-primary text-sm group-hover:text-brand-primary transition-colors">
                    {item.playerName ? `${item.playerName} (${item.age} yrs)` : `${item.age}-year-old`} &bull; {item.level}
                  </h3>
                  
                  {item.coachName && (
                    <p className="text-text-secondary text-[11px]">
                      Planner Mode Requestor: <strong className="text-text-primary">{item.coachName}</strong>
                    </p>
                  )}

                  <p className="text-text-secondary text-xs truncate max-w-2xl">
                    {item.outputPreview}
                  </p>
                </div>

                {/* Right side actions and metadata */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-border-light pt-2 sm:pt-0 gap-3">
                  <span className="text-[10px] text-text-muted font-mono hidden sm:block">
                    ⏱ {((item.responseTimeMs || 3000) / 1000).toFixed(1)}s latency
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item.id);
                      }}
                      className="p-2 bg-slate-50 text-text-secondary rounded-lg border border-border-default flex items-center justify-center premium-btn-hover hover:text-brand-primary hover:bg-brand-primaryLight/50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-2 bg-slate-50 text-text-secondary rounded-lg border border-border-default flex items-center justify-center premium-btn-hover hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex justify-center items-center space-x-3 pt-4">
          <button
            onClick={() => fetchHistory(page - 1)}
            disabled={page === 1}
            className="p-2 border border-border-default rounded-lg bg-white text-text-secondary hover:text-brand-primary hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold text-text-secondary">
            Page {page} of {pages}
          </span>

          <button
            onClick={() => fetchHistory(page + 1)}
            disabled={page === pages}
            className="p-2 border border-border-default rounded-lg bg-white text-text-secondary hover:text-brand-primary hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Sheet modal */}
      {renderModal()}
      
    </div>
  );
}
