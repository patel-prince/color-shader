"use client";

import { useRef } from "react";
import { useMouseDrag } from "../hooks";
import "./SaturationPicker.css";

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface SaturationPickerProps {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
  className?: string;
}

/**
 * SaturationPicker component provides 2D saturation/brightness selection
 */
export default function SaturationPicker({
  hsv,
  onChange,
  className = "",
}: SaturationPickerProps) {
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
      className={`saturation-picker ${className}`}
      ref={saturationRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Color saturation and brightness"
      aria-valuetext={`Saturation ${hsv.s}%, Brightness ${hsv.v}%`}
    >
      <div
        className="saturation-background"
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
      />
      <div className="saturation-white" />
      <div className="saturation-black" />
      <div
        className="saturation-handle"
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
        }}
      />
    </div>
  );
}
