import React, { useState } from 'react';
import {
  PlusCircle,
  X,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  CheckCheck,
} from 'lucide-react';
import apiService from '../services/api';

export default function RecommendBookModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [urlInput, setUrlInput] = useState('');
  const [isVerifyingUrl, setIsVerifyingUrl] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  // Handle book search recognition
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await apiService.searchBooks(q.trim());
      setSearchResults(results || []);
    } catch (err) {
      console.warn('Search error', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit recognized book
  const handleSelectBook = async (book) => {
    try {
      await apiService.submitRecommendation({
        title: book.title,
        author: book.author,
        source_url: 'Recognized from Search',
        note: 'Recommended by community reader',
      });
      setFeedback({
        type: 'success',
        message: `Awesome! "${book.title}" by ${book.author} has been submitted to our literary catalog.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Could not submit recommendation. Please try again.',
      });
    }
  };

  // Verify URL Fallback
  const handleVerifyUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsVerifyingUrl(true);
    setFeedback(null);
    try {
      const data = await apiService.verifyAndAddUrl(urlInput.trim());
      if (data.verified) {
        setFeedback({ type: 'success', message: data.message });
        setUrlInput('');
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to verify URL. Please ensure it is a valid book or purchase link.',
      });
    } finally {
      setIsVerifyingUrl(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#151518] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-zinc-100 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-brand-400" />
              <span>Recommend a Book</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Have an unmissable read or a hidden gem that belongs in our archives? Add it below!
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1">
          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-start space-x-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-600/50 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 1. Search Dropdown / Recognition Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Search &amp; Recognize Book Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type book title or author name..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
              />
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </span>
            </div>

            {/* Search Results Dropdown List */}
            {searchResults.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 space-y-1.5 shadow-xl max-h-56 overflow-y-auto custom-scrollbar">
                {searchResults.map((b, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectBook(b)}
                    className="p-2.5 rounded-xl hover:bg-zinc-800/90 border border-transparent hover:border-zinc-700 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={b.cover_url}
                        alt={b.title}
                        className="w-8 h-12 object-cover rounded shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x450/1e293b/f8fafc?text=Book";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-zinc-200 group-hover:text-brand-300 truncate">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          by {b.author} ({b.year || 'Modern'})
                        </p>
                      </div>
                    </div>
                    <button className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {hasSearched && searchResults.length === 0 && !isSearching && (
              <p className="text-[11px] text-zinc-500 italic pl-1">
                No matching book found in library search. Use the URL option below!
              </p>
            )}
          </div>

          {/* 2. URL Fallback Section */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <LinkIcon className="w-4 h-4" />
              <span>Not Able to Find the Book You Want to Recommend?</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Don&apos;t worry, we got you covered. Just drop a purchase or Goodreads URL here and our app will verify if the book exists and add it to our recommendation catalog.
            </p>

            <form onSubmit={handleVerifyUrl} className="space-y-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.amazon.com/dp/... or goodreads.com/book/show/..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="submit"
                disabled={!urlInput.trim() || isVerifyingUrl}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-md shadow-amber-600/20"
              >
                {isVerifyingUrl ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Book URL...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    <span>Verify &amp; Add Book to Cave</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

