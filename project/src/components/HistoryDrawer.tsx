import React from 'react';
import { History, Trash2, X, FileVideo } from 'lucide-react';
import { AnalysisResult } from '../types';
import { DatabaseService } from '../services/db';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: AnalysisResult) => void;
  historyList: AnalysisResult[];
  onRefreshHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  historyList,
  onRefreshHistory,
}) => {
  if (!isOpen) return null;

  const handleClear = async () => {
    await DatabaseService.clearHistory();
    onRefreshHistory();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-700/80 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Forensic Investigation History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Tag */}
        <div className="px-5 py-2.5 bg-indigo-950/60 border-b border-indigo-900/50 flex items-center justify-between text-xs text-indigo-200">
          <span className="flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PostgreSQL 18 (FastAPI Connected)</span>
          </span>
          <span className="font-mono text-indigo-400 font-bold">{historyList.length} scans</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {historyList.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <FileVideo className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-300">No investigation records yet.</p>
              <p className="mt-1 text-slate-400">Analyze a video clip to see its forensic report logged in the database.</p>
            </div>
          ) : (
            historyList.map((item) => {
              const isDeepfake = item.verdict === 'DEEPFAKE';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-800 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400">
                      {item.fileName}
                    </p>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shrink-0 ${
                        isDeepfake ? 'bg-rose-950 text-rose-300 border border-rose-800/60' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {item.verdict} ({item.confidenceScore}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{new Date(item.analyzedAt).toLocaleDateString()}</span>
                    <span>
                      {item.totalFrames === 1 ? '1 frame (Image)' : `${item.totalFrames} frames`} • {item.processingTimeSec}s
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {historyList.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950 text-xs">
            <button
              onClick={handleClear}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
