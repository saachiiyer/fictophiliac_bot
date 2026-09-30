import React from 'react';
import {
  Sparkles,
  ArrowDown,
  Wand2,
  Globe2,
  UserCheck,
  ArrowRight,
  RotateCw,
  Instagram,
  Star,
  Film,
  ExternalLink,
} from 'lucide-react';
import DynamicFlippingTiles from './DynamicFlippingTiles';

export default function HubLandingView({
  onExploreCave,
  onOpenChat,
  onOpenNews,
  onOpenCreator,
  reviews = [],
  categories = [],
  onSelectBookForChat,
}) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-b from-brand-600/20 via-amber-500/15 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-700/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs sm:text-sm font-medium animate-fade-in shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated by Saachi Iyer • Powered by Gemini GenAI</span>
          </div>

          {/* BIGGEST TITLE POSSIBLE */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-zinc-100 leading-[1.05] drop-shadow-2xl">
            Welcome to my <br />
            <span className="bg-gradient-to-r from-zinc-100 via-amber-200 to-brand-400 bg-clip-text text-transparent">
              Literary Cave
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 font-light leading-relaxed">
            Step inside the sanctuary of unforgettable plot twists, locked-room mysteries, and banter-filled romance. Here, every recommendation is tailored personally to your soul.
          </p>

          {/* CENTER ALIGNED EXPLORE THE CAVE BUTTON */}
          <div className="pt-6">
            <button
              onClick={onExploreCave}
              className="group px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-brand-600 via-amber-600 to-brand-500 hover:from-brand-500 hover:to-amber-500 text-white font-serif font-bold text-base sm:text-lg transition-all duration-300 shadow-2xl shadow-brand-500/30 hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <span>Explore the Cave</span>
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 text-xs flex flex-col items-center space-y-1 animate-pulse">
          <span>Scroll to enter</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </div>
      </section>

      {/* 2. CAVE HUB CONTENT SECTION */}
      <section
        id="cave-hub-content"
        className="w-full max-w-6xl px-4 py-16 space-y-16 border-t border-zinc-800/80"
      >
        {/* THREE PRIMARY ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            onClick={onOpenChat}
            className="group relative bg-[#151518] border border-zinc-800 hover:border-brand-500/60 rounded-3xl p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/20 flex flex-col justify-between overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-100 group-hover:text-brand-300 transition-colors">
                Get your next read sorted!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Chat with Fictophiliac AI to get custom books calibrated to your past favorites, authors, and tropes.
              </p>
            </div>
            <div className="mt-5 text-xs font-semibold text-brand-400 flex items-center space-x-1.5">
              <span>Start Concierge Chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={onOpenNews}
            className="group relative bg-[#151518] border border-zinc-800 hover:border-amber-500/60 rounded-3xl p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-100 group-hover:text-amber-300 transition-colors">
                Bookish Spotlights from around the World
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Discover Booker Prize winners across the years, Goodreads champions, Indian &amp; Global bestsellers, and page-to-screen adaptations.
              </p>
            </div>
            <div className="mt-5 text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
              <span>Browse Global Spotlights</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={onOpenCreator}
            className="group relative bg-[#151518] border border-zinc-800 hover:border-pink-500/60 rounded-3xl p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 flex flex-col justify-between overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-100 group-hover:text-pink-300 transition-colors">
                About Me
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Meet Saachi Iyer—the mind, Bookstagrammer, and fictophile behind Fictophiliac. Dive into my reading journey and Hall-of-Fame shelf.
              </p>
            </div>
            <div className="mt-5 text-xs font-semibold text-pink-400 flex items-center space-x-1.5">
              <span>Explore My Reading Life</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* DYNAMIC FLIPPING NEWS & SPOTLIGHT CARDS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="font-serif font-bold text-2xl text-zinc-100 flex items-center space-x-2">
                <RotateCw className="w-5 h-5 text-brand-400" />
                <span>Live Bookish Flips &amp; Adaptation News</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cards rotate every few seconds with breaking adaptations and literary awards
              </p>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              Auto-flipping live feed
            </span>
          </div>

          <DynamicFlippingTiles onOpenNews={onOpenNews} />
        </div>

        {/* INSTAGRAM REVIEWS & COMMUNITY REELS SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-pink-400 mb-1">
                <Instagram className="w-3.5 h-3.5" />
                <span>@_fictophiliac_ &amp; Bookstagram Sphere</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-zinc-100">
                My Reviews &amp; Community Opinions
              </h2>
            </div>
            <a
              href="https://www.instagram.com/_fictophiliac_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 text-zinc-300 hover:text-white transition flex items-center space-x-2 w-max"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Follow @_fictophiliac_</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#151518] border border-zinc-800 hover:border-brand-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
              >
                <div>
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          rev.is_creator
                            ? 'bg-gradient-to-tr from-brand-600 to-amber-500 text-white'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {rev.is_creator ? 'SI' : <Film className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                          <span>{rev.reviewer}</span>
                          {rev.is_creator && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 font-sans font-medium">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-pink-400">{rev.reviewer_handle}</p>
                      </div>
                    </div>

                    <span className="text-xs text-amber-400 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{rev.rating}</span>
                    </span>
                  </div>

                  {/* Book Reference Strip with verified cover */}
                  <div className="flex space-x-3 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 mb-3">
                    <img
                      src={rev.cover_url}
                      alt={rev.book_title}
                      className="w-10 h-14 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x150/1e293b/f8fafc?text=Book";
                      }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-serif font-bold text-xs text-zinc-100 truncate">
                        {rev.book_title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">by {rev.book_author}</p>
                      <span className="text-[10px] text-zinc-500">{rev.platform}</span>
                    </div>
                  </div>

                  {/* Quote Content */}
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500">
                    {rev.media_type === 'video_reel' ? '🎥 Reel Opinion' : '📝 Book Review'}
                  </span>
                  <a
                    href={rev.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:text-brand-300 font-medium transition flex items-center space-x-1"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

