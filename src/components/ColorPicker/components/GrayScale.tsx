import React, { useState, useRef, useEffect } from "react";
import type { RGB } from "../types";
import { hexToRgb, generateMixedScale, SCALE_LEVELS } from "../utils";
import styles from "../ColorPicker.module.css";

// Popular gray scale colors
const GRAY_SCALES = {
  slate: "#64748b", // Tailwind Slate-500
  zinc: "#71717a", // Tailwind Zinc-500
  gray: "#6b7280", // Tailwind Gray-500
  neutral: "#737373", // Tailwind Neutral-500
  stone: "#78716c", // Tailwind Stone-500
};

interface GrayScaleProps {
  selectedGrayScale: string;
  onGrayScaleChange: (grayScale: string) => void;
}

const GrayScale: React.FC<GrayScaleProps> = ({
  selectedGrayScale,
  onGrayScaleChange,
}) => {
  const grayRgb: RGB = hexToRgb(
    GRAY_SCALES[selectedGrayScale as keyof typeof GRAY_SCALES]
  );
  const scale = generateMixedScale(grayRgb);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

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
    <div className={styles.colorScale}>
      <div className={styles.colorScaleHeader}>
        <h3 className={styles.colorScaleTitle}>Gray Scale Reference</h3>
        <div className={styles.grayScaleControls}>
          <select
            value={selectedGrayScale}
            onChange={(e) => onGrayScaleChange(e.target.value)}
            className={styles.grayScaleSelect}
          >
            {Object.entries(GRAY_SCALES).map(([name, hex]) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)} -{" "}
                {hex.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
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

export default GrayScale;
