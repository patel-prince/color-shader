import React from "react";
import type { RGB } from "../types";
import { generateMixedScale, generateHslScale, SCALE_LEVELS } from "../utils";
import styles from "../ColorPicker.module.css";

interface ColorScaleProps {
  title: string;
  baseRgb: RGB;
  type: "mixed" | "hsl";
  className?: string;
}

const ColorScale: React.FC<ColorScaleProps> = ({
  title,
  baseRgb,
  type,
  className = "",
}) => {
  const scale =
    type === "mixed" ? generateMixedScale(baseRgb) : generateHslScale(baseRgb);

  return (
    <div className={`${styles.colorScale} ${className}`}>
      <h3 className={styles.colorScaleTitle}>{title}</h3>
      <div className={styles.colorScaleGrid}>
        {SCALE_LEVELS.map((level) => (
          <div key={level} className={styles.colorScaleItem}>
            <div
              className={styles.colorScaleSwatch}
              style={{ backgroundColor: scale[level] }}
            />
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
