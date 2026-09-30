import React from 'react';
import {
  Bookmark,
  X,
  User,
  BookOpen,
  Heart,
  PlusCircle,
  ChevronRight,
  Compass,
  MessageSquare,
  Newspaper,
  UserCheck,
} from 'lucide-react';

export default function SideNavBar({
  isOpen,
  onClose,
  user = { name: 'Reader' },
  onOpenSignIn,
  onOpenLibrary,
  onOpenWishlist,
  onOpenRecommend,
  onNavigate,
  readCount = 0,
  wishlistCount = 0,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full bg-zinc-950 border-r border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white text-xs">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-zinc-100">Fictophiliac</h3>
                <p className="text-[10px] text-zinc-500">The Literary Cave</p>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Sign-In Profile Strip */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center text-sm font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">{user.name}</p>
                <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Active Reader</span>
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSignIn}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              Manage
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <button
              onClick={onOpenLibrary}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 text-xs font-semibold transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>My Library</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {readCount} read
              </span>
            </button>

            <button
              onClick={onOpenWishlist}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 text-xs font-semibold transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>My Wishlist</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                {wishlistCount}
              </span>
            </button>

            <button
              onClick={onOpenRecommend}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 text-xs font-semibold transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Recommend More Books</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
            </button>

            <div className="pt-3 border-t border-zinc-900 space-y-1">
              <button
                onClick={() => onNavigate('hub')}
                className="w-full px-4 py-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs text-left flex items-center space-x-3"
              >
                <Compass className="w-4 h-4" />
                <span>Literary Cave Entrance</span>
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="w-full px-4 py-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs text-left flex items-center space-x-3"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Fictophiliac Concierge Chat</span>
              </button>
              <button
                onClick={() => onNavigate('news')}
                className="w-full px-4 py-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs text-left flex items-center space-x-3"
              >
                <Newspaper className="w-4 h-4" />
                <span>Bookish Spotlights</span>
              </button>
              <button
                onClick={() => onNavigate('creator')}
                className="w-full px-4 py-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs text-left flex items-center space-x-3"
              >
                <UserCheck className="w-4 h-4" />
                <span>About Me</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Footer */}
        <div className="pt-4 border-t border-zinc-900 text-center">
          <p className="text-[11px] text-zinc-500">Fictophiliac v2.0 • Created by Saachi</p>
        </div>
      </div>
    </div>
  );
}

