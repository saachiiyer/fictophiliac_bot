import React, { useState, useEffect } from 'react';
import { Menu, Bookmark, Heart, BookOpen } from 'lucide-react';

import HubLandingView from './components/HubLandingView';
import ChatbotWindow from './components/ChatbotWindow';
import CuratedNewsSection from './components/CuratedNewsSection';
import AboutCreator from './components/AboutCreator';
import SideNavBar from './components/SideNavBar';
import RecommendBookModal from './components/RecommendBookModal';
import WishlistModal from './components/WishlistModal';
import ReadingHistoryModal from './components/ReadingHistoryModal';
import AuthModal from './components/AuthModal';

import { useRecommendations } from './hooks/useRecommendations';
import { useReadingHistory } from './hooks/useReadingHistory';
import apiService from './services/api';

export default function App() {
  // Main view state: 'hub' (Hero + Hub) | 'chat' | 'news' | 'creator'
  const [currentView, setCurrentView] = useState('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

  // User State
  const [user, setUser] = useState({ name: 'Saachi & Fellow Bookworms', signedIn: true });
  const [apiStatus, setApiStatus] = useState(null);
  const [curatedCategories, setCuratedCategories] = useState([]);
  const [communityReviews, setCommunityReviews] = useState([]);

  // Wishlist persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const s = localStorage.getItem('fictophiliac_wishlist');
      return s ? JSON.parse(s) : [
        {
          title: "Daisy Darker",
          author: "Alice Feeney",
          genre: "Psychological Thriller",
          cover_url: "https://covers.openlibrary.org/b/id/12836262-M.jpg"
        },
        {
          title: "Prophet Song",
          author: "Paul Lynch",
          genre: "Dystopian / Booker Winner",
          cover_url: "https://covers.openlibrary.org/b/id/13936994-M.jpg"
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fictophiliac_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [wishlist]);

  // Read books hook
  const {
    readBooks,
    readCount,
    addReadBook,
    clearHistory,
  } = useReadingHistory();

  // Recommendations hook
  const {
    recommendations,
    replacingIndex,
    fetchRecommendations,
    replaceBook,
    resetRecommendations,
  } = useRecommendations();

  // Chat conversation state
  const [chatStep, setChatStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState({
    previousReads: [],
    favoriteAuthors: [],
    preferredGenres: [],
  });

  // Initial loads: greeting, health, curated shelves, reviews
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay = 'Good evening';
    if (hour >= 5 && hour < 12) timeOfDay = 'Good morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'Good afternoon';

    setMessages([
      {
        sender: 'bot',
        text: `Hi, ${timeOfDay}! 📖 I am Fictophiliac, your personal GenAI reading concierge created by Saachi Iyer.\n\nWelcome to my Literary Cave! To get started, what are 1 to 3 books you've loved recently?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickPicks: {
          type: 'reads',
          items: [
            'The Palace of Illusions by Chitra Banerjee',
            'A Thousand Splendid Suns by Khaled Hosseini',
            'Daisy Darker by Alice Feeney',
            'The Love Hypothesis by Ali Hazelwood',
            'The Immortals of Meluha by Amish Tripathi',
          ]
        }
      }
    ]);

    async function loadData() {
      try {
        const status = await apiService.getHealthStatus();
        setApiStatus(status);
      } catch (err) {
        console.warn('Backend status unreachable', err);
      }

      try {
        const curated = await apiService.getCuratedShelves();
        setCuratedCategories(curated.categories || []);
      } catch (err) {
        console.warn('Curated shelves unreachable', err);
      }

      try {
        const reviews = await apiService.getReviews();
        setCommunityReviews(reviews || []);
      } catch (err) {
        console.warn('Reviews unreachable', err);
      }
    }

    loadData();
  }, []);

  // Wishlist toggle
  const toggleWishlist = (book) => {
    const exists = wishlist.some((b) => b.title.toLowerCase() === book.title.toLowerCase());
    if (exists) {
      setWishlist((prev) => prev.filter((b) => b.title.toLowerCase() !== book.title.toLowerCase()));
    } else {
      setWishlist((prev) => [book, ...prev]);
    }
  };

  const isWishlisted = (title) => {
    return wishlist.some((b) => b.title.toLowerCase() === title.toLowerCase());
  };

  // Mark as Read and Replace
  const handleMarkAsRead = async (index, book) => {
    addReadBook(book);
    // Remove from wishlist if read
    setWishlist((prev) => prev.filter((b) => b.title.toLowerCase() !== book.title.toLowerCase()));

    try {
      await replaceBook(index, {
        readBook: book.title,
        previousReads: userProfile.previousReads,
        favoriteAuthors: userProfile.favoriteAuthors,
        preferredGenres: userProfile.preferredGenres,
        excludedTitles: readBooks.map((b) => b.title).concat([book.title]),
      });
    } catch (err) {
      console.error('Error replacing book:', err);
    }
  };

  // Local tone-aware heuristic fallback that reads the room immediately
  const getLocalChatReaction = (step, text) => {
    const lower = (text || '').toLowerCase();
    if (step === 1) {
      if (
        lower.includes('palace of illusions') ||
        lower.includes('forest of enchantments') ||
        lower.includes('immortals') ||
        lower.includes('chitra') ||
        lower.includes('amish') ||
        lower.includes('namesake') ||
        lower.includes('mythology')
      ) {
        return "What an enchanting selection! Lyrical mythological retellings and evocative Indian narratives with profound feminine strength and depth.\n\nWho are 1 to 3 of your all-time favorite authors?";
      }
      if (
        lower.includes('splendid suns') ||
        lower.includes('lemon tree') ||
        lower.includes('kite runner') ||
        lower.includes('hosseini') ||
        lower.includes('katouh') ||
        lower.includes('nightingale') ||
        lower.includes('historical') ||
        lower.includes('grief') ||
        lower.includes('salt to the sea')
      ) {
        return "Profound and deeply moving choices. Stories of human resilience, heartbreaking beauty, and indelible courage in the face of sorrow.\n\nWho are 1 to 3 of your all-time favorite authors?";
      }
      if (
        lower.includes('romance') ||
        lower.includes('love hypothesis') ||
        lower.includes('hazelwood') ||
        lower.includes('colleen') ||
        lower.includes('henry')
      ) {
        return "Delightful choices packed with emotional connection, witty banter, and heartfelt warmth!\n\nWho are 1 to 3 of your all-time favorite authors?";
      }
      if (
        lower.includes('thriller') ||
        lower.includes('housemaid') ||
        lower.includes('mcfadden') ||
        lower.includes('christie') ||
        lower.includes('feeney')
      ) {
        return "Edge-of-your-seat picks! High-stakes suspense and psychological tension that keep you guessing.\n\nWho are 1 to 3 of your all-time favorite authors?";
      }
      return "Splendid selection! Those reflect such thoughtful and distinctive literary taste.\n\nWho are 1 to 3 of your all-time favorite authors?";
    }

    if (step === 2) {
      if (
        lower.includes('chitra') ||
        lower.includes('durjoy') ||
        lower.includes('datta') ||
        lower.includes('dutta') ||
        lower.includes('siddharth') ||
        lower.includes('maheshwari') ||
        lower.includes('shanghvi') ||
        lower.includes('amish') ||
        lower.includes('ashwin') ||
        lower.includes('jhumpa') ||
        lower.includes('lahiri') ||
        lower.includes('arundhati')
      ) {
        return "Exceptional Indian storytellers! They craft such wonderful cultural richness, intricate relationships, and emotional resonance.\n\nFinally, what genres, tropes, or emotional reading vibes are you craving today?";
      }
      if (
        lower.includes('hosseini') ||
        lower.includes('hannah') ||
        lower.includes('doerr') ||
        lower.includes('katouh') ||
        lower.includes('sepetys') ||
        lower.includes('backman')
      ) {
        return "Masters of deeply emotional storytelling, human resilience, and unforgettable historical tapestries.\n\nFinally, what genres, tropes, or emotional reading vibes are you craving today?";
      }
      if (
        lower.includes('hazelwood') ||
        lower.includes('henry') ||
        lower.includes('lauren') ||
        lower.includes('mcquiston')
      ) {
        return "Terrific contemporary voices known for smart humor, tender moments, and irresistible chemistry.\n\nFinally, what genres, tropes, or reading vibes are you craving today?";
      }
      if (
        lower.includes('christie') ||
        lower.includes('feeney') ||
        lower.includes('mcfadden') ||
        lower.includes('jackson') ||
        lower.includes('jewell')
      ) {
        return "Masters of suspense, locked rooms, and clever psychological puzzles.\n\nFinally, what genres or tropes are you in the mood for right now?";
      }
      return "Incredible authors with distinct voices and compelling storytelling!\n\nFinally, what genres, tropes, or reading vibes are you craving today?";
    }

    return "Understood! Let's tailor your recommendations to that exact reading mood.";
  };

  // Chat message submission
  const handleSendMessage = async (text) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text, time: now }]);

    if (chatStep === 1) {
      const reads = text.split(/,|\sand\s/i).map((r) => r.trim()).filter(Boolean);
      setUserProfile((p) => ({ ...p, previousReads: reads }));
      setChatStep(2);

      setIsTyping(true);
      try {
        const res = await apiService.getChatReaction({
          step: 1,
          inputText: text,
          previousReads: reads,
        });
        const replyText = res?.reply || getLocalChatReaction(1, text);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: {
              type: 'authors',
              items: ['Chitra Banerjee Divakaruni', 'Khaled Hosseini', 'Durjoy Datta', 'Amish Tripathi', 'Agatha Christie', 'Ali Hazelwood']
            }
          }
        ]);
      } catch (e) {
        const fallbackText = getLocalChatReaction(1, text);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: fallbackText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: {
              type: 'authors',
              items: ['Chitra Banerjee Divakaruni', 'Khaled Hosseini', 'Durjoy Datta', 'Amish Tripathi', 'Agatha Christie', 'Ali Hazelwood']
            }
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    } else if (chatStep === 2) {
      const authors = text.split(/,|\sand\s/i).map((a) => a.trim()).filter(Boolean);
      setUserProfile((p) => ({ ...p, favoriteAuthors: authors }));
      setChatStep(3);

      setIsTyping(true);
      try {
        const res = await apiService.getChatReaction({
          step: 2,
          inputText: text,
          previousReads: userProfile.previousReads,
          favoriteAuthors: authors,
        });
        const replyText = res?.reply || getLocalChatReaction(2, text);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: { type: 'genres' }
          }
        ]);
      } catch (e) {
        const fallbackText = getLocalChatReaction(2, text);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: fallbackText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: { type: 'genres' }
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    } else if (chatStep === 3) {
      const genres = text.split(/,|\sand\s/i).map((g) => g.trim()).filter(Boolean);
      const updated = { ...userProfile, preferredGenres: genres };
      setUserProfile(updated);
      setChatStep(4);
      triggerGeneration(updated);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        triggerGeneration(userProfile);
      }, 800);
    }
  };

  const handleSkipStep = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: '⏩ Skipped this question', time: now }]);

    if (chatStep === 1) {
      setChatStep(2);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `No problem at all! Who are 1 to 3 of your favorite authors?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: {
              type: 'authors',
              items: ['Chitra Banerjee Divakaruni', 'Khaled Hosseini', 'Durjoy Datta', 'Amish Tripathi', 'Agatha Christie', 'Ali Hazelwood']
            }
          }
        ]);
      }, 600);
    } else if (chatStep === 2) {
      setChatStep(3);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Skipped! What genres, themes, or reading vibes are you craving today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickPicks: { type: 'genres' }
          }
        ]);
      }, 600);
    } else if (chatStep === 3) {
      setChatStep(4);
      triggerGeneration(userProfile);
    }
  };

  const triggerGeneration = async (profile) => {
    setIsTyping(true);
    try {
      await fetchRecommendations({
        previousReads: profile.previousReads,
        favoriteAuthors: profile.favoriteAuthors,
        preferredGenres: profile.preferredGenres || [],
        excludedTitles: readBooks.map((b) => b.title),
        count: 6,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `✨ I've calibrated your tastes with Gemini! Here are your handpicked recommendations.\n\n• Tap the 🤍 heart to add to your Wishlist\n• Tap "Mark as Read & Replace" on any card to swap it for a fresh alternative!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans selection:bg-[#e06b53] selection:text-white antialiased">
      {/* Top Bar with Sidebar Trigger */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div
              onClick={() => {
                setCurrentView('hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white text-xs shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Fictophiliac
              </span>
            </div>
          </div>

          {/* View Switcher Pills */}
          <div className="hidden md:flex items-center bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setCurrentView('hub')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentView === 'hub'
                  ? 'bg-brand-600 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Literary Cave
            </button>
            <button
              onClick={() => setCurrentView('chat')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentView === 'chat'
                  ? 'bg-brand-600 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Concierge Chat
            </button>
            <button
              onClick={() => setCurrentView('news')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentView === 'news'
                  ? 'bg-brand-600 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Spotlights
            </button>
            <button
              onClick={() => setCurrentView('creator')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentView === 'creator'
                  ? 'bg-brand-600 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              About Me
            </button>
          </div>

          {/* Right Shortcut Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-rose-400 hover:text-rose-300 transition relative"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsLibraryOpen(true)}
              className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 hover:text-emerald-300 transition relative"
              title="My Library"
            >
              <BookOpen className="w-5 h-5" />
              {readCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {readCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 w-full">
        {currentView === 'hub' && (
          <HubLandingView
            onExploreCave={() => {
              const el = document.getElementById('cave-hub-content');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenChat={() => {
              setCurrentView('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNews={() => {
              setCurrentView('news');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCreator={() => {
              setCurrentView('creator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            reviews={communityReviews}
            categories={curatedCategories}
            onSelectBookForChat={(book) => {
              setCurrentView('chat');
              handleSendMessage(
                `I'm curious about "${book.title}" by ${book.author} (${book.badge}). Can you recommend similar books?`
              );
            }}
          />
        )}

        {currentView === 'chat' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <ChatbotWindow
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onSkipStep={handleSkipStep}
              chatStep={chatStep}
              recommendations={recommendations}
              replacingIndex={replacingIndex}
              onMarkAsRead={handleMarkAsRead}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
              onResetChat={() => {
                setChatStep(1);
                resetRecommendations();
                setUserProfile({ previousReads: [], favoriteAuthors: [], preferredGenres: [] });
                setMessages([
                  {
                    sender: 'bot',
                    text: `Restarted! What are 1 to 3 books you've loved recently?`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickPicks: {
                      type: 'reads',
                      items: [
                        'Daisy Darker by Alice Feeney',
                        'And Then There Were None by Agatha Christie',
                        'The Love Hypothesis by Ali Hazelwood',
                      ],
                    },
                  },
                ]);
              }}
            />
          </div>
        )}

        {currentView === 'news' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <CuratedNewsSection
              categories={curatedCategories}
              onSelectBookForChat={(book) => {
                setCurrentView('chat');
                handleSendMessage(
                  `I'm curious about "${book.title}" by ${book.author} (${book.badge}). Can you recommend similar books?`
                );
              }}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
            />
          </div>
        )}

        {currentView === 'creator' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AboutCreator
              onConsultCreatorTaste={() => {
                setCurrentView('chat');
                handleSendMessage(
                  `I'd love recommendations matching Saachi's taste: psychological thrillers like Daisy Darker, locked-room mysteries like Agatha Christie, and fast-paced domestic suspense like Freida McFadden!`
                );
              }}
            />
          </div>
        )}
      </main>

      {/* SIDE NAVIGATION BAR */}
      <SideNavBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onOpenSignIn={() => {
          setIsSidebarOpen(false);
          setIsAuthModalOpen(true);
        }}
        onOpenLibrary={() => {
          setIsSidebarOpen(false);
          setIsLibraryOpen(true);
        }}
        onOpenWishlist={() => {
          setIsSidebarOpen(false);
          setIsWishlistOpen(true);
        }}
        onOpenRecommend={() => {
          setIsSidebarOpen(false);
          setIsRecommendModalOpen(true);
        }}
        onNavigate={(view) => {
          setIsSidebarOpen(false);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        readCount={readCount}
        wishlistCount={wishlist.length}
      />

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSignIn={(name) => {
          setUser({ name: name || 'Saachi & Readers', signedIn: true });
          setIsAuthModalOpen(false);
        }}
      />

      <ReadingHistoryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        readBooks={readBooks}
        onClearHistory={clearHistory}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={(book) => toggleWishlist(book)}
        onConsultBook={(book) => {
          setIsWishlistOpen(false);
          setCurrentView('chat');
          handleSendMessage(
            `I have "${book.title}" in my Wishlist. Can you tell me what makes it worth reading?`
          );
        }}
      />

      <RecommendBookModal
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
      />
    </div>
  );
}
