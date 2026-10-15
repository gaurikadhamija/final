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
  HelpCircle,
  Compass,
  Check,
  Clock,
  Award
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
        return;
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
        setError(err.message || 'Invalid email or password. Please verify your credentials or use the 1-click test button.');
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

  const prefillAccount = (type: 'alex' | 'rohit' | 'sarah' | 'dean') => {
    setError(null);
    setSuccessNotice(null);
    setAuthMode('login');

    if (type === 'alex') {
      setSelectedRole('student');
      setEmail('alex.chen@campus.edu');
      setPassword('Demo2026!');
    } else if (type === 'rohit') {
      setSelectedRole('student');
      setEmail('rohit.sharma@iiitd.ac.in');
      setPassword('Demo2026!');
    } else if (type === 'sarah') {
      setSelectedRole('organizer');
      setEmail('acm-lead@campus.edu');
      setPassword('Demo2026!');
    } else if (type === 'dean') {
      setSelectedRole('organizer');
      setEmail('studentlife-admin@campus.edu');
      setPassword('Demo2026!');
    }
  };

  return (
    <div className="auth-screen min-h-screen relative flex flex-col justify-between overflow-x-hidden text-[#241410] bg-[#F8F4EC] selection:bg-[#5B2435] selection:text-[#FFFDF8]">
      {/* Background ambient mesh and subtle wine glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[480px] bg-gradient-to-b from-[#5B2435]/10 via-[#B78A4A]/5 to-transparent pointer-events-none -z-10" />

      {/* Top Banner Navigation Header */}
      <header className="auth-header sticky top-0 z-40 w-full border-b border-[#E2D7C8] bg-[#FFFDF8]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
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

      {/* Main Container - with ample top padding to avoid clipping */}
      <main className="auth-main flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-10 sm:pb-16 flex flex-col justify-center">
        
        {/* Editorial Heading Section */}
        <div className="auth-intro text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="auth-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B2435]/10 border border-[#5B2435]/25 text-[#5B2435] text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B78A4A]" />
            <span>Discover Opportunities · Build Your Verified Future</span>
          </div>
          <h2 className="auth-title text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241410] tracking-tight leading-tight">
            Sign In to Campus Intelligence
          </h2>
          <p className="auth-description text-xs sm:text-sm text-[#4A3830] mt-3 leading-relaxed max-w-xl mx-auto font-normal">
            Select your role to access your personalized campus workspace. Students build verified co-curricular transcripts; organisers manage certified attendance and student identity audits.
          </p>
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
                    Personalized event relevance matching, verified attendance credits, verified skill portfolios, and 2–hour free time window schedule fit.
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
                    <span className="text-[10px] text-[#7A6860] font-mono">Quick sign-in:</span>
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
                    <span className="text-[10px] text-[#7A6860] font-mono">Quick sign-in:</span>
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

            {/* Evaluator Quick Pre-fills */}
            <div className="auth-test-accounts p-4 rounded-2xl bg-[#FFFDF8] border border-[#E2D7C8] shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A3830] block mb-2.5">
                Instant Test Personas & Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => prefillAccount('alex')}
                  className="p-2.5 rounded-xl bg-[#F8F4EC] hover:bg-[#EFE5D5] border border-[#D5C7B5] text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="font-bold text-[#241410] flex items-center justify-between">
                    <span>Alex Chen</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#194D33]" />
                  </div>
                  <div className="text-[10px] text-[#194D33] font-semibold mt-0.5">Student · Verified ✓</div>
                </button>
                <button
                  type="button"
                  onClick={() => prefillAccount('rohit')}
                  className="p-2.5 rounded-xl bg-[#F8F4EC] hover:bg-[#EFE5D5] border border-[#D5C7B5] text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="font-bold text-[#241410] flex items-center justify-between">
                    <span>Rohit Sharma</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A16]" />
                  </div>
                  <div className="text-[10px] text-[#8A5A16] font-semibold mt-0.5">Student · Pending ⏳</div>
                </button>
                <button
                  type="button"
                  onClick={() => prefillAccount('sarah')}
                  className="p-2.5 rounded-xl bg-[#F8F4EC] hover:bg-[#EFE5D5] border border-[#D5C7B5] text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="font-bold text-[#241410] flex items-center justify-between">
                    <span>Sarah Lin (ACM)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B2435]" />
                  </div>
                  <div className="text-[10px] text-[#5B2435] font-semibold mt-0.5">Organiser · Reviewer</div>
                </button>
                <button
                  type="button"
                  onClick={() => prefillAccount('dean')}
                  className="p-2.5 rounded-xl bg-[#F8F4EC] hover:bg-[#EFE5D5] border border-[#D5C7B5] text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="font-bold text-[#241410] flex items-center justify-between">
                    <span>Dean of Students</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#241410]" />
                  </div>
                  <div className="text-[10px] text-[#241410] font-semibold mt-0.5">Admin · Reviewer</div>
                </button>
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
