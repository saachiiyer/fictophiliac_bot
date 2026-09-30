import React from 'react';
import { Heart, X, Trash2, Sparkles } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist = [],
  onRemove,
  onConsultBook,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#151518] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-serif font-bold text-lg text-zinc-100">My Wishlist</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-2 opacity-50 stroke-[1.5]" />
              Your wishlist is empty. Tap the heart icon on any book recommendation to queue it!
            </div>
          ) : (
            wishlist.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={b.cover_url}
                    alt={b.title}
                    className="w-9 h-12 object-cover rounded shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x150/1e293b/f8fafc?text=Book";
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-zinc-200 truncate">{b.title}</h4>
                    <p className="text-zinc-400 text-[11px] truncate">by {b.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onConsultBook(b)}
                    className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-medium flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask Bot</span>
                  </button>
                  <button
                    onClick={() => onRemove(b)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500 text-right">
          {wishlist.length} saved titles
        </div>
      </div>
    </div>
  );
}

