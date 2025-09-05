import React from "react";
import type { RGB } from "../types";
import { hexToRgb } from "../utils";
import ColorScale from "./ColorScale";
import GrayScale from "./GrayScale";
import styles from "../ColorPicker.module.css";

interface ColorScalesProps {
  color: string; // hex color string
  selectedGrayScale: string;
  onGrayScaleChange: (grayScale: string) => void;
  className?: string;
  onShowCssVars?: (scaleType: "mixed") => void;
}

const ColorScales: React.FC<ColorScalesProps> = ({
  color,
  selectedGrayScale,
  onGrayScaleChange,
  className = "",
  onShowCssVars,
}) => {
  const rgb: RGB = hexToRgb(color);

  return (
    <div className={`${styles.colorScalesContainer} ${className}`}>
      <GrayScale
        selectedGrayScale={selectedGrayScale}
        onGrayScaleChange={onGrayScaleChange}
      />
      <ColorScale
        title="Color Scale"
        baseRgb={rgb}
        type="mixed"
        onShowCssVars={onShowCssVars}
      />
    </div>
  );
};

export default ColorScales;
