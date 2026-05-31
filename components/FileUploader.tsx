
import React, { useState } from 'react';
import { MAX_SCREENSHOTS } from '../constants';
import { ChatScreenshot } from '../types';
import { Trash2, Plus, Edit2 } from 'lucide-react';

interface Props {
  screenshots: ChatScreenshot[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onEditRequest: (screenshot: ChatScreenshot) => void;
}

const FileUploader: React.FC<Props> = ({ screenshots, onUpload, onRemove, onEditRequest }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div 
        className={`relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging 
            ? "border-violet-400 bg-violet-400/10 scale-95" 
            : "border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-violet-500 hover:bg-white/80 dark:hover:bg-slate-800/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => onUpload(e.target.files)}
        />
        <div className="bg-violet-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.5)]">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-200">Drop screenshots here</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Up to 4 images (SMS, WhatsApp, IG, etc.)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {screenshots.map((shot) => (
          <div key={shot.id} className="relative aspect-[9/16] rounded-xl overflow-hidden glass-card group">
            <img 
              src={shot.dataUrl} 
              alt="Chat" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button 
                onClick={() => onRemove(shot.id)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => onEditRequest(shot)}
                className="p-2 bg-violet-500 rounded-full hover:bg-violet-600 transition-colors"
              >
                <Edit2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
