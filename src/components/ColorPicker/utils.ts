import type { RGB, HSV, HSL } from "./types";

// Convert HEX to RGB
export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Convert RGB to HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Convert RGB to HSV
export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return { h, s: Math.round(s), v: Math.round(v) };
};

// Convert HSV to RGB
export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

// Convert HSV to HSL
export const hsvToHsl = (h: number, s: number, v: number): HSL => {
  const hslL = ((2 - s / 100) * v) / 2;
  const hslS =
    hslL !== 0 && hslL !== 100
      ? ((v - hslL) / Math.min(hslL, 100 - hslL)) * 100
      : 0;

  return {
    h: Math.round(h),
    s: Math.round(Math.max(0, hslS)),
    l: Math.round(hslL),
  };
};

// Parse HEX string to RGB
export const parseHex = (hex: string): RGB | null => {
  const cleanHex = hex.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;
  return hexToRgb("#" + cleanHex);
};

// Parse RGB string to RGB
export const parseRgb = (rgb: string): RGB | null => {
  const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!match) return null;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) return null;
  return { r, g, b };
};

// Parse HSL string to RGB
export const parseHsl = (hsl: string): RGB | null => {
  const match = hsl.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (!match) return null;
  let h = parseInt(match[1]);
  let s = parseInt(match[2]);
  let l = parseInt(match[3]);
  if (h > 360 || s > 100 || l > 100 || h < 0 || s < 0 || l < 0) return null;

  // Convert HSL to RGB
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
};

// Color scale generation utilities
export const SCALE_LEVELS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

// Generate color scale by mixing with white and black (base color at 600)
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

// Generate color scale by manipulating HSL values
export const generateHslScale = (baseRgb: RGB): Record<number, string> => {
  const scale: Record<number, string> = {};
  const baseHsv = rgbToHsv(baseRgb.r, baseRgb.g, baseRgb.b);
  const baseHsl = hsvToHsl(baseHsv.h, baseHsv.s, baseHsv.v);

  SCALE_LEVELS.forEach((level) => {
    let lightness: number;
    let saturation = baseHsl.s;

    if (level === 50) {
      lightness = 96;
      saturation = Math.min(saturation, 30);
    } else if (level === 100) {
      lightness = 90;
      saturation = Math.min(saturation, 40);
    } else if (level === 200) {
      lightness = 81;
      saturation = Math.min(saturation, 55);
    } else if (level === 300) {
      lightness = 72;
      saturation = Math.min(saturation, 70);
    } else if (level === 400) {
      lightness = Math.min(baseHsl.l * 1.25, 68);
      saturation = Math.min(saturation, 85);
    } else if (level === 500) {
      lightness = Math.min(baseHsl.l * 1.12, 62);
      saturation = Math.min(baseHsl.s * 0.98, 95);
    } else if (level === 600) {
      // Base color position
      lightness = baseHsl.l;
      saturation = baseHsl.s;
    } else if (level === 700) {
      lightness = Math.min(baseHsl.l * 0.75, Math.max(baseHsl.l - 15, 8));
      saturation = Math.min(baseHsl.s * 1.08, 95);
    } else if (level === 800) {
      lightness = Math.min(baseHsl.l * 0.7, Math.max(baseHsl.l - 15, 6));
      saturation = Math.min(baseHsl.s * 1.15, 95);
    } else if (level === 900) {
      lightness = Math.min(baseHsl.l * 0.55, Math.max(baseHsl.l - 20, 4));
      saturation = Math.min(baseHsl.s * 1.2, 95);
    } else {
      // 950
      lightness = Math.min(baseHsl.l * 0.4, Math.max(baseHsl.l - 25, 2));
      saturation = Math.min(baseHsl.s * 1.25, 95);
    }

    // Convert back to RGB and then to hex
    const hslToRgbConvert = (h: number, s: number, l: number): RGB => {
      h = h / 360;
      s = s / 100;
      l = l / 100;

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
      };
    };

    const rgb = hslToRgbConvert(baseHsl.h, saturation, lightness);
    scale[level] = rgbToHex(rgb.r, rgb.g, rgb.b);
  });

  return scale;
};
