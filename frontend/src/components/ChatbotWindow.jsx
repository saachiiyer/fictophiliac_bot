import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, Bot, User, FastForward, Check } from 'lucide-react';
import BookCard from './BookCard';

export default function ChatbotWindow({
  messages,
  isTyping,
  onSendMessage,
  onSkipStep,
  chatStep,
  recommendations,
  replacingIndex,
  onMarkAsRead,
  onResetChat,
}) {
  const [inputVal, setInputVal] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const chatEndRef = useRef(null);

  const toggleGenre = (genreWithIcon) => {
    const cleanGenre = genreWithIcon.replace(/^[^\w]+/, '').trim();
    setSelectedGenres((prev) => {
      if (prev.includes(cleanGenre)) {
        return prev.filter((g) => g !== cleanGenre);
      } else {
        return [...prev, cleanGenre];
      }
    });
  };

  const handleDoneGenres = () => {
    if (selectedGenres.length === 0) return;
    onSendMessage(selectedGenres.join(', '));
    setSelectedGenres([]);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, recommendations]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  const genreSuggestions = [
    '🇮🇳 Indian Fiction & Mythology',
    '💔 Emotional Historical Fiction',
    '💖 Contemporary Romance',
    '⚡ Psychological Thriller',
    '🔍 Mystery / Whodunit',
    '🏆 Literary Fiction & Booker',
    '✨ Fantasy / Mythological Retellings',
    '🌿 Human Resilience & Memoirs'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-darkCard/95 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in">
      {/* Chat Window Header */}
      <div className="px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-amberGlow flex items-center justify-center text-white text-sm shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900"></span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center space-x-2">
              <span>Fictophiliac Concierge</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-medium">GenAI Bot</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Trained on literary pacing, tropes &amp; author styles</p>
          </div>
        </div>

        <button
          onClick={onResetChat}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex-shrink-0 flex items-center justify-center text-brand-400 text-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-none'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Suggestion Chips in Question 1 */}
              {msg.quickPicks && msg.quickPicks.type === 'reads' && chatStep === 1 && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-zinc-400 w-full mb-1">Quick tap to select:</span>
                  {msg.quickPicks.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(item)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-brand-600 hover:text-white text-zinc-300 border border-zinc-700 transition"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestion Chips in Question 2 */}
              {msg.quickPicks && msg.quickPicks.type === 'authors' && chatStep === 2 && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-zinc-400 w-full mb-1">Popular author suggestions:</span>
                  {msg.quickPicks.items.map((author, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(author)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-brand-600 hover:text-white text-zinc-300 border border-zinc-700 transition"
                    >
                      {author}
                    </button>
                  ))}
                </div>
              )}

              {/* Genre Pills in Question 3 - Multi-Select with Done button */}
              {msg.quickPicks && msg.quickPicks.type === 'genres' && chatStep === 3 && (
                <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300 font-medium">
                      Select one or more reading vibes:
                    </span>
                    {selectedGenres.length > 0 && (
                      <span className="text-[11px] text-brand-400 font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/25">
                        {selectedGenres.length} selected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {genreSuggestions.map((g, i) => {
                      const clean = g.replace(/^[^\w]+/, '').trim();
                      const isSelected = selectedGenres.includes(clean);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-brand-600 to-amber-600 text-white border-amber-500/70 shadow-md shadow-brand-600/30 font-semibold scale-[1.02]'
                              : 'bg-zinc-800/90 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700 hover:border-zinc-600'
                          }`}
                        >
                          <span>{g}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Done Button to Trigger Selection */}
                  <div className="pt-1 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleDoneGenres}
                      disabled={selectedGenres.length === 0}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all duration-200 shadow-md ${
                        selectedGenres.length > 0
                          ? 'bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white shadow-brand-500/30 cursor-pointer'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {selectedGenres.length > 0
                          ? `Done • Get Recommendations (${selectedGenres.length} selected)`
                          : 'Select 1 or more genres above'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={onSkipStep}
                      className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition"
                    >
                      Skip step &rarr;
                    </button>
                  </div>
                </div>
              )}

              <span className="block text-[10px] text-zinc-500 mt-1.5 text-right">
                {msg.time}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-zinc-300 text-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Bot Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-400 bounce-1"></div>
              <div className="w-2 h-2 rounded-full bg-brand-400 bounce-2"></div>
              <div className="w-2 h-2 rounded-full bg-brand-400 bounce-3"></div>
              <span className="text-xs text-zinc-400 ml-2">Fictophiliac is consulting Gemini AI...</span>
            </div>
          </div>
        )}

        {/* Recommendations Grid inside Chat stream */}
        {recommendations && recommendations.length > 0 && (
          <div className="pt-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="font-serif font-bold text-base text-zinc-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Your Curated Book Recommendations ({recommendations.length})</span>
              </h4>
              <span className="text-[11px] text-emerald-400 font-medium">
                ✓ Tap &quot;Mark as Read&quot; to replace any book
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((book, idx) => (
                <BookCard
                  key={`${book.title}-${idx}`}
                  index={idx}
                  book={book}
                  isReplacing={replacingIndex === idx}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Skip Action Bar when on questions */}
      {chatStep >= 1 && chatStep <= 3 && (
        <div className="px-6 py-2 bg-zinc-900/60 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
          <span>
            {chatStep === 1 && "Step 1 of 3: Past Reads"}
            {chatStep === 2 && "Step 2 of 3: Favorite Authors"}
            {chatStep === 3 && "Step 3 of 3: Genres & Moods"}
          </span>
          <button
            onClick={onSkipStep}
            className="text-brand-400 hover:text-brand-300 font-medium transition flex items-center space-x-1"
          >
            <span>Skip this question</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center space-x-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            chatStep === 1
              ? "e.g. Daisy Darker by Alice Feeney, And Then There Were None..."
              : chatStep === 2
              ? "e.g. Holly Jackson, Agatha Christie, Freida McFadden..."
              : chatStep === 3
              ? "e.g. Psychological Thriller, Mystery, Romance..."
              : "Ask about a book, genre, or request more recommendations..."
          }
          className="flex-1 px-4 py-2.5 bg-zinc-800/90 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() && !isTyping}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-medium text-sm transition shadow-lg shadow-brand-600/20 flex items-center space-x-2"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
