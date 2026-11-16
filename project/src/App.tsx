/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModelWorkflowSection } from './components/ModelWorkflowSection';
import { UploadSection } from './components/UploadSection';
import { WhyDifferentSection } from './components/WhyDifferentSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { User, AnalysisResult } from './types';
import { DatabaseService } from './services/db';
import { runDeepfakeAnalysis } from './services/deepfakeModel';
import { FuturisticBackground } from './components/FuturisticBackground';

// Code-split heavy sections & modals for faster initial page load
const AnalysisResultSection = lazy(() =>
  import('./components/AnalysisResultSection').then((m) => ({ default: m.AnalysisResultSection }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const PlanModal = lazy(() =>
  import('./components/PlanModal').then((m) => ({ default: m.PlanModal }))
);
const HistoryDrawer = lazy(() =>
  import('./components/HistoryDrawer').then((m) => ({ default: m.HistoryDrawer }))
);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyList, setHistoryList] = useState<AnalysisResult[]>([]);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ step: string; percent: number } | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Initialize DB session and history
    const user = DatabaseService.getCurrentUser();
    setCurrentUser(user);
    setHistoryList(DatabaseService.getHistory());

    // Asynchronously sync latest history from PostgreSQL backend
    DatabaseService.fetchHistoryFromBackend().then((backendHistory) => {
      if (backendHistory && backendHistory.length > 0) {
        setHistoryList(backendHistory);
      }
    });
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    DatabaseService.logout();
    setCurrentUser(null);
  };

  const handleStartAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress({ step: 'Initializing analysis engine...', percent: 5 });

    try {
      const result = await runDeepfakeAnalysis(file, (step, percent) => {
        setAnalysisProgress({ step, percent });
      });

      setCurrentResult(result);
      await DatabaseService.saveAnalysis(result);
      setHistoryList(DatabaseService.getHistory());

      setIsAnalyzing(false);
      setAnalysisProgress(null);

      // Smooth scroll to Section 5 Analysis Result
      setTimeout(() => {
        const el = document.getElementById('results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  const handleDirectDocxDownload = async () => {
    try {
      const [{ generateProjectPlanDocx }, { default: confetti }] = await Promise.all([
        import('./services/docxGenerator'),
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
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    } catch (e) {
      console.error('Docx download error:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* Futuristic Interactive Arrow & Cursor Canvas Background */}
      <FuturisticBackground />

      {/* 1. Header & Navigation (Wireframe Section 1) */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenPlan={() => setPlanModalOpen(true)}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        
        {/* 2. Hero Section (Wireframe Section 2) */}
        <HeroSection
          onTryNow={() => {
            const el = document.getElementById('analyze');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onHowItWorks={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Model Workflow Section (Wireframe Section 3) */}
        <ModelWorkflowSection />

        {/* 4. Upload & Analyze Section (Wireframe Section 4) */}
        <UploadSection
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onAnalyze={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          analysisProgress={analysisProgress}
        />

        {/* 5. Analysis Result Section (Wireframe Section 5 - Appears after clicking Analyze) */}
        {currentResult && (
          <Suspense fallback={<div className="py-20 text-center text-slate-400 font-mono text-xs animate-pulse">Loading forensic report interface...</div>}>
            <AnalysisResultSection
              result={currentResult}
              onRunAgain={() => {
                const el = document.getElementById('analyze');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onDownloadDocxPlan={handleDirectDocxDownload}
            />
          </Suspense>
        )}

        {/* 6. Why Our Model Is Different (Wireframe Section 6) */}
        <WhyDifferentSection />

        {/* 7. Contact Us Section (Wireframe Section 7) */}
        <ContactSection />

      </main>

      {/* 8. Footer (Wireframe Section 8) */}
      <Footer onOpenPlan={() => setPlanModalOpen(true)} />

      {/* Modals & Drawers */}
      <Suspense fallback={null}>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            initialMode={authMode}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
            }}
          />
        )}

        {planModalOpen && (
          <PlanModal
            isOpen={planModalOpen}
            onClose={() => setPlanModalOpen(false)}
          />
        )}

        {historyDrawerOpen && (
          <HistoryDrawer
            isOpen={historyDrawerOpen}
            onClose={() => setHistoryDrawerOpen(false)}
            onSelectResult={(item) => {
              setCurrentResult(item);
              setTimeout(() => {
                const el = document.getElementById('results');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            historyList={historyList}
            onRefreshHistory={() => setHistoryList(DatabaseService.getHistory())}
          />
        )}
      </Suspense>

    </div>
  );
}
