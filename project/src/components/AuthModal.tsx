import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Database, AlertCircle, CheckCircle2, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
import { DatabaseService } from '../services/db';
import { User } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Researcher' | 'Supervisor' | 'Examiner'>('Researcher');
  const [institution, setInstitution] = useState('Media Forensics & AI Research Center');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with incoming initialMode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Form Validations
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter matching passwords.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await DatabaseService.loginUser(email, password);
        if (res.success && res.user) {
          setSuccessMsg(`Welcome back, ${res.user.name}!`);
          setTimeout(() => {
            onSuccess(res.user!);
            onClose();
          }, 450);
        } else {
          setError(res.error || 'Authentication failed. Please verify credentials.');
        }
      } else {
        const res = await DatabaseService.registerUser({
          name,
          email,
          password,
          role,
          institution,
        });
        if (res.success && res.user) {
          setSuccessMsg('Account registered successfully! Logging you in...');
          setTimeout(() => {
            onSuccess(res.user!);
            onClose();
          }, 450);
        } else {
          setError(res.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoRole: string) => {
    setError(null);
    setSuccessMsg(null);
    setEmail(demoEmail);
    setPassword('numl1234');
    setLoading(true);
    try {
      const res = await DatabaseService.loginUser(demoEmail, 'numl1234');
      if (res.success && res.user) {
        setSuccessMsg(`Logged in as ${res.user.name} (${demoRole})`);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 400);
      } else {
        setError(res.error || 'Demo login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-700/80 relative text-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Project Logo */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showText={false} showBadge={false} />
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to Deepfake Detective' : 'Create Investigator Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Access saved forensic video scans and execute neural inference models.'
              : 'Register your researcher profile in the PostgreSQL forensic database.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-4 text-xs font-semibold border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-semibold block">Authentication Notice:</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="investigator@forensics.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Researcher">Researcher</option>
                  <option value="Student">Student</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Examiner">Examiner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Affiliation</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center space-x-1.5 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {loading
                  ? 'Verifying Credentials...'
                  : mode === 'login'
                  ? 'Sign In to Deepfake Detective'
                  : 'Complete Registration'}
              </span>
            </button>
          </div>
        </form>

        {/* 1-Click Database Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>1-Click Verified Demo Accounts:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Instant Access</span>
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('adnannawazk080@gmail.com', 'Lead Engineer')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 text-slate-300 flex items-center justify-between text-[11px] transition-all group"
            >
              <div>
                <span className="font-semibold text-white block group-hover:text-indigo-300 transition-colors">Muhammad Adnan</span>
                <span className="text-[10px] text-slate-400 font-mono">adnannawazk080@gmail.com</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                Lead
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('kainat.zahra@forensics.ai', 'Supervisor')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 text-slate-300 flex items-center justify-between text-[11px] transition-all group"
            >
              <div>
                <span className="font-semibold text-white block group-hover:text-teal-300 transition-colors">Syeda Kainat Zahra</span>
                <span className="text-[10px] text-slate-400 font-mono">kainat.zahra@forensics.ai</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-950/70 text-teal-300 border border-teal-800/50">
                Supervisor
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hadia.noor@forensics.ai', 'Student')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 text-slate-300 flex items-center justify-between text-[11px] transition-all group"
            >
              <div>
                <span className="font-semibold text-white block group-hover:text-amber-300 transition-colors">Hadia Noor</span>
                <span className="text-[10px] text-slate-400 font-mono">hadia.noor@forensics.ai</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/70 text-amber-300 border border-amber-800/50">
                Researcher
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
