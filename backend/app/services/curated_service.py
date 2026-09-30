from typing import List, Optional
from app.schemas.curated import CuratedBook, CuratedCategory

class CuratedService:
    def __init__(self):
        self._categories = self._build_curated_data()

    def _build_curated_data(self) -> List[CuratedCategory]:
        return [
            # ----------------------------------------------------
            # 1. BOOKER PRIZE WINNERS (12 Books)
            # ----------------------------------------------------
            CuratedCategory(
                id="booker-prize",
                name="Booker Prize Winners",
                icon="trophy",
                tagline="Celebrated literary milestones across the years",
                books=[
                    CuratedBook(
                        id="bp-1",
                        title="Orbital",
                        author="Samantha Harvey",
                        year="2024",
                        badge="Booker Winner 2024",
                        genre="Literary Fiction / Sci-Fi",
                        description="A breathtaking exploration of a single day aboard the International Space Station, capturing humanity's beauty and vulnerability from orbit.",
                        cover_url="https://covers.openlibrary.org/b/id/14541972-M.jpg",
                        extra_meta="Shortest book to win in over a decade"
                    ),
                    CuratedBook(
                        id="bp-2",
                        title="Prophet Song",
                        author="Paul Lynch",
                        year="2023",
                        badge="Booker Winner 2023",
                        genre="Dystopian / Political Fiction",
                        description="A terrifying and tender portrait of a mother fighting to protect her family as democratic Ireland descends into totalitarian tyranny.",
                        cover_url="https://covers.openlibrary.org/b/id/14814200-M.jpg",
                        extra_meta="Profound and claustrophobic masterpiece"
                    ),
                    CuratedBook(
                        id="bp-3",
                        title="The Seven Moons of Maali Almeida",
                        author="Shehan Karunatilaka",
                        year="2022",
                        badge="Booker Winner 2022",
                        genre="Dark Comedy / Magical Realism",
                        description="A murdered war photographer in 1989 Colombo has seven moons in the afterlife to solve his own death and deliver photographic evidence that could shake Sri Lanka.",
                        cover_url="https://covers.openlibrary.org/b/id/13822859-M.jpg",
                        extra_meta="Hilarious, harrowing murder mystery"
                    ),
                    CuratedBook(
                        id="bp-4",
                        title="The Promise",
                        author="Damon Galgut",
                        year="2021",
                        badge="Booker Winner 2021",
                        genre="Family Saga / Historical Drama",
                        description="Over four decades in South Africa, a white family repeatedly fails to fulfill a solemn promise made to their Black domestic servant.",
                        cover_url="https://covers.openlibrary.org/b/id/11514543-M.jpg",
                        extra_meta="Masterful modernist narrative style"
                    ),
                    CuratedBook(
                        id="bp-5",
                        title="Shuggie Bain",
                        author="Douglas Stuart",
                        year="2020",
                        badge="Booker Winner 2020",
                        genre="Historical Drama",
                        description="An unforgettable story of a young boy in 1980s Glasgow fiercely devoted to his alcoholic mother as their world collapses.",
                        cover_url="https://covers.openlibrary.org/b/id/9271540-M.jpg",
                        extra_meta="Heartbreaking portrait of addiction and unconditional love"
                    ),
                    CuratedBook(
                        id="bp-6",
                        title="Girl, Woman, Other",
                        author="Bernardine Evaristo",
                        year="2019",
                        badge="Booker Winner 2019",
                        genre="Contemporary Interconnected Fiction",
                        description="Follows twelve diverse Black British women across decades, interweaving their lives, struggles, art, and sexuality in rhythmic prose.",
                        cover_url="https://covers.openlibrary.org/b/id/9134982-M.jpg",
                        extra_meta="Shared Booker Prize with Margaret Atwood"
                    ),
                    CuratedBook(
                        id="bp-7",
                        title="The Testaments",
                        author="Margaret Atwood",
                        year="2019",
                        badge="Booker Winner 2019",
                        genre="Dystopian Fiction",
                        description="More than fifteen years after the events of The Handmaid's Tale, the Republic of Gilead's inner workings are revealed through three contrasting women.",
                        cover_url="https://covers.openlibrary.org/b/id/12366815-M.jpg",
                        extra_meta="Global publishing sensation"
                    ),
                    CuratedBook(
                        id="bp-8",
                        title="Milkman",
                        author="Anna Burns",
                        year="2018",
                        badge="Booker Winner 2018",
                        genre="Psychological / Historical Drama",
                        description="Set during the Northern Ireland Troubles, an unnamed 18-year-old girl is stalked by a powerful paramilitary man amidst relentless neighborhood rumors.",
                        cover_url="https://covers.openlibrary.org/b/id/13561491-M.jpg",
                        extra_meta="Uniquely voice-driven and atmospheric"
                    ),
                    CuratedBook(
                        id="bp-9",
                        title="Lincoln in the Bardo",
                        author="George Saunders",
                        year="2017",
                        badge="Booker Winner 2017",
                        genre="Experimental Historical Fiction",
                        description="On the night of his young son Willie's burial during the Civil War, Abraham Lincoln visits the cemetery where a chorus of ghosts lingers between life and death.",
                        cover_url="https://covers.openlibrary.org/b/id/7909378-M.jpg",
                        extra_meta="Brilliantly constructed chorus of spirits"
                    ),
                    CuratedBook(
                        id="bp-10",
                        title="The God of Small Things",
                        author="Arundhati Roy",
                        year="1997",
                        badge="Booker Winner 1997",
                        genre="Literary Drama",
                        description="The poignant saga of fraternal twins Esthappen and Rahel in Kerala, shattered by societal caste taboos and family secrets.",
                        cover_url="https://covers.openlibrary.org/b/id/10513792-M.jpg",
                        extra_meta="One of the most celebrated Booker winners of all time"
                    ),
                    CuratedBook(
                        id="bp-11",
                        title="Midnight's Children",
                        author="Salman Rushdie",
                        year="1981",
                        badge="Booker of Bookers",
                        genre="Magical Realism / Epic History",
                        description="Born at the exact stroke of midnight as India gains independence, Saleem Sinai is telepathically linked to 1,000 children born with extraordinary powers.",
                        cover_url="https://covers.openlibrary.org/b/id/8346713-M.jpg",
                        extra_meta="Voted the best Booker winner in 25 and 40-year retrospectives"
                    ),
                    CuratedBook(
                        id="bp-12",
                        title="The Remains of the Day",
                        author="Kazuo Ishiguro",
                        year="1989",
                        badge="Booker Winner 1989",
                        genre="Literary Masterpiece",
                        description="An aging English butler embarks on a motoring trip across post-war Britain, coming to terms with his unquestioning loyalty to an aristocratic master.",
                        cover_url="https://covers.openlibrary.org/b/id/95742-M.jpg",
                        extra_meta="Adapted into the Oscar-nominated film starring Anthony Hopkins"
                    ),
                ]
            ),

            # ----------------------------------------------------
            # 2. GOODREADS TOP BOOKS & CHOICE WINNERS (10 Books)
            # ----------------------------------------------------
            CuratedCategory(
                id="goodreads-top",
                name="Goodreads Top Books & Choice Winners",
                icon="star",
                tagline="Voted by millions of readers worldwide",
                books=[
                    CuratedBook(
                        id="gr-1",
                        title="Yellowface",
                        author="R.F. Kuang",
                        year="2023",
                        badge="Goodreads Choice Winner",
                        genre="Satirical Thriller",
                        description="When Athena Liu dies in a freak accident, fellow writer June Hayward steals her finished manuscript about Chinese laborers in WWI and publishes it under a pseudonym.",
                        cover_url="https://covers.openlibrary.org/b/id/13195421-M.jpg",
                        extra_meta="4.1★ across 400,000+ ratings"
                    ),
                    CuratedBook(
                        id="gr-2",
                        title="Tomorrow, and Tomorrow, and Tomorrow",
                        author="Gabrielle Zevin",
                        year="2022",
                        badge="Goodreads Best Fiction",
                        genre="Literary Fiction / Tech",
                        description="Two childhood best friends reunite in college to build video games, rocketing into superstardom and navigating fame, tragedy, and enduring love.",
                        cover_url="https://covers.openlibrary.org/b/id/12859975-M.jpg",
                        extra_meta="Book of the Year across multiple global platforms"
                    ),
                    CuratedBook(
                        id="gr-3",
                        title="Fourth Wing",
                        author="Rebecca Yarros",
                        year="2023",
                        badge="Best Romantasy Winner",
                        genre="Romantasy / Epic Fantasy",
                        description="Twenty-year-old Violet Sorrengail enters the brutal Basgiath War College where dragon riders bond with deadly dragons or perish in the trials.",
                        cover_url="https://covers.openlibrary.org/b/id/14407898-M.jpg",
                        extra_meta="Over 1 million Goodreads 5-star ratings"
                    ),
                    CuratedBook(
                        id="gr-4",
                        title="The Seven Husbands of Evelyn Hugo",
                        author="Taylor Jenkins Reid",
                        year="2017",
                        badge="All-Time Reader Favorite",
                        genre="Historical Drama",
                        description="Aging Hollywood icon Evelyn Hugo finally decides to reveal the truth about her glamorous, scandalous life and seven marriages to an unknown reporter.",
                        cover_url="https://covers.openlibrary.org/b/id/8354226-M.jpg",
                        extra_meta="One of the most reviewed books in Goodreads history"
                    ),
                    CuratedBook(
                        id="gr-5",
                        title="Daisy Jones & The Six",
                        author="Taylor Jenkins Reid",
                        year="2019",
                        badge="Goodreads Historical Fiction Winner",
                        genre="Rock & Roll Drama / Oral History",
                        description="The legendary rise and precipitous fall of an iconic 1970s rock group, told in an electric oral-history interview format that feels 100% real.",
                        cover_url="https://covers.openlibrary.org/b/id/8742674-M.jpg",
                        extra_meta="Adapted into the Emmy-nominated Amazon Prime series"
                    ),
                    CuratedBook(
                        id="gr-6",
                        title="Lessons in Chemistry",
                        author="Bonnie Garmus",
                        year="2022",
                        badge="Goodreads Debut Winner",
                        genre="Feminist Historical Fiction",
                        description="Chemist Elizabeth Zott in 1960s California becomes the reluctant host of a TV cooking show, daring women across America to rethink their boundaries.",
                        cover_url="https://covers.openlibrary.org/b/id/12725772-M.jpg",
                        extra_meta="Over 100 weeks on the New York Times bestseller list"
                    ),
                    CuratedBook(
                        id="gr-7",
                        title="The Midnight Library",
                        author="Matt Haig",
                        year="2020",
                        badge="Goodreads Fiction Winner",
                        genre="Philosophical / Contemporary Fantasy",
                        description="Between life and death lies a library containing infinite books—each one allowing Nora Seed to experience the lives she might have lived if she'd made different choices.",
                        cover_url="https://covers.openlibrary.org/b/id/10313767-M.jpg",
                        extra_meta="International reader comfort favorite"
                    ),
                    CuratedBook(
                        id="gr-8",
                        title="The Song of Achilles",
                        author="Madeline Miller",
                        year="2011",
                        badge="BookTok & Goodreads Champion",
                        genre="Mythological Retelling / Romance",
                        description="A breathtaking, deeply moving reimagining of Homer's Iliad through the profound bond between gentle exile Patroclus and golden hero Achilles.",
                        cover_url="https://covers.openlibrary.org/b/id/7098465-M.jpg",
                        extra_meta="Orange Prize for Fiction winner"
                    ),
                    CuratedBook(
                        id="gr-9",
                        title="Normal People",
                        author="Sally Rooney",
                        year="2018",
                        badge="Contemporary Icon",
                        genre="Literary Fiction / Coming-of-Age",
                        description="Marianne and Connell grow up in a small Irish town, drifting in and out of each other's romantic and intellectual orbits through their college years.",
                        cover_url="https://covers.openlibrary.org/b/id/8794265-M.jpg",
                        extra_meta="Adapted into the BBC/Hulu series"
                    ),
                    CuratedBook(
                        id="gr-10",
                        title="Where the Crawdads Sing",
                        author="Delia Owens",
                        year="2018",
                        badge="Multi-Million Sensation",
                        genre="Mystery / Southern Coming-of-Age",
                        description="For years, rumors of the 'Marsh Girl' have haunted Barkley Cove. When handsome Chase Andrews is found dead, the isolated marsh girl becomes the prime suspect.",
                        cover_url="https://covers.openlibrary.org/b/id/8362947-M.jpg",
                        extra_meta="Over 15 million copies sold worldwide"
                    ),
                ]
            ),

            # ----------------------------------------------------
            # 3. NATIONAL BESTSELLERS IN INDIA (10 Books)
            # ----------------------------------------------------
            CuratedCategory(
                id="indian-bestsellers",
                name="National Bestsellers (India)",
                icon="flag",
                tagline="Chart-topping authors and stories from Indian literature",
                books=[
                    CuratedBook(
                        id="in-1",
                        title="The Immortals of Meluha",
                        author="Amish Tripathi",
                        year="2010",
                        badge="#1 National Bestseller",
                        genre="Mythological Fiction",
                        description="1900 BC in ancient India: Shiva, a Tibetan immigrant, arrives in the land of Meluha and is hailed as the legendary Neelkanth savior against evil.",
                        cover_url="https://covers.openlibrary.org/b/id/11152324-M.jpg",
                        extra_meta="Over 5 million copies sold in India"
                    ),
                    CuratedBook(
                        id="in-2",
                        title="The Secret of the Nagas",
                        author="Amish Tripathi",
                        year="2011",
                        badge="Mythological Blockbuster",
                        genre="Mythological Adventure",
                        description="Shiva embarks on an epic quest to avenge his slaughtered friend and track down the mysterious Naga warrior who holds the key to India's destiny.",
                        cover_url="https://covers.openlibrary.org/b/id/6917318-M.jpg",
                        extra_meta="Book 2 of the legendary Shiva Trilogy"
                    ),
                    CuratedBook(
                        id="in-3",
                        title="The Rozabal Line",
                        author="Ashwin Sanghi",
                        year="2008",
                        badge="Bestselling Conspiracy Thriller",
                        genre="Historical Conspiracy Thriller",
                        description="A deadly international conspiracy links Jesus's survival in Kashmir with modern intelligence agencies and religious cults.",
                        cover_url="https://covers.openlibrary.org/b/id/12393403-M.jpg",
                        extra_meta="Widely acclaimed as 'The Indian Da Vinci Code'"
                    ),
                    CuratedBook(
                        id="in-4",
                        title="The Krishna Key",
                        author="Ashwin Sanghi",
                        year="2012",
                        badge="Mythological Mystery Thriller",
                        genre="Mythological Whodunit",
                        description="Historian Ravi Mohan Saini must race across ancient temples to solve a string of brutal murders committed by an assassin who believes he is Kalki avatar.",
                        cover_url="https://covers.openlibrary.org/b/id/10838319-M.jpg",
                        extra_meta="National chart-topping thriller"
                    ),
                    CuratedBook(
                        id="in-5",
                        title="The Namesake",
                        author="Jhumpa Lahiri",
                        year="2003",
                        badge="Acclaimed Masterpiece",
                        genre="Cultural / Family Drama",
                        description="Gogol Ganguli, named after the Russian author, navigates the complexities of first-generation American identity and Bengali heritage.",
                        cover_url="https://covers.openlibrary.org/b/id/6628164-M.jpg",
                        extra_meta="Pulitzer Prize-winning author; adapted into a Mira Nair film"
                    ),
                    CuratedBook(
                        id="in-6",
                        title="The White Tiger",
                        author="Aravind Adiga",
                        year="2008",
                        badge="Booker Prize Winner",
                        genre="Dark Satirical Fiction",
                        description="Balram Halwai chronicles his rise from impoverished rural teashop worker to wealthy Bangalore chauffeur and entrepreneur through sheer wit and murder.",
                        cover_url="https://covers.openlibrary.org/b/id/10497892-M.jpg",
                        extra_meta="Adapted into the Oscar-nominated Netflix film"
                    ),
                    CuratedBook(
                        id="in-7",
                        title="The Palace of Illusions",
                        author="Chitra Banerjee Divakaruni",
                        year="2008",
                        badge="Feminist Epic Reimagining",
                        genre="Mythological Retelling",
                        description="The ancient Mahabharata epic reimagined entirely through the vibrant, passionate voice of Panchaali (Draupadi) from fire to exile.",
                        cover_url="https://covers.openlibrary.org/b/id/10314060-M.jpg",
                        extra_meta="Beloved staple across Indian reading circles"
                    ),
                    CuratedBook(
                        id="in-8",
                        title="The Zoya Factor",
                        author="Anuja Chauhan",
                        year="2008",
                        badge="Romantic Comedy Classic",
                        genre="Rom-Com / Cricket Fiction",
                        description="Advertising agent Zoya Solanki becomes the unwitting good-luck charm for the Indian Cricket Team during the World Cup, clashing with the stern captain.",
                        cover_url="https://covers.openlibrary.org/b/id/10631895-M.jpg",
                        extra_meta="Adapted into a Bollywood feature film"
                    ),
                    CuratedBook(
                        id="in-9",
                        title="Those Pricey Thakur Girls",
                        author="Anuja Chauhan",
                        year="2013",
                        badge="Cozy Comedy of Manners",
                        genre="Family Comedy / Romance",
                        description="In 1980s Hailey Road, New Delhi, Justice Laxmi Narayan Thakur and his five alphabetically named daughters navigate news broadcasting, romance, and gossip.",
                        cover_url="https://covers.openlibrary.org/b/id/7875442-M.jpg",
                        extra_meta="Adapted into the streaming series 'Dil Bekaraar'"
                    ),
                    CuratedBook(
                        id="in-10",
                        title="Ghachar Ghochar",
                        author="Vivek Shanbhag",
                        year="2015",
                        badge="Sensational Modern Novella",
                        genre="Psychological Family Drama",
                        description="In Bangalore, a close-knit lower-middle-class family suddenly strikes it rich, and the newfound wealth gradually corrodes their morality and sanity.",
                        cover_url="https://covers.openlibrary.org/b/id/13502048-M.jpg",
                        extra_meta="Translated from Kannada into over 20 languages"
                    ),
                ]
            ),

            # ----------------------------------------------------
            # 4. INTERNATIONAL BESTSELLERS (10 Books)
            # ----------------------------------------------------
            CuratedCategory(
                id="international-bestsellers",
                name="International Bestsellers",
                icon="globe",
                tagline="Sensational global hits dominating international charts",
                books=[
                    CuratedBook(
                        id="int-1",
                        title="The Housemaid",
                        author="Freida McFadden",
                        year="2022",
                        badge="Global Thriller Phenomenon",
                        genre="Psychological Thriller",
                        description="Millie takes a live-in housekeeper job for the wealthy Winchester family, only to find the attic bedroom locks from the outside.",
                        cover_url="https://covers.openlibrary.org/b/id/15105883-M.jpg",
                        extra_meta="#1 New York Times & Sunday Times Bestseller"
                    ),
                    CuratedBook(
                        id="int-2",
                        title="The Housemaid's Secret",
                        author="Freida McFadden",
                        year="2023",
                        badge="Goodreads Mystery Winner",
                        genre="Psychological Thriller",
                        description="Millie agrees to clean a penthouse for a tech billionaire whose wife is never allowed out of her bedroom, plunging into another deadly spiral.",
                        cover_url="https://covers.openlibrary.org/b/id/13439869-M.jpg",
                        extra_meta="Over 500,000 5-star ratings"
                    ),
                    CuratedBook(
                        id="int-3",
                        title="The Silent Patient",
                        author="Alex Michaelides",
                        year="2019",
                        badge="Multi-Million Bestseller",
                        genre="Psychological Thriller",
                        description="A famous painter shoots her husband five times in the face and never speaks another word; a psychotherapist risks everything to unlock her silence.",
                        cover_url="https://covers.openlibrary.org/b/id/9407338-M.jpg",
                        extra_meta="Celebrated for one of the most iconic twist endings in literature"
                    ),
                    CuratedBook(
                        id="int-4",
                        title="Verity",
                        author="Colleen Hoover",
                        year="2018",
                        badge="International Megahit",
                        genre="Romantic Psychological Thriller",
                        description="Struggling writer Lowen Ashleigh is hired to finish the remaining books of injured author Verity Crawford, only to find a chilling unpublished manuscript.",
                        cover_url="https://covers.openlibrary.org/b/id/8747160-M.jpg",
                        extra_meta="Weeks on global bestseller lists"
                    ),
                    CuratedBook(
                        id="int-5",
                        title="Atomic Habits",
                        author="James Clear",
                        year="2018",
                        badge="#1 Worldwide Non-Fiction",
                        genre="Self-Transformation",
                        description="A proven framework for improving every day through tiny changes that compound into remarkable life and career results.",
                        cover_url="https://covers.openlibrary.org/b/id/12539702-M.jpg",
                        extra_meta="Over 15 million copies sold globally"
                    ),
                    CuratedBook(
                        id="int-6",
                        title="None of This Is True",
                        author="Lisa Jewell",
                        year="2023",
                        badge="Instant Bestseller",
                        genre="Psychological Suspense",
                        description="Popular podcaster Alix Summer encounters her 'birthday twin' Josie Fair in a local pub, but Josie soon embeds herself dangerously into Alix's life.",
                        cover_url="https://covers.openlibrary.org/b/id/13300169-M.jpg",
                        extra_meta="Chilling and addictive dual-narrative suspense"
                    ),
                    CuratedBook(
                        id="int-7",
                        title="The Guest List",
                        author="Lucy Foley",
                        year="2020",
                        badge="Locked-Room Sensation",
                        genre="Modern Agatha Christie Whodunit",
                        description="A glamorous celebrity wedding on a remote Irish island is plunged into darkness when a body is discovered and a storm cuts off all escape.",
                        cover_url="https://covers.openlibrary.org/b/id/10096112-M.jpg",
                        extra_meta="Reese's Book Club selection"
                    ),
                    CuratedBook(
                        id="int-8",
                        title="The Paris Apartment",
                        author="Lucy Foley",
                        year="2022",
                        badge="Atmospheric Suspense",
                        genre="Locked-Room Mystery",
                        description="Jess arrives in Paris to stay with her half-brother Ben, but he is missing from his eerie luxury apartment building where every neighbor is hiding something.",
                        cover_url="https://covers.openlibrary.org/b/id/11541298-M.jpg",
                        extra_meta="#1 New York Times Bestseller"
                    ),
                    CuratedBook(
                        id="int-9",
                        title="The Maid",
                        author="Nita Prose",
                        year="2022",
                        badge="Goodreads Mystery Winner",
                        genre="Cozy Whodunit",
                        description="Molly the hotel maid, who struggles with social cues, discovers infamous guest Charles Black dead in his bed, finding herself framed for murder.",
                        cover_url="https://covers.openlibrary.org/b/id/11199954-M.jpg",
                        extra_meta="Over 1 million copies sold; upcoming film"
                    ),
                    CuratedBook(
                        id="int-10",
                        title="Never Lie",
                        author="Freida McFadden",
                        year="2022",
                        badge="Fast-Paced Domestic Thriller",
                        genre="Psychological Thriller",
                        description="Newlyweds Ethan and Tricia get stranded in an isolated estate previously owned by a psychiatrist who vanished years ago, finding her audio session tapes.",
                        cover_url="https://covers.openlibrary.org/b/id/13198561-M.jpg",
                        extra_meta="One of McFadden's highest-rated twists"
                    ),
                ]
            ),

            # ----------------------------------------------------
            # 5. PAGE TO SCREEN (Movie & TV Adaptations) (10 Books)
            # ----------------------------------------------------
            CuratedCategory(
                id="page-to-screen",
                name="Page to Screen (Movie & TV Adaptations)",
                icon="film",
                tagline="Bestselling books being adapted for cinema and streaming",
                books=[
                    CuratedBook(
                        id="pts-1",
                        title="A Good Girl's Guide to Murder",
                        author="Holly Jackson",
                        year="2019",
                        badge="Now on Netflix & BBC",
                        genre="YA Crime Thriller",
                        description="Pip Fitz-Amobi investigates a five-year-old closed murder case in her small town, unraveling dark secrets someone is desperate to keep buried.",
                        cover_url="https://covers.openlibrary.org/b/id/13156188-M.jpg",
                        extra_meta="Starring Emma Myers (Wednesday)"
                    ),
                    CuratedBook(
                        id="pts-2",
                        title="It Ends With Us",
                        author="Colleen Hoover",
                        year="2016",
                        badge="Major Theatrical Release",
                        genre="Contemporary Drama / Romance",
                        description="Lily Bloom overcomes a difficult childhood and falls for neurosurgeon Ryle Kincaid, before her first love Atlas re-enters her life.",
                        cover_url="https://covers.openlibrary.org/b/id/10473609-M.jpg",
                        extra_meta="Starring Blake Lively & Justin Baldoni"
                    ),
                    CuratedBook(
                        id="pts-3",
                        title="Lessons in Chemistry",
                        author="Bonnie Garmus",
                        year="2022",
                        badge="Emmy-Winning Apple TV+ Series",
                        genre="Historical Drama / Comedy",
                        description="Chemist Elizabeth Zott in 1960s California becomes the reluctant star of America's most beloved TV cooking show, daring women to change the status quo.",
                        cover_url="https://covers.openlibrary.org/b/id/12725772-M.jpg",
                        extra_meta="Starring Academy Award winner Brie Larson"
                    ),
                    CuratedBook(
                        id="pts-4",
                        title="Dune",
                        author="Frank Herbert",
                        year="1965",
                        badge="Oscar-Winning Film Epic",
                        genre="Sci-Fi / Space Opera",
                        description="Paul Atreides is thrust onto the dangerous desert planet Arrakis, where factions clash over the most valuable substance in the universe.",
                        cover_url="https://covers.openlibrary.org/b/id/11481354-M.jpg",
                        extra_meta="Directed by Denis Villeneuve; 6 Academy Awards"
                    ),
                    CuratedBook(
                        id="pts-5",
                        title="Red, White & Royal Blue",
                        author="Casey McQuiston",
                        year="2019",
                        badge="Hit Amazon Prime Film",
                        genre="Romantic Comedy",
                        description="The son of the US President and Britain's Prince Henry go from high-profile feud to a secret, tender cross-Atlantic romance.",
                        cover_url="https://covers.openlibrary.org/b/id/9171544-M.jpg",
                        extra_meta="#1 Prime Video Worldwide Premiere"
                    ),
                    CuratedBook(
                        id="pts-6",
                        title="The Seven Husbands of Evelyn Hugo",
                        author="Taylor Jenkins Reid",
                        year="2017",
                        badge="Upcoming Netflix Feature",
                        genre="Historical Hollywood Drama",
                        description="Evelyn Hugo's sprawling Old Hollywood life story is heading to Netflix, directed by Leslye Headland.",
                        cover_url="https://covers.openlibrary.org/b/id/8354226-M.jpg",
                        extra_meta="One of Netflix's most anticipated literary adaptations"
                    ),
                    CuratedBook(
                        id="pts-7",
                        title="Daisy Jones & The Six",
                        author="Taylor Jenkins Reid",
                        year="2019",
                        badge="Emmy-Nominated Prime Series",
                        genre="Rock & Roll Musical Drama",
                        description="Starring Riley Keough and Sam Claflin as the explosive musical duo whose hit album captured the spirit of the 70s before their shock breakup.",
                        cover_url="https://covers.openlibrary.org/b/id/8742674-M.jpg",
                        extra_meta="Produced by Reese Witherspoon"
                    ),
                    CuratedBook(
                        id="pts-8",
                        title="The Housemaid",
                        author="Freida McFadden",
                        year="2022",
                        badge="Upcoming Lionsgate Feature",
                        genre="Psychological Thriller",
                        description="Lionsgate and director Paul Feig are adapting Freida McFadden's runaway bestselling psychological thriller for the big screen.",
                        cover_url="https://covers.openlibrary.org/b/id/15105883-M.jpg",
                        extra_meta="Screenplay by Rebecca Sonnenshine (The Boys)"
                    ),
                    CuratedBook(
                        id="pts-9",
                        title="Where the Crawdads Sing",
                        author="Delia Owens",
                        year="2018",
                        badge="Sony Pictures Theatrical Hit",
                        genre="Mystery / Southern Drama",
                        description="Daisy Edgar-Jones stars as Kya Clark, the abandoned marsh girl accused of murdering a wealthy town athlete in North Carolina.",
                        cover_url="https://covers.openlibrary.org/b/id/8362947-M.jpg",
                        extra_meta="Original song 'Carolina' by Taylor Swift"
                    ),
                    CuratedBook(
                        id="pts-10",
                        title="Normal People",
                        author="Sally Rooney",
                        year="2018",
                        badge="BAFTA & Emmy-Nominated Series",
                        genre="Coming-of-Age Drama",
                        description="Starring Daisy Edgar-Jones and Paul Mescal in their breakout performances exploring the intricate, devastating bond between two Irish youths.",
                        cover_url="https://covers.openlibrary.org/b/id/8794265-M.jpg",
                        extra_meta="Critically acclaimed worldwide streaming hit"
                    ),
                ]
            )
        ]

    def get_all_categories(self) -> List[CuratedCategory]:
        return self._categories

    def get_category_by_id(self, category_id: str) -> Optional[CuratedCategory]:
        for cat in self._categories:
            if cat.id == category_id:
                return cat
        return None

curated_service = CuratedService()
