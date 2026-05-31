
import React, { useState } from 'react';
import { ChatScreenshot } from '../types';
import { X, Wand2 } from 'lucide-react';
import { editImageWithAI } from '../services/geminiService';

interface Props {
  screenshot: ChatScreenshot;
  onClose: () => void;
  onUpdate: (updatedScreenshot: ChatScreenshot) => void;
}

const ImageEditorTool: React.FC<Props> = ({ screenshot, onClose, onUpdate }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const updatedDataUrl = await editImageWithAI(screenshot.dataUrl, prompt);
      onUpdate({ ...screenshot, dataUrl: updatedDataUrl });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to edit image");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-xl w-full glass-card rounded-3xl p-6 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Wand2 className="text-teal-400" /> AI MAGIC EDIT
        </h3>

        <div className="flex gap-6 mb-8">
          <div className="w-1/2 aspect-[9/16] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
            <img src={screenshot.dataUrl} alt="Original" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What should AI do?</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Add a retro glitch filter' or 'Blur sensitive info'"
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            
            <button 
              disabled={loading || !prompt.trim()}
              onClick={handleEdit}
              className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all ${
                loading ? "bg-slate-700 animate-pulse cursor-not-allowed" : "bg-gradient-to-r from-teal-400 to-violet-500 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]"
              }`}
            >
              {loading ? "WAVING WAND..." : "APPLY MAGIC"}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center italic">
          Uses Gemini 2.5 Flash Image. Editing might slightly alter text legibility.
        </p>
      </div>
    </div>
  );
};

export default ImageEditorTool;
