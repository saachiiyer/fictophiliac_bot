import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, PenTool } from 'lucide-react';

export default function StepAuthors({ initialAuthors, onNext, onBack, onSkip }) {
  const [authors, setAuthors] = useState([
    initialAuthors[0] || '',
    initialAuthors[1] || '',
    initialAuthors[2] || '',
  ]);

  const handleChange = (index, value) => {
    const updated = [...authors];
    updated[index] = value;
    setAuthors(updated);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const valid = authors.map((a) => a.trim()).filter(Boolean);
    onNext(valid);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-semibold text-zinc-200 mb-1">
          Who are your favorite authors?
        </label>
        <p className="text-xs text-zinc-400 mb-3">
          For example: <em>Holly Jackson</em>, <em>Agatha Christie</em>, <em>Freida McFadden</em>
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
            <PenTool className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={authors[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            placeholder="e.g. Holly Jackson"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
            <PenTool className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={authors[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            placeholder="e.g. Agatha Christie"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
            <PenTool className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={authors[2]}
            onChange={(e) => handleChange(2, e.target.value)}
            placeholder="e.g. Freida McFadden"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition py-2 px-3 rounded-lg hover:bg-zinc-800 flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition py-2 px-3 rounded-lg hover:bg-zinc-800"
          >
            Skip &rarr;
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-brand-600/20 flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}

