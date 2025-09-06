"use client";

import { useState, useEffect, useCallback } from "react";
import "./ColorHistory.css";

interface ColorHistoryItem {
  hex: string;
  timestamp: number;
  isFavorite?: boolean;
}

interface ColorHistoryProps {
  currentColor: string;
  onColorSelect: (hex: string) => void;
  className?: string;
}

const MAX_HISTORY_ITEMS = 20;
const MAX_FAVORITES = 10;

export function ColorHistory({
  currentColor,
  onColorSelect,
  className = "",
}: ColorHistoryProps) {
  const [history, setHistory] = useState<ColorHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<ColorHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("colorkit-history");
      const savedFavorites = localStorage.getItem("colorkit-favorites");

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.warn("Failed to load color history:", error);
    }
  }, []);

  // Save to localStorage when history or favorites change
  useEffect(() => {
    try {
      localStorage.setItem("colorkit-history", JSON.stringify(history));
    } catch (error) {
      console.warn("Failed to save color history:", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem("colorkit-favorites", JSON.stringify(favorites));
    } catch (error) {
      console.warn("Failed to save color favorites:", error);
    }
  }, [favorites]);

  // Add color to history when currentColor changes
  useEffect(() => {
    if (currentColor && /^#[0-9A-F]{6}$/i.test(currentColor)) {
      const normalizedColor = currentColor.toUpperCase();

      setHistory((prev) => {
        // Don't add if it's already the most recent
        if (prev.length > 0 && prev[0].hex === normalizedColor) {
          return prev;
        }

        // Remove existing instance if present
        const filtered = prev.filter((item) => item.hex !== normalizedColor);

        // Add to beginning and limit size
        const newHistory = [
          { hex: normalizedColor, timestamp: Date.now() },
          ...filtered,
        ].slice(0, MAX_HISTORY_ITEMS);

        return newHistory;
      });
    }
  }, [currentColor]);

  const toggleFavorite = useCallback((hex: string, event: React.MouseEvent) => {
    event.stopPropagation();

    setFavorites((prev) => {
      const existingIndex = prev.findIndex((item) => item.hex === hex);

      if (existingIndex >= 0) {
        // Remove from favorites
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add to favorites (limit size)
        if (prev.length >= MAX_FAVORITES) {
          return prev; // Don't add if at limit
        }
        return [{ hex, timestamp: Date.now(), isFavorite: true }, ...prev];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (hex: string) => {
      return favorites.some((item) => item.hex === hex);
    },
    [favorites]
  );

  const clearHistory = useCallback(() => {
    if (window.confirm("Clear all color history?")) {
      setHistory([]);
    }
  }, []);

  const clearFavorites = useCallback(() => {
    if (window.confirm("Clear all favorite colors?")) {
      setFavorites([]);
    }
  }, []);

  const handleColorClick = useCallback(
    (hex: string) => {
      onColorSelect(hex);
    },
    [onColorSelect]
  );

  const renderColorItem = (
    item: ColorHistoryItem,
    showFavoriteButton = true
  ) => (
    <div
      key={`${item.hex}-${item.timestamp}`}
      className={`color-history-item ${
        item.hex === currentColor.toUpperCase() ? "active" : ""
      }`}
      onClick={() => handleColorClick(item.hex)}
      title={`${item.hex} - Click to select`}
    >
      <div
        className="color-history-swatch"
        style={{ backgroundColor: item.hex }}
      />
      <div className="color-history-info">
        <span className="color-history-hex">{item.hex}</span>
        {showFavoriteButton && (
          <button
            className={`favorite-button ${
              isFavorite(item.hex) ? "favorited" : ""
            }`}
            onClick={(e) => toggleFavorite(item.hex, e)}
            title={
              isFavorite(item.hex)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite(item.hex) ? "★" : "☆"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`color-history ${className}`}>
      <div className="color-history-header">
        <div className="color-history-tabs">
          <button
            className={`history-tab ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            Recent ({history.length})
          </button>
          <button
            className={`history-tab ${
              activeTab === "favorites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        <div className="history-actions">
          {activeTab === "recent" && history.length > 0 && (
            <button className="clear-button" onClick={clearHistory}>
              Clear
            </button>
          )}
          {activeTab === "favorites" && favorites.length > 0 && (
            <button className="clear-button" onClick={clearFavorites}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="color-history-content">
        {activeTab === "recent" && (
          <div className="history-grid">
            {history.length > 0 ? (
              history.map((item) => renderColorItem(item, true))
            ) : (
              <div className="empty-state">
                <p>No recent colors</p>
                <span>Colors you pick will appear here</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="history-grid">
            {favorites.length > 0 ? (
              favorites.map((item) => renderColorItem(item, false))
            ) : (
              <div className="empty-state">
                <p>No favorite colors</p>
                <span>Star colors to save them here</span>
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === "favorites" && favorites.length >= MAX_FAVORITES && (
        <div className="favorites-limit-notice">
          Maximum {MAX_FAVORITES} favorites reached
        </div>
      )}
    </div>
  );
}
