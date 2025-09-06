"use client";

import { useState, useRef, useEffect } from "react";
import type { RGB } from "../types";
import { generateMixedScale, SCALE_LEVELS } from "../utils/colorScales";
import "./ColorScale.css";

interface ColorScaleProps {
  title: string;
  baseRgb: RGB;
  className?: string;
  onShowCssVars?: () => void;
}

export default function ColorScale({
  title,
  baseRgb,
  className = "",
  onShowCssVars,
}: ColorScaleProps) {
  const scale = generateMixedScale(baseRgb);
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
    <div className={`color-scale ${className}`}>
      <div className="color-scale-header">
        <h3 className="color-scale-title">{title}</h3>
        {onShowCssVars && (
          <button className="color-scale-export-btn" onClick={onShowCssVars}>
            Export CSS
          </button>
        )}
      </div>
      <div className="color-scale-grid">
        {SCALE_LEVELS.map((level) => (
          <div
            key={level}
            className="color-scale-item"
            onClick={() => copyToClipboard(scale[level], level)}
            title={`Click to copy ${scale[level]}`}
          >
            <div
              className="color-scale-swatch"
              style={{ backgroundColor: scale[level] }}
            >
              {copiedColor === `${level}` && (
                <div className="copied-overlay">copied</div>
              )}
            </div>
            <div className="color-scale-label">
              <span className="color-scale-level">{level}</span>
              <span className="color-scale-hex">{scale[level]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
