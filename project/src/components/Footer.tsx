import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenPlan: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPlan }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 py-14 border-t border-white/10 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo, Links, Social Circles */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          
          {/* Logo & Brand */}
          <Logo size="sm" showBadge={false} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'how-it-works', label: 'How it works' },
              { id: 'analyze', label: 'Analyze' },
              { id: 'why-us', label: 'Why us' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="hover:text-teal-300 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social & Action Circles */}
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-400 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-400 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:adnannawazk080@gmail.com"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-400 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
              title="Email Project Lead"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={onOpenPlan}
              className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-500/50 hover:bg-indigo-900 text-indigo-300 hover:text-white flex items-center space-x-1.5 transition-all text-xs font-semibold cursor-pointer shadow-md"
              title="Milestone Plan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Milestone Plan</span>
            </button>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p className="text-center sm:text-left flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>&copy; 2026 Deepfake Detective | Built for Explainable AI Media Forensics</span>
          </p>
          <p className="text-center sm:text-right font-mono text-[11px] text-slate-400">
            National University of Modern Languages (NUML)
          </p>
        </div>

      </div>
    </footer>
  );
};
