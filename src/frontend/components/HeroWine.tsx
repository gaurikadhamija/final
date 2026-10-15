import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sliders, Clock, ShieldCheck, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from './RelevanceScoreRing.js';

import campusTechSalonImg from '../../assets/images/campus_tech_salon_1791739518311.jpg';
import studentWorkshopImg from '../../assets/images/student_workshop_1791739542898.jpg';
import campusQuadArchImg from '../../assets/images/campus_quad_arch_1791739530548.jpg';
import worthwhileCoffeePreviewImg from '../../assets/images/worthwhile_coffee_preview_1791446958386.jpg';

interface SpotlightSlide {
  id: string;
  category: string;
  venue: string;
  time: string;
  title: string;
  tagline: string;
  score: number;
  skills: string[];
  attendeeEvidence: string;
  image: string;
  alt: string;
}

const SPOTLIGHT_SLIDES: SpotlightSlide[] = [
  {
    id: 'evt_robotics_ros2_lab',
    category: 'Advanced Robotics Workshop',
    venue: 'Turing Hall, IIIT Delhi',
    time: 'Thursday, 3:00 PM – 5:30 PM',
    title: 'Hands-on ROS2 & Real-Time LiDAR SLAM Mapping',
    tagline: 'Program physical TurtleBot4 rovers through indoor occupancy grid mapping in the Advanced Robotics Lab.',
    score: 94,
    skills: ['ROS2 Humble', 'Nav2', 'Occupancy Grids'],
    attendeeEvidence: '92% verified by 24 checked-in attendees',
    image: campusTechSalonImg,
    alt: 'Students collaborating in the robotics lab'
  },
  {
    id: 'evt_genai_llm_agents',
    category: 'Engineering Masterclass',
    venue: 'Bharti Hall, IIT Delhi',
    time: 'Friday, 3:15 PM – 5:15 PM',
    title: 'Autonomous Generative AI & Multi-Agent Loops',
    tagline: 'Build production vector retrieval pipelines, structured tool-calling, and LangGraph agent loops with industry leads.',
    score: 96,
    skills: ['Gemini 2.5 API', 'LangGraph', 'Function Calling'],
    attendeeEvidence: '96% verified by 68 checked-in attendees',
    image: studentWorkshopImg,
    alt: 'AI engineering workshop in progress'
  },
  {
    id: 'evt_startup_pitch_mixer',
    category: 'Venture & Founder Mixer',
    venue: 'Terrace Amphitheatre, IHC Lodhi',
    time: 'Saturday, 4:00 PM – 6:00 PM',
    title: 'Founders & Angel Pitch Mixer: Fall Cohort Demo',
    tagline: '12 student ventures pitch for $50k in nondilutive micro-grants in front of seed funds and campus alumni.',
    score: 91,
    skills: ['Pitch Decks', 'Venture Capital', 'Angel Co-founders'],
    attendeeEvidence: '89% verified by 52 founders and scouts',
    image: campusQuadArchImg,
    alt: 'Evening campus courtyard discussion'
  },
  {
    id: 'evt_hft_quant_trading',
    category: 'Quantitative Finance Clinic',
    venue: 'Auditorium 2, NSUT Dwarka',
    time: 'Thursday, 6:00 PM – 8:00 PM',
    title: 'HFT Order Books & Algorithmic Market Making',
    tagline: 'Simulate limit order book dynamics and latency arbitrage strategies in high-frequency trading simulations.',
    score: 93,
    skills: ['Python', 'Order Book Dynamics', 'Backtesting'],
    attendeeEvidence: '95% verified by 36 engineering attendees',
    image: worthwhileCoffeePreviewImg,
    alt: 'Lecture hall with student finance simulations'
  }
];

export const HeroWine: React.FC = () => {
  const { navigateTo, setIsGoalsModalOpen } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SPOTLIGHT_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext]);

  const currentSlide = SPOTLIGHT_SLIDES[currentIndex];

  return (
    <section className="relative border-b border-[#E5DDD1] bg-transparent pt-10 pb-16 lg:pt-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main 12-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Column 1: Editorial Intent & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Human Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#581C2E] font-semibold mb-4">
              <span>Campus Decision Intelligence</span>
              <span aria-hidden="true" className="text-[#A48F7C]">·</span>
              <span>2026 Academic Term</span>
            </div>

            {/* High-Contrast Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1311] leading-[1.08] tracking-tight">
              The right events.<br className="hidden sm:inline" />
              At the right time.<br className="hidden sm:inline" />
              <span className="italic font-normal text-[#581C2E]">For your goals.</span>
            </h1>

            {/* High-Contrast Deck */}
            <p className="text-base sm:text-lg text-[#473832] mt-5 max-w-xl leading-relaxed font-normal">
              WorthWhile matches students with high-yield campus workshops, hackathons, and research salons based on your semester targets, verified turnout audits, and real commute windows.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('discover-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-md bg-[#581C2E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#431422] shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigateTo('freetime')}
                className="px-4 py-3 rounded-md bg-[#FFFFFF] border border-[#D5C9B8] text-[#1C1311] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#581C2E]" />
                <span>2-Hour Free Window</span>
              </button>

              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="px-3.5 py-3 rounded-md text-xs font-semibold text-[#5C4A42] hover:text-[#581C2E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#581C2E]" />
                <span>Adjust Priorities</span>
              </button>
            </div>

            {/* Statistics Strip */}
            <div className="mt-12 pt-6 border-t border-[#E5DDD1] grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <span className="block font-serif text-3xl font-bold text-[#1C1311] tabular-nums">21</span>
                <span className="text-[11px] uppercase tracking-wider text-[#735E55] font-semibold">Active Sessions</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-[#581C2E] tabular-nums">14</span>
                <span className="text-[11px] uppercase tracking-wider text-[#735E55] font-semibold">Delhi Venues</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-[#1C1311] tabular-nums">88%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#735E55] font-semibold">Avg Target Match</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-[#1F5C3E] tabular-nums">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#735E55] font-semibold">Verified Checks</span>
              </div>
            </div>
          </div>

          {/* Column 2: Spotlight Dossier */}
          <div className="lg:col-span-5">
            <div 
              className="relative rounded-lg border border-[#D5C9B8] bg-[#FFFFFF] p-6 shadow-sm transition-all hover:border-[#581C2E] group"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
            >
              
              {/* Header Dossier Line */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5DDD1] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#581C2E] font-bold">
                    Featured Session
                  </span>
                  <span className="text-[10px] font-mono text-[#735E55]">
                    {currentIndex + 1} of {SPOTLIGHT_SLIDES.length}
                  </span>
                </div>
                
                {/* Clean Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? "Pause rotation" : "Resume rotation"}
                    aria-label={isPlaying ? "Pause rotation" : "Resume rotation"}
                    className="p-1 rounded text-[#735E55] hover:text-[#1C1311] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </button>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous spotlight"
                    className="p-1 rounded text-[#1C1311] hover:text-[#581C2E] hover:bg-[#FAF7F2] border border-[#E5DDD1] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next spotlight"
                    className="p-1 rounded text-[#1C1311] hover:text-[#581C2E] hover:bg-[#FAF7F2] border border-[#E5DDD1] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cover Image Stage */}
              <div className="relative h-48 w-full rounded-md overflow-hidden bg-[#1C1311] mb-4 select-none">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.alt}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                
                {/* Measured Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                
                {/* Unboxed Metadata Overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 text-xs text-white drop-shadow-sm flex items-center justify-between font-mono text-[11px]">
                  <span>{currentSlide.category}</span>
                  <span>{currentSlide.venue.split(',')[0]}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="min-h-[76px]">
                <h3 className="font-serif text-xl font-bold text-[#1C1311] leading-snug group-hover:text-[#581C2E] transition-colors">
                  {currentSlide.title}
                </h3>
                <p className="text-xs text-[#5C4A42] mt-1.5 leading-relaxed line-clamp-2">
                  {currentSlide.tagline}
                </p>
              </div>

              {/* Evidence & Score Bar */}
              <div className="mt-4 pt-3 border-t border-[#E5DDD1] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#1F5C3E] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#1F5C3E] shrink-0" />
                  <span className="text-[11px]">{currentSlide.attendeeEvidence}</span>
                </div>
                <RelevanceScoreRing
                  score={currentSlide.score}
                  size="sm"
                  onClick={() => navigateTo('event-details', currentSlide.id)}
                />
              </div>

              {/* Primary Action Button */}
              <div className="mt-4">
                <button
                  onClick={() => navigateTo('event-details', currentSlide.id)}
                  className="w-full py-2.5 rounded-md bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D5C9B8] text-xs font-semibold uppercase tracking-wider text-[#1C1311] transition-colors flex items-center justify-center gap-2 cursor-pointer group-hover:border-[#581C2E]"
                >
                  <span>Inspect Session Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#581C2E]" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
