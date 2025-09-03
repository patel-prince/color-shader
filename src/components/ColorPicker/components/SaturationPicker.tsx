import React, { useRef } from "react";
import type { HSV } from "../types";
import { useMouseDrag } from "../hooks";
import styles from "../ColorPicker.module.css";

interface SaturationPickerProps {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
}

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

  return (
    <div
      className={styles.saturationPicker}
      ref={saturationRef}
      onMouseDown={handleMouseDown}
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
