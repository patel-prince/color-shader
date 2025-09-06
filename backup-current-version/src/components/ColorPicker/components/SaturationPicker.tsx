import React, { useRef } from "react";
import type { HSV } from "../types";
import { useMouseDrag } from "../hooks";
import styles from "../ColorPicker.module.css";

interface SaturationPickerProps {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
}

/**
 * SaturationPicker component provides 2D saturation/brightness selection
 * Optimized automatically by React Compiler
 */
const SaturationPicker: React.FC<SaturationPickerProps> = ({
  hsv,
  onChange,
}) => {
  const saturationRef = useRef<HTMLDivElement>(null);

  const updateSaturationValue = (clientX: number, clientY: number) => {
    if (!saturationRef.current) return;

    const rect = saturationRef.current.getBoundingClientRect();
    const s = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    const v = Math.max(
      0,
      Math.min(100, (1 - (clientY - rect.top) / rect.height) * 100)
    );
    onChange(Math.round(s), Math.round(v));
  };

  const { handleMouseDown } = useMouseDrag({
    onDrag: updateSaturationValue,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    let newS = hsv.s;
    let newV = hsv.v;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newS = Math.max(0, hsv.s - step);
        break;
      case "ArrowRight":
        e.preventDefault();
        newS = Math.min(100, hsv.s + step);
        break;
      case "ArrowUp":
        e.preventDefault();
        newV = Math.min(100, hsv.v + step);
        break;
      case "ArrowDown":
        e.preventDefault();
        newV = Math.max(0, hsv.v - step);
        break;
      default:
        return;
    }

    onChange(newS, newV);
  };

  return (
    <div
      className={styles.saturationPicker}
      ref={saturationRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Color saturation and brightness"
      aria-valuetext={`Saturation ${hsv.s}%, Brightness ${hsv.v}%`}
    >
      <div
        className={styles.saturationBackground}
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
      />
      <div className={styles.saturationWhite} />
      <div className={styles.saturationBlack} />
      <div
        className={styles.saturationHandle}
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
        }}
      />
    </div>
  );
};

export default SaturationPicker;
