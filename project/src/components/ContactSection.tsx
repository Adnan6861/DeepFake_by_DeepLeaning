import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Building, MessageSquare, UserCheck } from 'lucide-react';
import { DatabaseService } from '../services/db';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      await DatabaseService.saveContactMessage({ name, email, message });
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmittedSuccess(false), 6000);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-slate-900/50 border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[300px] bg-teal-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>Research & Milestone Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Project Team
          </h2>
          <p className="mt-2.5 text-base text-slate-300 max-w-lg mx-auto">
            Submit evaluation comments, test feedback, or research inquiries directly to the project authors.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
          
          {submittedSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-center space-x-3 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Thank you! Your feedback has been recorded into the system database and forwarded to <strong>adnannawazk080@gmail.com</strong>.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wide">
                  Your Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Examiner / External Reviewer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs sm:text-sm bg-slate-950/90 text-white placeholder-slate-500 shadow-inner transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wide">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@numl.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs sm:text-sm bg-slate-950/90 text-white placeholder-slate-500 shadow-inner transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wide">
                Evaluation Notes / Inquiry <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your evaluation notes, model comments, or research inquiries regarding the deepfake detection system..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs sm:text-sm bg-slate-950/90 text-white placeholder-slate-500 shadow-inner resize-none transition-all"
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-64 px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-teal-900/40 transition-all flex items-center justify-center space-x-2 mx-auto active:scale-98 cursor-pointer ring-1 ring-white/20"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </div>
          </form>

          {/* Direct Author & Department Details */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-start space-x-3">
              <Building className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Faculty of Engineering & CS</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Department of Software Engineering • Media Forensics & AI Research Lab
                </p>
                <p className="text-teal-400 font-mono text-[10px] mt-1 font-semibold">National University of Modern Languages</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-start space-x-3">
              <UserCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Authors & Supervision</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Lead: <a href="mailto:adnannawazk080@gmail.com" className="text-indigo-300 hover:underline font-semibold">adnannawazk080@gmail.com</a>
                </p>
                <p className="text-slate-300 text-[11px]">
                  Supervisor: <strong className="text-white">Syeda Kainat Zahra</strong>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
