
import React from 'react';
import { Heart, MessageSquare, Zap, ShieldCheck, Flame, Share2, RefreshCw, Sun, Moon } from 'lucide-react';

export const COLORS = {
  primary: '#8b5cf6', // Violet
  secondary: '#f472b6', // Pink
  accent: '#2dd4bf', // Teal
  dark: '#0f172a',
};

export const UI_ICONS = {
  Heart: <Heart className="w-6 h-6" />,
  Message: <MessageSquare className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Shield: <ShieldCheck className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Share: <Share2 className="w-6 h-6" />,
  Refresh: <RefreshCw className="w-6 h-6" />,
  Sun: <Sun className="w-6 h-6" />,
  Moon: <Moon className="w-6 h-6" />,
};

export const MAX_SCREENSHOTS = 4;
