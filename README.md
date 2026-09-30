# Fictophiliac 📚✨
### The Literary Cave & GenAI Concierge by Saachi Iyer

**Fictophiliac** is an enterprise-structured literary recommendation ecosystem and digital cave created by avid reader, reviewer, and Bookstagrammer **Saachi Iyer**. Powered by **Python FastAPI** and **Google Gemini 3.5 Flash**, with a dynamic, dark-mode **React** frontend.

---

## 🌟 Key Features & Experience

### 1. 🏰 Welcome to my Literary Cave (Hero Landing)
- **Massive Typography**: Grand cinematic welcome banner with atmospheric ambient glow.
- **Center-Aligned "Explore the Cave" Button**: Smoothly scrolls down to the interactive Cave Hub.

### 2. 🎛️ Interactive Cave Hub & 3 Primary Action Buttons
- **Get your next read sorted!**: Launches the conversational Fictophiliac Chatbot.
- **Bookish Spotlights from around the World**: Deep-dives into award-winning catalogs and charts.
- **About Me**: Explores Saachi Iyer's reading life, taste blueprint, and Hall of Fame.

### 3. 🔄 Dynamic Flipping 3D Live Tiles
- Auto-rotating 3D cards that flip every few seconds with breaking page-to-screen adaptations, Booker Prize triumphs, and national bestsellers.
- Click any tile to manually flip it and see details or jump straight to spotlights.

### 4. 🤖 Fictophiliac Chatbot Concierge
- **Time-Aware Greeting**: Welcomes the reader dynamically (*"Good morning / afternoon / evening!"*).
- **3-Step Interactive Calibration**:
  1. *Previous Reads*: e.g., *Daisy Darker*, *And Then There Were None*, *The Love Hypothesis*.
  2. *Favorite Authors*: e.g., *Holly Jackson*, *Agatha Christie*, *Freida McFadden*.
  3. *Genres & Moods*: Psychological thriller, locked-room mystery, dark romance, banter-filled contemporary romance.
  - *Quick Chips & Skip anytime* buttons at every stage.
- **In-Chat Recommendation Cards**:
  - Displays real book covers, synopses, and personalized match reasons.
  - **🤍 Wishlist Heart Icon**: Hover tooltip explaining *"Save to Wishlist"*; click to save to your personal reading queue.
  - **"Mark as Read & Replace" Button**: Conquers the book, saves it to *My Library*, and dynamically swaps in an alternative recommendation in place!

### 5. 📱 Bookstagram & Community Reviews Feed
- Authentic reviews from Saachi's `@_fictophiliac_` Bookstagram channel.
- Community video reels and reader opinions on trending books.

### 6. 📂 Slide-Out Side Navigation Bar
- **Sign-In / Reader Profile**: Manage your active reader identity.
- **My Library**: Tracks all books conquered with the *"Mark as Read"* button.
- **My Wishlist**: Direct access to all wishlisted titles with one-click *"Ask Bot"* consultation.
- **Recommend More Books**:
  - **Search & Recognition Dropdown**: Type a book title or author; Fictophiliac queries the catalog with instant auto-suggestions.
  - **URL Verification Fallback**: *"Not Able to Find the Book You Want to Recommend? Don't worry, we got you covered. Just drop a URL to purchase the book here and we will do our best to verify and add the book."* Verifies online purchase/Goodreads links with OpenLibrary/Google Books APIs.

### 7. 👤 About Me (Saachi Iyer)
- Written in **first-person perspective** (*"Hi, I'm Saachi Iyer..."*).
- Showcases `saachi.jpg` with creator badge.
- **Logos Only Contact Bar**: Clickable icons for **Instagram**, **Email**, and **WhatsApp** with tooltips (raw numbers, email strings, and handles are tucked away).
- My Hall-of-Fame Bookshelf (*Daisy Darker*, *And Then There Were None*, *The Love Hypothesis*, *The Housemaid*).

---

## 🏛️ Enterprise Project Architecture

```
fictophiliac/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── health.py            # Health & Gemini API connection status
│   │   │       │   ├── recommendations.py   # /recommend and /replace endpoints
│   │   │       │   ├── curated.py           # Booker, Goodreads, Indian/Global shelves
│   │   │       │   └── community.py         # Search books, verify URL, & reviews
│   │   │       └── router.py                # Aggregated v1 API router
│   │   ├── core/
│   │   │   ├── config.py                    # Multi-path .env loader & Pydantic settings
│   │   │   └── logging.py                   # Centralized structured logger
│   │   ├── schemas/
│   │   │   ├── health.py                    # Health check models
│   │   │   ├── recommendation.py            # Book, request & replacement models
│   │   │   ├── curated.py                   # Curated shelves models
│   │   │   └── community.py                 # Search result, URL verification & review models
│   │   ├── services/
│   │   │   ├── gemini_service.py            # Gemini 2.5 Flash SDK integration
│   │   │   ├── cover_service.py             # OpenLibrary & Google Books cover engine
│   │   │   ├── curated_service.py           # Curated books database (Booker, Adaptations, etc.)
│   │   │   └── community_service.py         # Live search recognition & URL verification
│   │   └── main.py                          # FastAPI app, CORS, static mounts
│   ├── requirements.txt                     # Backend dependencies
│   ├── .env                                 # API keys
│   └── run.py                               # Smart runner with venv auto-detect
│
├── frontend/
│   ├── public/
│   │   ├── index.html                       # Standalone single-file production preview
│   │   └── saachi.jpg                       # Creator photograph
│   ├── src/
│   │   ├── components/
│   │   │   ├── HubLandingView.jsx           # Hero banner & Cave Hub
│   │   │   ├── DynamicFlippingTiles.jsx     # Auto-rotating 3D cards
│   │   │   ├── ChatbotWindow.jsx            # Concierge chatbot interface
│   │   │   ├── BookCard.jsx                 # Card with wishlist heart & mark-as-read
│   │   │   ├── CuratedNewsSection.jsx       # Booker, Goodreads, & Bestsellers
│   │   │   ├── AboutCreator.jsx             # About Me (1st person, logos only)
│   │   │   ├── SideNavBar.jsx               # Slide-out navigation drawer
│   │   │   ├── RecommendBookModal.jsx       # Search dropdown & URL verification
│   │   │   ├── WishlistModal.jsx            # Saved wishlist items
│   │   │   ├── ReadingHistoryModal.jsx      # My Library
│   │   │   └── AuthModal.jsx                # Profile modal
│   │   ├── services/api.js                  # Axios client for /api/v1
│   │   ├── hooks/                           # Custom React hooks
│   │   └── App.jsx                          # Root React view coordinator
│   └── dist/                                # Production Vite build
│
├── run.py                                   # Smart root launcher (auto-activates venv)
├── main.py                                  # Root fallback runner
├── saachi.jpg                               # Source creator image
└── README.md
```

---

## 🚀 How to Run

### Quick Start (From Root Directory)

Simply execute `run.py` from the root folder:

```bash
python3 run.py
```

> **Smart Auto-Detection**: `run.py` automatically detects the backend virtual environment at `backend/venv`, re-executes with it if necessary, checks for port availability, and launches the server.

### Or Run from Backend:

```bash
cd backend
python3 run.py
```

Then open **`http://localhost:8000`** (or the port displayed in terminal) in your browser!

### Running the Vite Dev Server (Optional):

```bash
cd frontend
npm run dev
```
Proxy routes `/api` directly to `http://localhost:8000`.
