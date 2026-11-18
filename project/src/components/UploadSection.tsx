import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Loader2, FileVideo, Image as ImageIcon, Lock, LogIn, UserPlus, CheckCircle2, X, Play, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
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
  const [uploadMode, setUploadMode] = useState<'video' | 'image'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB threshold

  const isSelectedFileImage = selectedFile
    ? selectedFile.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(selectedFile.name)
    : uploadMode === 'image';

  const handleFile = (file: File) => {
    setErrorMessage(null);

    // Gate: Must be authenticated
    if (!currentUser) {
      setErrorMessage('Authentication required: Please sign in or register before uploading forensic media files.');
      onOpenAuth('login');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB threshold.`);
      return;
    }

    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    const isVideoFile = validVideoTypes.includes(file.type) || /\.(mp4|mov|avi|webm)$/i.test(file.name);
    const isImageFile = validImageTypes.includes(file.type) || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

    if (!isVideoFile && !isImageFile) {
      setErrorMessage('Please upload a valid video (.mp4, .mov, .avi, .webm) or image (.jpg, .jpeg, .png, .webp) file.');
      return;
    }

    if (isImageFile) {
      setUploadMode('image');
      if (file.size > 100) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviewUrl(typeof reader.result === 'string' ? reader.result : null);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setUploadMode('video');
      setImagePreviewUrl(null);
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!currentUser) {
      setErrorMessage('Please sign in or create an account to upload forensic media.');
      onOpenAuth('login');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleZoneClick = () => {
    if (!currentUser) {
      setErrorMessage('Authentication required: Please sign in or register to upload media files.');
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

  const loadSampleImage = (type: 'fake' | 'real') => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    const sampleFileName = type === 'fake'
      ? 'deepfake_synthesized_portrait_sample.jpg'
      : 'authentic_dslr_portrait_sample.jpg';

    const dummyBlob = new Blob(['ffd8ffe0'], { type: 'image/jpeg' });
    const mockFile = new File([dummyBlob], sampleFileName, { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: Math.floor(1.4 * 1024 * 1024) });
    setUploadMode('image');
    setImagePreviewUrl(
      type === 'fake'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    );
    setSelectedFile(mockFile);
    setErrorMessage(null);
  };

  const triggerAnalyze = () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Please select or upload a video or image file first.');
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
            Upload & Analyze Video or Image
          </h2>
          <p className="mt-2 text-base text-slate-300 max-w-xl mx-auto">
            Upload a video (multi-frame timeline) or a single image (1-frame dashboard) up to 100 MB to evaluate face manipulation and Grad-CAM visual heatmaps.
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

          {/* Media Mode Switcher (Video vs Single Image) */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setUploadMode('video');
                  if (selectedFile && isSelectedFileImage) {
                    setSelectedFile(null);
                    setImagePreviewUrl(null);
                  }
                  setErrorMessage(null);
                }}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  uploadMode === 'video'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileVideo className="w-4 h-4" />
                <span>Video Upload (Multi-Frame)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('image');
                  if (selectedFile && !isSelectedFileImage) {
                    setSelectedFile(null);
                    setImagePreviewUrl(null);
                  }
                  setErrorMessage(null);
                }}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  uploadMode === 'image'
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/40 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image Upload (Single-Frame)</span>
              </button>
            </div>
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
            accept={
              uploadMode === 'image'
                ? '.jpg,.jpeg,.png,.webp,.bmp,image/*,.mp4,.mov,.avi,.webm,video/*'
                : '.mp4,.mov,.avi,.webm,video/*,.jpg,.jpeg,.png,.webp,.bmp,image/*'
            }
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
                  Authentication Required to Upload Media
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Forensic video and single-image analysis are restricted to verified researchers. Please sign in or create an account to proceed.
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
                  {isSelectedFileImage && imagePreviewUrl ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/70 mx-auto shadow-xl ring-4 ring-emerald-500/20 bg-slate-950">
                      <img
                        src={imagePreviewUrl}
                        alt="Selected preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-xl ring-4 ring-emerald-500/20">
                      {isSelectedFileImage ? <ImageIcon className="w-8 h-8" /> : <FileVideo className="w-8 h-8" />}
                    </div>
                  )}

                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-600/60 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isSelectedFileImage
                          ? 'SINGLE IMAGE (1 FRAME) • READY FOR INFERENCE'
                          : 'VIDEO STREAM • READY FOR NEURAL INFERENCE'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white flex items-center justify-center space-x-2 truncate">
                      <span>{selectedFile.name}</span>
                    </p>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      {Math.max(0.01, selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                      {isSelectedFileImage ? 'Single-Frame Dashboard Mode' : 'Multi-Frame Timeline Mode'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      Choose another {isSelectedFileImage ? 'image or video' : 'video or image'}
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreviewUrl(null);
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
                      {uploadMode === 'image' ? (
                        <ImageIcon className="w-7 h-7 stroke-[2.2] text-teal-400" />
                      ) : (
                        <Upload className="w-7 h-7 stroke-[2.2]" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 animate-pulse ring-2 ring-slate-900" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white">
                      {uploadMode === 'image' ? (
                        <>
                          Drag & drop a <span className="text-teal-400">single image</span> here or{' '}
                          <span className="text-indigo-400 underline underline-offset-4 font-extrabold">Browse Files</span>
                        </>
                      ) : (
                        <>
                          Drag & drop <span className="text-indigo-400">video or image</span> here or{' '}
                          <span className="text-indigo-400 underline underline-offset-4 font-extrabold">Browse Files</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 font-mono">
                      {uploadMode === 'image'
                        ? 'Single image switches dashboard to 1-Frame Forensic Inspection Mode'
                        : 'Accepts high-definition video or static images up to 100 MB'}
                    </p>
                  </div>

                  {/* Format Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {(uploadMode === 'image'
                      ? ['JPG', 'PNG', 'WEBP', 'BMP']
                      : ['MP4', 'MOV', 'AVI', 'WEBM', 'JPG', 'PNG']
                    ).map((fmt) => (
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

        {/* Quick Demo Video & Image Samples (Ideal for Evaluators & Milestone Demo) */}
        {currentUser && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Play className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Quick Evaluator Demo:</strong> Test Video (Multi-Frame) or Single Image (1-Frame):</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => loadSampleVideo('fake')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-all cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Fake Video</span>
              </button>
              <button
                type="button"
                onClick={() => loadSampleVideo('real')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-semibold text-xs transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real Video</span>
              </button>
              <button
                type="button"
                onClick={() => loadSampleImage('fake')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/60 font-semibold text-xs transition-all cursor-pointer shadow-sm"
              >
                <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Fake Image (1-Frame)</span>
              </button>
              <button
                type="button"
                onClick={() => loadSampleImage('real')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/60 font-semibold text-xs transition-all cursor-pointer shadow-sm"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real Image (1-Frame)</span>
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
            className={`w-full sm:w-auto sm:min-w-96 px-8 py-4 rounded-2xl font-extrabold text-base transition-all select-none shadow-xl ${
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
                <span>
                  {isSelectedFileImage
                    ? 'Analyzing Single Image (1-Frame)...'
                    : 'Running Forensic Video Analysis...'}
                </span>
              </span>
            ) : !currentUser ? (
              <span className="inline-flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Sign In to Analyze Media</span>
              </span>
            ) : !selectedFile ? (
              <span>Upload {uploadMode === 'image' ? 'Image' : 'Video or Image'} to Analyze</span>
            ) : (
              <span className="inline-flex items-center space-x-2">
                <span>
                  {isSelectedFileImage
                    ? `Analyze Single Image (${Math.max(0.01, selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`
                    : `Analyze Video (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)`}
                </span>
              </span>
            )}
          </button>

          {/* Hint under button if no file selected */}
          {currentUser && !selectedFile && (
            <p className="mt-2.5 text-xs text-slate-400 font-mono">
              Please drop a video or image, or click a Quick Sample above to start analysis.
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
