import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Layers } from 'lucide-react';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const [{ generateProjectPlanDocx }, { default: confetti }] = await Promise.all([
        import('../services/docxGenerator'),
        import('canvas-confetti'),
      ]);
      const blob = await generateProjectPlanDocx();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Deepfake_Detection_System_Milestone_Plan.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setDownloaded(false), 5000);
    } catch (err) {
      console.error('Failed to generate docx:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Technical Milestone Deliverable & Implementation Plan
              </h3>
              <p className="text-xs text-slate-400">
                Department of Software Engineering • Media Forensics & AI Research Center
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body - Scrollable Plan Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Direct Download Callout */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-white text-sm">Download Official Technical Plan (.docx)</p>
              <p className="text-slate-400 text-xs">
                Complete defense document formatted with deliverables, database schemas, and mathematical foundations.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Compiling .docx...' : downloaded ? 'Downloaded!' : 'Download .docx'}</span>
            </button>
          </div>

          {/* Section 1: Executive Deliverables */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Milestone Deliverables Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Frontend UI/UX Implementation</p>
                <p className="text-slate-400">
                  Fully interactive responsive single-page architecture matching high-tech wireframes with video dropzone, confidence gauge, and frame scrubber.
                </p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Database-Connected Auth</p>
                <p className="text-slate-400">
                  Login & Sign Up modules persisting user profiles, roles, and scan histories in a local database layer.
                </p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Video Ingestion Pipeline</p>
                <p className="text-slate-400">
                  Supports up to 100 MB MP4/MOV/AVI/WEBM uploads and academic sample evaluation from FaceForensics++, DFDC, and Celeb-DF v2.
                </p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <p className="font-bold text-white mb-1">Explainability Layer</p>
                <p className="text-slate-400">
                  Frame-by-frame Grad-CAM activation heatmap simulation localizing perioral and boundary blending artifacts.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Architecture */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>2. Technical Stack Specification</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-1">
              <li>
                <strong className="text-white">Presentation Layer:</strong> React 19 + Tailwind CSS single-page layout with dark forensic HUD styling.
              </li>
              <li>
                <strong className="text-white">Persistence & Auth Layer:</strong> User entity schemas with SHA password hashing, role tokens, and investigation scan history.
              </li>
              <li>
                <strong className="text-white">Inference & Explainability Engine:</strong> YOLOv12 multi-scale face detector, EfficientNet-B4 spatial backbone with Channel Attention Module, and Grad-CAM layer activation gradients.
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Project Ref: SE-2026-DF-04
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Word File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
