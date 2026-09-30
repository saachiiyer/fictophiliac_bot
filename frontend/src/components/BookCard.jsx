import React from 'react';
import { Check, Sparkles, FileText, Loader2, Heart } from 'lucide-react';

export default function BookCard({
  book,
  index,
  isReplacing,
  onMarkAsRead,
  onToggleWishlist,
  isWishlisted = false,
}) {
  if (isReplacing) {
    return (
      <div className="bg-[#151518] border border-emerald-500/40 rounded-2xl p-6 min-h-[360px] flex flex-col items-center justify-center space-y-3 text-center animate-pulse">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <h4 className="text-sm font-semibold text-emerald-300">
          Marked &quot;{book.title}&quot; as read!
        </h4>
        <p className="text-xs text-zinc-400 max-w-xs">
          Fictophiliac is selecting an alternative recommendation...
        </p>
      </div>
    );
  }

  const fallbackCover = `https://placehold.co/300x450/1e293b/f8fafc?text=${encodeURIComponent(
    book.title.slice(0, 20)
  )}`;

  return (
    <div className="group relative bg-[#151518] border border-zinc-800/90 hover:border-brand-500/50 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 animate-fade-in">
      <div>
        <div className="flex space-x-3.5 relative">
          <div className="w-20 sm:w-24 h-32 sm:h-36 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md border border-zinc-700/60 relative">
            <img
              src={book.cover_url || fallbackCover}
              alt={book.title}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackCover;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/25 mb-1">
                  {book.genre || 'Fiction'}
                </span>

                {/* WISHLIST HEART WITH HOVER TOOLTIP */}
                <div className="relative group/heart">
                  <button
                    onClick={() => onToggleWishlist && onToggleWishlist(book)}
                    className={`p-1.5 rounded-lg transition ${
                      isWishlisted
                        ? 'text-rose-500 hover:text-rose-400'
                        : 'text-zinc-500 hover:text-rose-400'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                      }`}
                    />
                  </button>

                  {/* Hover explanation tooltip */}
                  <div className="absolute right-0 bottom-full mb-1 hidden group-hover/heart:block w-48 p-2 rounded-lg bg-zinc-950 border border-zinc-800 shadow-2xl text-[10px] text-zinc-300 z-30 pointer-events-none">
                    <span className="font-semibold text-rose-400 block mb-0.5">
                      {isWishlisted ? '❤️ In Your Wishlist' : '🤍 Save to Wishlist'}
                    </span>
                    Save this book to your reading queue to purchase or read later.
                  </div>
                </div>
              </div>

              <h3 className="font-serif font-bold text-sm sm:text-base text-zinc-100 leading-snug line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                by <span className="text-zinc-200">{book.author}</span>
              </p>
            </div>

            <div className="text-[11px] text-zinc-500 mt-2 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>{book.page_count || 'Standard novel'}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mt-3 line-clamp-3 leading-relaxed">
          {book.summary}
        </p>

        <div className="mt-2.5 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
          <p className="text-[11px] text-amber-300/90 font-medium flex items-start space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{book.match_reason}</span>
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80">
        <button
          onClick={() => onMarkAsRead(index, book)}
          className="w-full py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-emerald-600/90 text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-emerald-500/80 text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm group/btn"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-white" />
          <span>Mark as Read &amp; Replace</span>
        </button>
      </div>
    </div>
  );
}
