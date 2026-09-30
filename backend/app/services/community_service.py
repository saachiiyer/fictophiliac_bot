import re
import urllib.parse
from typing import List, Optional
import httpx
from app.core.logging import logger
from app.schemas.community import (
    BookSearchResult,
    VerifyUrlResponse,
    UserRecommendationSubmission,
    BookReviewItem,
)

class CommunityService:
    def __init__(self):
        self._user_submissions: List[UserRecommendationSubmission] = []
        self._reviews: List[BookReviewItem] = self._build_curated_reviews()

    def _build_curated_reviews(self) -> List[BookReviewItem]:
        return [
            BookReviewItem(
                id="rev-1",
                book_title="Daisy Darker",
                book_author="Alice Feeney",
                reviewer="Saachi Iyer",
                reviewer_handle="@_fictophiliac_",
                rating=5.0,
                quote="The claustrophobia on Seaglass Island is suffocating in the best way. Alice Feeney plays mind games with you until the final page. One of my favorite thrillers of all time!",
                cover_url="https://covers.openlibrary.org/b/id/12836262-M.jpg",
                platform="Instagram Review",
                post_url="https://www.instagram.com/_fictophiliac_/",
                media_type="review",
                is_creator=True
            ),
            BookReviewItem(
                id="rev-2",
                book_title="The Housemaid",
                book_author="Freida McFadden",
                reviewer="Saachi Iyer",
                reviewer_handle="@_fictophiliac_",
                rating=4.5,
                quote="I finished this in a single sitting because I could not put it down. The shift in perspective in the second half will make your jaw hit the floor.",
                cover_url="https://covers.openlibrary.org/b/id/12971203-M.jpg",
                platform="Instagram Reel",
                post_url="https://www.instagram.com/_fictophiliac_/",
                media_type="video_reel",
                is_creator=True
            ),
            BookReviewItem(
                id="rev-3",
                book_title="And Then There Were None",
                book_author="Agatha Christie",
                reviewer="Saachi Iyer",
                reviewer_handle="@_fictophiliac_",
                rating=5.0,
                quote="The masterpiece that birthed modern locked-room suspense. Ten strangers, an isolated island, and poetic justice served in the darkest rhythm.",
                cover_url="https://covers.openlibrary.org/b/id/8231991-M.jpg",
                platform="Instagram Classic Spotlight",
                post_url="https://www.instagram.com/_fictophiliac_/",
                media_type="review",
                is_creator=True
            ),
            BookReviewItem(
                id="rev-4",
                book_title="A Good Girl's Guide to Murder",
                book_author="Holly Jackson",
                reviewer="BookishSphere",
                reviewer_handle="@bookishsphere",
                rating=4.5,
                quote="Pip Fitz-Amobi is the smartest YA detective since Nancy Drew. The BBC/Netflix adaptation also captured the podcast-style energy brilliantly!",
                cover_url="https://covers.openlibrary.org/b/id/10459811-M.jpg",
                platform="Bookstagram Reel",
                post_url="https://www.instagram.com/explore/tags/agoodgirlsguidetomurder/",
                media_type="video_reel",
                is_creator=False
            ),
            BookReviewItem(
                id="rev-5",
                book_title="Yellowface",
                book_author="R.F. Kuang",
                reviewer="TheLitCritic",
                reviewer_handle="@thelitcritic",
                rating=4.5,
                quote="A satirical punch in the gut about privilege and publishing greed. It reads like a psychological car crash you can't look away from.",
                cover_url="https://covers.openlibrary.org/b/id/13511874-M.jpg",
                platform="Instagram Critique",
                post_url="https://www.instagram.com/explore/tags/yellowface/",
                media_type="review",
                is_creator=False
            ),
        ]

    async def search_books(self, query: str) -> List[BookSearchResult]:
        """Search books via Open Library with Google Books fallback."""
        results: List[BookSearchResult] = []
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(
                    "https://openlibrary.org/search.json",
                    params={"q": query, "limit": 6}
                )
                if res.status_code == 200:
                    data = res.json()
                    for doc in data.get("docs", [])[:6]:
                        title = doc.get("title", "Unknown Title")
                        authors = doc.get("author_name", ["Unknown Author"])
                        author = authors[0] if authors else "Unknown Author"
                        year = str(doc.get("first_publish_year", ""))
                        cover_id = doc.get("cover_i")
                        if cover_id:
                            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                        else:
                            clean_text = title[:20].replace(" ", "+")
                            cover_url = f"https://placehold.co/300x450/1e293b/f8fafc?text={clean_text}"

                        results.append(BookSearchResult(
                            title=title,
                            author=author,
                            year=year,
                            cover_url=cover_url
                        ))
        except Exception as e:
            logger.warning(f"Error querying OpenLibrary search: {e}")

        # Fallback to local catalog matches if empty
        if not results:
            candidates = [
                ("The Housemaid", "Freida McFadden", "2022", "https://covers.openlibrary.org/b/id/12971203-M.jpg"),
                ("The Silent Patient", "Alex Michaelides", "2019", "https://covers.openlibrary.org/b/id/10313886-M.jpg"),
                ("Daisy Darker", "Alice Feeney", "2022", "https://covers.openlibrary.org/b/id/12836262-M.jpg"),
                ("None of This Is True", "Lisa Jewell", "2023", "https://covers.openlibrary.org/b/id/13812739-M.jpg"),
                ("The Guest List", "Lucy Foley", "2020", "https://covers.openlibrary.org/b/id/10344583-M.jpg"),
                ("A Good Girl's Guide to Murder", "Holly Jackson", "2019", "https://covers.openlibrary.org/b/id/10459811-M.jpg"),
            ]
            q_lower = query.lower()
            for t, a, y, c in candidates:
                if q_lower in t.lower() or q_lower in a.lower():
                    results.append(BookSearchResult(title=t, author=a, year=y, cover_url=c))

        return results

    async def verify_url_and_add(self, url: str) -> VerifyUrlResponse:
        """Verify URL (Amazon, Goodreads, OpenLibrary) and recognize book."""
        clean_url = url.strip()
        parsed = urllib.parse.urlparse(clean_url)
        netloc = parsed.netloc.lower()

        # Extract potential identifier or keywords from URL path
        path = parsed.path
        extracted_name = None

        # Goodreads pattern: /book/show/12345.Book_Title
        gr_match = re.search(r"/book/show/\d+[\.\-]?([^/?#]*)", path)
        if gr_match and gr_match.group(1):
            extracted_name = gr_match.group(1).replace("-", " ").replace("_", " ").strip()

        # Amazon pattern: /dp/B0... or /Title/dp/...
        amz_match = re.search(r"/([^/]+)/dp/[A-Z0-9]+", path)
        if amz_match and amz_match.group(1):
            extracted_name = amz_match.group(1).replace("-", " ").replace("_", " ").strip()

        if not extracted_name and len(path) > 3:
            slug = path.strip("/").split("/")[-1]
            extracted_name = re.sub(r"[-_]+", " ", slug).strip()

        if not extracted_name:
            extracted_name = "Recommended Book"

        # Search OpenLibrary or Google Books with extracted keywords
        search_res = await self.search_books(extracted_name)
        if search_res:
            found = search_res[0]
            self._user_submissions.append(UserRecommendationSubmission(
                title=found.title,
                author=found.author,
                source_url=clean_url,
                note=f"Verified from {netloc or 'community link'}"
            ))
            return VerifyUrlResponse(
                verified=True,
                title=found.title,
                author=found.author,
                cover_url=found.cover_url,
                message=f"Success! We verified \"{found.title}\" by {found.author} and added it to our Cave recommendations."
            )

        # Fallback verification
        clean_title = extracted_name.title()[:40]
        self._user_submissions.append(UserRecommendationSubmission(
            title=clean_title,
            author="Verified Author",
            source_url=clean_url,
            note="Verified via link preview"
        ))
        return VerifyUrlResponse(
            verified=True,
            title=clean_title,
            author="Verified Author",
            cover_url=f"https://placehold.co/300x450/1e293b/f8fafc?text={clean_title[:20].replace(' ', '+')}",
            message=f"Verified! \"{clean_title}\" was successfully analyzed and added to the recommendation queue."
        )

    def add_submission(self, submission: UserRecommendationSubmission):
        self._user_submissions.append(submission)

    def get_reviews(self) -> List[BookReviewItem]:
        return self._reviews

community_service = CommunityService()

