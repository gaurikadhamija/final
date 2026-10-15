import React, { useState } from 'react';
import { Bookmark, Plus, Check } from 'lucide-react';
import { EventItem } from '../types/index.js';
import { RelevanceScoreRing } from './RelevanceScoreRing.js';
import { useApp } from '../context/AppContext.js';

interface Props {
  event: EventItem;
  onSelect?: () => void;
  featured?: boolean;
}

export const EventCard: React.FC<Props> = ({ event, onSelect, featured = false }) => {
  const {
    savedEventIds,
    toggleSave,
    compareEventIds,
    addToCompare,
    removeFromCompare,
    setScoreModalEvent,
    navigateTo
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const isSaved = savedEventIds.has(event.id);
  const isCompared = compareEventIds.includes(event.id);

  const startDate = new Date(event.start_time);
  const dateFormatted = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const timeFormatted = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      navigateTo('event-details', event.id);
    }
  };

  return (
    <article
      data-event-card="true"
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-lg border border-[#D5C9B8] bg-[#FFFFFF] transition-all duration-200 hover:border-[#581C2E] hover:shadow-md cursor-pointer overflow-hidden ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Visual Anchor (Cover Image) */}
      <div
        className={`relative overflow-hidden bg-[#FAF7F2] shrink-0 ${
          featured ? 'w-full md:w-5/12 h-56 md:h-full min-h-[220px]' : 'w-full h-44'
        }`}
      >
        {!imageError && event.cover_image ? (
          <img
            src={event.cover_image}
            alt={event.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#FAF7F2] text-[#5C4A42] p-4 text-center">
            <span className="font-serif text-lg font-bold text-[#1C1311] line-clamp-2">
              {event.title}
            </span>
          </div>
        )}

        {/* Measured dark scrim for image contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* Quick Save Bookmark button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleSave(event.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-md backdrop-blur-sm transition-colors shadow-sm cursor-pointer ${
            isSaved
              ? 'bg-[#581C2E] text-white'
              : 'bg-[#FFFFFF]/90 text-[#1C1311] hover:bg-white border border-[#D5C9B8]'
          }`}
          aria-label={isSaved ? 'Remove from saved sessions' : 'Save session to agenda'}
          title={isSaved ? 'Session saved' : 'Save session'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : 'text-[#1C1311]'}`} />
        </button>

        {/* Category & Pricing Bottom Scrim Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white font-mono drop-shadow-sm text-[11px]">
          <span className="font-semibold uppercase tracking-wider text-[#FAF7F2]">
            {event.category}
          </span>
          <span className="font-semibold">
            {event.is_free ? 'Free' : `$${(event.cost_cents / 100).toFixed(0)}`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col justify-between flex-1 p-5 sm:p-6 bg-[#FFFFFF]">
        <div>
          {/* Metadata line (Zero-pill discipline, rich warm typography) */}
          <div className="flex items-center gap-1.5 text-xs text-[#735E55] mb-2 font-mono font-medium flex-wrap">
            <span>{dateFormatted}</span>
            <span aria-hidden="true" className="text-[#D5C9B8]">·</span>
            <span>{timeFormatted}</span>
            <span aria-hidden="true" className="text-[#D5C9B8]">·</span>
            <span className="truncate max-w-[140px] text-[#1C1311] font-semibold">{event.venue?.name || 'Campus Venue'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1311] leading-snug group-hover:text-[#581C2E] transition-colors">
            {event.title}
          </h3>

          {/* Tagline / Deck */}
          <p className="text-xs sm:text-sm text-[#473832] mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {event.tagline || 'Essential campus workshop focused on practical depth, peer collaboration, and verified competency.'}
          </p>

          {/* Key Skills */}
          {event.skills_taught && event.skills_taught.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#5C4A42] overflow-hidden text-ellipsis whitespace-nowrap font-mono">
              <span className="font-semibold text-[#1C1311]">Focus:</span>
              <span>{event.skills_taught.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Bottom Utility Strip */}
        <div className="mt-5 pt-4 border-t border-[#E5DDD1] flex items-center justify-between gap-3">
          {/* Relevance Ring */}
          <RelevanceScoreRing
            score={event.relevance.totalScore}
            size="sm"
            onClick={() => setScoreModalEvent(event)}
          />

          {/* Action Buttons: Save Session & Compare */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                toggleSave(event.id);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs border cursor-pointer ${
                isSaved
                  ? 'bg-[#581C2E] text-white border-[#581C2E]'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#1C1311] border-[#D5C9B8]'
              }`}
              title={isSaved ? 'Remove from saved sessions' : 'Save session to your agenda'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : 'text-[#581C2E]'}`} />
              <span>{isSaved ? 'Saved' : 'Save Session'}</span>
            </button>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                if (isCompared) removeFromCompare(event.id);
                else addToCompare(event.id);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs border cursor-pointer ${
                isCompared
                  ? 'bg-[#581C2E] text-white border-[#581C2E]'
                  : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1311] border-[#D5C9B8]'
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Compared</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#581C2E]" />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
