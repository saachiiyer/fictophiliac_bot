import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';

export default function DynamicFlippingTiles({ onOpenNews }) {
  const [flippedCards, setFlippedCards] = useState([false, false, false]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlippedCards((prev) => {
        const next = [...prev];
        const randIdx = Math.floor(Math.random() * next.length);
        next[randIdx] = !next[randIdx];
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tiles = [
    {
      id: 0,
      front: {
        tag: "🎬 Now Streaming on Netflix & BBC",
        title: "A Good Girl's Guide to Murder",
        author: "Holly Jackson",
        badge: "Page to Screen",
        desc: "Starring Emma Myers. Pip's investigative murder trial podcast comes to life on the screen.",
        cover: "https://covers.openlibrary.org/b/id/13156188-M.jpg"
      },
      back: {
        tag: "🎥 Theatrical Release",
        title: "It Ends With Us",
        author: "Colleen Hoover",
        badge: "Box Office Sensation",
        desc: "Starring Blake Lively and Justin Baldoni. The emotionally charged bestseller conquers cinemas worldwide.",
        cover: "https://covers.openlibrary.org/b/id/10473609-M.jpg"
      }
    },
    {
      id: 1,
      front: {
        tag: "🏆 Booker Prize Winner 2024",
        title: "Orbital",
        author: "Samantha Harvey",
        badge: "Literary Milestone",
        desc: "Six astronauts witness 16 sunrises in one day aboard the ISS, reflecting on human fragility.",
        cover: "https://covers.openlibrary.org/b/id/14541972-M.jpg"
      },
      back: {
        tag: "🏆 Booker Prize Winner 2023",
        title: "Prophet Song",
        author: "Paul Lynch",
        badge: "Devastating Masterpiece",
        desc: "A mother fights to protect her family as Ireland descends into totalitarian rule.",
        cover: "https://covers.openlibrary.org/b/id/14814200-M.jpg"
      }
    },
    {
      id: 2,
      front: {
        tag: "⭐ Goodreads Best Fiction",
        title: "Yellowface",
        author: "R.F. Kuang",
        badge: "Cultural Satire",
        desc: "A stolen manuscript, Twitter cancel culture, and publishing greed collide in a fast-paced thriller.",
        cover: "https://covers.openlibrary.org/b/id/13195421-M.jpg"
      },
      back: {
        tag: "🇮🇳 #1 National Bestseller",
        title: "The Immortals of Meluha",
        author: "Amish Tripathi",
        badge: "Indian Mythological Epic",
        desc: "Over 5 million copies sold. The legendary transformation of Shiva from Tibetan immigrant to Neelkanth savior.",
        cover: "https://covers.openlibrary.org/b/id/11152324-M.jpg"
      }
    }
  ];

  const handleTileClick = (idx) => {
    setFlippedCards((p) => {
      const next = [...p];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiles.map((t, idx) => {
        const isFlipped = flippedCards[idx];
        return (
          <div
            key={t.id}
            onClick={() => handleTileClick(idx)}
            className="perspective-1000 h-64 sm:h-72 cursor-pointer group"
            title="Click to flip tile"
          >
            <div
              className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT FACE */}
              <div className="absolute inset-0 backface-hidden bg-[#151518] border border-zinc-800 group-hover:border-brand-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-brand-400 mb-2">
                    <span>{t.front.tag}</span>
                    <RefreshCw className="w-3 h-3 text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  <div className="flex space-x-3.5">
                    <img
                      src={t.front.cover}
                      alt={t.front.title}
                      className="w-16 h-24 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x150/1e293b/f8fafc?text=Book";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-base text-zinc-100 leading-snug line-clamp-2">
                        {t.front.title}
                      </h4>
                      <p className="text-xs text-zinc-400">by {t.front.author}</p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-semibold">
                        {t.front.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 mt-3 line-clamp-2 leading-relaxed">
                    {t.front.desc}
                  </p>
                </div>
                <div className="text-[10px] text-zinc-500 text-right">Tap tile to flip &rarr;</div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-900 border border-brand-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-400 mb-2">
                    <span>{t.back.tag}</span>
                    <RefreshCw className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="flex space-x-3.5">
                    <img
                      src={t.back.cover}
                      alt={t.back.title}
                      className="w-16 h-24 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x150/1e293b/f8fafc?text=Book";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-base text-zinc-100 leading-snug line-clamp-2">
                        {t.back.title}
                      </h4>
                      <p className="text-xs text-zinc-400">by {t.back.author}</p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">
                        {t.back.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 mt-3 line-clamp-2 leading-relaxed">
                    {t.back.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenNews) onOpenNews();
                    }}
                    className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Explore in Spotlights</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span>Tap to flip back</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

