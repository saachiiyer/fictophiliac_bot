import { requestRecommendations } from "./api.js";

const state = { step: 0, preferences: { previous_reads: [], favorite_authors: [], preferred_genres: [], excluded_books: [] } };
const STEPS = [
  { key: "previous_reads", prompt: "Hi there! Let's find your next read. Name up to 3 books you've recently loved:", placeholder: "e.g., Daisy Darker, Then There Were None" },
  { key: "favorite_authors", prompt: "Who are up to 3 of your favorite authors?", placeholder: "e.g., Holly Jackson, Agatha Christie" },
  { key: "preferred_genres", prompt: "Which genres do you prefer right now?", placeholder: "e.g., Thriller, Romance, Mystery" }
];

const promptText = document.getElementById("prompt-text");
const inputField = document.getElementById("answer-input");
const questionnaireBox = document.getElementById("questionnaire");
const gridBox = document.getElementById("recommendation-grid");
const submitBtn = document.getElementById("btn-submit");
const skipBtn = document.getElementById("btn-skip");

function parseCSV(val) { return val.split(",").map((s) => s.trim()).filter(Boolean); }
function updateUI() {
  if (state.step < STEPS.length) {
    promptText.innerText = STEPS[state.step].prompt;
    inputField.placeholder = STEPS[state.step].placeholder;
    inputField.value = "";
    inputField.focus();
  } else {
    questionnaireBox.style.display = "none";
    loadInitialRecommendations();
  }
}

submitBtn.onclick = () => {
  const val = inputField.value.trim();
  if (val) state.preferences[STEPS[state.step].key] = parseCSV(val);
  state.step++;
  updateUI();
};
skipBtn.onclick = () => { state.step++; updateUI(); };
inputField.addEventListener("keydown", (e) => { if (e.key === "Enter") submitBtn.click(); });

async function loadInitialRecommendations() {
  gridBox.innerHTML = "<p>Analyzing your reading profile...</p>";
  try {
    const data = await requestRecommendations({ ...state.preferences, count: 6 });
    gridBox.innerHTML = "";
    data.recommendations.forEach(renderBookTile);
  } catch (err) {
    gridBox.innerHTML = `<p style="color: #ef4444;">Error: ${err.message}</p>`;
  }
}

function renderBookTile(book) {
  state.preferences.excluded_books.push(book.title);
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
    <img class="book-cover" src="${book.cover_url}" alt="${book.title}" onerror="this.src='https://placehold.co/300x400?text=No+Cover'"/>
    <div class="book-content">
      <div class="badge">${book.genre}</div>
      <h3 style="margin: 0 0 4px 0;">${book.title}</h3>
      <span style="font-size: 0.85rem; color: #cbd5e1;">By ${book.author}</span>
      <p class="pitch">${book.pitch}</p>
      <button class="btn-mark-read">Mark as Read</button>
    </div>
  `;
  card.querySelector(".btn-mark-read").onclick = async (e) => {
    const btn = e.target;
    btn.disabled = true;
    btn.innerText = "Finding a replacement...";
    try {
      const data = await requestRecommendations({ ...state.preferences, count: 1 });
      if (data.recommendations.length > 0) card.replaceWith(renderBookTile(data.recommendations[0]));
      else card.remove();
    } catch {
      btn.disabled = false;
      btn.innerText = "Error replacing. Retry?";
    }
  };
  gridBox.appendChild(card);
  return card;
}
updateUI();
