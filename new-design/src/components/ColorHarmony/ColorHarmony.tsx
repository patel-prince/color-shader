"use client";

import { useState, useMemo, useCallback } from "react";
import "./ColorHarmony.css";

interface ColorHarmonyProps {
  baseColor: string;
  onColorSelect: (hex: string) => void;
  className?: string;
}

interface HarmonyColor {
  hex: string;
  name: string;
  angle?: number;
}

type HarmonyType =
  | "complementary"
  | "triadic"
  | "analogous"
  | "split-complementary"
  | "tetradic";

export function ColorHarmony({
  baseColor,
  onColorSelect,
  className = "",
}: ColorHarmonyProps) {
  const [selectedHarmony, setSelectedHarmony] =
    useState<HarmonyType>("complementary");

  // Convert hex to HSL
  const hexToHsl = useCallback(
    (hex: string): { h: number; s: number; l: number } => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
          case r:
            h = (g - b) / delta + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / delta + 2;
            break;
          case b:
            h = (r - g) / delta + 4;
            break;
        }
        h /= 6;
      }

      return { h: h * 360, s: s * 100, l: l * 100 };
    },
    []
  );

  // Convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360; // Normalize hue to 0-360
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }, []);

  // Generate harmony colors based on type
  const harmonyColors = useMemo((): HarmonyColor[] => {
    const baseHsl = hexToHsl(baseColor);
    const { h, s, l } = baseHsl;

    switch (selectedHarmony) {
      case "complementary":
        return [
          { hex: baseColor, name: "Base" },
          { hex: hslToHex(h + 180, s, l), name: "Complementary", angle: 180 },
        ];

      case "triadic":
        return [
          { hex: baseColor, name: "Base" },
          { hex: hslToHex(h + 120, s, l), name: "Triadic 1", angle: 120 },
          { hex: hslToHex(h + 240, s, l), name: "Triadic 2", angle: 240 },
        ];

      case "analogous":
        return [
          { hex: hslToHex(h - 30, s, l), name: "Analogous -30°", angle: -30 },
          { hex: baseColor, name: "Base" },
          { hex: hslToHex(h + 30, s, l), name: "Analogous +30°", angle: 30 },
          { hex: hslToHex(h + 60, s, l), name: "Analogous +60°", angle: 60 },
        ];

      case "split-complementary":
        return [
          { hex: baseColor, name: "Base" },
          { hex: hslToHex(h + 150, s, l), name: "Split Comp 1", angle: 150 },
          { hex: hslToHex(h + 210, s, l), name: "Split Comp 2", angle: 210 },
        ];

      case "tetradic":
        return [
          { hex: baseColor, name: "Base" },
          { hex: hslToHex(h + 90, s, l), name: "Tetradic 1", angle: 90 },
          { hex: hslToHex(h + 180, s, l), name: "Tetradic 2", angle: 180 },
          { hex: hslToHex(h + 270, s, l), name: "Tetradic 3", angle: 270 },
        ];

      default:
        return [{ hex: baseColor, name: "Base" }];
    }
  }, [baseColor, selectedHarmony, hexToHsl, hslToHex]);

  const harmonyDescriptions = {
    complementary:
      "Two colors opposite on the color wheel. Creates high contrast and vibrant looks.",
    triadic:
      "Three colors evenly spaced around the color wheel. Offers strong visual contrast while retaining harmony.",
    analogous:
      "Colors that are next to each other on the color wheel. Creates serene and comfortable designs.",
    "split-complementary":
      "Base color plus two colors adjacent to its complement. Offers high contrast with less tension.",
    tetradic:
      "Four colors arranged into two complementary pairs. Offers plenty of possibilities with strong visual impact.",
  };

  const handleColorClick = useCallback(
    (hex: string) => {
      onColorSelect(hex);
    },
    [onColorSelect]
  );

  const copyPalette = useCallback(async () => {
    const paletteText = harmonyColors
      .map((color) => `${color.name}: ${color.hex}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(paletteText);
      // Show feedback
      const button = document.querySelector(
        ".copy-palette-button"
      ) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to copy palette:", error);
    }
  }, [harmonyColors]);

  return (
    <div className={`color-harmony ${className}`}>
      <div className="harmony-header">
        <h3 className="harmony-title">Color Harmony</h3>
        <p className="harmony-subtitle">
          Generate harmonious color schemes from {baseColor.toUpperCase()}
        </p>
      </div>

      <div className="harmony-controls">
        <div className="harmony-types">
          {(Object.keys(harmonyDescriptions) as HarmonyType[]).map((type) => (
            <button
              key={type}
              className={`harmony-type-button ${
                selectedHarmony === type ? "active" : ""
              }`}
              onClick={() => setSelectedHarmony(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        <button className="copy-palette-button" onClick={copyPalette}>
          Copy Palette
        </button>
      </div>

      <div className="harmony-description">
        <p>{harmonyDescriptions[selectedHarmony]}</p>
      </div>

      <div className="harmony-colors">
        {harmonyColors.map((color, index) => (
          <div
            key={`${color.hex}-${index}`}
            className={`harmony-color-item ${
              color.hex === baseColor ? "base-color" : ""
            }`}
            onClick={() => handleColorClick(color.hex)}
            title={`${color.name}: ${color.hex} - Click to select`}
          >
            <div
              className="harmony-color-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <div className="harmony-color-info">
              <span className="harmony-color-name">{color.name}</span>
              <span className="harmony-color-hex">{color.hex}</span>
              {color.angle !== undefined && (
                <span className="harmony-color-angle">
                  {color.angle > 0 ? "+" : ""}
                  {color.angle}°
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="harmony-visualization">
        <div className="color-wheel">
          <div className="wheel-center">
            <div
              className="base-dot"
              style={{ backgroundColor: baseColor }}
              title={`Base: ${baseColor}`}
            />
          </div>
          {harmonyColors.slice(1).map((color, index) => {
            const baseHsl = hexToHsl(baseColor);
            const angle = color.angle || 0;
            const totalAngle = (baseHsl.h + angle) % 360;
            const radian = (totalAngle - 90) * (Math.PI / 180); // -90 to start from top
            const radius = 45; // Distance from center
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <div
                key={`wheel-${color.hex}-${index}`}
                className="wheel-dot"
                style={{
                  backgroundColor: color.hex,
                  transform: `translate(${x}px, ${y}px)`,
                }}
                title={`${color.name}: ${color.hex}`}
              />
            );
          })}
        </div>
        <p className="wheel-caption">Color wheel visualization</p>
      </div>
    </div>
  );
}
