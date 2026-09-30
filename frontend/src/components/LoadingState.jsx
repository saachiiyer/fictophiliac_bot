import React from 'react';
import { BookOpen } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="text-center py-12 space-y-4 animate-fade-in">
      <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <BookOpen className="w-7 h-7 text-brand-400" />
      </div>
      <div>
        <h3 className="text-lg font-serif font-bold text-zinc-100">
          Consulting Gemini Literary Engine...
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
          Analyzing narrative arcs, authorial pacing, and fetching book covers.
        </p>
      </div>
    </div>
  );
}

