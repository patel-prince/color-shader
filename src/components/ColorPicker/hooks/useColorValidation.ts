import { useCallback } from "react";
import type { ColorFormat } from "../types";
import { parseHex, parseRgb, parseHsl } from "../utils";

/**
 * Custom hook for color input validation
 * Provides validation functions for different color formats
 */
export const useColorValidation = () => {
  const validateColor = useCallback(
    (format: ColorFormat, value: string): boolean => {
      switch (format) {
        case "hex":
          return parseHex(value) !== null;
        case "rgb":
          return parseRgb(value) !== null;
        case "hsl":
          return parseHsl(value) !== null;
        default:
          return false;
      }
    },
    []
  );

  const validateAllFormats = useCallback(
    (values: Record<ColorFormat, string>) => {
      const results: Record<ColorFormat, boolean> = {} as Record<
        ColorFormat,
        boolean
      >;

      (Object.keys(values) as ColorFormat[]).forEach((format) => {
        results[format] = validateColor(format, values[format]);
      });

      return results;
    },
    [validateColor]
  );

  const getValidationErrors = useCallback(
    (values: Record<ColorFormat, string>) => {
      const errors: Partial<Record<ColorFormat, string>> = {};

      (Object.keys(values) as ColorFormat[]).forEach((format) => {
        if (!validateColor(format, values[format])) {
          switch (format) {
            case "hex":
              errors[format] = "Invalid HEX format (use #RRGGBB)";
              break;
            case "rgb":
              errors[format] = "Invalid RGB format (use rgb(r, g, b))";
              break;
            case "hsl":
              errors[format] = "Invalid HSL format (use hsl(h, s%, l%))";
              break;
          }
        }
      });

      return errors;
    },
    [validateColor]
  );

  return {
    validateColor,
    validateAllFormats,
    getValidationErrors,
  };
};
