
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { UI_ICONS } from '../constants';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out: starts fast, slows down
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * value;

      if (Number.isInteger(value)) {
        setCount(Math.floor(current));
      } else {
        setCount(Math.round(current * 10) / 10);
      }

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return <>{count}</>;
};

const AnalysisDisplay: React.FC<Props> = ({ result, onReset }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // A tiny delay to allow the DOM to paint and trigger css transitions
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black italic tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-500 underline decoration-teal-400/30">
          YOUR TEXT GAME REPORT
        </h2>
        <p className="text-slate-400 text-sm italic">*Probabilistic insights only, not life facts.*</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Attraction Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6 border-l-4 border-l-pink-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            {UI_ICONS.Heart}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-pink-400 mb-1">Her Attraction</h3>
              <p className="text-5xl font-black text-white">
                <AnimatedNumber value={result.attractionScore} />
                <span className="text-xl text-slate-500">/10</span>
              </p>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-pink-500 shadow-[0_0_10px_#f472b6]" 
                style={{ 
                  width: `${isMounted ? result.attractionScore * 10 : 0}%`, 
                  transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
              />
            </div>
          </div>
          <p className="text-slate-200 leading-relaxed text-lg italic">"{result.attractionFeedback}"</p>
        </div>

        {/* Texting Skill Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6 border-l-4 border-l-teal-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            {UI_ICONS.Zap}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-1">Your Skillset</h3>
              <p className="text-5xl font-black text-white">
                <AnimatedNumber value={result.textingSkillScore} />
                <span className="text-xl text-slate-500">/10</span>
              </p>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-teal-500 shadow-[0_0_10px_#2dd4bf]" 
                style={{ 
                  width: `${isMounted ? result.textingSkillScore * 10 : 0}%`, 
                  transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
              />
            </div>
          </div>
          <p className="text-slate-200 leading-relaxed text-lg">"{result.textingSkillFeedback}"</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-violet-600/20 to-indigo-600/20">
        <h3 className="text-xl font-bold text-violet-300 mb-6 flex items-center gap-2">
          {UI_ICONS.Flame} PRO TIPS TO UP YOUR GAME
        </h3>
        <div className="space-y-4">
          {result.topTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 transition-all hover:translate-x-2">
              <div className="bg-violet-500 text-white font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <p className="text-slate-300 font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <button 
          onClick={onReset}
          className="flex-1 py-5 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          {UI_ICONS.Refresh} TRY ANOTHER CHAT
        </button>
        <button 
          onClick={() => alert("Sharing feature coming soon! 📸")}
          className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-violet-500/20"
        >
          {UI_ICONS.Share} SHARE RESULTS
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
