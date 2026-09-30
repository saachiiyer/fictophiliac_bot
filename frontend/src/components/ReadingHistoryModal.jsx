import React from 'react';
import { X, CheckCheck, BookOpen, Trash2 } from 'lucide-react';

export default function ReadingHistoryModal({ isOpen, onClose, readBooks, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-darkCard border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <CheckCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif font-bold text-lg text-zinc-100">
              Books You&apos;ve Marked as Read
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {readBooks.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-60" />
              You haven&apos;t marked any recommendations as read yet.
            </div>
          ) : (
            readBooks.map((b, i) => (
              <div
                key={`${b.title}-${i}`}
                className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs transition hover:border-zinc-700"
              >
                <div>
                  <h4 className="font-semibold text-zinc-200">{b.title}</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    by {b.author} •{' '}
                    <span className="text-brand-400">{b.genre}</span>
                  </p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {b.markedAt}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{readBooks.length} books read</span>
          {readBooks.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-rose-400 hover:text-rose-300 transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

