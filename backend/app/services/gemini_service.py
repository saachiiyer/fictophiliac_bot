import json
import re
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.schemas.recommendation import BookRecommendation

class GeminiService:
    def __init__(self):
        self._client = None
        self._sdk_type = None
        self._init_client()

    def _init_client(self):
        api_key = settings.GEMINI_API_KEY
        if not api_key or "your_gemini" in api_key or len(api_key) < 10:
            logger.info("Gemini API key is not configured; running in mock/preview fallback mode.")
            return

        try:
            from google import genai
            self._client = genai.Client(api_key=api_key)
            self._sdk_type = "google-genai"
            logger.info("Initialized Google GenAI SDK (google-genai).")
        except ImportError:
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=api_key)
                self._client = legacy_genai
                self._sdk_type = "legacy-genai"
                logger.info("Initialized Legacy Google Generative AI SDK.")
            except ImportError:
                logger.warning("Neither 'google-genai' nor 'google-generativeai' package is installed.")

    @property
    def is_configured(self) -> bool:
        return self._client is not None

    def _extract_text(self, response) -> str:
        """Safely extract generated text from response, handling thought signatures or multiple parts."""
        if hasattr(response, "text") and response.text:
            return response.text
        if hasattr(response, "candidates") and response.candidates:
            parts = getattr(response.candidates[0].content, "parts", [])
            texts = [getattr(p, "text", "") for p in parts if getattr(p, "text", None)]
            return "\n".join(texts)
        return ""

    def _clean_json_str(self, raw_str: str) -> str:
        """Clean markdown markers and whitespace around JSON payloads."""
        cleaned = raw_str.strip()
        if "```json" in cleaned:
            cleaned = cleaned.split("```json", 1)[1]
            if "```" in cleaned:
                cleaned = cleaned.split("```", 1)[0]
        elif "```" in cleaned:
            cleaned = cleaned.split("```", 1)[1]
            if "```" in cleaned:
                cleaned = cleaned.split("```", 1)[0]
        return cleaned.strip()

    def build_prompt(
        self,
        previous_reads: List[str],
        favorite_authors: List[str],
        preferred_genres: List[str],
        excluded_titles: List[str],
        count: int
    ) -> str:
        past_str = ", ".join(previous_reads) if previous_reads else "None provided (user skipped)"
        auth_str = ", ".join(favorite_authors) if favorite_authors else "None provided (user skipped)"
        gen_str = ", ".join(preferred_genres) if preferred_genres else "Derive intuitively from their stated past reads and authors"
        excl_str = ", ".join(excluded_titles) if excluded_titles else "None"

        return f"""You are Fictophiliac, an empathetic and discerning AI literary concierge created by book reviewer Saachi Iyer.

READER PROFILE:
- Past Favorite Reads: {past_str}
- Favorite Authors: {auth_str}
- Preferred Genres / Reading Vibes: {gen_str}

STRICT EXCLUSIONS (Do NOT recommend any of these):
{excl_str}
Also do NOT recommend any of the exact books already listed in 'Past Favorite Reads'.

CRITICAL INSTRUCTION — READ THE ROOM:
1. Thoroughly analyze the tone, emotional weight, cultural depth, and literary genre of the reader's past reads and authors.
2. DO NOT default to psychological thrillers, locked-room mysteries, or generic plot twists unless the user explicitly requested thrillers or listed thriller books/authors!
3. If the reader loves emotional historical fiction, trauma/resilience, grief, or war literature (e.g., Khaled Hosseini, Zoulfa Katouh, Kristin Hannah, Anthony Doerr):
   -> Recommend deeply moving, human, emotionally resonant historical and literary masterworks.
4. If the reader lists Indian authors or Indian mythological retellings (e.g., Chitra Banerjee Divakaruni, Amish Tripathi, Ashwin Sanghi, Jhumpa Lahiri, Arundhati Roy, Durjoy Datta, Siddharth Dhanvant Shanghvi):
   -> Honor their taste with celebrated Indian literature, mythological epics, South Asian diaspora fiction, or contemporary Indian romance/drama.
5. If the reader lists romance, recommend heartwarming, witty, or poignant romances matching their tropes.
6. If the reader lists thrillers, recommend high-stakes suspense and clever psychological puzzles.
7. Always ensure the "match_reason" is specific, empathetic, and directly acknowledges how this book connects to the titles and authors they shared.

TASK:
Recommend exactly {count} distinct books tailored specifically to their true literary taste.

OUTPUT FORMAT:
Respond ONLY with a JSON array conforming to this schema:
[
  {{
    "title": "Exact Title of the Book",
    "author": "Author Name",
    "genre": "Specific Genre / Trope (e.g. Indian Mythological Fiction, Emotional Historical Drama, Contemporary Romance)",
    "summary": "2-3 sentence compelling hook without spoilers",
    "match_reason": "Specific 1-2 sentence justification linking this recommendation to their stated favorites and authors",
    "page_count": "e.g. 360 pages"
  }}
]
"""

    def generate_chat_reaction(
        self,
        step: int,
        user_input: str,
        previous_reads: List[str] = None,
        favorite_authors: List[str] = None,
        preferred_genres: List[str] = None,
    ) -> Dict[str, str]:
        """
        Dynamically reacts to the reader's input during the step-by-step chat.
        Reads the room, acknowledges their specific books/authors, and transitions smoothly.
        """
        user_input_clean = user_input.strip()
        previous_reads = previous_reads or []
        favorite_authors = favorite_authors or []

        # Try with Gemini if configured
        if self.is_configured:
            prompt = f"""You are Fictophiliac, a warm, literary AI book concierge created by book reviewer Saachi Iyer.
The user is at Step {step} of setting up their reading profile.
Step 1: They entered their past favorite reads.
Step 2: They entered their favorite authors.
Step 3: They entered their preferred genres/moods.

Current user message: "{user_input_clean}"
Previous context:
- Past Reads: {', '.join(previous_reads) if previous_reads else 'None'}
- Authors: {', '.join(favorite_authors) if favorite_authors else 'None'}

CRITICAL INSTRUCTION — READ THE ROOM:
- React warmly and authentically to what they ACTUALLY wrote in 1 to 2 sentences.
- If they gave emotional historical fiction or mythological books (like The Palace of Illusions, Khaled Hosseini, A Thousand Splendid Suns, Lemon Trees), acknowledge their poignant emotional weight, lyrical prose, or cultural beauty. DO NOT call them thrillers or talk about plot twists!
- If they gave Indian authors (like Chitra Banerjee, Durjoy Datta, Siddharth), celebrate their storytelling, cultural richness, or romance/drama.
- Then, smoothly ask the next question:
  * If Step 1: "Who are 1 to 3 of your all-time favorite authors?"
  * If Step 2: "What genres, tropes, or emotional reading vibes are you craving today?"

Keep the total reply under 60 words. No robotic fluff. Output ONLY the response text."""

            model_candidates = [
                getattr(settings, "GEMINI_MODEL", "gemini-3.5-flash"),
                "gemini-3.5-flash",
                "gemini-3.5-flash-lite",
                "gemini-flash-latest"
            ]

            for model_name in model_candidates:
                try:
                    if self._sdk_type == "google-genai":
                        resp = self._client.models.generate_content(
                            model=model_name,
                            contents=prompt,
                        )
                        reply = self._extract_text(resp).strip()
                        if reply:
                            return {"reply": reply}
                    else:
                        model = self._client.GenerativeModel(model_name)
                        resp = model.generate_content(prompt)
                        reply = self._extract_text(resp).strip()
                        if reply:
                            return {"reply": reply}
                except Exception as e:
                    logger.warning(f"Reaction generation failed on {model_name}: {e}")
                    continue

        # Intelligent heuristic fallback (Reads the room accurately offline!)
        lower = user_input_clean.lower()

        if step == 1:
            # Check for Mythological & Indian books
            if any(k in lower for k in ["palace of illusions", "forest of enchantments", "immortals of meluha", "nagas", "namesake", "god of small things", "rozabal", "chitra", "amish"]):
                reply = (
                    "What a rich, enchanting selection! Lyrical mythological retellings and evocative Indian narratives with profound feminine strength and depth.\n\n"
                    "Next: Who are 1 to 3 of your all-time favorite authors?"
                )
            # Check for Emotional Historical / Tragedy / Resilience
            elif any(k in lower for k in ["splendid suns", "kite runner", "lemon tree", "lemon trees", "hosseini", "katouh", "nightingale", "salt to the sea", "book thief", "all the light"]):
                reply = (
                    "Profound and deeply moving choices. Stories of human resilience, heartbreaking beauty, and indelible courage in the face of sorrow.\n\n"
                    "Next: Who are 1 to 3 of your all-time favorite authors?"
                )
            # Check for Romance / Rom-Com
            elif any(k in lower for k in ["love hypothesis", "love and other words", "book lovers", "henry", "hazelwood", "colleen hoover", "it ends with us", "romance", "daisy jones", "evelyn hugo"]):
                reply = (
                    "Delightful, high-chemistry choices! Packed with emotional resonance, witty banter, and unforgettable connection.\n\n"
                    "Next: Who are 1 to 3 of your all-time favorite authors?"
                )
            # Check for Thrillers / Mystery
            elif any(k in lower for k in ["housemaid", "silent patient", "daisy darker", "feeney", "agatha", "christie", "freida", "mcfadden", "jackson", "good girl", "whodunit", "thriller"]):
                reply = (
                    "Brilliant, edge-of-your-seat picks! High-stakes suspense and psychological intensity that keep you guessing.\n\n"
                    "Next: Who are 1 to 3 of your all-time favorite authors?"
                )
            else:
                reply = (
                    f"Splendid selection! That is a wonderfully curated reading foundation.\n\n"
                    f"Next: Who are 1 to 3 of your all-time favorite authors?"
                )

        elif step == 2:
            # Check for Indian Authors
            if any(k in lower for k in ["chitra", "banerjee", "durjoy", "datta", "dutta", "siddharth", "maheshwari", "shanghvi", "amish", "ashwin", "jhumpa", "lahiri", "arundhati", "chetan", "bhagat"]):
                reply = (
                    "Exceptional Indian storytellers! They craft such wonderful cultural richness, intricate relationships, and emotional resonance.\n\n"
                    "Finally, what genres, tropes, or emotional reading vibes are you craving today?"
                )
            # Check for Historical / Drama Authors
            elif any(k in lower for k in ["hosseini", "hannah", "doerr", "katouh", "sepetys", "backman", "zusak"]):
                reply = (
                    "Masters of deeply emotional storytelling and unforgettable historical tapestries.\n\n"
                    "Finally, what genres, tropes, or emotional reading vibes are you craving today?"
                )
            # Check for Romance Authors
            elif any(k in lower for k in ["hazelwood", "henry", "lauren", "armas", "mcquiston", "reid"]):
                reply = (
                    "Terrific contemporary voices with witty dialogue, heartfelt warmth, and great pacing.\n\n"
                    "Finally, what genres or tropes are you in the mood for right now?"
                )
            # Check for Thriller Authors
            elif any(k in lower for k in ["christie", "feeney", "mcfadden", "jackson", "jewell", "foley", "lapena"]):
                reply = (
                    "Masters of suspense, locked rooms, and intricate puzzles.\n\n"
                    "Finally, what genres or tropes are you in the mood for right now?"
                )
            else:
                reply = (
                    f"Incredible authors with distinct voices and compelling storytelling!\n\n"
                    f"Finally, what genres, tropes, or reading vibes are you craving today?"
                )
        else:
            reply = "Understood! Let's tailor your recommendations to that exact reading mood."

        return {"reply": reply}

    def generate_recommendations(
        self,
        previous_reads: List[str],
        favorite_authors: List[str],
        preferred_genres: List[str],
        excluded_titles: List[str],
        count: int = 6
    ) -> List[BookRecommendation]:
        if not self.is_configured:
            logger.info("Using curated catalog mock recommendations (API key not set).")
            raw_books = self._get_mock_catalog(previous_reads, favorite_authors, preferred_genres, excluded_titles, count)
            return [BookRecommendation(**b) for b in raw_books]

        prompt = self.build_prompt(previous_reads, favorite_authors, preferred_genres, excluded_titles, count)

        model_candidates = [
            getattr(settings, "GEMINI_MODEL", "gemini-3.5-flash"),
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest"
        ]

        last_error = None
        for model_name in model_candidates:
            try:
                raw_json_str = ""
                if self._sdk_type == "google-genai":
                    response = self._client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                    raw_json_str = self._extract_text(response)
                else:
                    model = self._client.GenerativeModel(model_name)
                    response = model.generate_content(prompt)
                    raw_json_str = self._extract_text(response)

                cleaned_json = self._clean_json_str(raw_json_str)
                parsed = json.loads(cleaned_json)
                items = parsed if isinstance(parsed, list) else parsed.get("recommendations", [])
                
                if items:
                    logger.info(f"Successfully generated {len(items)} recommendations via {model_name}")
                    return [BookRecommendation(**item) for item in items[:count]]

            except Exception as e:
                last_error = e
                logger.warning(f"Gemini generation failed with model '{model_name}': {e}. Trying fallback.")
                continue

        logger.error(f"All Gemini models exhausted. Last error: {last_error}. Falling back to taste-matched curated catalog.")
        raw_books = self._get_mock_catalog(previous_reads, favorite_authors, preferred_genres, excluded_titles, count)
        return [BookRecommendation(**b) for b in raw_books]

    def _get_mock_catalog(
        self,
        previous_reads: List[str],
        favorite_authors: List[str],
        preferred_genres: List[str],
        excluded_titles: List[str],
        count: int
    ) -> List[Dict[str, Any]]:
        """
        Extensive multi-genre library that computes taste-relevance scoring based on user's
        stated books, authors, and genres, never defaulting to thrillers when Indian/Historical/Romance
        tastes are provided.
        """
        catalog = [
            # 1. INDIAN LITERATURE & MYTHOLOGICAL RETELLINGS
            {
                "title": "The Forest of Enchantments",
                "author": "Chitra Banerjee Divakaruni",
                "genre": "Indian Mythological Fiction",
                "tags": ["mythology", "indian", "retelling", "chitra", "feminist", "epic"],
                "summary": "The Ramayana reimagined from Sita's luminous, courageous perspective, exploring duty, love, betrayal, and quiet endurance in ancient Bharat.",
                "match_reason": "Written by Chitra Banerjee Divakaruni; the companion masterpiece to The Palace of Illusions celebrating fierce female agency in epic tradition.",
                "page_count": "384 pages"
            },
            {
                "title": "The Henna Artist",
                "author": "Alka Joshi",
                "genre": "Historical Indian Fiction",
                "tags": ["indian", "historical", "women", "drama", "culture", "resilience"],
                "summary": "In vibrant 1950s Jaipur, Lakshmi builds an independent life as the city's most requested henna artist to wealthy patrons, until a sister she never knew arrives.",
                "match_reason": "Rich Indian historical setting and deep character-driven storytelling echoing Chitra Banerjee Divakaruni's lyrical elegance.",
                "page_count": "368 pages"
            },
            {
                "title": "The Namesake",
                "author": "Jhumpa Lahiri",
                "genre": "Literary & Diaspora Fiction",
                "tags": ["indian", "literary", "family", "identity", "diaspora", "emotional"],
                "summary": "Following the Ganguli family from Calcutta to suburban Boston, this poignant novel delves into identity, generational disconnect, and the bittersweet ties of home.",
                "match_reason": "A profound, emotionally rich Indian literary masterwork that examines belonging, cultural roots, and human relationships.",
                "page_count": "291 pages"
            },
            {
                "title": "The Last Song of Dusk",
                "author": "Siddharth Dhanvant Shanghvi",
                "genre": "Lyrical Indian Fiction",
                "tags": ["indian", "siddharth", "literary", "drama", "poetic", "romance"],
                "summary": "Set in 1920s Bombay, Anuradha Gandharva's extraordinary beauty, music, and haunting passion unfold in a lush, unforgettable family chronicle.",
                "match_reason": "Directly honors your interest in Siddharth Dhanvant Shanghvi with poetic, evocative prose and intricate emotional drama.",
                "page_count": "320 pages"
            },
            {
                "title": "World's Best Boyfriend",
                "author": "Durjoy Datta",
                "genre": "Contemporary Indian Romance",
                "tags": ["indian", "durjoy", "romance", "contemporary", "youth", "relationship"],
                "summary": "Dhruv and Aranya are childhood rivals bound by unspoken history who must navigate college life, ambition, jealousy, and unexpected romance in modern India.",
                "match_reason": "Directly delivers Durjoy Datta's trademark emotional rollercoaster, youthful banter, and heartfelt relationship dynamics.",
                "page_count": "288 pages"
            },
            {
                "title": "Hold My Hand",
                "author": "Durjoy Datta",
                "genre": "Contemporary Indian Romance",
                "tags": ["indian", "durjoy", "romance", "travel", "contemporary", "emotional"],
                "summary": "Deep is a nerdy, introverted Indian scholar who gets an internship in Hong Kong and crosses paths with Ahana, a spirited blind girl who changes how he sees the world.",
                "match_reason": "By Durjoy Datta; a tender, heartwarming romance celebrating unexpected connection and vulnerability.",
                "page_count": "240 pages"
            },
            {
                "title": "The Immortals of Meluha",
                "author": "Amish Tripathi",
                "genre": "Indian Mythological Epic",
                "tags": ["indian", "mythology", "fantasy", "epic", "shiva"],
                "summary": "In 1900 BC, Tibetan immigrant Shiva travels to the perfect empire of Meluha, where his throat turns blue upon drinking the Somras, fulfilling the prophecy of the Neelkanth.",
                "match_reason": "A breathtaking modern reimagining of ancient Indian mythology with grand scope, philosophical depth, and epic adventure.",
                "page_count": "390 pages"
            },
            {
                "title": "The God of Small Things",
                "author": "Arundhati Roy",
                "genre": "Booker Prize / Literary Fiction",
                "tags": ["indian", "booker", "literary", "kerala", "family", "tragedy"],
                "summary": "In lush Kerala, fraternal twins Estha and Rahel see their world shattered by caste taboos, forbidden love, and a tragic childhood drowning.",
                "match_reason": "A landmark Indian literary masterpiece of extraordinary sensory beauty, exploring family heartbreak and social boundaries.",
                "page_count": "340 pages"
            },
            {
                "title": "Karna's Wife: The Outcast's Queen",
                "author": "Kavita Kane",
                "genre": "Mythological Retelling",
                "tags": ["mythology", "indian", "retelling", "mahabharata", "feminist"],
                "summary": "Uruvi, a Kshatriya princess, chooses Karna as her husband despite societal scorn, witnessing the tragic hero of the Mahabharata from inside the Kaurava camp.",
                "match_reason": "A perfect companion to The Palace of Illusions, exploring the Mahabharata through the eyes of an extraordinary, courageous woman.",
                "page_count": "312 pages"
            },

            # 2. EMOTIONAL HISTORICAL FICTION, GRIEF & RESILIENCE
            {
                "title": "The Kite Runner",
                "author": "Khaled Hosseini",
                "genre": "Emotional Historical Drama",
                "tags": ["historical", "emotional", "hosseini", "afghanistan", "grief", "redemption"],
                "summary": "In a peaceful 1970s Kabul, Amir betrays his closest friend Hassan, embarking decades later on a perilous journey of redemption under Taliban rule.",
                "match_reason": "From Khaled Hosseini, the author of A Thousand Splendid Suns; an unforgettable emotional exploration of guilt, loyalty, and redemption.",
                "page_count": "371 pages"
            },
            {
                "title": "And the Mountains Echoed",
                "author": "Khaled Hosseini",
                "genre": "Intergenerational Literary Epic",
                "tags": ["historical", "emotional", "hosseini", "family", "literary"],
                "summary": "Beginning with a heartbreaking sibling separation in 1950s Afghanistan, this rich tapestry follows love and loss across Kabul, Paris, and California.",
                "match_reason": "Hosseini's sweeping emotional canvas, exploring how our decisions reverberate through generations with breathtaking humanity.",
                "page_count": "448 pages"
            },
            {
                "title": "The Nightingale",
                "author": "Kristin Hannah",
                "genre": "WWII Historical Drama",
                "tags": ["historical", "wwii", "women", "sisterhood", "emotional", "resilience"],
                "summary": "Two sisters in Nazi-occupied France follow separate paths of defiance: Vianne hides Jewish children in her home, while younger Isabelle joins the Maquis resistance.",
                "match_reason": "Shares the heart-wrenching emotional courage, sisterhood, and wartime resilience found in As Long as the Lemon Trees Grow.",
                "page_count": "440 pages"
            },
            {
                "title": "All the Light We Cannot See",
                "author": "Anthony Doerr",
                "genre": "Pulitzer Prize / Historical Fiction",
                "tags": ["historical", "wwii", "pulitzer", "lyrical", "literary"],
                "summary": "The intertwined fates of Marie-Laure, a blind French girl fleeing Paris, and Werner, an orphaned German radio prodigy in the walled citadel of Saint-Malo.",
                "match_reason": "Breathtakingly lyrical prose and profound empathy that mirrors the beauty and devastation of A Thousand Splendid Suns.",
                "page_count": "531 pages"
            },
            {
                "title": "Salt to the Sea",
                "author": "Ruta Sepetys",
                "genre": "Historical Tragedy & Hope",
                "tags": ["historical", "wwii", "refugee", "emotional", "tragedy"],
                "summary": "Four young refugees fleeing East Prussia board the MV Wilhelm Gustloff in 1945, each carrying devastating secrets in the deadliest maritime disaster in history.",
                "match_reason": "Heart-wrenching historical tragedy highlighting the courage and quiet dignity of displaced innocents caught in war.",
                "page_count": "391 pages"
            },
            {
                "title": "The Book Thief",
                "author": "Markus Zusak",
                "genre": "Literary Historical Fiction",
                "tags": ["historical", "wwii", "literary", "emotional", "books"],
                "summary": "Narrated by Death, this touching story follows Liesel Meminger, a foster girl in Munich who finds solace and survival by stealing books and sharing them with a hidden Jewish fist-fighter.",
                "match_reason": "Deeply compassionate and poetic storytelling about the life-saving magic of words amidst wartime devastation.",
                "page_count": "552 pages"
            },
            {
                "title": "Circe",
                "author": "Madeline Miller",
                "genre": "Mythological Literary Fiction",
                "tags": ["mythology", "retelling", "literary", "feminist", "greece"],
                "summary": "Banished to a deserted island by Zeus, the nymph Circe discovers her hidden powers of witchcraft, crossing paths with Odysseus, Hermes, and the Minotaur.",
                "match_reason": "Like The Palace of Illusions, this gives vibrant, empowering first-person agency to a misunderstood legendary woman.",
                "page_count": "393 pages"
            },

            # 3. CONTEMPORARY ROMANCE & EMOTIONAL CONNECTION
            {
                "title": "The Love Hypothesis",
                "author": "Ali Hazelwood",
                "genre": "Academic Contemporary Romance",
                "tags": ["romance", "academic", "contemporary", "banter", "tropes"],
                "summary": "Third-year Ph.D. candidate Olive Smith kisses the notoriously stern Professor Adam Carlsen to fake a relationship, sparking authentic emotional chemistry.",
                "match_reason": "Witty STEM banter, slow-burn emotional tension, and beloved fake-dating tropes.",
                "page_count": "384 pages"
            },
            {
                "title": "Love and Other Words",
                "author": "Christina Lauren",
                "genre": "Second Chance Romance",
                "tags": ["romance", "emotional", "books", "contemporary", "second-chance"],
                "summary": "Childhood best friends Macy and Elliot fell in love surrounded by books before years of silence intervened, rekindling unspoken feelings when they cross paths again.",
                "match_reason": "A deeply heartfelt, emotionally resonant romance honoring the love of literature and childhood bonds.",
                "page_count": "432 pages"
            },
            {
                "title": "Book Lovers",
                "author": "Emily Henry",
                "genre": "Romantic Comedy",
                "tags": ["romance", "books", "humor", "contemporary", "banter"],
                "summary": "Cutthroat literary agent Nora and broody editor Charlie keep bumping into each other in a small North Carolina town, challenging all their storybook clichés.",
                "match_reason": "Sharp industry wit, enemies-to-lovers spark, and a genuine love letter to readers.",
                "page_count": "384 pages"
            },

            # 4. PSYCHOLOGICAL THRILLERS & WHODUNITS (Only when requested!)
            {
                "title": "The Housemaid",
                "author": "Freida McFadden",
                "genre": "Psychological Thriller",
                "tags": ["thriller", "psychological", "suspense", "twists", "freida"],
                "summary": "Millie takes a live-in maid position for the wealthy Winchester family, only to find the bedroom door locks from the outside and dangerous games are underway.",
                "match_reason": "Fast-paced, unhinged reversals and relentless psychological tension.",
                "page_count": "336 pages"
            },
            {
                "title": "Daisy Darker",
                "author": "Alice Feeney",
                "genre": "Locked-Room Gothic Mystery",
                "tags": ["mystery", "gothic", "thriller", "twists", "feeney"],
                "summary": "The dysfunctional Darker family gathers on an isolated tidal island for Nana's 80th birthday, only to be eliminated one by one as the tide traps them until morning.",
                "match_reason": "Atmospheric isolated setting, dark family secrets, and a stunning final reveal.",
                "page_count": "352 pages"
            },
            {
                "title": "And Then There Were None",
                "author": "Agatha Christie",
                "genre": "Classic Whodunit Mystery",
                "tags": ["classic", "mystery", "whodunit", "christie", "isolated"],
                "summary": "Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious host, where a nursery rhyme begins predicting their deaths.",
                "match_reason": "The quintessential gold standard of locked-room mysteries and psychological dread.",
                "page_count": "272 pages"
            },
            {
                "title": "A Good Girl's Guide to Murder",
                "author": "Holly Jackson",
                "genre": "Investigative Mystery",
                "tags": ["mystery", "investigative", "jackson", "young-adult", "podcast"],
                "summary": "Pip Fitz-Amobi re-investigates the closed murder case of popular schoolgirl Andie Bell for her senior project, uncovering sinister town secrets.",
                "match_reason": "High-energy investigative sleuthing and clever layered revelations.",
                "page_count": "433 pages"
            }
        ]

        # Taste-matching score calculation
        all_excluded = [t.lower().strip() for t in excluded_titles + previous_reads if t]
        
        # Combine user taste keywords
        user_text = " ".join(previous_reads + favorite_authors + preferred_genres).lower()
        
        # Detect primary taste profiles
        is_indian_taste = any(k in user_text for k in ["chitra", "banerjee", "durjoy", "datta", "dutta", "siddharth", "maheshwari", "shanghvi", "palace of illusions", "immortals", "nagas", "meluha", "namesake", "god of small things", "amish", "ashwin", "indian", "mythology"])
        is_emotional_historical = any(k in user_text for k in ["splendid suns", "kite runner", "lemon tree", "hosseini", "katouh", "hannah", "nightingale", "historical", "war", "grief", "resilience", "tragedy", "sepetys", "book thief"])
        is_romance_taste = any(k in user_text for k in ["romance", "love hypothesis", "love and other words", "hazelwood", "henry", "contemporary romance", "rom-com", "fake dating"])
        is_thriller_taste = any(k in user_text for k in ["thriller", "mystery", "housemaid", "silent patient", "feeney", "christie", "mcfadden", "whodunit", "suspense", "crime"])

        scored_books = []
        for b in catalog:
            title_lower = b["title"].lower()
            # Skip if explicitly excluded or already read
            if any(ex in title_lower or title_lower in ex for ex in all_excluded):
                continue

            score = 0
            tags = b.get("tags", [])

            # Genre / Taste boosts
            if is_indian_taste:
                if "indian" in tags or "mythology" in tags or "retelling" in tags:
                    score += 15
                if any(a in user_text for a in ["chitra", "banerjee"]) and "chitra" in tags:
                    score += 20
                if any(a in user_text for a in ["durjoy", "datta", "dutta"]) and "durjoy" in tags:
                    score += 20
                if any(a in user_text for a in ["siddharth", "maheshwari", "shanghvi"]) and "siddharth" in tags:
                    score += 20

            if is_emotional_historical:
                if "historical" in tags or "emotional" in tags or "resilience" in tags:
                    score += 15
                if "hosseini" in tags and any(k in user_text for k in ["hosseini", "splendid suns", "kite runner"]):
                    score += 20
                if "retelling" in tags or "mythology" in tags:
                    score += 10

            if is_romance_taste:
                if "romance" in tags or "contemporary" in tags:
                    score += 15

            if is_thriller_taste:
                if "thriller" in tags or "mystery" in tags:
                    score += 15
            else:
                # If reader DID NOT ask for thrillers and gave emotional/Indian tastes, penalize thrillers!
                if "thriller" in tags or "suspense" in tags:
                    score -= 25

            # Direct genre tag matches
            for g in preferred_genres:
                g_low = g.lower()
                if any(t in g_low or g_low in t for t in tags):
                    score += 8

            scored_books.append((score, b))

        # Sort by score descending
        scored_books.sort(key=lambda x: x[0], reverse=True)

        selected = [b for _, b in scored_books[:count]]
        if len(selected) < count:
            remaining = [b for b in catalog if b not in selected and not any(ex in b["title"].lower() for ex in all_excluded)]
            selected.extend(remaining[:count - len(selected)])

        return selected[:count]

gemini_service = GeminiService()
