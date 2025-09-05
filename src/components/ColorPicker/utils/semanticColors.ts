/**
 * Semantic Color Generation Utilities
 * Automatically generates design system colors from a base color
 */

import type { RGB } from "../types";
import { hexToRgb, generateMixedScale } from "../utils";
import type { SemanticPalette } from "../types";

// Gray scale colors (matches GrayScale component)
const GRAY_SCALES = {
  slate: "#64748b",
  zinc: "#71717a",
  gray: "#6b7280",
  neutral: "#737373",
  stone: "#78716c",
};

/**
 * Calculate relative luminance for WCAG contrast
 */
function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Get best contrast color (white or black) for text
 */
function getBestContrast(baseRgb: RGB): string {
  const whiteRgb: RGB = { r: 255, g: 255, b: 255 };
  const blackRgb: RGB = { r: 0, g: 0, b: 0 };

  const whiteContrast = getContrastRatio(baseRgb, whiteRgb);
  const blackContrast = getContrastRatio(baseRgb, blackRgb);

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}

/**
 * Generate complete semantic palette from base color using mixed scale and gray colors
 */
export function generateSemanticPalette(
  baseColor: string,
  selectedGrayScale: string = "gray"
): SemanticPalette {
  const baseRgb = hexToRgb(baseColor);
  const mixedScale = generateMixedScale(baseRgb);
  // Generate gray scale from the selected gray color
  const selectedGrayHex =
    GRAY_SCALES[selectedGrayScale as keyof typeof GRAY_SCALES] ||
    GRAY_SCALES.gray;
  const grayRgb = hexToRgb(selectedGrayHex);
  const grayScale = generateMixedScale(grayRgb);

  const palette: SemanticPalette = {
    baseColor,
    roles: {
      // Interactive States - using mixed scale
      main: {
        name: "Main",
        description: "Primary brand color (Shade 600)",
        color: baseColor, // 600 level (base)
        usage: "Buttons, links, primary actions",
      },
      hover: {
        name: "Hover",
        description: "Interactive hover state (Shade 500)",
        color: mixedScale[500], // Lighter shade for hover
        usage: "Button hover, link hover",
      },
      active: {
        name: "Active",
        description: "Active/pressed state (Shade 700)",
        color: mixedScale[700], // Darker shade for active
        usage: "Active buttons, pressed states",
      },
      disabled: {
        name: "Disabled",
        description: "Disabled state (Shade 300)",
        color: mixedScale[300], // Light shade for disabled
        usage: "Disabled buttons, inactive elements",
      },

      // Contrast & Text - using white/black and gray scale
      contrast: {
        name: "Contrast",
        description: "High contrast text (White/Black)",
        color: getBestContrast(baseRgb), // White or black
        usage: "Text on main color background",
      },
      textPrimary: {
        name: "Text",
        description: "Primary text color (Gray 950)",
        color: grayScale[950], // Very dark gray for primary text
        usage: "Headlines, primary text",
      },
      textSecondary: {
        name: "Muted",
        description: "Secondary text color (Gray 600)",
        color: grayScale[600], // Medium gray for secondary text
        usage: "Captions, secondary text",
      },

      // Design System Variants - using mixed scale
      light: {
        name: "Light",
        description: "Light tint (Shade 100)",
        color: mixedScale[100], // Light variant
        usage: "Light backgrounds, subtle highlights",
      },
      lighter: {
        name: "Lighter",
        description: "Very light tint (Shade 50)",
        color: mixedScale[50], // Very light variant
        usage: "Very subtle backgrounds",
      },
      dark: {
        name: "Dark",
        description: "Dark shade (Shade 800)",
        color: mixedScale[800], // Dark variant
        usage: "Dark accents, shadows",
      },
      darker: {
        name: "Darker",
        description: "Very dark shade (Shade 900)",
        color: mixedScale[900], // Very dark variant
        usage: "Deep shadows, dark themes",
      },

      // Borders & Surfaces - using gray scale
      border: {
        name: "Border",
        description: "Border color (Gray 200)",
        color: grayScale[200], // Light gray border
        usage: "Input borders, dividers",
      },
      surface: {
        name: "Surface",
        description: "Primary surface (Gray 50)",
        color: grayScale[50], // Very light gray surface
        usage: "Main backgrounds, page background",
      },
      surfaceAlt: {
        name: "Surface Alt",
        description: "Secondary surface (White)",
        color: "#ffffff", // Pure white for elevated surfaces
        usage: "Cards, panels, elevated backgrounds",
      },
    },
  };

  return palette;
}
