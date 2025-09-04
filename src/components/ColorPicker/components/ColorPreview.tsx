import React from "react";
import type { RGB } from "../types";
import { rgbToHex } from "../utils";
import HueSlider from "./HueSlider";
import type { HSV } from "../types";
import styles from "../ColorPicker.module.css";

interface ColorPreviewProps {
  rgb: RGB;
  hsv: HSV;
  onHueChange: (h: number) => void;
}

/**
 * ColorPreview component displays the current color and hue slider
 * Optimized automatically by React Compiler
 */
const ColorPreview: React.FC<ColorPreviewProps> = ({
  rgb,
  hsv,
  onHueChange,
}) => {
  return (
    <div className={styles.colorPreviewSection}>
      <div
        className={styles.colorPreview}
        style={{
          backgroundColor: rgbToHex(rgb.r, rgb.g, rgb.b),
        }}
      />
      <HueSlider hsv={hsv} onChange={onHueChange} />
    </div>
  );
};

export default ColorPreview;
