import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fictophiliac_read_history';

export function useReadingHistory() {
  const [readBooks, setReadBooks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to parse read history from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readBooks));
    } catch (e) {
      console.warn('Failed to save read history to localStorage', e);
    }
  }, [readBooks]);

  const addReadBook = (book) => {
    const entry = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      markedAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    };

    setReadBooks((prev) => {
      const filtered = prev.filter((b) => b.title.toLowerCase() !== book.title.toLowerCase());
      return [entry, ...filtered];
    });
  };

  const clearHistory = () => {
    setReadBooks([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return {
    readBooks,
    readCount: readBooks.length,
    addReadBook,
    clearHistory,
  };
}

