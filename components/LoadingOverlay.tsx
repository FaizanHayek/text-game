
import React, { useEffect, useState, useMemo } from 'react';

const MESSAGES = [
  "Decrypting emojis...",
  "Calculating response lag...",
  "Measuring message-to-energy ratio...",
  "Consulting the texting gods...",
  "Reading between the lines...",
  "Checking for mirroring signals...",
  "Simulating outcome scenarios...",
  "Polishing your results..."
];

const EMOJIS = ["💖", "📱", "✨", "💬", "🔥", "💯", "👑", "💅", "🧢"];

const LoadingOverlay: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  // Generate stable random particles on mount
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${1 + Math.random() * 1.5}rem`
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      {/* Floating Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float-up opacity-0"
            style={{
              left: p.left,
              bottom: '-10%',
              fontSize: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Main Loader Container */}
      <div className="relative">
        {/* Holographic Scanning Beam */}
        <div className="absolute -inset-10 z-10 pointer-events-none overflow-hidden rounded-3xl">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-scan opacity-50"></div>
        </div>

        {/* Orbiting Elements */}
        <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 border-[3px] border-violet-500/10 rounded-full animate-[spin_10s_linear_infinite]">
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-500 rounded-full shadow-[0_0_15px_#8b5cf6]"></div>
          </div>
          <div className="absolute inset-4 border-[3px] border-pink-500/10 rounded-full animate-[spin_7s_linear_infinite_reverse]">
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_15px_#f472b6]"></div>
          </div>
          
          {/* Central Pulsing Icon */}
          <div className="relative z-20 bg-slate-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border border-slate-800">
             <span className="text-5xl animate-pulse">🧐</span>
             <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-20 space-y-4">
        <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">AI is Cooking</span>
          <span className="inline-block animate-bounce ml-2">🔥</span>
        </h2>
        
        <div className="h-8 flex items-center justify-center">
          <p className="text-teal-300 font-bold tracking-widest text-sm animate-pulse">
            {MESSAGES[msgIdx]}
          </p>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-12 w-72 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
        <div className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-teal-400 rounded-full animate-progress-fast"></div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes progress-fast {
          0% { width: 0%; }
          30% { width: 60%; }
          70% { width: 85%; }
          100% { width: 100%; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite alternate;
        }
        .animate-progress-fast {
          animation: progress-fast 4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
