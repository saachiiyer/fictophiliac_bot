import React, { useState } from 'react';
import { Sparkles, Instagram, Mail, MessageCircle, Flame, PenTool, Quote } from 'lucide-react';

export default function AboutCreator({ onConsultCreatorTaste }) {
  const [imgError, setImgError] = useState(false);

  const saachiFavorites = [
    {
      title: "Daisy Darker",
      author: "Alice Feeney",
      tag: "My Signature Thriller",
      reason: "Atmospheric, claustrophobic, and features one of the most stunning family secret reveals in modern fiction.",
      cover: "https://covers.openlibrary.org/b/id/13231964-M.jpg"
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      tag: "My All-Time Classic",
      reason: "The gold standard of locked-room mysteries; flawless tension that defines the genre.",
      cover: "https://covers.openlibrary.org/b/id/11172296-M.jpg"
    },
    {
      title: "The Love Hypothesis",
      author: "Ali Hazelwood",
      tag: "My Comfort Romance",
      reason: "Smart academic banter, genuine emotional warmth, and pitch-perfect fake-dating tropes.",
      cover: "https://covers.openlibrary.org/b/id/10601402-M.jpg"
    },
    {
      title: "The Housemaid",
      author: "Freida McFadden",
      tag: "Binge-Worthy Mystery",
      reason: "Relentless pacing and jaw-dropping reversals that keep you awake until 3 AM.",
      cover: "https://covers.openlibrary.org/b/id/15105883-M.jpg"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Creator Profile Hero Card */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-[#151518] to-brand-950/40 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Creator Photo & Logo-Only Contact Buttons */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-brand-600 via-amber-500 to-brand-500 p-1 shadow-2xl shadow-brand-500/25">
              <div className="w-full h-full bg-zinc-950 rounded-[22px] overflow-hidden flex items-center justify-center">
                {!imgError ? (
                  <img
                    src="/saachi.jpg"
                    alt="Saachi Iyer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-[22px] hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="font-serif text-3xl font-bold bg-gradient-to-r from-zinc-100 via-brand-200 to-amber-300 bg-clip-text text-transparent">
                      SI
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
                      Creator
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* LOGOS ONLY - NO TEXT HANDLES / RAW NUMBERS / RAW EMAILS */}
            <div className="flex items-center space-x-3 mt-4">
              {/* Instagram Logo */}
              <a
                href="https://www.instagram.com/_fictophiliac_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/60 text-zinc-400 hover:text-pink-400 flex items-center justify-center transition shadow-md hover:scale-110"
                title="Follow me on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* Email Logo */}
              <a
                href="mailto:saachiiyer25@gmail.com"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 text-zinc-400 hover:text-amber-400 flex items-center justify-center transition shadow-md hover:scale-110"
                title="Send me an Email"
              >
                <Mail className="w-5 h-5" />
              </a>

              {/* WhatsApp Logo */}
              <a
                href="https://wa.me/91990781296"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition shadow-md hover:scale-110"
                title="Chat with me on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bio Content - FIRST PERSON PERSPECTIVE */}
          <div className="flex-1 text-center md:text-left space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Mind Behind Fictophiliac</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100">
              Hi, I&apos;m Saachi Iyer.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              I am an avid reader, book reviewer, and devoted fictophile. Beyond any corporate titles, I am a story-first book lover who lives in the pages of unputdownable psychological thrillers, locked-room detective puzzles, and witty contemporary romance.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              I share my reading journey on Bookstagram and Goodreads. I created <strong>Fictophiliac</strong> out of my own personal reader&apos;s itch: I was tired of static, repetitive book lists. I wanted an AI that recommends books with genuine literary taste, understands tropes, and lets you mark books you&apos;ve already conquered so they get replaced on the spot.
            </p>

            <div className="pt-2">
              <button
                onClick={onConsultCreatorTaste}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-brand-500/20 flex items-center space-x-2 mx-auto md:mx-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Fictophiliac For Books Matching My Taste</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Blueprint - First Person */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#151518] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-100">My Favorite Reading Moods</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            High-stakes psychological dread, unreliable narrators, stormy manor settings, and razor-sharp romantic banter.
          </p>
        </div>

        <div className="bg-[#151518] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <PenTool className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-100">My Go-To Authors</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Agatha Christie, Alice Feeney, Freida McFadden, Holly Jackson, and Ali Hazelwood.
          </p>
        </div>

        <div className="bg-[#151518] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Quote className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-100">My Reading Philosophy</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            &ldquo;Life is too short for boring books. If a book doesn&apos;t hook you by chapter three, replace it with one that keeps you up until dawn.&rdquo;
          </p>
        </div>
      </div>

      {/* Hall of Fame */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h3 className="font-serif font-bold text-xl text-zinc-100 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span>My Hall-of-Fame Reads</span>
          </h3>
          <span className="text-xs text-zinc-500">Books that inspired Fictophiliac</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {saachiFavorites.map((b, i) => (
            <div
              key={i}
              className="bg-[#151518] border border-zinc-800/90 hover:border-brand-500/50 rounded-2xl p-4 flex flex-col justify-between transition hover:shadow-xl group"
            >
              <div>
                <div className="w-full h-48 rounded-xl overflow-hidden bg-zinc-800 mb-3 shadow-md border border-zinc-700/60">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/300x450/1e293b/f8fafc?text=${encodeURIComponent(b.title.slice(0, 16))}`;
                    }}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/25">
                  {b.tag}
                </span>

                <h4 className="font-serif font-bold text-base text-zinc-100 mt-2 line-clamp-1">
                  {b.title}
                </h4>
                <p className="text-xs text-zinc-400">by {b.author}</p>

                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {b.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
