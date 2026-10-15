import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Compass,
  Check,
  ChevronRight,
  Zap,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';

const DELHI_REGIONS = [
  'South Delhi (IIT Delhi / IIIT Delhi / JNU)',
  'North Delhi (Delhi University North Campus)',
  'West Delhi (NSUT Dwarka)',
  'North West Delhi (DTU Rohini)',
  'Central Delhi (Connaught Place / IHC Lodhi)',
  'Gurugram NCR (Cyber City)',
  'Noida NCR (Sector 62 Institutional)'
];

interface QuickPersona {
  id: 'alex' | 'rohit' | 'sarah' | 'dean';
  name: string;
  roleTitle: string;
  role: 'student' | 'organizer';
  email: string;
  password: string;
  campus: string;
  badge: string;
  badgeColor: string;
  avatarBg: string;
  avatarText: string;
  quote: string;
  scatterOffsetDesktop: string;
  tilt: string;
}

const QUICK_PERSONAS: QuickPersona[] = [
  {
    id: 'alex',
    name: 'Alex Chen',
    roleTitle: 'Senior CS Student',
    role: 'student',
    email: 'alex.chen@campus.edu',
    password: 'Demo2026!',
    campus: 'IIIT Delhi / South Campus',
    badge: 'Verified Student · Tier 1',
    badgeColor: 'text-[#194D33] bg-[#194D33]/10 border-[#194D33]/20',
    avatarBg: 'bg-[#194D33]',
    avatarText: 'AC',
    quote: 'Targeting 2-hr free gaps for tech masterclasses & AI hackathons',
    scatterOffsetDesktop: 'lg:-rotate-1 lg:translate-x-1',
    tilt: 'hover:rotate-0 hover:-translate-y-1.5'
  },
  {
    id: 'rohit',
    name: 'Rohit Sharma',
    roleTitle: '2nd Year Engineering',
    role: 'student',
    email: 'rohit.sharma@iiitd.ac.in',
    password: 'Demo2026!',
    campus: 'DTU Rohini / North Campus',
    badge: 'Audit Pending · Fast Review',
    badgeColor: 'text-[#8A5A16] bg-[#8A5A16]/10 border-[#8A5A16]/20',
    avatarBg: 'bg-[#8A5A16]',
    avatarText: 'RS',
    quote: 'Exploring robotics workshops & seeking verifiable attendance credit',
    scatterOffsetDesktop: 'lg:rotate-1 lg:-translate-x-1',
    tilt: 'hover:rotate-0 hover:-translate-y-1.5'
  },
  {
    id: 'sarah',
    name: 'Sarah Lin',
    roleTitle: 'ACM Chapter President',
    role: 'organizer',
    email: 'acm-lead@campus.edu',
    password: 'Demo2026!',
    campus: 'South Delhi Collegiate Hub',
    badge: 'Certified Organiser Desk',
    badgeColor: 'text-[#5B2435] bg-[#5B2435]/10 border-[#5B2435]/20',
    avatarBg: 'bg-[#5B2435]',
    avatarText: 'SL',
    quote: 'Auditing 140+ attendee verify claims with 96% speaker confidence',
    scatterOffsetDesktop: 'lg:rotate-1.5 lg:translate-x-1.5',
    tilt: 'hover:rotate-0 hover:-translate-y-1.5'
  },
  {
    id: 'dean',
    name: 'Student Affairs Dean',
    roleTitle: 'Campus Oversight Lead',
    role: 'organizer',
    email: 'studentlife-admin@campus.edu',
    password: 'Demo2026!',
    campus: 'University Council NCR',
    badge: 'Faculty Oversight Authority',
    badgeColor: 'text-[#241410] bg-[#241410]/10 border-[#241410]/20',
    avatarBg: 'bg-[#241410]',
    avatarText: 'DS',
    quote: 'Reviewing cross-campus event accreditation & organizer integrity',
    scatterOffsetDesktop: 'lg:-rotate-1.5 lg:-translate-x-1',
    tilt: 'hover:rotate-0 hover:-translate-y-1.5'
  }
];

export const AuthScreen: React.FC = () => {
  const { login, signup, demoLogin, setIsGuestPreview } = useApp();

  // Selected role for the auth flow
  const [selectedRole, setSelectedRole] = useState<'student' | 'organizer'>('student');

  // Auth mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [delhiRegion, setDelhiRegion] = useState(DELHI_REGIONS[0]);

  // Selected persona state for animated glow highlight
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    // Validation
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid college or institutional email address.');
      return;
    }

    if (authMode === 'forgot') {
      setLoading(true);
      try {
        await api.forgotPassword(email.trim());
        setSuccessNotice('If an account is associated with this email, password reset instructions have been generated.');
      } catch (err: any) {
        setError(err.message || 'Could not process password reset request.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
      }
      if (selectedRole === 'organizer' && !organizationName.trim()) {
        setError('Please provide your club, society, or department name.');
        return;
      }

      setLoading(true);
      try {
        await signup({
          email: email.trim(),
          password,
          name: name.trim(),
          role: selectedRole,
          delhi_region: delhiRegion,
          organization_name: selectedRole === 'organizer' ? organizationName.trim() : undefined
        });
      } catch (err: any) {
        setError(err.message || 'Account registration failed. Please verify your details.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      setLoading(true);
      try {
        await login(email.trim(), password);
      } catch (err: any) {
        setError(err.message || 'Invalid email or password. Please verify your credentials or select a test persona card.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoSignIn = async (role: 'student' | 'organizer') => {
    setError(null);
    setSuccessNotice(null);
    setDemoLoading(role);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || `Could not sign in with demo ${role} account.`);
    } finally {
      setDemoLoading(null);
    }
  };

  const applyPersona = (persona: QuickPersona, instantLogin = false) => {
    setError(null);
    setSuccessNotice(null);
    setAuthMode('login');
    setActivePersonaId(persona.id);
    setSelectedRole(persona.role);
    setEmail(persona.email);
    setPassword(persona.password);

    if (instantLogin) {
      setDemoLoading(persona.id);
      login(persona.email, persona.password)
        .catch(() => demoLogin(persona.role))
        .catch((err: any) => setError(err.message || `Could not log in as ${persona.name}`))
        .finally(() => setDemoLoading(null));
    }
  };

  return (
    <div className="auth-screen min-h-screen relative flex flex-col justify-between overflow-x-hidden text-[#241410] bg-[#F8F4EC] selection:bg-[#5B2435] selection:text-[#FFFDF8]">
      {/* Dynamic ambient layered gradients & warm glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[560px] bg-gradient-to-b from-[#5B2435]/12 via-[#B78A4A]/8 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-24 left-10 w-72 h-72 rounded-full bg-[#B78A4A]/8 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-36 right-10 w-96 h-96 rounded-full bg-[#5B2435]/8 blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Navigation Header */}
      <header className="auth-header sticky top-0 z-40 w-full border-b border-[#E2D7C8] bg-[#FFFDF8]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="/worthwhile-icon.svg"
            alt="WorthWhile"
            className="w-9 h-9 object-contain shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#241410] leading-none">
                WorthWhile
              </h1>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#5B2435]/10 text-[#5B2435] hidden sm:inline-block">
                Campus Intelligence
              </span>
            </div>
            <p className="text-[10px] font-sans font-semibold text-[#665249] mt-0.5 hidden xs:block">
              Delhi NCR Higher Education Opportunity & Credential Audit Network
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsGuestPreview(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] hover:bg-[#F8F4EC] text-xs font-semibold text-[#4A3830] transition-colors shadow-xs cursor-pointer"
          title="Browse events without logging in"
        >
          <Compass className="w-3.5 h-3.5 text-[#5B2435]" />
          <span>Explore as Guest</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="auth-main flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-14 sm:pt-8 sm:pb-20 flex flex-col justify-center">
        
        {/* Editorial Heading Section */}
        <div className="auth-intro text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="auth-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B2435]/10 border border-[#5B2435]/25 text-[#5B2435] text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B78A4A]" />
            <span>Discover Opportunities · Build Your Verified Future</span>
          </div>
          <h2 className="auth-title text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241410] tracking-tight leading-tight">
            Sign In to Campus Intelligence
          </h2>
          <p className="auth-description text-xs sm:text-sm text-[#4A3830] mt-3 leading-relaxed max-w-2xl mx-auto font-normal">
            Choose a quick demo persona card below to pre-fill or sign in immediately, or switch roles to enter your campus credentials.
          </p>
        </div>

        {/* SCATTERED PERSONA SHOWCASE: 4 Distinct Organic Floating Persona Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B2435]" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#5B2435]">
                Instant Test Personas & Access Cards
              </span>
            </div>
            <span className="text-[11px] text-[#7A6860] font-sans">
              Click any card to load credentials, or click <strong>1-Click Login</strong>
            </span>
          </div>

          {/* Scattered 4-card interactive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {QUICK_PERSONAS.map((persona, index) => {
              const isSelected = activePersonaId === persona.id || (authMode === 'login' && email === persona.email);
              return (
                <div
                  key={persona.id}
                  onClick={() => applyPersona(persona, false)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group text-left ${persona.scatterOffsetDesktop} ${persona.tilt} ${
                    isSelected
                      ? 'bg-[#FFFDF8] border-[#5B2435] shadow-xl ring-2 ring-[#5B2435]/30 -translate-y-1'
                      : 'bg-[#FFFDF8]/90 hover:bg-[#FFFDF8] border-[#E2D7C8] hover:border-[#B78A4A] shadow-sm hover:shadow-lg'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${persona.name} persona card`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      applyPersona(persona, false);
                    }
                  }}
                >
                  {/* Subtle Corner Accent Stamp */}
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-[#8C7A70] uppercase tracking-wider">
                    0{index + 1}
                  </div>

                  <div>
                    {/* Header Row: Avatar & Badges */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl ${persona.avatarBg} text-[#FFFDF8] flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                        {persona.avatarText}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif text-base font-bold text-[#241410] truncate group-hover:text-[#5B2435] transition-colors">
                            {persona.name}
                          </h3>
                        </div>
                        <p className="text-[11px] font-medium text-[#7A6860] truncate">
                          {persona.roleTitle}
                        </p>
                      </div>
                    </div>

                    {/* Role & Verification Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span className="truncate">{persona.badge}</span>
                      </span>
                    </div>

                    {/* Campus Location */}
                    <p className="text-[11px] text-[#4A3830] font-medium flex items-center gap-1 mb-2.5">
                      <Compass className="w-3 h-3 text-[#B78A4A] shrink-0" />
                      <span className="truncate">{persona.campus}</span>
                    </p>

                    {/* Narrative Persona Quote */}
                    <p className="text-xs text-[#5A453D] leading-relaxed italic bg-[#F8F4EC]/80 p-2.5 rounded-xl border border-[#E2D7C8]/70 mb-4">
                      "{persona.quote}"
                    </p>
                  </div>

                  {/* Card Footer Actions: Pre-fill vs Instant 1-Click Launch */}
                  <div className="pt-3 border-t border-[#E2D7C8] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] text-[#7A6860] font-mono">
                      <span className="truncate">pwd: {persona.password}</span>
                      {isSelected && (
                        <span className="text-[#5B2435] font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={demoLoading !== null}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyPersona(persona, true);
                      }}
                      className="w-full py-2 px-2.5 rounded-xl bg-[#5B2435]/10 hover:bg-[#5B2435] text-[#5B2435] hover:text-[#FFFDF8] text-[11px] font-bold tracking-wide transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title={`Instant 1-click sign in as ${persona.name}`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#B78A4A] group-hover:text-[#FFFDF8]" />
                      <span>{demoLoading === persona.id ? 'Launching...' : '1-Click Login'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Selection & Authentication Cards Grid */}
        <div className="auth-layout grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Role Switcher & Explanations (5 cols) */}
          <div className="auth-role-panel lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#5B2435] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#5B2435] text-[#FFFDF8] inline-flex items-center justify-center text-[10px]">1</span>
                <span>Select Your Role</span>
              </span>
              <span className="text-[10px] text-[#7A6860] font-mono">Click card to switch</span>
            </div>

            {/* Student Role Card */}
            <div
              onClick={() => {
                setSelectedRole('student');
                setError(null);
              }}
              className={`role-card auth-role-card relative p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'border-[#5B2435] bg-[#FFFDF8] shadow-md ring-2 ring-[#5B2435]/25'
                  : 'border-[#E2D7C8] bg-[#FFFDF8]/75 hover:bg-[#FFFDF8] hover:border-[#D5C7B5] shadow-xs'
              }`}
              role="group"
              tabIndex={0}
              aria-label={selectedRole === 'student' ? 'Student portal, selected. Press Enter to select.' : 'Student portal. Press Enter to select.'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole('student');
                  setError(null);
                }
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl shrink-0 transition-colors shadow-2xs ${
                  selectedRole === 'student'
                    ? 'bg-[#5B2435] text-[#FFFDF8]'
                    : 'bg-[#F8F4EC] text-[#5B2435]'
                }`}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#241410]">
                      Student Portal
                    </h3>
                    {selectedRole === 'student' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B2435] bg-[#5B2435]/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-[#5B2435]" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A453D] mt-1 leading-relaxed">
                    Personalized event relevance matching, verified attendance credits, skill portfolios, and 2–hour free time window schedule fit.
                  </p>
                  
                  {/* Feature chips */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      AI Fit Score
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      Verified Credits
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      Schedule Fit
                    </span>
                  </div>

                  {/* Quick 1-click test button for evaluator */}
                  <div className="mt-3.5 pt-3 border-t border-[#E2D7C8] flex items-center justify-between">
                    <span className="text-[10px] text-[#7A6860] font-mono">Quick test:</span>
                    <button
                      type="button"
                      disabled={demoLoading !== null}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoSignIn('student');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#5B2435]/10 hover:bg-[#5B2435] hover:text-[#FFFDF8] text-[#5B2435] text-[11px] font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                      title="Instant sign-in as Alex Chen (Student)"
                    >
                      <Sparkles className="w-3 h-3 text-[#B78A4A]" />
                      <span>{demoLoading === 'student' ? 'Signing in...' : '1-Click Student Demo'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Organiser Role Card */}
            <div
              onClick={() => {
                setSelectedRole('organizer');
                setError(null);
              }}
              className={`role-card auth-role-card relative p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedRole === 'organizer'
                  ? 'border-[#5B2435] bg-[#FFFDF8] shadow-md ring-2 ring-[#5B2435]/25'
                  : 'border-[#E2D7C8] bg-[#FFFDF8]/75 hover:bg-[#FFFDF8] hover:border-[#D5C7B5] shadow-xs'
              }`}
              role="group"
              tabIndex={0}
              aria-label={selectedRole === 'organizer' ? 'Organiser portal, selected. Press Enter to select.' : 'Organiser portal. Press Enter to select.'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole('organizer');
                  setError(null);
                }
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl shrink-0 transition-colors shadow-2xs ${
                  selectedRole === 'organizer'
                    ? 'bg-[#5B2435] text-[#FFFDF8]'
                    : 'bg-[#F8F4EC] text-[#5B2435]'
                }`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#241410]">
                      Organiser Portal
                    </h3>
                    {selectedRole === 'organizer' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B2435] bg-[#5B2435]/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-[#5B2435]" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A453D] mt-1 leading-relaxed">
                    Publish campus sessions, manage attendee check-in desks, verify certificates, audit student enrollment, and view verified turnout metrics.
                  </p>

                  {/* Feature chips */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      Attendance Desk
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      Credential Audit
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F8F4EC] text-[10px] font-mono font-semibold text-[#4A3830]">
                      Trust Score
                    </span>
                  </div>

                  {/* Quick 1-click test button for evaluator */}
                  <div className="mt-3.5 pt-3 border-t border-[#E2D7C8] flex items-center justify-between">
                    <span className="text-[10px] text-[#7A6860] font-mono">Quick test:</span>
                    <button
                      type="button"
                      disabled={demoLoading !== null}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoSignIn('organizer');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#5B2435]/10 hover:bg-[#5B2435] hover:text-[#FFFDF8] text-[#5B2435] text-[11px] font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                      title="Instant sign-in as Sarah Lin (ACM President)"
                    >
                      <Sparkles className="w-3 h-3 text-[#B78A4A]" />
                      <span>{demoLoading === 'organizer' ? 'Signing in...' : '1-Click Organiser Demo'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="auth-security p-3.5 rounded-xl bg-[#F8F4EC] border border-[#E2D7C8] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#194D33] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#4A3830] leading-relaxed">
                <strong className="text-[#241410]">Role-Enforced Security:</strong> Permissions are cryptographically verified by server session tokens. Organisers audit credentials and grant authentication allowance directly through the reviewer desk.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Authentication Form Card (7 cols) */}
          <div className="auth-form-panel lg:col-span-7">
            <div className="auth-form-card bg-[#FFFDF8] rounded-2xl border border-[#D5C7B5] shadow-lg p-6 sm:p-8">
              
              {/* Form Mode Tabs & Active Portal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D7C8] pb-4 mb-6">
                {/* Segmented Pill Control */}
                <div className="auth-mode-tabs inline-flex p-1 rounded-xl bg-[#F4EBDD] border border-[#E2D7C8] self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#5B2435] text-[#FFFDF8] shadow-xs'
                        : 'text-[#4A3830] hover:text-[#241410]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-[#5B2435] text-[#FFFDF8] shadow-xs'
                        : 'text-[#4A3830] hover:text-[#241410]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Portal Indicator Badge */}
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#5B2435] bg-[#5B2435]/10 px-3 py-1 rounded-full self-start sm:self-auto border border-[#5B2435]/20">
                  {selectedRole === 'student' ? (
                    <>
                      <GraduationCap className="w-3.5 h-3.5 text-[#5B2435]" />
                      <span>Student Portal</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-[#5B2435]" />
                      <span>Organiser Portal</span>
                    </>
                  )}
                </span>
              </div>

              {/* Status & Error Alerts */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#5B2435]/10 border border-[#5B2435]/30 text-xs text-[#5B2435] flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-medium">{error}</div>
                </div>
              )}

              {successNotice && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#194D33]/10 border border-[#194D33]/30 text-xs text-[#194D33] flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-medium">{successNotice}</div>
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name (Sign Up only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6860]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={selectedRole === 'student' ? 'e.g. Alex Chen' : 'e.g. Sarah Lin'}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium placeholder:text-[#8C7A70] focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Organization / Chapter Name (Organiser Sign Up only) */}
                {authMode === 'signup' && selectedRole === 'organizer' && (
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820] mb-1.5">
                      Organization / Society Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6860]" />
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. ACM Student Chapter / Robotics Club"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium placeholder:text-[#8C7A70] focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820] mb-1.5">
                    {selectedRole === 'student' ? 'College / Campus Email *' : 'Official / Organization Email *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6860]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'student@campus.edu or iiitd.ac.in' : 'lead@society.campus.edu'}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium placeholder:text-[#8C7A70] focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                    />
                  </div>
                </div>

                {/* Campus Region (Sign Up only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820] mb-1.5">
                      Primary Campus / Delhi NCR Zone
                    </label>
                    <select
                      value={delhiRegion}
                      onChange={(e) => setDelhiRegion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                    >
                      {DELHI_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Password field (Login & Sign Up) */}
                {authMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820]">
                        Password *
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot');
                            setError(null);
                          }}
                          className="text-[11px] text-[#5B2435] hover:underline font-semibold cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6860]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium placeholder:text-[#8C7A70] focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#7A6860] hover:text-[#241410] cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (Sign Up only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#3D2820] mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#7A6860]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FFFDF8] text-xs text-[#241410] font-medium placeholder:text-[#8C7A70] focus:outline-none focus:border-[#5B2435] focus:ring-2 focus:ring-[#5B2435]/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Forgot Password note */}
                {authMode === 'forgot' && (
                  <p className="text-xs text-[#5A453D] leading-relaxed p-3 rounded-xl bg-[#F8F4EC] border border-[#E2D7C8]">
                    Enter the collegiate email registered with your account. We will dispatch a password recovery link.
                  </p>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-3.5 px-4 rounded-xl bg-[#5B2435] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider hover:bg-[#3F1723] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : authMode === 'login' ? (
                      <>
                        <span>Sign In as {selectedRole === 'student' ? 'Student' : 'Organiser'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : authMode === 'signup' ? (
                      <>
                        <span>Create {selectedRole === 'student' ? 'Student' : 'Organiser'} Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Back to sign in link if in forgot mode */}
                {authMode === 'forgot' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className="text-xs text-[#5B2435] hover:underline font-semibold cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding Note */}
      <footer className="auth-footer w-full border-t border-[#E2D7C8] py-4 px-4 text-center text-xs text-[#7A6860] bg-[#FFFDF8]/70">
        <span>WorthWhile — Delhi NCR Campus Opportunity & Event Intelligence Platform</span>
        <span className="mx-2">·</span>
        <button
          onClick={() => setIsGuestPreview(true)}
          className="text-[#5B2435] hover:underline font-semibold cursor-pointer"
        >
          Explore Campus as Guest
        </button>
      </footer>
    </div>
  );
};
