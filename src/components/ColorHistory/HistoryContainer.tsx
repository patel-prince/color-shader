/**
 * HistoryContainer Component
 * Responsive container that manages history/favorites display in left sidebar across all screen sizes
 * - Mobile: Collapsible accordion sections (closed by default)
 * - Tablet/Desktop: Collapsible accordion sections (open by default)
 */

import { useState, useEffect } from "react";
import { ColorHistory, ColorFavorites } from "./index";
import { useColorHistory } from "../ColorPicker/hooks/useColorHistory";
import styles from "./HistoryContainer.module.css";

export interface HistoryContainerProps {
  currentColor: string;
  onColorSelect: (hex: string) => void;
  className?: string;
  isSidebarView?: boolean; // true for accordion layout in sidebar, false for regular layout (deprecated)
}

export function HistoryContainer({
  currentColor,
  onColorSelect,
  className = "",
  isSidebarView = false,
}: HistoryContainerProps) {
  const {
    history,
    favorites,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
    clearHistory,
    isFavorite,
  } = useColorHistory();

  // Track screen size for accordion default state
  const [shouldOpenByDefault, setShouldOpenByDefault] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Open by default for screens ≥ 500px (greater than mobile)
      setShouldOpenByDefault(window.innerWidth >= 500);
    };

    // Check initial screen size
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const containerClass = isSidebarView
    ? `${styles.sidebarContainer} ${className}`
    : `${styles.desktopContainer} ${className}`;

  return (
    <div className={containerClass}>
      {/* Desktop: Show both sections with more space */}
      {!isSidebarView && (
        <>
          <ColorFavorites
            favorites={favorites}
            currentColor={currentColor}
            onColorSelect={onColorSelect}
            onAddFavorite={addToFavorites}
            onRemoveFavorite={removeFromFavorites}
            isFavorite={isFavorite}
          />
          <ColorHistory
            history={history}
            onColorSelect={onColorSelect}
            onClearHistory={clearHistory}
          />
        </>
      )}

      {/* Mobile/Tablet: Collapsible sections in sidebar */}
      {isSidebarView && (
        <div className={styles.collapsibleSections}>
          <details className={styles.section} open={shouldOpenByDefault}>
            <summary className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Favorites</span>
              <span className={styles.sectionCount}>({favorites.length})</span>
            </summary>
            <div className={styles.sectionContent}>
              <ColorFavorites
                favorites={favorites}
                currentColor={currentColor}
                onColorSelect={onColorSelect}
                onAddFavorite={addToFavorites}
                onRemoveFavorite={removeFromFavorites}
                isFavorite={isFavorite}
              />
            </div>
          </details>

          <details className={styles.section} open={shouldOpenByDefault}>
            <summary className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Recent</span>
              <span className={styles.sectionCount}>({history.length})</span>
            </summary>
            <div className={styles.sectionContent}>
              <ColorHistory
                history={history}
                onColorSelect={onColorSelect}
                onClearHistory={clearHistory}
              />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
