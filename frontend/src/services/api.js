import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const apiService = {
  async getHealthStatus() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  async getCuratedShelves() {
    const response = await apiClient.get('/curated');
    return response.data;
  },

  async getRecommendations({ previousReads, favoriteAuthors, preferredGenres, excludedTitles, count = 6 }) {
    const response = await apiClient.post('/recommendations/recommend', {
      previous_reads: previousReads,
      favorite_authors: favoriteAuthors,
      preferred_genres: preferredGenres,
      excluded_titles: excludedTitles,
      count: count,
    });
    return response.data;
  },

  async replaceBook({ readBook, previousReads, favoriteAuthors, preferredGenres, excludedTitles }) {
    const response = await apiClient.post('/recommendations/replace', {
      read_book: readBook,
      previous_reads: previousReads,
      favorite_authors: favoriteAuthors,
      preferred_genres: preferredGenres,
      excluded_titles: excludedTitles,
    });
    return response.data;
  },

  async searchBooks(q) {
    const response = await apiClient.get('/community/search-books', {
      params: { q },
    });
    return response.data;
  },

  async verifyAndAddUrl(url) {
    const response = await apiClient.post('/community/verify-and-add-url', { url });
    return response.data;
  },

  async submitRecommendation(payload) {
    const response = await apiClient.post('/community/submit-recommendation', payload);
    return response.data;
  },

  async getChatReaction({ step, inputText, previousReads, favoriteAuthors, preferredGenres }) {
    const response = await apiClient.post('/recommendations/chat-react', {
      step,
      input_text: inputText,
      previous_reads: previousReads,
      favorite_authors: favoriteAuthors,
      preferred_genres: preferredGenres,
    });
    return response.data;
  },

  async getReviews() {
    const response = await apiClient.get('/community/reviews');
    return response.data;
  },
};

export default apiService;
