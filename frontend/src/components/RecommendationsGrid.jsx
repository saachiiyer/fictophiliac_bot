import React from 'react';
import { Sliders, RotateCw } from 'lucide-react';
import BookCard from './BookCard';

export default function RecommendationsGrid({
  recommendations,
  replacingIndex,
  onMarkAsRead,
  onAdjustPreferences,
  onRerollAll,
  userProfile,
}) {
  const pastReadsStr = userProfile.previousReads?.join(', ');
  const authorsStr = userProfile.favoriteAuthors?.join(', ');
  const genresStr = userProfile.preferredGenres?.slice(0, 3).join(', ');

  const summaryParts = [];
  if (pastReadsStr) summaryParts.push(`Reads: ${pastReadsStr}`);
  if (authorsStr) summaryParts.push(`Authors: ${authorsStr}`);
  if (genresStr) summaryParts.push(`Genres: ${genresStr}`);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center space-x-2">
            <span>Curated for Your Taste</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-sans font-medium">
              {recommendations.length} books
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {summaryParts.length
              ? summaryParts.join(' • ')
              : 'Calibrated with default literary curation'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onAdjustPreferences}
            className="text-xs px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition flex items-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span>Adjust Taste</span>
          </button>
          <button
            onClick={onRerollAll}
            className="text-xs px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition flex items-center space-x-1.5 shadow-md shadow-brand-600/20"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-roll All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book, idx) => (
          <BookCard
            key={`${book.title}-${idx}`}
            index={idx}
            book={book}
            isReplacing={replacingIndex === idx}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}

