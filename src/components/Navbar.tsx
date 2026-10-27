import React, { useState } from 'react';
import { Terminal, Shield, Award, BookOpen, Wrench, PlusCircle, Menu, X, Bot, Sparkles, User } from 'lucide-react';
import { GoogleUser } from '../types/cyber';

interface NavbarProps {
  currentTab: 'rooms' | 'paths' | 'toolbelt' | 'custom' | 'profile';
  onSelectTab: (tab: 'rooms' | 'paths' | 'toolbelt' | 'custom' | 'profile') => void;
  isAttackBoxOpen: boolean;
  onToggleAttackBox: () => void;
  userXp: number;
  userLevel: number;
  googleUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
  onOpenAiAdvisor: () => void;
  onOpenBeginnerGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isAttackBoxOpen,
  onToggleAttackBox,
  userXp,
  userLevel,
  googleUser,
  onOpenGoogleAuth,
  onOpenAiAdvisor,
  onOpenBeginnerGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'rooms' | 'paths' | 'toolbelt' | 'custom' | 'profile') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('rooms')}
            className="flex items-center gap-2.5 text-left group"
            aria-label="RootForge Home"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans whitespace-nowrap">
              Root<span className="text-emerald-400">Forge</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('rooms')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'rooms'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Rooms & Labs
          </button>
          <button
            onClick={() => handleNavClick('paths')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'paths'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Learning Paths
          </button>
          <button
            onClick={() => handleNavClick('toolbelt')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'toolbelt'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Hacker Toolbelt
          </button>
          <button
            onClick={() => handleNavClick('custom')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'custom'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            CTF Creator
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'profile'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Profile (Lvl {userLevel})
          </button>
        </nav>

        {/* Zone 3: AI Advisor, Beginner Guide, Google Sign-in & AttackBox Launch */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Beginner Guide Button */}
          <button
            onClick={onOpenBeginnerGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors"
            title="Anfänger-Erklärung öffnen"
          >
            <span>🔰</span>
            <span className="hidden xs:inline">Anfänger-Guide</span>
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors"
            title="KI-Startberater öffnen"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>KI-Berater</span>
          </button>

          {/* Google Sign-In Button */}
          {googleUser ? (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-emerald-500/40 rounded-lg hover:bg-slate-850 transition-colors text-xs text-slate-200"
              title={`Eingeloggt als ${googleUser.email}`}
            >
              <img
                src={googleUser.avatarUrl}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden sm:inline font-medium max-w-[80px] truncate">
                {googleUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-lg transition-colors shadow-sm"
              aria-label="Mit Google anmelden"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden xs:inline">Google Login</span>
            </button>
          )}

          {/* XP Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-400 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-emerald-400 font-semibold">{userXp} XP</span>
          </div>

          {/* AttackBox Trigger */}
          <button
            onClick={onToggleAttackBox}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              isAttackBoxOpen
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-750 border border-emerald-500/30'
            }`}
            aria-label={isAttackBoxOpen ? 'Hide AttackBox' : 'Free AttackBox'}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAttackBoxOpen ? 'Hide Box' : 'AttackBox'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1.5 text-sm font-medium">
          <button
            onClick={() => handleNavClick('rooms')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              currentTab === 'rooms'
                ? 'bg-slate-900 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Rooms & Labs</span>
          </button>
          <button
            onClick={() => handleNavClick('paths')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              currentTab === 'paths'
                ? 'bg-slate-900 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Learning Paths</span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => handleNavClick('toolbelt')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              currentTab === 'toolbelt'
                ? 'bg-slate-900 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Hacker Toolbelt</span>
            <Wrench className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => handleNavClick('custom')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              currentTab === 'custom'
                ? 'bg-slate-900 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>CTF Creator</span>
            <PlusCircle className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              currentTab === 'profile'
                ? 'bg-slate-900 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Profile & Certs (Lvl {userLevel})</span>
            <span className="text-xs font-mono text-emerald-400">{userXp} XP</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBeginnerGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>🔰</span>
              <span>Anfänger-Guide & Begriffserklärung</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAiAdvisor();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>KI-Startberater</span>
              </button>
              <button
                onClick={() => {
                  onOpenGoogleAuth();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-white text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>{googleUser ? 'Google Konto' : 'Google Login'}</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
