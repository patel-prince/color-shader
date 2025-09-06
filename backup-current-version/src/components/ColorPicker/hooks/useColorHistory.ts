/**
 * Custom hook for managing color history and favorites
 * Provides state management and persistence for user color interactions
 */

import { useState, useEffect, useCallback } from "react";
import type {
  ColorHistoryItem,
  ColorFavoriteItem,
  ColorHistoryHookReturn,
} from "../types";
import {
  loadColorHistoryState,
  addColorToHistory as addToHistoryStorage,
  addColorToFavorites as addToFavoritesStorage,
  removeColorFromFavorites as removeFromFavoritesStorage,
  clearColorHistory as clearHistoryStorage,
  isColorFavorite,
} from "../utils/storage";

/**
 * Custom hook for color history and favorites management
 * @returns Object containing history data and management functions
 *
 * @example
 * ```typescript
 * const { history, favorites, addToHistory, addToFavorites } = useColorHistory();
 *
 * // Add color to history
 * addToHistory('#ff0000');
 *
 * // Add color to favorites
 * addToFavorites('#ff0000', 'My Red');
 * ```
 */
export function useColorHistory(): ColorHistoryHookReturn {
  const [history, setHistory] = useState<ColorHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<ColorFavoriteItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const { history: storedHistory, favorites: storedFavorites } =
      loadColorHistoryState();
    setHistory(storedHistory);
    setFavorites(storedFavorites);
    setIsInitialized(true);
  }, []);

  /**
   * Add a color to history
   * Automatically removes duplicates and maintains chronological order
   */
  const addToHistory = useCallback(
    (hex: string) => {
      if (!hex || !isInitialized) return;

      try {
        const updatedHistory = addToHistoryStorage(hex);
        setHistory(updatedHistory);
      } catch (error) {
        console.warn("Failed to add color to history:", error);
      }
    },
    [isInitialized]
  );

  /**
   * Add a color to favorites with a custom name
   */
  const addToFavorites = useCallback(
    (hex: string, name: string) => {
      if (!hex || !name?.trim() || !isInitialized) return;

      try {
        const updatedFavorites = addToFavoritesStorage(hex, name.trim());
        setFavorites(updatedFavorites);
      } catch (error) {
        console.warn("Failed to add color to favorites:", error);
      }
    },
    [isInitialized]
  );

  /**
   * Remove a color from favorites by ID
   */
  const removeFromFavorites = useCallback(
    (id: string) => {
      if (!id || !isInitialized) return;

      try {
        const updatedFavorites = removeFromFavoritesStorage(id);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.warn("Failed to remove color from favorites:", error);
      }
    },
    [isInitialized]
  );

  /**
   * Clear all history items
   */
  const clearHistory = useCallback(() => {
    if (!isInitialized) return;

    try {
      clearHistoryStorage();
      setHistory([]);
    } catch (error) {
      console.warn("Failed to clear history:", error);
    }
  }, [isInitialized]);

  /**
   * Check if a color is currently in favorites
   */
  const isFavorite = useCallback(
    (hex: string): boolean => {
      if (!hex || !isInitialized) return false;
      return isColorFavorite(hex, favorites);
    },
    [favorites, isInitialized]
  );

  return {
    history,
    favorites,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
    clearHistory,
    isFavorite,
  };
}
