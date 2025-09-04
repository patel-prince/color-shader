import React, { useRef } from "react";
import type { HSV } from "../types";
import { useMouseDrag } from "../hooks";
import styles from "../ColorPicker.module.css";

interface HueSliderProps {
  hsv: HSV;
  onChange: (h: number) => void;
}

/**
 * HueSlider component provides hue selection with rainbow gradient
 * Memoized to prevent re-renders when other color properties change
 */
const HueSlider: React.FC<HueSliderProps> = React.memo(({ hsv, onChange }) => {
  const hueRef = useRef<HTMLDivElement>(null);

  const updateHue = (clientX: number) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const h = Math.max(
      0,
      Math.min(360, ((clientX - rect.left) / rect.width) * 360)
    );
    onChange(Math.round(h));
  };

  const { handleMouseDown } = useMouseDrag({
    onDrag: (clientX) => updateHue(clientX),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    let newH = hsv.h;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        newH = Math.max(0, hsv.h - step);
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        newH = Math.min(360, hsv.h + step);
        break;
      case "Home":
        e.preventDefault();
        newH = 0;
        break;
      case "End":
        e.preventDefault();
        newH = 360;
        break;
      default:
        return;
    }

    onChange(newH);
  };

  return (
    <div
      className={styles.hueSlider}
      ref={hueRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Color hue"
      aria-valuetext={`Hue ${hsv.h} degrees`}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={hsv.h}
    >
      <div className={styles.hueGradient} />
      <div
        className={styles.hueHandle}
        style={{ left: `${(hsv.h / 360) * 100}%` }}
      />
    </div>
  );
});

HueSlider.displayName = "HueSlider";

export default HueSlider;
