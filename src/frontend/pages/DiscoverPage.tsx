import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { EventItem, EventCategory } from '../types/index.js';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { HeroWine } from '../components/HeroWine.js';
import { EventCard } from '../components/EventCard.js';

const CATEGORIES: EventCategory[] = [
  'All',
  'Workshops',
  'Hackathons',
  'Career Events',
  'Networking',
  'Cultural',
  'Competitions'
];

export const DiscoverPage: React.FC = () => {
  const { profile, setIsGoalsModalOpen, navigateTo } = useApp();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [recommended, setRecommended] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [certOnly, setCertOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'time' | 'career'>('relevance');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allEvents, recEvents] = await Promise.all([
        api.getEvents({
          category: selectedCategory,
          search: searchQuery.trim() || undefined,
          is_free: freeOnly ? true : undefined,
          certificate_only: certOnly ? true : undefined,
        }),
        api.getRecommendedEvents()
      ]);

      setEvents(allEvents);
      setRecommended(recEvents.slice(0, 3));
    } catch (err: any) {
      setError(err.message || 'Failed to load campus events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, freeOnly, certOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  // Sort client-side
  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'relevance') {
      return b.relevance.totalScore - a.relevance.totalScore;
    }
    if (sortBy === 'career') {
      return b.career_value_rating - a.career_value_rating;
    }
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  return (
    <div className="min-h-screen bg-transparent">
      {/* 1. EDITORIAL INTELLIGENCE OPENING */}
      <HeroWine />

      {/* 2. CATALOG & RECOMMENDATIONS BODY */}
      <div id="discover-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        
        {/* "Picked for you" Section (Top 3 Recommendations) */}
        {recommended.length > 0 && !searchQuery && selectedCategory === 'All' && (
          <section className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E5DDD1] gap-4">
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#581C2E] font-bold block mb-1">
                  Personalized Priorities
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1311]">
                  Picked for your semester goals
                </h2>
                <p className="text-xs sm:text-sm text-[#5C4A42] mt-1 font-normal">
                  Prioritized by target focus: {profile?.goals?.slice(0, 2).join(', ') || 'technical depth & internships'}.
                </p>
              </div>

              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="text-xs font-semibold text-[#581C2E] hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Calibrate Target Goals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {recommended.map(ev => (
                <EventCard key={`rec_${ev.id}`} event={ev} />
              ))}
            </div>
          </section>
        )}

        {/* Full Campus Catalog Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#E5DDD1] gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#581C2E] font-bold block mb-1">
                Collegiate Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1311]">
                Sessions worth your time
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4A42] mt-1 font-normal">
                {sortedEvents.length} opportunities evaluated by syllabus rigor, speaker credibility, and peer turnout audits.
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1311]">
              <span className="text-[#735E55]">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#FFFFFF] border border-[#D5C9B8] rounded-md px-3 py-1.5 text-xs text-[#1C1311] font-semibold focus:outline-none focus:border-[#581C2E] shadow-2xs"
              >
                <option value="relevance">Highest Relevance</option>
                <option value="time">Earliest Schedule</option>
                <option value="career">Career Leverage</option>
              </select>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#FFFFFF] border border-[#D5C9B8] rounded-lg p-4 sm:p-5 shadow-2xs mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#735E55]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, mentor, laboratory, skill (e.g. ROS2, LLM, Venture)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-md border border-[#D5C9B8] bg-[#FFFFFF] text-[#1C1311] placeholder:text-[#8A786F] font-medium focus:outline-none focus:border-[#581C2E]"
                />
              </form>

              {/* Quick toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`px-3.5 py-2 rounded-md border text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                    freeOnly
                      ? 'bg-[#581C2E] text-white border-[#581C2E]'
                      : 'border-[#D5C9B8] bg-[#FFFFFF] text-[#1C1311] hover:bg-[#FAF7F2]'
                  }`}
                >
                  Free Only
                </button>

                <button
                  type="button"
                  onClick={() => setCertOnly(!certOnly)}
                  className={`px-3.5 py-2 rounded-md border text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                    certOnly
                      ? 'bg-[#581C2E] text-white border-[#581C2E]'
                      : 'border-[#D5C9B8] bg-[#FFFFFF] text-[#1C1311] hover:bg-[#FAF7F2]'
                  }`}
                >
                  Certificate Included
                </button>

                <button
                  type="button"
                  onClick={() => fetchEvents()}
                  className="p-2.5 rounded-md border border-[#D5C9B8] text-[#1C1311] bg-[#FFFFFF] hover:bg-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
                  title="Refresh catalog"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Segmented Control */}
            <div className="mt-4 pt-3 border-t border-[#E5DDD1] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-md shrink-0 transition-colors border cursor-pointer ${
                      active
                        ? 'bg-[#581C2E] text-white border-[#581C2E] shadow-2xs'
                        : 'text-[#1C1311] border-[#D5C9B8] bg-[#FFFFFF] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#581C2E] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-mono text-[#735E55]">Updating campus catalog...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-lg bg-[#FFFFFF] border border-red-200 text-center">
              <p className="text-xs text-red-700 font-semibold mb-3">{error}</p>
              <button
                onClick={() => fetchEvents()}
                className="px-4 py-2 rounded-md bg-[#581C2E] text-white text-xs font-semibold"
              >
                Retry Loading
              </button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="py-20 text-center rounded-lg bg-[#FFFFFF] border border-[#D5C9B8]">
              <h3 className="font-serif text-xl font-bold text-[#1C1311]">No sessions found</h3>
              <p className="text-xs text-[#5C4A42] mt-1 max-w-md mx-auto">
                No campus sessions match your current criteria. Try expanding category filters or clearing search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFreeOnly(false);
                  setCertOnly(false);
                }}
                className="mt-4 px-4 py-2 rounded-md bg-[#581C2E] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {sortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
