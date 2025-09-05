/**
 * Local Storage Utilities for Color History and Favorites
 * Handles persistent storage of user color interactions
 */

import type {
  ColorHistoryItem,
  ColorFavoriteItem,
  ColorHistoryState,
} from "../types";

// Storage keys
const STORAGE_KEYS = {
  HISTORY: "color-shader-history",
  FAVORITES: "color-shader-favorites",
} as const;

// Configuration
const MAX_HISTORY_ITEMS = 16;

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeParseJSON<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn("Failed to parse JSON from localStorage:", error);
    return fallback;
  }
}

/**
 * Safely set item in localStorage
 */
function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
}

/**
 * Generate a unique ID for color items
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load color history from localStorage
 */
export function loadColorHistory(): ColorHistoryItem[] {
  const historyJson = localStorage.getItem(STORAGE_KEYS.HISTORY);
  const history = safeParseJSON<ColorHistoryItem[]>(historyJson, []);

  // Sort by timestamp (most recent first)
  return history.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Save color history to localStorage
 */
export function saveColorHistory(history: ColorHistoryItem[]): void {
  // Keep only the most recent items
  const trimmedHistory = history
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_HISTORY_ITEMS);

  safeSetItem(STORAGE_KEYS.HISTORY, trimmedHistory);
}

/**
 * Add a color to history (avoiding duplicates)
 */
export function addColorToHistory(hex: string): ColorHistoryItem[] {
  const currentHistory = loadColorHistory();

  // Remove existing entry if it exists
  const filteredHistory = currentHistory.filter(
    (item) => item.hex.toLowerCase() !== hex.toLowerCase()
  );

  // Create new item
  const newItem: ColorHistoryItem = {
    id: generateId(),
    hex: hex.toLowerCase(),
    timestamp: Date.now(),
  };

  // Add to beginning of array
  const updatedHistory = [newItem, ...filteredHistory];

  saveColorHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Load color favorites from localStorage
 */
export function loadColorFavorites(): ColorFavoriteItem[] {
  const favoritesJson = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  const favorites = safeParseJSON<ColorFavoriteItem[]>(favoritesJson, []);

  // Sort by timestamp (most recent first)
  return favorites.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Save color favorites to localStorage
 */
export function saveColorFavorites(favorites: ColorFavoriteItem[]): void {
  safeSetItem(STORAGE_KEYS.FAVORITES, favorites);
}

/**
 * Add a color to favorites
 */
export function addColorToFavorites(
  hex: string,
  name: string
): ColorFavoriteItem[] {
  const currentFavorites = loadColorFavorites();

  // Check if already exists
  const existingIndex = currentFavorites.findIndex(
    (item) => item.hex.toLowerCase() === hex.toLowerCase()
  );

  if (existingIndex >= 0) {
    // Update existing favorite
    currentFavorites[existingIndex] = {
      ...currentFavorites[existingIndex],
      name,
      timestamp: Date.now(),
    };
  } else {
    // Add new favorite
    const newFavorite: ColorFavoriteItem = {
      id: generateId(),
      hex: hex.toLowerCase(),
      name,
      timestamp: Date.now(),
    };
    currentFavorites.unshift(newFavorite);
  }

  saveColorFavorites(currentFavorites);
  return currentFavorites;
}

/**
 * Remove a color from favorites by ID
 */
export function removeColorFromFavorites(id: string): ColorFavoriteItem[] {
  const currentFavorites = loadColorFavorites();
  const updatedFavorites = currentFavorites.filter((item) => item.id !== id);

  saveColorFavorites(updatedFavorites);
  return updatedFavorites;
}

/**
 * Check if a color is in favorites
 */
export function isColorFavorite(
  hex: string,
  favorites: ColorFavoriteItem[]
): boolean {
  return favorites.some((item) => item.hex.toLowerCase() === hex.toLowerCase());
}

/**
 * Clear all history
 */
export function clearColorHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

/**
 * Load complete color history state
 */
export function loadColorHistoryState(): ColorHistoryState {
  return {
    history: loadColorHistory(),
    favorites: loadColorFavorites(),
  };
}
