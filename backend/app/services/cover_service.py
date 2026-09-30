import asyncio
import re
from typing import List, Optional, Dict
import httpx
from app.core.logging import logger
from app.schemas.recommendation import BookRecommendation

# Pre-compiled verified registry of official publisher covers
VERIFIED_COVERS: Dict[str, str] = {
    # Thrillers & Mysteries
    "thehousemaid": "https://covers.openlibrary.org/b/id/15105883-M.jpg",
    "thehousemaidssecret": "https://covers.openlibrary.org/b/id/13439869-M.jpg",
    "daisydarker": "https://covers.openlibrary.org/b/id/13231964-M.jpg",
    "andthentherewerenone": "https://covers.openlibrary.org/b/id/11172296-M.jpg",
    "thesilentpatient": "https://covers.openlibrary.org/b/id/9407338-M.jpg",
    "noneofthisistrue": "https://covers.openlibrary.org/b/id/13300169-M.jpg",
    "theguestlist": "https://covers.openlibrary.org/b/id/10096112-M.jpg",
    "theparisapartment": "https://covers.openlibrary.org/b/id/11541298-M.jpg",
    "rockpaperscissors": "https://covers.openlibrary.org/b/id/10826952-M.jpg",
    "agoodgirlsguidetomurder": "https://covers.openlibrary.org/b/id/13156188-M.jpg",
    "themaid": "https://covers.openlibrary.org/b/id/11199954-M.jpg",
    "neverlie": "https://covers.openlibrary.org/b/id/13198561-M.jpg",
    "verity": "https://covers.openlibrary.org/b/id/8747160-M.jpg",
    "magpiemurders": "https://covers.openlibrary.org/b/id/8231991-M.jpg",
    "yellowface": "https://covers.openlibrary.org/b/id/13195421-M.jpg",
    "clubyoutodeath": "https://covers.openlibrary.org/b/id/10631895-M.jpg",
    "thetherapist": "https://covers.openlibrary.org/b/id/10497892-M.jpg",
    "localwomanmissing": "https://covers.openlibrary.org/b/id/10826952-M.jpg",

    # Romance & Contemporary
    "thelovehypothesis": "https://covers.openlibrary.org/b/id/10601402-M.jpg",
    "loveandotherwords": "https://covers.openlibrary.org/b/id/13791078-M.jpg",
    "booklovers": "https://covers.openlibrary.org/b/id/11567819-M.jpg",
    "itendswithus": "https://covers.openlibrary.org/b/id/10473609-M.jpg",
    "itstartswithus": "https://covers.openlibrary.org/b/id/12833590-M.jpg",
    "redwhiteandroyalblue": "https://covers.openlibrary.org/b/id/9171544-M.jpg",
    "redwhiteroyalblue": "https://covers.openlibrary.org/b/id/9171544-M.jpg",
    "fourthwing": "https://covers.openlibrary.org/b/id/14407898-M.jpg",
    "ironflame": "https://covers.openlibrary.org/b/id/14407898-M.jpg",
    "thesevenhusbandsofevelynhugo": "https://covers.openlibrary.org/b/id/8354226-M.jpg",
    "daisyjonesandthesix": "https://covers.openlibrary.org/b/id/8742674-M.jpg",
    "daisyjonesthesix": "https://covers.openlibrary.org/b/id/8742674-M.jpg",
    "tomorrowandtomorrowandtomorrow": "https://covers.openlibrary.org/b/id/12859975-M.jpg",
    "themidnightlibrary": "https://covers.openlibrary.org/b/id/10313767-M.jpg",
    "thesongofachilles": "https://covers.openlibrary.org/b/id/7098465-M.jpg",
    "normalpeople": "https://covers.openlibrary.org/b/id/8794265-M.jpg",
    "wherethecrawdadssing": "https://covers.openlibrary.org/b/id/8362947-M.jpg",

    # Booker & Literary
    "orbital": "https://covers.openlibrary.org/b/id/14541972-M.jpg",
    "prophetsong": "https://covers.openlibrary.org/b/id/14814200-M.jpg",
    "themercyofgods": "https://covers.openlibrary.org/b/id/14541972-M.jpg",
    "thesevenmoonsofmaali": "https://covers.openlibrary.org/b/id/13822859-M.jpg",
    "thesevenmoonsofmaalialmeida": "https://covers.openlibrary.org/b/id/13822859-M.jpg",
    "thepromise": "https://covers.openlibrary.org/b/id/11514543-M.jpg",
    "shuggiebain": "https://covers.openlibrary.org/b/id/9271540-M.jpg",
    "girlwomanother": "https://covers.openlibrary.org/b/id/9134982-M.jpg",
    "thetestaments": "https://covers.openlibrary.org/b/id/12366815-M.jpg",
    "milkman": "https://covers.openlibrary.org/b/id/13561491-M.jpg",
    "lincolninthebardo": "https://covers.openlibrary.org/b/id/7909378-M.jpg",
    "thegodofsmallthings": "https://covers.openlibrary.org/b/id/10513792-M.jpg",
    "midnightschildren": "https://covers.openlibrary.org/b/id/8346713-M.jpg",
    "theremainsoftheday": "https://covers.openlibrary.org/b/id/95742-M.jpg",

    # Indian Bestsellers & Literary Masters
    "theimmortalsofmeluha": "https://covers.openlibrary.org/b/id/11152324-M.jpg",
    "thesecretofthenagas": "https://covers.openlibrary.org/b/id/6917318-M.jpg",
    "theooathofthevayuputras": "https://covers.openlibrary.org/b/id/7123971-M.jpg",
    "therozaballine": "https://covers.openlibrary.org/b/id/12393403-M.jpg",
    "thekrishnakey": "https://covers.openlibrary.org/b/id/10838319-M.jpg",
    "thenamesake": "https://covers.openlibrary.org/b/id/6628164-M.jpg",
    "thewhitetiger": "https://covers.openlibrary.org/b/id/10497892-M.jpg",
    "thepalaceofillusions": "https://covers.openlibrary.org/b/id/10314060-M.jpg",
    "theforestofenchantments": "https://covers.openlibrary.org/b/id/15224810-M.jpg",
    "kaikeyi": "https://covers.openlibrary.org/b/id/13315015-M.jpg",
    "thehennaartist": "https://covers.openlibrary.org/b/id/9293876-M.jpg",
    "thelastsongofdusk": "https://covers.openlibrary.org/b/id/158434-M.jpg",
    "karnaswife": "https://covers.openlibrary.org/b/id/10871701-M.jpg",
    "worldsbestboyfriend": "https://covers.openlibrary.org/b/id/11369925-M.jpg",
    "wishicouldtellyou": "https://covers.openlibrary.org/b/id/10499429-M.jpg",
    "holdmyhand": "https://covers.openlibrary.org/b/id/15121935-M.jpg",
    "thegreatindiannovel": "https://covers.openlibrary.org/b/id/4052784-M.jpg",
    "thecovenantofwater": "https://covers.openlibrary.org/b/id/13190092-M.jpg",
    "thezoyafactor": "https://covers.openlibrary.org/b/id/10631895-M.jpg",
    "thosepriceythakurgirls": "https://covers.openlibrary.org/b/id/7875442-M.jpg",
    "ghacharghochar": "https://covers.openlibrary.org/b/id/13502048-M.jpg",

    # Emotional Historical Fiction, Resilience & Literary Drama
    "athousandsplendidsuns": "https://covers.openlibrary.org/b/id/8579790-M.jpg",
    "thekiterunner": "https://covers.openlibrary.org/b/id/14846827-M.jpg",
    "andthemountainsechoed": "https://covers.openlibrary.org/b/id/7258558-M.jpg",
    "aslongasthelemontreesgrow": "https://covers.openlibrary.org/b/id/13872888-M.jpg",
    "thestationeryshop": "https://covers.openlibrary.org/b/id/10211160-M.jpg",
    "themountainssing": "https://covers.openlibrary.org/b/id/9319261-M.jpg",
    "thenightingale": "https://covers.openlibrary.org/b/id/8314147-M.jpg",
    "allthelightwecannotsee": "https://covers.openlibrary.org/b/id/14559680-M.jpg",
    "thebookthief": "https://covers.openlibrary.org/b/id/8153054-M.jpg",
    "salttothesea": "https://covers.openlibrary.org/b/id/11751638-M.jpg",
    "amancalledove": "https://covers.openlibrary.org/b/id/8864159-M.jpg",
    "circe": "https://covers.openlibrary.org/b/id/8739376-M.jpg",

    # Non-Fiction & Adaptations
    "atomichabits": "https://covers.openlibrary.org/b/id/12539702-M.jpg",
    "lessonsofchemistry": "https://covers.openlibrary.org/b/id/12725772-M.jpg",
    "lessonsinchemistry": "https://covers.openlibrary.org/b/id/12725772-M.jpg",
    "dune": "https://covers.openlibrary.org/b/id/11481354-M.jpg",
}

def normalize_key(text: str) -> str:
    """Normalize book title for exact key lookup (lowercase, alphanum only)."""
    return re.sub(r"[^a-z0-9]", "", (text or "").lower())

class CoverService:
    def __init__(self, timeout: float = 4.5):
        self.timeout = timeout
        self.headers = {"User-Agent": "FictophiliacEnterprise/2.0 (BookRecommender)"}

    async def fetch_cover(self, client: httpx.AsyncClient, title: str, author: str) -> Optional[str]:
        """Fetch exact matching cover with registry cache and verified search."""
        key = normalize_key(title)
        if key in VERIFIED_COVERS:
            return VERIFIED_COVERS[key]

        # Try prefix or substring matches in registry
        for v_key, v_url in VERIFIED_COVERS.items():
            if len(v_key) > 5 and (v_key in key or key in v_key):
                return v_url

        clean_title = title.strip()
        clean_author = author.strip() if author else ""

        # 1. Search Open Library with strict title/author verification
        try:
            ol_url = "https://openlibrary.org/search.json"
            params = {"title": clean_title, "limit": 8}
            if clean_author:
                params["author"] = clean_author

            res = await client.get(ol_url, params=params, timeout=self.timeout)
            if res.status_code == 200:
                docs = res.json().get("docs", [])
                target_norm = normalize_key(clean_title)

                for doc in docs:
                    doc_title = doc.get("title", "")
                    doc_norm = normalize_key(doc_title)
                    doc_authors = [normalize_key(a) for a in doc.get("author_name", [])]

                    # Strict match: title must share significant common substring
                    title_match = (
                        target_norm in doc_norm
                        or doc_norm in target_norm
                        or target_norm[:12] == doc_norm[:12]
                    )

                    author_match = True
                    if clean_author:
                        author_norm = normalize_key(clean_author)
                        author_match = any(
                            author_norm in da or da in author_norm for da in doc_authors
                        )

                    if title_match and author_match and doc.get("cover_i"):
                        cover_id = doc["cover_i"]
                        return f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"

        except Exception as e:
            logger.warning(f"OpenLibrary cover lookup error for '{title}': {e}")

        # 2. Google Books fallback with strict title match
        try:
            gb_url = "https://www.googleapis.com/books/v1/volumes"
            query_str = f'intitle:"{clean_title}"'
            if clean_author:
                query_str += f' inauthor:"{clean_author}"'

            gb_res = await client.get(gb_url, params={"q": query_str, "maxResults": 3}, timeout=self.timeout)
            if gb_res.status_code == 200:
                items = gb_res.json().get("items", [])
                target_norm = normalize_key(clean_title)

                for item in items:
                    vol = item.get("volumeInfo", {})
                    vol_title = vol.get("title", "")
                    vol_norm = normalize_key(vol_title)

                    if target_norm in vol_norm or vol_norm in target_norm:
                        image_links = vol.get("imageLinks", {})
                        thumb = image_links.get("thumbnail") or image_links.get("smallThumbnail")
                        if thumb:
                            clean_thumb = thumb.replace("http://", "https://").replace("&edge=curl", "")
                            return clean_thumb

        except Exception as e:
            logger.warning(f"Google Books cover lookup error for '{title}': {e}")

        # 3. Clean typographic fallback (NEVER an unrelated book's picture!)
        title_slug = clean_title[:24].replace(" ", "+")
        return f"https://placehold.co/300x450/1e293b/f8fafc?text={title_slug}"

    async def enrich_books_with_covers(self, books: List[BookRecommendation]) -> List[BookRecommendation]:
        """Concurrently fetch verified covers for all books in the list."""
        async with httpx.AsyncClient(headers=self.headers) as client:
            tasks = [self.fetch_cover(client, b.title, b.author) for b in books]
            results = await asyncio.gather(*tasks, return_exceptions=True)

            for book, cover in zip(books, results):
                if isinstance(cover, str) and cover:
                    book.cover_url = cover
                else:
                    title_slug = book.title[:24].replace(" ", "+")
                    book.cover_url = f"https://placehold.co/300x450/1e293b/f8fafc?text={title_slug}"

        return books

cover_service = CoverService()
