import React, { useState } from 'react';
import { Award, Sparkles, Info, Trophy, Star, Flag, Globe, Film, Heart } from 'lucide-react';

export default function CuratedNewsSection({
  categories = [],
  onSelectBookForChat,
  onToggleWishlist,
  isWishlisted,
}) {
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'booker-prize');
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const getIcon = (id) => {
    switch (id) {
      case 'booker-prize':
        return <Trophy className="w-4 h-4" />;
      case 'goodreads-top':
        return <Star className="w-4 h-4" />;
      case 'indian-bestsellers':
        return <Flag className="w-4 h-4" />;
      case 'international-bestsellers':
        return <Globe className="w-4 h-4" />;
      case 'page-to-screen':
        return <Film className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-brand-950/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Literary Gazette &amp; Bestseller Spotlight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
            Explore Prestigious Winners &amp; Chart Toppers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            Browse historic Booker Prize honorees, Goodreads Choice champions, National Indian bestsellers, international blockbusters, and books headed to the silver screen. Tap any book to consult Fictophiliac!
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Category Selector Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-2">
        {categories.map((cat) => {
          const isActive = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 border ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                  : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {getIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Header */}
      {activeCategory && (
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-zinc-100 flex items-center space-x-2">
              <span>{activeCategory.name}</span>
            </h3>
            <p className="text-xs text-zinc-400">{activeCategory.tagline}</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {activeCategory.books.length} curated titles
          </span>
        </div>
      )}

      {/* Grid of Curated News Tiles */}
      {activeCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory.books.map((b) => {
            const wishlisted = isWishlisted ? isWishlisted(b.title) : false;
            return (
              <div
                key={b.id}
                className="group bg-[#151518] border border-zinc-800/90 hover:border-brand-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 animate-fade-in"
              >
                <div>
                  <div className="flex space-x-4">
                    <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md border border-zinc-700/60 relative">
                      <img
                        src={b.cover_url}
                        alt={b.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/300x450/1e293b/f8fafc?text=${encodeURIComponent(
                            b.title.slice(0, 16)
                          )}`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 mb-1.5">
                            {b.badge}
                          </span>
                          {onToggleWishlist && (
                            <button
                              onClick={() => onToggleWishlist(b)}
                              className={`p-1 transition ${
                                wishlisted
                                  ? 'text-rose-500'
                                  : 'text-zinc-500 hover:text-rose-400'
                              }`}
                              title={wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  wishlisted ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-base text-zinc-100 leading-snug line-clamp-2">
                          {b.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium mt-0.5">
                          by <span className="text-zinc-200">{b.author}</span>
                          {b.year ? ` (${b.year})` : ''}
                        </p>
                      </div>

                      <div className="text-[11px] text-brand-400 font-medium">
                        {b.genre}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-4 line-clamp-3 leading-relaxed">
                    {b.description}
                  </p>

                  {b.extra_meta && (
                    <div className="mt-3 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span>{b.extra_meta}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => onSelectBookForChat(b)}
                    className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm shadow-brand-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Fictophiliac About This Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
