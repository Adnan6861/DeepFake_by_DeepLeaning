import React, { useState } from 'react';
import { UploadCloud, Film, ScanFace, Cpu, BarChart3, ChevronRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface StepDetail {
  number: number;
  title: string;
  sublabel: string;
  shortDesc: string;
  icon: React.ReactNode;
  technicalDetails: {
    technology: string;
    description: string;
    keyMetric: string;
    advantage: string;
  };
}

export const ModelWorkflowSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(3); // Default to YOLOv12 face detect

  const steps: StepDetail[] = [
    {
      number: 1,
      title: 'Upload video',
      sublabel: 'Ingestion Layer',
      shortDesc: 'Accepts high-definition video in MP4, MOV, AVI, or WEBM format up to 100 MB.',
      icon: <UploadCloud className="w-5 h-5" />,
      technicalDetails: {
        technology: 'HTML5 Video API + Client Stream Chunker',
        description: 'Validates container integrity, codecs, frame rate, and prepares video stream for high-efficiency decomposition without server timeouts.',
        keyMetric: 'Max 100 MB / 4K Support',
        advantage: 'Zero-install direct browser pipeline',
      },
    },
    {
      number: 2,
      title: 'Extract frames',
      sublabel: 'Temporal Decomposition',
      shortDesc: 'Decomposes video sequence into uniform temporal image frames at 2 to 5 FPS.',
      icon: <Film className="w-5 h-5" />,
      technicalDetails: {
        technology: 'OpenCV / WebGL Canvas Sampler',
        description: 'Reduces temporal redundancy while capturing key intra-frame synthesis anomalies like blinking skips, eyelid warping, and boundary jitter.',
        keyMetric: '2-5 Uniform FPS Sampling',
        advantage: 'High throughput temporal extraction',
      },
    },
    {
      number: 3,
      title: 'YOLOv12 face detect',
      sublabel: 'Facial Localization',
      shortDesc: 'Locates multi-scale facial bounding boxes and extracts aligned 68-point landmarks.',
      icon: <ScanFace className="w-5 h-5" />,
      technicalDetails: {
        technology: 'YOLOv12 Face / MTCNN Dual Pipeline',
        description: 'Crops and normalizes detected faces with margin padding to preserve critical blending seams along jaw, temples, and hairline.',
        keyMetric: '99.4% Face Recall',
        advantage: 'Sub-millisecond multi-face tracking',
      },
    },
    {
      number: 4,
      title: 'EfficientNet + attention',
      sublabel: 'Feature Extraction',
      shortDesc: 'Convolutional backbone extracts spatial patterns enhanced by a Channel Attention Module.',
      icon: <Cpu className="w-5 h-5" />,
      technicalDetails: {
        technology: 'EfficientNet-B0 + Channel Attention (CAM)',
        description: 'Weighted feature refinement amplifies biologically meaningful regions (eyes, mouth, skin texture) while suppressing background noise.',
        keyMetric: '19.3M Optimized Parameters',
        advantage: 'State-of-the-art spatial precision',
      },
    },
    {
      number: 5,
      title: 'Grad-CAM + score',
      sublabel: 'Explainability & Verdict',
      shortDesc: 'Generates gradient heatmaps over facial crops and outputs calibrated real/fake confidence.',
      icon: <BarChart3 className="w-5 h-5" />,
      technicalDetails: {
        technology: 'Grad-CAM Heatmap + Sigmoid Head',
        description: 'Computes gradients of the target class score with respect to feature activation maps, highlighting exact manipulated pixels for full audibility.',
        keyMetric: '≥80% Target Accuracy',
        advantage: 'Audit-ready visual explanation',
      },
    },
  ];

  const currentDetail = steps[selectedStep - 1];

  return (
    <section id="how-it-works" className="py-20 relative bg-slate-900/40 border-y border-white/10 overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-indigo-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Detection Pipeline Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How the model works
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            A 5-phase forensic pipeline combining state-of-the-art computer vision with interpretable attention heatmaps.
          </p>
        </div>

        {/* 5-Step Pipeline Flow Diagram */}
        <div className="relative">

          {/* Desktop Connecting Line with glowing gradient */}
          <div className="hidden lg:block absolute top-7 left-16 right-16 h-1 bg-gradient-to-r from-indigo-500/30 via-teal-400/50 to-indigo-500/30 -z-0 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isSelected = selectedStep === step.number;
              return (
                <div
                  key={step.number}
                  onClick={() => setSelectedStep(step.number)}
                  className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-2xl transition-all duration-300 border select-none group ${isSelected
                      ? 'bg-slate-900/95 border-indigo-500 shadow-xl shadow-indigo-950/80 ring-2 ring-indigo-500/30 transform -translate-y-1'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-slate-600 shadow-md hover:-translate-y-0.5'
                    }`}
                >
                  {/* Step Number Circle */}
                  <div className="relative mb-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-base transition-all duration-300 shadow-lg ${isSelected
                          ? 'bg-gradient-to-br from-indigo-500 to-teal-400 text-white shadow-indigo-500/50 ring-4 ring-indigo-950 scale-105'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700 group-hover:border-indigo-400/60 group-hover:text-white'
                        }`}
                    >
                      {step.number}
                    </div>

                    {/* Step Icon Mini Badge */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shadow-md border ${isSelected ? 'bg-slate-950 text-teal-300 border-teal-400/50' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-sm font-bold tracking-tight mb-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300/80 leading-snug max-w-[170px] min-h-[32px]">
                    {step.sublabel}
                  </p>

                  <div className={`mt-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center space-x-1 transition-all ${isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 group-hover:text-indigo-300'
                    }`}>
                    <span>Phase Details</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Deep-Dive Inspector Card */}
        <div
          key={currentDetail.number}
          className="animate-fade-up mt-12 bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl backdrop-blur-xl ring-1 ring-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[90px] pointer-events-none -z-0" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6 relative z-10">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-indigo-600/30 ring-2 ring-white/20">
                {currentDetail.number}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg sm:text-xl font-extrabold text-white">
                    Phase {currentDetail.number}: {currentDetail.title}
                  </h4>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono text-[10px] font-semibold">
                    ACTIVE INSPECTION
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">{currentDetail.sublabel}</p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-indigo-950/90 text-indigo-300 border border-indigo-500/50 font-mono text-xs font-bold shadow-sm flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{currentDetail.technicalDetails.keyMetric}</span>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm relative z-10">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Architecture & Mechanism</span>
                </p>
                <p className="text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-3.5 rounded-xl border border-white/10 text-xs sm:text-sm">
                  {currentDetail.technicalDetails.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Benefit: {currentDetail.technicalDetails.advantage}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Core Technology Stack</span>
              </p>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-indigo-500/30 font-mono text-xs text-slate-100 flex items-start space-x-3 shadow-inner">
                <Cpu className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{currentDetail.technicalDetails.technology}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Calibrated for real-time edge and web deployment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
