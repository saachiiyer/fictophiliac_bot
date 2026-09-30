import { useState, useCallback } from 'react';
import apiService from '../services/api';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [excludedTitles, setExcludedTitles] = useState([]);

  const fetchRecommendations = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getRecommendations({
        ...params,
        excludedTitles: excludedTitles,
      });
      setRecommendations(data.recommendations || []);
      const newTitles = (data.recommendations || []).map((b) => b.title);
      setExcludedTitles((prev) => Array.from(new Set([...prev, ...newTitles])));
      return data;
    } catch (err) {
      console.error('Failed to get recommendations', err);
      setError(err.response?.data?.detail || 'Failed to fetch recommendations. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [excludedTitles]);

  const replaceBook = useCallback(async (index, userProfile) => {
    const targetBook = recommendations[index];
    if (!targetBook) return;

    setReplacingIndex(index);
    try {
      const currentExclusions = Array.from(new Set([
        ...excludedTitles,
        targetBook.title,
        ...(userProfile.readBooks?.map((b) => b.title) || [])
      ]));

      const replacement = await apiService.replaceBook({
        readBook: targetBook.title,
        previousReads: userProfile.previousReads || [],
        favoriteAuthors: userProfile.favoriteAuthors || [],
        preferredGenres: userProfile.preferredGenres || [],
        excludedTitles: currentExclusions,
      });

      setRecommendations((prev) => {
        const next = [...prev];
        next[index] = replacement;
        return next;
      });

      setExcludedTitles((prev) => Array.from(new Set([...prev, replacement.title, targetBook.title])));
      return replacement;
    } catch (err) {
      console.error('Failed to replace book', err);
      throw err;
    } finally {
      setReplacingIndex(null);
    }
  }, [recommendations, excludedTitles]);

  return {
    recommendations,
    loading,
    replacingIndex,
    error,
    fetchRecommendations,
    replaceBook,
    resetRecommendations: () => {
      setRecommendations([]);
      setExcludedTitles([]);
      setError(null);
    },
  };
}

