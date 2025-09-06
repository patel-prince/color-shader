import type { RGB } from "../types";

/**
 * Standard color scale levels used for design systems (50-950)
 * Base color positioned at level 600 for optimal contrast and usability
 */
export const SCALE_LEVELS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/**
 * Generates a color scale by mixing base color with white (lighter) and black (darker)
 * This method preserves hue while creating visually consistent brightness progression
 */
export const generateMixedScale = (baseRgb: RGB): Record<number, string> => {
  const scale: Record<number, string> = {};

  SCALE_LEVELS.forEach((level) => {
    let r: number, g: number, b: number;

    if (level < 600) {
      // Create distinct lighter shades with specific ratios
      let ratio: number;
      switch (level) {
        case 50:
          ratio = 0.93; // Very light
          break;
        case 100:
          ratio = 0.85; // Light
          break;
        case 200:
          ratio = 0.7; // Medium light
          break;
        case 300:
          ratio = 0.55; // Light medium
          break;
        case 400:
          ratio = 0.35; // Slightly light
          break;
        case 500:
          ratio = 0.15; // Just lighter than base
          break;
        default:
          ratio = 0;
      }
      r = Math.round(baseRgb.r + (255 - baseRgb.r) * ratio);
      g = Math.round(baseRgb.g + (255 - baseRgb.g) * ratio);
      b = Math.round(baseRgb.b + (255 - baseRgb.b) * ratio);
    } else if (level === 600) {
      // Use base color
      r = baseRgb.r;
      g = baseRgb.g;
      b = baseRgb.b;
    } else {
      // Create distinct darker shades with specific ratios
      let ratio: number;
      switch (level) {
        case 700:
          ratio = 0.15; // Slightly darker
          break;
        case 800:
          ratio = 0.3; // Medium dark
          break;
        case 900:
          ratio = 0.45; // Dark
          break;
        case 950:
          ratio = 0.6; // Very dark
          break;
        default:
          ratio = 0;
      }
      r = Math.round(baseRgb.r * (1 - ratio));
      g = Math.round(baseRgb.g * (1 - ratio));
      b = Math.round(baseRgb.b * (1 - ratio));
    }

    scale[level] = rgbToHex(r, g, b);
  });

  return scale;
};

/**
 * Converts RGB color values to HEX color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Popular gray scale colors
export const GRAY_SCALES = {
  slate: "#64748b", // Tailwind Slate-500
  zinc: "#71717a", // Tailwind Zinc-500
  gray: "#6b7280", // Tailwind Gray-500
  neutral: "#737373", // Tailwind Neutral-500
  stone: "#78716c", // Tailwind Stone-500
};
