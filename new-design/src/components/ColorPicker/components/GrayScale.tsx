"use client";

import { useState, useRef, useEffect } from "react";
import type { RGB } from "../types";
import {
  generateMixedScale,
  SCALE_LEVELS,
  GRAY_SCALES,
} from "../utils/colorScales";
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
import "./GrayScale.css";

interface GrayScaleProps {
  selectedGrayScale: string;
  onGrayScaleChange: (grayScale: string) => void;
  className?: string;
}

export default function GrayScale({
  selectedGrayScale,
  onGrayScaleChange,
  className = "",
}: GrayScaleProps) {
  const grayRgb: RGB = hexToRgb(
    GRAY_SCALES[selectedGrayScale as keyof typeof GRAY_SCALES]
  );
  const scale = generateMixedScale(grayRgb);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = async (hexColor: string, level: number) => {
    try {
      await navigator.clipboard.writeText(hexColor);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setCopiedColor(`${level}`);

      // Set new timeout and store the reference
      timeoutRef.current = setTimeout(() => {
        setCopiedColor(null);
        timeoutRef.current = null;
      }, 1000);
    } catch (error) {
      console.error("Failed to copy color:", error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`gray-scale ${className}`}>
      <div className="gray-scale-header">
        <h3 className="gray-scale-title">Gray Scale Reference</h3>
        <div className="gray-scale-controls">
          <select
            value={selectedGrayScale}
            onChange={(e) => onGrayScaleChange(e.target.value)}
            className="gray-scale-select"
          >
            {Object.entries(GRAY_SCALES).map(([name, hex]) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)} -{" "}
                {hex.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="gray-scale-grid">
        {SCALE_LEVELS.map((level) => (
          <div
            key={level}
            className="gray-scale-item"
            onClick={() => copyToClipboard(scale[level], level)}
            title={`Click to copy ${scale[level]}`}
          >
            <div
              className="gray-scale-swatch"
              style={{ backgroundColor: scale[level] }}
            >
              {copiedColor === `${level}` && (
                <div className="copied-overlay">copied</div>
              )}
            </div>
            <div className="gray-scale-label">
              <span className="gray-scale-level">{level}</span>
              <span className="gray-scale-hex">{scale[level]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
