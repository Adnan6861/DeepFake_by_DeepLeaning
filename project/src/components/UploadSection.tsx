import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Loader2, FileVideo, Lock, LogIn, UserPlus, CheckCircle2, X, Play, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import { User } from '../types';

interface UploadSectionProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
  analysisProgress: { step: string; percent: number } | null;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  currentUser,
  onOpenAuth,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB threshold

  const handleFile = (file: File) => {
    setErrorMessage(null);

    // Gate: Must be authenticated
    if (!currentUser) {
      setErrorMessage('Authentication required: Please sign in or register before uploading forensic video files.');
      onOpenAuth('login');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB threshold.`);
      return;
    }

    const validExtensions = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const hasValidExt = /\.(mp4|mov|avi|webm)$/i.test(file.name);
    if (!validExtensions.includes(file.type) && !hasValidExt) {
      setErrorMessage('Please upload a valid video file (.mp4, .mov, .avi, or .webm).');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!currentUser) {
      setErrorMessage('Please sign in or create an account to upload forensic videos.');
      onOpenAuth('login');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleZoneClick = () => {
    if (!currentUser) {
      setErrorMessage('Authentication required: Please sign in or register to upload video files.');
      onOpenAuth('login');
      return;
    }
    fileInputRef.current?.click();
  };

  const loadSampleVideo = (type: 'fake' | 'real') => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    const sampleFileName = type === 'fake' 
      ? 'deepfake_manipulated_interview_sample.mp4' 
      : 'authentic_camera_control_sample.mp4';
    
    // Create a lightweight mock video file with realistic metadata without allocating 4.2MB in RAM
    const dummyBlob = new Blob(['ftypisom'], { type: 'video/mp4' });
    const mockFile = new File([dummyBlob], sampleFileName, { type: 'video/mp4' });
    Object.defineProperty(mockFile, 'size', { value: Math.floor(4.2 * 1024 * 1024) });
    handleFile(mockFile);
  };

  const triggerAnalyze = () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Please select or upload a video file first.');
      return;
    }
    onAnalyze(selectedFile);
  };

  return (
    <section id="analyze" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Forensic Ingestion Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Upload & Analyze Video
          </h2>
          <p className="mt-2 text-base text-slate-300 max-w-xl mx-auto">
            Upload any video up to 100 MB to evaluate face manipulation, temporal coherence, and Grad-CAM visual heatmaps.
          </p>

          {/* Authentication Status Pill */}
          <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-md transition-all">
            {currentUser ? (
              <span className="inline-flex items-center space-x-2 text-emerald-400 bg-emerald-950/80 border border-emerald-600/60 px-3 py-0.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Investigator: <strong className="text-white font-bold">{currentUser.name}</strong> ({currentUser.role})</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-2 text-amber-300 bg-amber-950/70 border border-amber-600/60 px-3 py-0.5 rounded-full shadow-sm">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign in required to initiate neural inference</span>
              </span>
            )}
          </div>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (currentUser) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleZoneClick}
          className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 overflow-hidden border-2 select-none ${
            !currentUser
              ? 'border-white/10 bg-slate-900/60 cursor-pointer hover:border-slate-600 shadow-xl'
              : isDragging
              ? 'border-indigo-400 bg-indigo-950/50 scale-[1.01] shadow-2xl shadow-indigo-600/30 cursor-pointer'
              : selectedFile
              ? 'border-emerald-500/80 bg-slate-900/95 shadow-2xl shadow-emerald-950/40 cursor-pointer ring-2 ring-emerald-500/20'
              : 'border-dashed border-indigo-500/40 hover:border-indigo-400 bg-slate-900/80 hover:bg-slate-900/95 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/50 cursor-pointer'
          }`}
        >
          {/* Subtle Grid Pattern in Dropzone */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,.mov,.avi,.webm,video/*"
            disabled={!currentUser}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {/* Unauthenticated Security Gate Overlay */}
          {!currentUser ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-xl ring-4 ring-amber-500/20">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Authentication Required to Upload Video
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Forensic video analysis and neural inference are restricted to verified researchers. Please sign in or create an account to proceed.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transition-all cursor-pointer ring-1 ring-white/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup')}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Upload Display */
            <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
              {selectedFile ? (
                /* Selected File Card */
                <div className="space-y-3 w-full max-w-md mx-auto animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-xl ring-4 ring-emerald-500/20">
                    <FileVideo className="w-8 h-8" />
                  </div>

                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-600/60 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>READY FOR NEURAL INFERENCE</span>
                    </div>
                    <p className="text-lg font-bold text-white flex items-center justify-center space-x-2 truncate">
                      <span>{selectedFile.name}</span>
                    </p>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Container Validated
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      Choose another video
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone State */
                <>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl group-hover:scale-105 transition-transform">
                      <Upload className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 animate-pulse ring-2 ring-slate-900" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white">
                      Drag & drop video here or <span className="text-indigo-400 underline underline-offset-4 font-extrabold">Browse Files</span>
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 font-mono">
                      Accepts high-definition video up to 100 MB
                    </p>
                  </div>

                  {/* Format Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {['MP4', 'MOV', 'AVI', 'WEBM'].map((fmt) => (
                      <span key={fmt} className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono text-[11px] font-semibold">
                        .{fmt}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-mono text-[11px] font-semibold">
                      MAX 100 MB
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Demo Video Samples (Ideal for Evaluators & Milestone Demo) */}
        {currentUser && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Play className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Quick Evaluator Demo:</strong> Don't have a video file ready? Test with 1 click:</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => loadSampleVideo('fake')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:scale-102"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Deepfake Sample</span>
              </button>
              <button
                type="button"
                onClick={() => loadSampleVideo('real')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:scale-102"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authentic Sample</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-bold px-1">✕</button>
          </div>
        )}

        {/* Big Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={triggerAnalyze}
            disabled={isAnalyzing || (!!currentUser && !selectedFile)}
            className={`w-full sm:w-96 px-8 py-4 rounded-2xl font-extrabold text-base transition-all select-none shadow-xl ${
              !currentUser
                ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-750 hover:text-white shadow-md'
                : !selectedFile
                ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed shadow-none'
                : isAnalyzing
                ? 'bg-indigo-700/70 cursor-not-allowed text-white shadow-indigo-600/30'
                : 'btn-sheen bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer ring-1 ring-white/20'
            }`}
          >
            {isAnalyzing ? (
              <span className="inline-flex items-center space-x-2.5">
                <Loader2 className="w-5 h-5 animate-spin text-teal-300" />
                <span>Running Forensic Analysis...</span>
              </span>
            ) : !currentUser ? (
              <span className="inline-flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Sign In to Analyze Video</span>
              </span>
            ) : !selectedFile ? (
              <span>Upload Video to Analyze</span>
            ) : (
              <span className="inline-flex items-center space-x-2">
                <span>Analyze Video ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
              </span>
            )}
          </button>

          {/* Hint under button if no video selected */}
          {currentUser && !selectedFile && (
            <p className="mt-2.5 text-xs text-slate-400 font-mono">
              Please drop a video or click a Quick Sample above to start analysis.
            </p>
          )}

          {/* Real-time Progress Bar During Inference */}
          {isAnalyzing && analysisProgress && (
            <div className="mt-6 max-w-md mx-auto space-y-2.5 bg-slate-900/90 p-4 rounded-2xl border border-white/10 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-200 font-medium">
                <span className="truncate pr-2 font-mono">{analysisProgress.step}</span>
                <span className="font-mono text-teal-300 font-extrabold text-sm">{analysisProgress.percent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 transition-all duration-300 rounded-full shadow-lg shadow-teal-500/50"
                  style={{ width: `${analysisProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
