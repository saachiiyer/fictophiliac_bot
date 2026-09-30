import React, { useState } from 'react';
import { User, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, user = { name: '' }, onSignIn }) {
  const [nameInput, setNameInput] = useState(user.name || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignIn) {
      onSignIn(nameInput.trim() || 'Bookworm');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#151518] border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-serif font-bold text-base text-zinc-100 flex items-center space-x-2">
            <User className="w-5 h-5 text-brand-400" />
            <span>Reader Profile</span>
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Set your reader name to customize Fictophiliac recommendations and save your Library.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your reader name..."
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition"
          >
            Save &amp; Continue Reading
          </button>
        </form>
      </div>
    </div>
  );
}

