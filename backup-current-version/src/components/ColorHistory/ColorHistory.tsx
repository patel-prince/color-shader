/**
 * ColorHistory Component
 * Displays recently used colors with click-to-select functionality
 */

import type { ColorHistoryItem } from "../ColorPicker/types";
import styles from "./ColorHistory.module.css";

export interface ColorHistoryProps {
  history: ColorHistoryItem[];
  onColorSelect: (hex: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export function ColorHistory({
  history,
  onColorSelect,
  onClearHistory,
  className,
}: ColorHistoryProps) {
  const handleColorClick = (item: ColorHistoryItem) => {
    onColorSelect(item.hex);
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={`${styles.historyContainer} ${className || ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Colors</h3>
        {history.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={onClearHistory}
            title="Clear history"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎨</div>
          <p className={styles.emptyText}>No recent colors</p>
          <p className={styles.emptySubtext}>
            Colors you pick will appear here
          </p>
        </div>
      ) : (
        <div className={styles.historyGrid}>
          {history.map((item) => (
            <div
              key={item.id}
              className={styles.historyItem}
              onClick={() => handleColorClick(item)}
              title={`${item.hex.toUpperCase()} • ${formatTime(
                item.timestamp
              )}`}
            >
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: item.hex }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
