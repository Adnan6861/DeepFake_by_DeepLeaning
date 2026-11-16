import React, { useState } from 'react';
import { ArrowRight, Scan, Activity, Target, HardDrive, Flame, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onTryNow: () => void;
  onHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTryNow, onHowItWorks }) => {
  const [activeViewMode, setActiveViewMode] = useState<'bbox' | 'gradcam' | 'raw'>('bbox');

  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Ambient Cyber Light Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/20 blur-[130px] pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-teal-500/15 blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-900/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Brief & CTAs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Tag Badge */}
            <div className="animate-fade-up inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-indigo-950/60 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
              <span>Next-Gen Neural Forensics</span>
              <span className="text-indigo-400/60">•</span>
              <span className="text-teal-300 font-mono text-[11px] normal-case">YOLOv12 + EfficientNet</span>
            </div>

            {/* Main Headline */}
            <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Know what's real. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-teal-300 to-cyan-300 drop-shadow-sm">
                See why it's fake.
              </span>
            </h1>

            {/* Subtext Paragraph with enhanced legibility */}
            <p className="animate-fade-up-delay-2 text-base sm:text-lg text-slate-200/90 max-w-xl leading-relaxed font-normal">
              Our explainable deep learning pipeline pairs <span className="text-white font-semibold underline decoration-indigo-500/60 decoration-2 underline-offset-4">YOLOv12 multi-scale face localization</span> with an <span className="text-white font-semibold underline decoration-teal-500/60 decoration-2 underline-offset-4">EfficientNet-B0 Channel Attention</span> backbone, projecting pixel-level <span className="text-indigo-300 font-semibold bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-700/50">Grad-CAM heatmaps</span> directly onto video frames to expose subtle synthetic manipulation.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up-delay-2 flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onTryNow}
                className="btn-sheen group inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-1 ring-white/20"
              >
                <span>Try it now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onHowItWorks}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 hover:border-slate-500 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
              >
                <span>How it works</span>
              </button>
            </div>

            {/* Trust & Academic Validation Stat Strip - Enhanced as 3 Micro Cards */}
            <div className="animate-fade-up-delay-3 pt-6 grid grid-cols-3 gap-3 sm:gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-md hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-semibold mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-slate-300">Target Accuracy</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">≥80%</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Benchmark Validation</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-md hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-1.5 text-teal-400 text-xs font-semibold mb-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-slate-300">File Capacity</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100 MB</p>
                <p className="text-[10px] text-slate-400 mt-0.5">MP4 / MOV / WEBM</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-md hover:border-rose-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-semibold mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-slate-300">Explainable</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300 tracking-tight">Grad-CAM</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Visual Heatmaps</p>
              </div>
            </div>

          </div>

          {/* Right Column: Deepfake Scanner Graphic with Live Scan Animation */}
          <div className="lg:col-span-5 flex justify-center animate-fade-up-delay-2">
            <div className="animate-float-subtle w-full max-w-md bg-slate-900/90 rounded-2xl border border-white/15 shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10 backdrop-blur-xl hover:border-indigo-500/40 transition-colors duration-300">

              {/* Graphic Card Header */}
              <div className="px-4 py-3 bg-slate-950/90 text-white flex items-center justify-between text-xs border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Scan className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono font-medium tracking-wider text-slate-200 uppercase text-[11px]">Live Forensic Scan</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                    MODEL RUNNING
                  </span>
                </div>
              </div>

              {/* Visual Display Container */}
              <div className="relative aspect-4/3 bg-black overflow-hidden flex items-center justify-center group select-none">
                {/* Underneath Face Photo */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80"
                  alt="Deepfake Analysis Subject"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover filter contrast-[1.1] brightness-95 transition-transform duration-700 group-hover:scale-105"
                />

                {/* Simulated Grad-CAM Heatmap Overlay */}
                {activeViewMode === 'gradcam' && (
                  <>
                    <div className="absolute inset-0 pointer-events-none mix-blend-color-burn opacity-85 bg-radial from-red-600/80 via-amber-400/60 to-transparent" style={{ transform: 'translate(4%, 8%) scale(0.65)' }} />
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-75 bg-radial from-rose-500/90 via-yellow-400/50 to-transparent" style={{ transform: 'translate(4%, 8%) scale(0.65)' }} />
                  </>
                )}

                {/* YOLOv12 Bounding Box & Facial Landmark Overlay */}
                {(activeViewMode === 'bbox' || activeViewMode === 'gradcam') && (
                  <div className="absolute inset-x-[18%] inset-y-[12%] border-2 border-dashed border-emerald-400 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                    {/* Corner Reticles */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 shadow-[0_0_8px_#34d399]" />

                    {/* HUD Label */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/95 border border-emerald-400/60 text-[10px] font-mono text-emerald-300 font-bold tracking-wide shadow-md">
                      YOLOv12 FACE #1 • 99.4% CONF
                    </div>

                    {/* Artifact Hotspot Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center space-x-1.5 shadow-lg shadow-rose-900/60 ring-2 ring-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>SEAM ANOMALY DETECTED</span>
                    </div>
                  </div>
                )}

                {/* Moving Horizontal Laser Scan Line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_15px_#2dd4bf] animate-scan-line pointer-events-none" />

                {/* Telemetry HUD at Bottom */}
                <div className="absolute bottom-2.5 inset-x-3 bg-slate-950/95 backdrop-blur-md rounded-xl px-3 py-2 text-[10px] font-mono text-slate-200 flex items-center justify-between border border-white/10 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Grad-CAM: Layer4_Conv</span>
                  </div>
                  <span className="text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">Fake Prob: 87.2%</span>
                </div>
              </div>

              {/* Mode Toggle Controls */}
              <div className="p-3 bg-slate-950/95 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium text-[11px] flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Forensic Layer:</span>
                </span>
                <div className="inline-flex rounded-xl bg-slate-900 p-0.5 border border-slate-700/80 shadow-inner">
                  <button
                    onClick={() => setActiveViewMode('bbox')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${activeViewMode === 'bbox'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    YOLOv12 BBox
                  </button>
                  <button
                    onClick={() => setActiveViewMode('gradcam')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${activeViewMode === 'gradcam'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Grad-CAM
                  </button>
                  <button
                    onClick={() => setActiveViewMode('raw')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${activeViewMode === 'raw'
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Raw Frame
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
