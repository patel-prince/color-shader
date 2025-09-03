import React, { useRef } from "react";
import type { HSV } from "../types";
import { useMouseDrag } from "../hooks";
import styles from "../ColorPicker.module.css";

interface HueSliderProps {
  hsv: HSV;
  onChange: (h: number) => void;
}

const HueSlider: React.FC<HueSliderProps> = ({ hsv, onChange }) => {
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

  return (
    <div
      className={styles.hueSlider}
      ref={hueRef}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.hueGradient} />
      <div
        className={styles.hueHandle}
        style={{ left: `${(hsv.h / 360) * 100}%` }}
      />
    </div>
  );
};

export default HueSlider;
