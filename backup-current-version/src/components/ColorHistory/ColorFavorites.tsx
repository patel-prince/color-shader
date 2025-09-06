/**
 * ColorFavorites Component
 * Displays saved favorite colors with management functionality
 */

import { useState } from "react";
import type { ColorFavoriteItem } from "../ColorPicker/types";
import styles from "./ColorFavorites.module.css";

export interface ColorFavoritesProps {
  favorites: ColorFavoriteItem[];
  currentColor: string;
  onColorSelect: (hex: string) => void;
  onAddFavorite: (hex: string, name: string) => void;
  onRemoveFavorite: (id: string) => void;
  isFavorite: (hex: string) => boolean;
  className?: string;
}

export function ColorFavorites({
  favorites,
  currentColor,
  onColorSelect,
  onAddFavorite,
  onRemoveFavorite,
  isFavorite,
  className,
}: ColorFavoritesProps) {
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [favoriteName, setFavoriteName] = useState("");

  const handleColorClick = (item: ColorFavoriteItem) => {
    onColorSelect(item.hex);
  };

  const handleAddFavorite = () => {
    const name = favoriteName.trim();
    if (!name) return;

    onAddFavorite(currentColor, name);
    setFavoriteName("");
    setIsAddingFavorite(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddFavorite();
    } else if (e.key === "Escape") {
      setIsAddingFavorite(false);
      setFavoriteName("");
    }
  };

  const currentColorIsFavorite = isFavorite(currentColor);

  return (
    <div className={`${styles.favoritesContainer} ${className || ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Favorites</h3>
        {!currentColorIsFavorite && currentColor && (
          <button
            className={styles.addButton}
            onClick={() => setIsAddingFavorite(true)}
            title="Add current color to favorites"
          >
            + Add
          </button>
        )}
      </div>

      {/* Add Favorite Form */}
      {isAddingFavorite && (
        <div className={styles.addForm}>
          <div className={styles.addFormPreview}>
            <div
              className={styles.previewSwatch}
              style={{ backgroundColor: currentColor }}
            />
            <span className={styles.previewCode}>
              {currentColor.toUpperCase()}
            </span>
          </div>
          <div className={styles.addFormInput}>
            <input
              type="text"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name..."
              className={styles.nameInput}
              maxLength={20}
              autoFocus
            />
            <div className={styles.addFormButtons}>
              <button
                onClick={handleAddFavorite}
                disabled={!favoriteName.trim()}
                className={styles.saveButton}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingFavorite(false);
                  setFavoriteName("");
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⭐</div>
          <p className={styles.emptyText}>No favorite colors</p>
          <p className={styles.emptySubtext}>Save colors you love</p>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((item) => (
            <div key={item.id} className={styles.favoriteItem}>
              <div
                className={styles.favoriteColor}
                onClick={() => handleColorClick(item)}
              >
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: item.hex }}
                />
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>{item.name}</span>
                  <span className={styles.colorCode}>
                    {item.hex.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => onRemoveFavorite(item.id)}
                title="Remove from favorites"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
