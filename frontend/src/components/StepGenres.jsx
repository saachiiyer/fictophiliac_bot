import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

const SUGGESTED_GENRES = [
  '⚡ Psychological Thriller',
  '🔍 Mystery / Whodunit',
  '💖 Contemporary Romance',
  '🚪 Locked Room Mystery',
  '🏡 Domestic Suspense',
  '🥀 Dark Romance',
  '🚀 Sci-Fi / Dystopian',
  '✨ Fantasy / Magic',
];

export default function StepGenres({ initialGenres, onSubmit, onBack }) {
  const [selectedGenres, setSelectedGenres] = useState(initialGenres || []);
  const [customInput, setCustomInput] = useState('');
  const [count, setCount] = useState(6);

  const toggleGenre = (genreText) => {
    const cleanGenre = genreText.replace(/^[^\w]+/, '').trim();
    if (selectedGenres.includes(cleanGenre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== cleanGenre));
    } else {
      setSelectedGenres([...selectedGenres, cleanGenre]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalGenres = [...selectedGenres];
    if (customInput.trim()) {
      customInput.split(',').forEach((g) => {
        const clean = g.trim();
        if (clean && !finalGenres.includes(clean)) finalGenres.push(clean);
      });
    }
    onSubmit(finalGenres, count);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-semibold text-zinc-200 mb-1">
          What genres are you in the mood for?
        </label>
        <p className="text-xs text-zinc-400 mb-3">
          Tap any genre to toggle or type custom tags below.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {SUGGESTED_GENRES.map((g) => {
          const clean = g.replace(/^[^\w]+/, '').trim();
          const isSelected = selectedGenres.includes(clean);

          return (
            <button
              key={clean}
              type="button"
              onClick={() => toggleGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/20 text-brand-300 shadow-sm shadow-brand-500/10'
                  : 'border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Or type custom genres (e.g. cozy mystery, enemies to lovers)"
          className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
        />
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
        <span>How many books would you like recommended?</span>
        <select
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-200 text-xs focus:outline-none"
        >
          <option value="4">4 books</option>
          <option value="6">6 books (Recommended)</option>
          <option value="8">8 books</option>
          <option value="10">10 books</option>
        </select>
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

        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-amberGlow hover:from-brand-500 hover:to-amber-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-500/25 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Recommendations</span>
        </button>
      </div>
    </form>
  );
}

