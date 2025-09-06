"use client";

import { useState, useCallback } from "react";
import { SaturationPicker, HueSlider } from "./components";
import "./ColorPicker.css";

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: ColorValue) => void;
  className?: string;
  showScales?: boolean;
}

export default function ColorPicker({
  initialColor = "#3b82f6",
  onChange,
  className = "",
  showScales = true,
}: ColorPickerProps) {
  const [color, setColor] = useState<ColorValue>(() =>
    hexToColorValue(initialColor)
  );

  const handleColorChange = useCallback(
    (newColor: ColorValue) => {
      setColor(newColor);
      onChange?.(newColor);
    },
    [onChange]
  );

  const handleHexChange = (hex: string) => {
    if (isValidHex(hex)) {
      const newColor = hexToColorValue(hex);
      handleColorChange(newColor);
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    const newColor = rgbToColorValue(r, g, b);
    handleColorChange(newColor);
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const newColor = hslToColorValue(h, s, l);
    handleColorChange(newColor);
  };

  const handleHsvChange = (h?: number, s?: number, v?: number) => {
    const newHsv = {
      h: h !== undefined ? h : color.hsv.h,
      s: s !== undefined ? s : color.hsv.s,
      v: v !== undefined ? v : color.hsv.v,
    };
    const newColor = hsvToColorValue(newHsv.h, newHsv.s, newHsv.v);
    handleColorChange(newColor);
  };

  return (
    <div className={`color-picker ${className}`}>
      {/* Visual Color Picker */}
      <div className="visual-picker-section">
        <SaturationPicker
          hsv={color.hsv}
          onChange={(s, v) => handleHsvChange(undefined, s, v)}
        />
        <HueSlider hsv={color.hsv} onChange={(h) => handleHsvChange(h)} />
      </div>

      {/* Color Preview */}
      <div className="color-preview-section">
        <div
          className="color-preview"
          style={{ backgroundColor: color.hex }}
          aria-label={`Selected color: ${color.hex}`}
        />
        <div className="color-info">
          <h3 className="color-title">Selected Color</h3>
          <p className="color-hex">{color.hex.toUpperCase()}</p>
        </div>
      </div>

      {/* Color Input Fields */}
      <div className="color-inputs-section">
        <div className="input-group">
          <label htmlFor="hex-input" className="input-label">
            HEX
          </label>
          <input
            id="hex-input"
            type="text"
            value={color.hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="color-input"
            placeholder="#000000"
          />
        </div>

        <div className="rgb-inputs">
          <div className="input-group">
            <label htmlFor="rgb-r" className="input-label">
              R
            </label>
            <input
              id="rgb-r"
              type="number"
              min="0"
              max="255"
              value={color.rgb.r}
              onChange={(e) =>
                handleRgbChange(
                  parseInt(e.target.value) || 0,
                  color.rgb.g,
                  color.rgb.b
                )
              }
              className="color-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="rgb-g" className="input-label">
              G
            </label>
            <input
              id="rgb-g"
              type="number"
              min="0"
              max="255"
              value={color.rgb.g}
              onChange={(e) =>
                handleRgbChange(
                  color.rgb.r,
                  parseInt(e.target.value) || 0,
                  color.rgb.b
                )
              }
              className="color-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="rgb-b" className="input-label">
              B
            </label>
            <input
              id="rgb-b"
              type="number"
              min="0"
              max="255"
              value={color.rgb.b}
              onChange={(e) =>
                handleRgbChange(
                  color.rgb.r,
                  color.rgb.g,
                  parseInt(e.target.value) || 0
                )
              }
              className="color-input"
            />
          </div>
        </div>

        <div className="hsl-inputs">
          <div className="input-group">
            <label htmlFor="hsl-h" className="input-label">
              H
            </label>
            <input
              id="hsl-h"
              type="number"
              min="0"
              max="360"
              value={Math.round(color.hsl.h)}
              onChange={(e) =>
                handleHslChange(
                  parseInt(e.target.value) || 0,
                  color.hsl.s,
                  color.hsl.l
                )
              }
              className="color-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="hsl-s" className="input-label">
              S
            </label>
            <input
              id="hsl-s"
              type="number"
              min="0"
              max="100"
              value={Math.round(color.hsl.s)}
              onChange={(e) =>
                handleHslChange(
                  color.hsl.h,
                  parseInt(e.target.value) || 0,
                  color.hsl.l
                )
              }
              className="color-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="hsl-l" className="input-label">
              L
            </label>
            <input
              id="hsl-l"
              type="number"
              min="0"
              max="100"
              value={Math.round(color.hsl.l)}
              onChange={(e) =>
                handleHslChange(
                  color.hsl.h,
                  color.hsl.s,
                  parseInt(e.target.value) || 0
                )
              }
              className="color-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Color conversion utilities
function hexToColorValue(hex: string): ColorValue {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  return {
    hex: `#${cleanHex.toLowerCase()}`,
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    hsv: rgbToHsv(r, g, b),
  };
}

function rgbToColorValue(r: number, g: number, b: number): ColorValue {
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    hsv: rgbToHsv(r, g, b),
  };
}

function hslToColorValue(h: number, s: number, l: number): ColorValue {
  const rgb = hslToRgb(h, s, l);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h, s, l },
    hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
  };
}

function hsvToColorValue(h: number, s: number, v: number): ColorValue {
  const rgb = hsvToRgb(h, s, v);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
    hsv: { h, s, v },
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    v: v * 100,
  };
}

function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}
