import React from 'react';
import { BookMarked, CheckCheck, MessagesSquare, Newspaper, User } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, apiStatus, readCount, onOpenHistory }) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('chat')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amberGlow flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Fictophiliac
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">GenAI Reading Concierge</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-zinc-800/80 border border-zinc-700/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessagesSquare className="w-3.5 h-3.5" />
            <span>Fictophiliac Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'news'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Spotlight &amp; News</span>
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'creator'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>About Saachi</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${apiStatus?.gemini_configured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
            <span className="text-[11px]">
              {apiStatus?.gemini_configured ? 'Gemini 2.5 Flash' : 'Catalog Preview Mode'}
            </span>
          </div>

          <button
            onClick={onOpenHistory}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-200 flex items-center space-x-2 transition shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Read History</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              {readCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
