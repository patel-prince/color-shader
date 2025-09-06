"use client";

import type { RGB } from "../types";
// Import hexToRgb utility function
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
import ColorScale from "./ColorScale";
import GrayScale from "./GrayScale";
import "./ColorScales.css";

interface ColorScalesProps {
  color: string; // hex color string
  selectedGrayScale: string;
  onGrayScaleChange: (grayScale: string) => void;
  className?: string;
  onShowCssVars?: () => void;
}

export default function ColorScales({
  color,
  selectedGrayScale,
  onGrayScaleChange,
  className = "",
  onShowCssVars,
}: ColorScalesProps) {
  const rgb: RGB = hexToRgb(color);

  return (
    <div className={`color-scales-container ${className}`}>
      <GrayScale
        selectedGrayScale={selectedGrayScale}
        onGrayScaleChange={onGrayScaleChange}
      />
      <ColorScale
        title="Color Scale"
        baseRgb={rgb}
        onShowCssVars={onShowCssVars}
      />
    </div>
  );
}
