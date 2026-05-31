
import React, { useState, useCallback, useEffect } from 'react';
import { AppStatus, ChatScreenshot, AnalysisResult } from './types';
import { analyzeConversations } from './services/geminiService';
import FileUploader from './components/FileUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import ImageEditorTool from './components/ImageEditorTool';
import { UI_ICONS } from './constants';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [screenshots, setScreenshots] = useState<ChatScreenshot[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [editingScreenshot, setEditingScreenshot] = useState<ChatScreenshot | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newShots: ChatScreenshot[] = [];
    Array.from(files).forEach((file) => {
      if (screenshots.length + newShots.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setScreenshots(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          dataUrl,
          file
        }]);
      };
      reader.readAsDataURL(file);
    });
  }, [screenshots]);

  const removeScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  const startAnalysis = async () => {
    if (screenshots.length === 0) return;
    setStatus(AppStatus.ANALYZING);
    try {
      const dataUrls = screenshots.map(s => s.dataUrl);
      const analysis = await analyzeConversations(dataUrls);
      setResult(analysis);
      setStatus(AppStatus.RESULTS);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Oops! The AI text-detectors got shy. Try again?");
      setStatus(AppStatus.IDLE);
    }
  };

  const resetApp = () => {
    setScreenshots([]);
    setResult(null);
    setStatus(AppStatus.IDLE);
  };

  const updateScreenshot = (updated: ChatScreenshot) => {
    setScreenshots(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'} selection:bg-violet-500 selection:text-white`}>
      {status === AppStatus.ANALYZING && <LoadingOverlay />}
      
      {editingScreenshot && (
        <ImageEditorTool 
          screenshot={editingScreenshot} 
          onClose={() => setEditingScreenshot(null)}
          onUpdate={updateScreenshot}
        />
      )}

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-4 rounded-full glass-card hover:scale-110 active:scale-95 transition-all shadow-lg text-violet-500"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? UI_ICONS.Sun : UI_ICONS.Moon}
      </button>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest">
            {UI_ICONS.Zap} Gen-Z Powered Analysis
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-600 to-slate-400 dark:from-white dark:via-slate-400 dark:to-slate-800">
            CheckYour<br/>
            <span className="text-violet-500 neon-glow">TextGame</span>
          </h1>
          <p className={`text-lg max-w-lg mx-auto font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Stop overthinking that dry "haha". Let AI decode the flirtation and tell you where you stand.
          </p>
        </header>

        {status === AppStatus.IDLE && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="space-y-10">
              <FileUploader 
                screenshots={screenshots} 
                onUpload={handleUpload} 
                onRemove={removeScreenshot}
                onEditRequest={setEditingScreenshot}
              />
              
              <div className="flex flex-col items-center gap-6">
                <button 
                  disabled={screenshots.length === 0}
                  onClick={startAnalysis}
                  className={`group relative w-full py-6 rounded-3xl font-black text-2xl transition-all duration-300 transform active:scale-95 ${
                    screenshots.length > 0 
                      ? "bg-violet-600 text-white shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:bg-violet-500 hover:-translate-y-1" 
                      : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {screenshots.length > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                      ANALYZE MY GAME {UI_ICONS.Flame}
                    </span>
                  ) : "UPLOAD SCREENSHOTS FIRST"}
                  {screenshots.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  )}
                </button>

                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  {UI_ICONS.Shield} <span>Encrypted processing. No storage. No leaks. Just insights.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.RESULTS && result && (
          <AnalysisDisplay result={result} onReset={resetApp} />
        )}
      </main>

      {/* Footer / Floating CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-3xl mx-auto flex justify-end pointer-events-auto">
          <div className="glass-card px-4 py-2 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            V1.0.5 "RIZZ-LORD" EDITION
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
