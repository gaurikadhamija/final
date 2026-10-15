import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Edit3,
  User,
  ShieldCheck,
  Award,
  Building2,
  GraduationCap,
  Clock,
  Info
} from 'lucide-react';
import { useApp, NavigationPage } from '../context/AppContext.js';
import { UserRole } from '../types/index.js';

export const Navbar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    currentUserRole,
    setCurrentUserRole,
    compareEventIds,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsGoalsModalOpen,
    setIsEditProfileOpen,
    setIsVerificationModalOpen,
    currentUser,
    isAuthenticated,
    logout,
    setIsGuestPreview
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  const navLinks: { label: string; page: NavigationPage }[] = [
    { label: 'Discover', page: 'discover' },
    { label: '2-Hour Window', page: 'freetime' },
    { label: 'Compare', page: 'compare' },
    { label: 'Campus Map', page: 'heatmap' },
    { label: 'Portfolio', page: 'myevents' },
    { label: 'Organizer Desk', page: 'organizer' }
  ];

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'W';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DDD1] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigateTo('discover')}
              className="flex items-center gap-3 text-left group focus-visible:outline-none"
              aria-label="WorthWhile Home"
            >
              {!logoLoadError ? (
                <img
                  src="/worthwhile-icon.svg"
                  alt="WorthWhile"
                  onError={() => setLogoLoadError(true)}
                  className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-102"
                />
              ) : (
                <div className="h-9 w-9 shrink-0 rounded-md bg-[#581C2E] flex items-center justify-center text-[#FAF7F2] font-serif font-bold text-lg shadow-2xs">
                  W
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1311] leading-none group-hover:text-[#581C2E] transition-colors">
                  WorthWhile
                </span>
                <span className="text-[9px] font-mono tracking-wider uppercase text-[#735E55] mt-1 font-semibold hidden sm:block">
                  Campus Event Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide">
            {navLinks.map(link => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`relative py-1.5 transition-colors uppercase tracking-wider text-[11px] font-bold ${
                    isActive
                      ? 'text-[#581C2E]'
                      : 'text-[#5C4A42] hover:text-[#1C1311]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.page === 'compare' && compareEventIds.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#581C2E] text-white font-bold">
                      {compareEventIds.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#581C2E]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Quick Goals Trigger Button */}
            <button
              onClick={() => setIsGoalsModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-[#FFFFFF] hover:bg-[#F5EFE6] text-xs font-semibold text-[#1C1311] transition-colors whitespace-nowrap shadow-2xs"
              title="Calibrate semester priorities"
            >
              <Sliders className="w-3.5 h-3.5 text-[#581C2E]" />
              <span>Priorities</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#D5C9B8] bg-[#FFFFFF] hover:bg-[#F5EFE6] text-xs font-medium text-[#1C1311] transition-colors shadow-2xs"
                aria-expanded={roleMenuOpen}
              >
                <span className="text-[11px] font-semibold capitalize text-[#581C2E]">{currentUserRole}</span>
                <span className="text-[11px] text-[#735E55]">View</span>
                <ChevronDown className="w-3 h-3 text-[#735E55]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-[#FFFFFF] border border-[#D5C9B8] shadow-lg py-1 z-50">
                  {(['student', 'organizer'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentUserRole(role);
                        setRoleMenuOpen(false);
                        if (role === 'organizer') navigateTo('organizer');
                        else if (activePage === 'organizer') navigateTo('discover');
                      }}
                      className={`w-full px-3 py-2 text-left text-xs capitalize flex items-center justify-between ${
                        currentUserRole === role
                          ? 'bg-[#F5EFE6] font-bold text-[#581C2E]'
                          : 'text-[#1C1311] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {role === 'student' ? <GraduationCap className="w-3.5 h-3.5 text-[#581C2E]" /> : <Building2 className="w-3.5 h-3.5 text-[#581C2E]" />}
                        <span>{role} Perspective</span>
                      </span>
                      {currentUserRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#581C2E]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student Verification Button */}
            {isAuthenticated && currentUser?.role === 'student' && (
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors shadow-2xs ${
                  currentUser.student_verification_status === 'verified'
                    ? 'border-[#1F5C3E]/30 bg-[#1F5C3E]/8 text-[#1F5C3E] hover:bg-[#1F5C3E]/15'
                    : currentUser.student_verification_status === 'pending'
                    ? 'border-[#8C6834]/30 bg-[#8C6834]/8 text-[#8C6834] hover:bg-[#8C6834]/15'
                    : currentUser.student_verification_status === 'info_requested'
                    ? 'border-[#B45309]/30 bg-[#B45309]/8 text-[#B45309] hover:bg-[#B45309]/15'
                    : 'border-[#581C2E]/30 bg-[#581C2E]/8 text-[#581C2E] hover:bg-[#581C2E]/15'
                }`}
                title="Student Verification Status"
              >
                {currentUser.student_verification_status === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5C3E]" />
                    <span className="text-[11px]">Verified Student</span>
                  </>
                ) : currentUser.student_verification_status === 'pending' ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-[#8C6834]" />
                    <span className="text-[11px]">Pending Review</span>
                  </>
                ) : currentUser.student_verification_status === 'info_requested' ? (
                  <>
                    <Info className="w-3.5 h-3.5 text-[#B45309]" />
                    <span className="text-[11px]">Action Required</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#581C2E]" />
                    <span className="text-[11px]">Verify ID</span>
                  </>
                )}
              </button>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-md text-[#5C4A42] hover:text-[#1C1311] hover:bg-[#F2ECE1] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#581C2E]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-[#FFFFFF] border border-[#D5C9B8] shadow-xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1311]">
                        Campus Alerts
                      </h4>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[10px] bg-[#581C2E] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-[#581C2E] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#735E55] py-4 text-center">
                        No notifications right now.
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.event_id) {
                              navigateTo('event-details', n.event_id);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-2.5 rounded-md border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'border-transparent bg-[#FAF7F2] text-[#5C4A42]'
                              : 'border-[#581C2E]/20 bg-[#FBF9F6] text-[#1C1311]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-[#1C1311]">
                              {n.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C4A42] mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Menu or Guest Sign In */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F2ECE1] transition-colors"
                  aria-label="User Account"
                >
                  <div className="w-8 h-8 rounded-md bg-[#581C2E] text-[#FAF7F2] flex items-center justify-center font-serif text-xs font-bold shadow-2xs">
                    {initials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#1C1311] leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[9.5px] font-mono text-[#735E55] uppercase tracking-wider capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#735E55] hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#FFFFFF] border border-[#D5C9B8] shadow-xl p-2 z-50 text-xs">
                    <div className="px-3 py-2.5 border-b border-[#E5DDD1] mb-1">
                      <p className="font-semibold text-[#1C1311]">{currentUser.name}</p>
                      <p className="text-[10px] text-[#735E55] font-mono truncate">{currentUser.email}</p>
                      <span className="mt-1.5 inline-block text-[9.5px] font-mono font-semibold uppercase tracking-wider text-[#1F5C3E] bg-[#1F5C3E]/8 px-2 py-0.5 rounded">
                        Active {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateTo('myevents');
                      }}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-[#FAF7F2] flex items-center gap-2 text-[#1C1311]"
                    >
                      <Award className="w-3.5 h-3.5 text-[#581C2E]" />
                      <span>Portfolio & Transcript</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsEditProfileOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-[#FAF7F2] flex items-center gap-2 text-[#1C1311]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#581C2E]" />
                      <span>Edit Student Profile</span>
                    </button>

                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setIsVerificationModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left rounded-md hover:bg-[#FAF7F2] flex items-center justify-between text-[#1C1311]"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#581C2E]" />
                          <span>Student ID Verification</span>
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#735E55]">
                          {currentUser.student_verification_status || 'Unverified'}
                        </span>
                      </button>
                    )}

                    {currentUser.role === 'organizer' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigateTo('organizer');
                        }}
                        className="w-full px-3 py-2 text-left rounded-md hover:bg-[#FAF7F2] flex items-center gap-2 text-[#581C2E] font-semibold"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#581C2E]" />
                        <span>Organizer Desk</span>
                      </button>
                    )}

                    <div className="pt-1 mt-1 border-t border-[#E5DDD1]">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-left rounded-md hover:bg-[#581C2E]/8 flex items-center gap-2 text-[#581C2E] font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsGuestPreview(false)}
                className="px-4 py-1.5 rounded-md bg-[#581C2E] text-[#FAF7F2] hover:bg-[#431422] text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#1C1311] hover:bg-[#F2ECE1]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DDD1] bg-[#FAF7F2] px-4 py-4 space-y-1.5 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => {
                navigateTo(link.page);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                activePage === link.page
                  ? 'bg-[#581C2E] text-[#FAF7F2]'
                  : 'text-[#1C1311] hover:bg-[#F2ECE1]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E5DDD1] flex flex-col gap-2">
            <button
              onClick={() => {
                setIsGoalsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-bold rounded-md bg-[#581C2E] text-[#FAF7F2]"
            >
              Semester Priorities
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold rounded-md border border-[#D5C9B8] text-[#581C2E]"
              >
                Sign Out ({currentUser?.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsGuestPreview(false);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold rounded-md bg-[#581C2E] text-[#FAF7F2]"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
