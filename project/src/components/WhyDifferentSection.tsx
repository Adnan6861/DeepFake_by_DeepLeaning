import React from 'react';
import { Eye, Zap, Globe, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const WhyDifferentSection: React.FC = () => {
  const differentiators = [
    {
      title: 'Explainable (Grad-CAM)',
      tag: 'Interpretability-First',
      description:
        'Unlike opaque black-box models, our framework uses Gradient-weighted Class Activation Mapping (Grad-CAM) to project heatmaps onto suspicious facial coordinates (mouth seams, eye reflections, boundary warping).',
      bulletPoints: ['Micro-artifact localization', 'Auditable evidence trail', 'Non-technical visual clarity'],
      icon: <Eye className="w-6 h-6 text-emerald-300" />,
      circleColor: 'bg-emerald-950/80 border border-emerald-500/50 shadow-emerald-950/50',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
    },
    {
      title: 'YOLOv12 + EfficientNet Speed & Accuracy',
      tag: 'Hybrid Architecture',
      description:
        'Synergizes ultra-fast YOLOv12 facial localization with an EfficientNet-B0 CNN backbone enhanced by a Channel Attention Module to maximize biological feature sensitivity while suppressing background noise.',
      bulletPoints: ['High throughput 1.8s inference', 'Multi-scale boundary alignment', '≥80% benchmark target accuracy'],
      icon: <Zap className="w-6 h-6 text-indigo-300" />,
      circleColor: 'bg-indigo-950/80 border border-indigo-500/50 shadow-indigo-950/50',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-600/50',
    },
    {
      title: 'Zero-Install Web Deployment',
      tag: 'Accessible Engineering',
      description:
        'Zero setup, zero GPU configuration required for end users. Packaged as a clean, responsive single-page web application accessible to journalists, media outlets, and forensic researchers worldwide.',
      bulletPoints: ['Runs in any standard browser', 'Drag-and-drop up to 100 MB', 'Persistent database history'],
      icon: <Globe className="w-6 h-6 text-teal-300" />,
      circleColor: 'bg-teal-950/80 border border-teal-500/50 shadow-teal-950/50',
      badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-600/50',
    },
  ];

  return (
    <section id="why-us" className="py-20 relative bg-slate-900/40 border-t border-white/10 overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-3">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>Technical Innovation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why our model is different
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Engineered to overcome the detection, explainability, and accessibility gaps identified in traditional deepfake research.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {differentiators.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-3xl border border-white/10 p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 backdrop-blur-xl ring-1 ring-white/5 relative overflow-hidden"
            >
              <div className="relative z-10">
                {/* Header Icon Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${card.circleColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${card.badgeColor}`}>
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-indigo-200 transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 border-t border-white/10 space-y-2.5 text-xs relative z-10">
                {card.bulletPoints.map((item, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-2.5 text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
