import React from 'react';
import { AppProvider, useApp } from './frontend/context/AppContext.js';
import { Navbar } from './frontend/components/Navbar.js';
import { Footer } from './frontend/components/Footer.js';
import { CoffeeAtmosphere } from './frontend/components/CoffeeAtmosphere.js';
import { DiscoverPage } from './frontend/pages/DiscoverPage.js';
import { FreeTimePage } from './frontend/pages/FreeTimePage.js';
import { HeatmapPage } from './frontend/pages/HeatmapPage.js';
import { ComparePage } from './frontend/pages/ComparePage.js';
import { MyEventsPage } from './frontend/pages/MyEventsPage.js';
import { OrganizerDashboardPage } from './frontend/pages/OrganizerDashboardPage.js';
import { EventDetailsPage } from './frontend/pages/EventDetailsPage.js';
import { GoalsModal } from './frontend/components/GoalsModal.js';
import { ReviewModal } from './frontend/components/ReviewModal.js';
import { RelevanceScoreModal } from './frontend/components/RelevanceScoreModal.js';
import { AuthModal } from './frontend/components/AuthModal.js';
import { AuthScreen } from './frontend/components/AuthScreen.js';
import { EditProfileModal } from './frontend/components/EditProfileModal.js';
import { StudentVerificationModal } from './frontend/components/StudentVerificationModal.js';
import { StudentVerificationBanner } from './frontend/components/StudentVerificationBanner.js';
import { Sparkles, ArrowRight, Bookmark, Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activePage,
    selectedEventId,
    scoreModalEvent,
    setScoreModalEvent,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    authLoading,
    isGuestPreview,
    setIsGuestPreview,
    saveToast,
    dismissSaveToast
  } = useApp();

  // 1. Initial Authentication Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-4">
        <CoffeeAtmosphere />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <img
            src="/worthwhile-icon.svg"
            alt="WorthWhile"
            className="w-12 h-12 object-contain animate-bounce"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <h2 className="font-serif text-2xl font-bold text-[#241410]">WorthWhile</h2>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5B2435] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#5B2435] animate-ping" />
            <span>Verifying session credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Visitor Flow: Show dedicated full-page Auth & Role-Selection Screen
  if (!isAuthenticated && !isGuestPreview) {
    return <AuthScreen />;
  }

  // 3. Authenticated or Guest Preview App Flow
  return (
    <div className="relative flex flex-col min-h-screen text-[#1C1311] selection:bg-[#581C2E] selection:text-[#FAF7F2] bg-transparent">
      {/* Editorial Academic Foundation Canvas */}
      <CoffeeAtmosphere />

      {/* Guest Mode Invitation Bar if browsing without an account */}
      {!isAuthenticated && isGuestPreview && (
        <div className="sticky top-0 z-50 w-full bg-[#581C2E] text-[#FAF7F2] px-4 py-2 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span>You are browsing WorthWhile in Guest Mode. Sign in to save events, track verified hours, and build your student portfolio.</span>
          </div>
          <button
            onClick={() => setIsGuestPreview(false)}
            className="px-3 py-1 rounded bg-[#FAF7F2] text-[#581C2E] font-semibold text-[11px] uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors shrink-0 ml-3 cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Sticky Top Navigation */}
        <Navbar />

        {/* Student Verification Alert Banner (if unverified or needs action) */}
        <StudentVerificationBanner />

        {/* Main Page Content */}
        <main className="flex-1">
          {activePage === 'discover' && <DiscoverPage />}
          {activePage === 'freetime' && <FreeTimePage />}
          {activePage === 'heatmap' && <HeatmapPage />}
          {activePage === 'compare' && <ComparePage />}
          {activePage === 'myevents' && <MyEventsPage />}
          {activePage === 'organizer' && <OrganizerDashboardPage />}
          {activePage === 'event-details' && (
            <EventDetailsPage eventId={selectedEventId || 'evt_genai_masterclass'} />
          )}
        </main>

        {/* Global Modals */}
        <GoalsModal />
        <ReviewModal />
        <EditProfileModal />
        <StudentVerificationModal />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <RelevanceScoreModal
          event={scoreModalEvent}
          onClose={() => setScoreModalEvent(null)}
        />

        {/* Save Session Feedback Toast */}
        {saveToast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-md bg-[#1C1311] text-[#FAF7F2] shadow-xl border border-[#581C2E]/60 text-xs font-semibold backdrop-blur-md"
          >
            <span className="p-1 rounded bg-[#581C2E] text-white">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </span>
            <span>{saveToast.message}</span>
            <button
              type="button"
              onClick={dismissSaveToast}
              className="ml-2 text-[#D5C9B8] hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Editorial Dark Coffee/Wine Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
