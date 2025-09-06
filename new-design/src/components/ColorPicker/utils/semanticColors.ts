/**
 * Semantic Color Generation Utilities
 * Automatically generates design system colors from a base color
 */

import type { RGB } from "../types";
import { generateMixedScale, GRAY_SCALES } from "./colorScales";

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

export interface SemanticRole {
  name: string;
  description: string;
  color: string;
  usage: string;
}

export interface SemanticPalette {
  baseColor: string;
  roles: {
    main: SemanticRole;
    hover: SemanticRole;
    active: SemanticRole;
    disabled: SemanticRole;
    contrast: SemanticRole;
    light: SemanticRole;
    lighter: SemanticRole;
    dark: SemanticRole;
    darker: SemanticRole;
    textPrimary: SemanticRole;
    textSecondary: SemanticRole;
    border: SemanticRole;
    surface: SemanticRole;
    surfaceAlt: SemanticRole;
  };
}

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
        description: "Auto contrast text on main color",
        color: getBestContrast(baseRgb),
        usage: "Text on main color background",
      },

      // Color Variants - using mixed scale
      light: {
        name: "Light",
        description: "Light variant (Shade 100)",
        color: mixedScale[100],
        usage: "Light backgrounds, subtle highlights",
      },
      lighter: {
        name: "Lighter",
        description: "Lightest variant (Shade 50)",
        color: mixedScale[50],
        usage: "Very light backgrounds, page backgrounds",
      },
      dark: {
        name: "Dark",
        description: "Dark variant (Shade 800)",
        color: mixedScale[800],
        usage: "Dark themes, strong emphasis",
      },
      darker: {
        name: "Darker",
        description: "Darkest variant (Shade 900)",
        color: mixedScale[900],
        usage: "Very dark themes, maximum emphasis",
      },

      // Neutral Colors - using gray scale
      textPrimary: {
        name: "Text Primary",
        description: "Primary text color",
        color: grayScale[950],
        usage: "Main text, headings",
      },
      textSecondary: {
        name: "Text Secondary",
        description: "Secondary text color",
        color: grayScale[600],
        usage: "Secondary text, captions",
      },
      border: {
        name: "Border",
        description: "Border and divider color",
        color: grayScale[200],
        usage: "Borders, dividers, separators",
      },
      surface: {
        name: "Surface",
        description: "Surface background color",
        color: grayScale[50],
        usage: "Card backgrounds, elevated surfaces",
      },
      surfaceAlt: {
        name: "Surface Alt",
        description: "Alternative surface color",
        color: "#ffffff",
        usage: "Page backgrounds, main surfaces",
      },
    },
  };

  return palette;
}
