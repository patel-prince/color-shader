import { useState, useEffect, useCallback } from "react";
import type { HSV, ColorValues, ColorFormat } from "../types";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  hsvToHsl,
  parseHex,
  parseRgb,
  parseHsl,
} from "../utils";

interface UseColorStateOptions {
  initialColor: string;
  onChange: (color: string) => void;
}

/**
 * Custom hook for managing color state with format preservation
 * Handles the complex logic of maintaining precision across different color formats
 */
export const useColorState = ({
  initialColor,
  onChange,
}: UseColorStateOptions) => {
  // Core HSV state
  const [hsv, setHsv] = useState<HSV>(() => {
    const rgb = hexToRgb(initialColor);
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });

  // Input values state
  const [inputValues, setInputValues] = useState<ColorValues>(() => {
    const rgb = hexToRgb(initialColor);
    const hsl = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const hslConverted = hsvToHsl(hsl.h, hsl.s, hsl.v);

    return {
      hex: initialColor,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hslConverted.h}, ${hslConverted.s}%, ${hslConverted.l}%)`,
    };
  });

  // Track last changed format to prevent precision loss
  const [lastChangedFormat, setLastChangedFormat] =
    useState<ColorFormat | null>(null);

  // Valid values for fallback
  const [lastValidValues, setLastValidValues] = useState<ColorValues>(
    () => inputValues
  );

  // Update parent when HSV changes
  useEffect(() => {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    // Calculate formats from the most accurate source
    const updateInputValues = (sourceRgb = rgb) => {
      const sourceHex = rgbToHex(sourceRgb.r, sourceRgb.g, sourceRgb.b);
      const sourceHsv = rgbToHsv(sourceRgb.r, sourceRgb.g, sourceRgb.b);
      const sourceHsl = hsvToHsl(sourceHsv.h, sourceHsv.s, sourceHsv.v);

      return {
        hex: sourceHex,
        rgb: `rgb(${sourceRgb.r}, ${sourceRgb.g}, ${sourceRgb.b})`,
        hsl: `hsl(${sourceHsl.h}, ${sourceHsl.s}%, ${sourceHsl.l}%)`,
      };
    };

    setInputValues((prev) => {
      let sourceRgb = rgb;

      // Preserve format precision if user manually changed a format
      if (lastChangedFormat && prev[lastChangedFormat]) {
        switch (lastChangedFormat) {
          case "hex": {
            const hexRgb = parseHex(prev[lastChangedFormat]);
            if (hexRgb) sourceRgb = hexRgb;
            break;
          }
          case "rgb": {
            const rgbParsed = parseRgb(prev[lastChangedFormat]);
            if (rgbParsed) sourceRgb = rgbParsed;
            break;
          }
          case "hsl": {
            const hslRgb = parseHsl(prev[lastChangedFormat]);
            if (hslRgb) sourceRgb = hslRgb;
            break;
          }
        }
      }

      const newValues = updateInputValues(sourceRgb);

      // Preserve exact value for manually changed format
      if (lastChangedFormat && prev[lastChangedFormat]) {
        newValues[lastChangedFormat] = prev[lastChangedFormat];
      }

      // Update valid values cache
      setLastValidValues(newValues);

      return newValues;
    });

    onChange(hex);
  }, [hsv, onChange, lastChangedFormat]);

  // Update HSV when external color changes
  useEffect(() => {
    const rgb = hexToRgb(initialColor);
    const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHsv(newHsv);
    setLastChangedFormat(null);
  }, [initialColor]);

  // Handle HSV updates (from visual pickers)
  const updateHsv = useCallback((newHsv: Partial<HSV>) => {
    setLastChangedFormat(null);
    setHsv((prev) => ({ ...prev, ...newHsv }));
  }, []);

  // Handle input format changes
  const updateInputFormat = useCallback(
    (format: ColorFormat, value: string) => {
      setLastChangedFormat(format);
      setInputValues((prev) => ({ ...prev, [format]: value }));

      // Parse and update HSV if valid
      let rgb = null;
      switch (format) {
        case "hex":
          rgb = parseHex(value);
          break;
        case "rgb":
          rgb = parseRgb(value);
          break;
        case "hsl":
          rgb = parseHsl(value);
          break;
      }

      if (rgb) {
        const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setHsv(newHsv);
      }
    },
    []
  );

  // Revert invalid input to last valid value
  const revertInvalidInput = useCallback(
    (format: ColorFormat) => {
      setInputValues((prev) => ({
        ...prev,
        [format]: lastValidValues[format],
      }));
      setLastChangedFormat(null);
    },
    [lastValidValues]
  );

  // Get current RGB values
  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

  return {
    hsv,
    currentRgb,
    inputValues,
    lastValidValues,
    lastChangedFormat,
    updateHsv,
    updateInputFormat,
    revertInvalidInput,
  };
};
