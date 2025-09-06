"use client";

import { useRef } from "react";
import { useMouseDrag } from "../hooks";
import "./HueSlider.css";

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface HueSliderProps {
  hsv: HSV;
  onChange: (h: number) => void;
  className?: string;
}

/**
 * HueSlider component provides hue selection with rainbow gradient
 */
export default function HueSlider({
  hsv,
  onChange,
  className = "",
}: HueSliderProps) {
  const hueRef = useRef<HTMLDivElement>(null);

  const updateHue = (clientX: number, clientY: number) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    // For vertical slider, use Y position
    const h = Math.max(
      0,
      Math.min(360, ((clientY - rect.top) / rect.height) * 360)
    );
    onChange(Math.round(h));
  };

  const { handleMouseDown } = useMouseDrag({
    onDrag: (clientX, clientY) => updateHue(clientX, clientY),
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
      className={`hue-slider ${className}`}
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
      <div className="hue-gradient" />
      <div className="hue-handle" style={{ top: `${(hsv.h / 360) * 100}%` }} />
    </div>
  );
}
