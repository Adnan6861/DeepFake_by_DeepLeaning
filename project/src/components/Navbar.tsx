import React, { useState, useEffect, useRef } from 'react';
import { History, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenPlan?: () => void;
  onOpenHistory: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenHistory,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = ['hero', 'how-it-works', 'analyze', 'why-us', 'contact'];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const scrollPos = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <div
        className={`rounded-2xl border backdrop-blur-2xl px-4 sm:px-6 h-[4.5rem] flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'border-indigo-500/30 bg-slate-950/90 shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-500/20'
            : 'border-white/10 bg-slate-900/85 shadow-2xl shadow-black/60 ring-1 ring-white/5'
        }`}
      >
        
        {/* Brand / Logo */}
        <Logo
          size="md"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('hero');
          }}
        />

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-xs lg:text-sm font-medium text-slate-300">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'how-it-works', label: 'How it works' },
            { id: 'analyze', label: 'Analyze' },
            { id: 'why-us', label: 'Why us' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                  isActive
                    ? 'text-white bg-indigo-600/25 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                    : 'hover:text-white hover:bg-slate-800/70 border border-transparent text-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          
          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 pl-1.5 pr-3 py-1 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 bg-slate-800/90 hover:bg-slate-800 transition-all text-xs font-medium text-slate-200 cursor-pointer shadow-md"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden ring-2 ring-indigo-400/50 shadow-sm">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-semibold text-white leading-tight text-xs truncate max-w-[110px]">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{currentUser.role}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-3 py-2.5 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/50">
                  <div className="pb-2.5 border-b border-slate-800 mb-2.5">
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                    <p className="text-slate-400 truncate text-[11px]">{currentUser.email}</p>
                    <div className="mt-1.5 flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{currentUser.institution || 'Verified Investigator'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenHistory();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-600/20 text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer border border-transparent hover:border-indigo-500/30"
                    >
                      <span className="font-medium">Scan History (Database)</span>
                      <History className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/50 text-rose-300 flex items-center justify-between font-medium transition-colors cursor-pointer border border-transparent hover:border-rose-800/40"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/90 rounded-xl transition-all cursor-pointer border border-slate-700/60 hover:border-slate-600"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'how-it-works', label: 'How it works' },
              { id: 'analyze', label: 'Analyze' },
              { id: 'why-us', label: 'Why us' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-white font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
