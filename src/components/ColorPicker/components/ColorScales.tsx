import React from "react";
import type { RGB } from "../types";
import { hexToRgb } from "../utils";
import ColorScale from "./ColorScale";
import styles from "../ColorPicker.module.css";

interface ColorScalesProps {
  color: string; // hex color string
  className?: string;
}

const ColorScales: React.FC<ColorScalesProps> = ({ color, className = "" }) => {
  const rgb: RGB = hexToRgb(color);

  return (
    <div className={`${styles.colorScalesContainer} ${className}`}>
      <ColorScale title="Mixed Scale" baseRgb={rgb} type="mixed" />
      <ColorScale title="HSL Scale" baseRgb={rgb} type="hsl" />
    </div>
  );
};

export default ColorScales;
