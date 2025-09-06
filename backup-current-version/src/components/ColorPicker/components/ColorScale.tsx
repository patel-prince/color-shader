import React, { useState, useRef, useEffect } from "react";
import type { RGB } from "../types";
import { generateMixedScale, SCALE_LEVELS } from "../utils";
import styles from "../ColorPicker.module.css";

interface ColorScaleProps {
  title: string;
  baseRgb: RGB;
  type: "mixed";
  className?: string;
  onShowCssVars?: (scaleType: "mixed") => void;
}

const ColorScale: React.FC<ColorScaleProps> = ({
  title,
  baseRgb,
  type,
  className = "",
  onShowCssVars,
}) => {
  const scale = generateMixedScale(baseRgb);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = async (hexColor: string, level: number) => {
    try {
      await navigator.clipboard.writeText(hexColor);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setCopiedColor(`${level}`);

      // Set new timeout and store the reference
      timeoutRef.current = setTimeout(() => {
        setCopiedColor(null);
        timeoutRef.current = null;
      }, 1000);
    } catch (error) {
      console.error("Failed to copy color:", error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`${styles.colorScale} ${className}`}>
      <div className={styles.colorScaleHeader}>
        <h3 className={styles.colorScaleTitle}>{title}</h3>
        {onShowCssVars && (
          <button
            className={styles.colorScaleExportBtn}
            onClick={() => onShowCssVars(type)}
          >
            Export CSS
          </button>
        )}
      </div>
      <div className={styles.colorScaleGrid}>
        {SCALE_LEVELS.map((level) => (
          <div
            key={level}
            className={styles.colorScaleItem}
            onClick={() => copyToClipboard(scale[level], level)}
            title={`Click to copy ${scale[level]}`}
          >
            <div
              className={styles.colorScaleSwatch}
              style={{ backgroundColor: scale[level] }}
            >
              {copiedColor === `${level}` && (
                <div className={styles.copiedOverlay}>copied</div>
              )}
            </div>
            <div className={styles.colorScaleLabel}>
              <span className={styles.colorScaleLevel}>{level}</span>
              <span className={styles.colorScaleHex}>{scale[level]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorScale;
