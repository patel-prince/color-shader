/**
 * Custom hook for semantic color generation
 * Automatically generates design system colors from a base color
 */

import { useMemo } from "react";
import type { SemanticPalette, SemanticPaletteHookReturn } from "../types";
import { generateSemanticPalette } from "../utils/semanticColors";

/**
 * Custom hook for semantic color palette generation
 * @param baseColor - The base color to generate the palette from
 * @returns Object containing semantic palette and utility functions
 *
 * @example
 * ```typescript
 * const { semanticPalette, exportCssVariables } = useSemanticColors('#ff0000');
 *
 * // Access semantic colors
 * const mainColor = semanticPalette.roles.main.color;
 * const hoverColor = semanticPalette.roles.hover.color;
 *
 * // Export as CSS variables
 * const cssVars = exportCssVariables('primary');
 * ```
 */
export function useSemanticColors(
  baseColor: string,
  selectedGrayScale: string = "gray"
): SemanticPaletteHookReturn {
  // Generate semantic palette whenever base color or gray scale changes
  const semanticPalette = useMemo(() => {
    return generateSemanticPalette(baseColor, selectedGrayScale);
  }, [baseColor, selectedGrayScale]);

  /**
   * Generate palette from a new base color
   */
  const generatePalette = (newBaseColor: string): SemanticPalette => {
    return generateSemanticPalette(newBaseColor);
  };

  /**
   * Export semantic colors as CSS custom properties that reference base scale variables
   */
  const exportCssVariables = (prefix: string = "color"): string => {
    const { roles } = semanticPalette;
    const finalPrefix = prefix.trim() || "color";

    const cssVars = Object.entries(roles)
      .map(([key, role]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

        // Map semantic roles to their corresponding scale variables
        let variableReference: string;

        switch (key) {
          // Primary color scale references
          case "main":
            variableReference = `var(--${finalPrefix}-600)`;
            break;
          case "hover":
            variableReference = `var(--${finalPrefix}-500)`;
            break;
          case "active":
            variableReference = `var(--${finalPrefix}-700)`;
            break;
          case "disabled":
            variableReference = `var(--${finalPrefix}-300)`;
            break;
          case "light":
            variableReference = `var(--${finalPrefix}-100)`;
            break;
          case "lighter":
            variableReference = `var(--${finalPrefix}-50)`;
            break;
          case "dark":
            variableReference = `var(--${finalPrefix}-800)`;
            break;
          case "darker":
            variableReference = `var(--${finalPrefix}-900)`;
            break;

          // Gray scale references for neutral colors
          case "textPrimary":
            variableReference = `var(--${selectedGrayScale}-950)`;
            break;
          case "textSecondary":
            variableReference = `var(--${selectedGrayScale}-600)`;
            break;
          case "surface":
            variableReference = `var(--${selectedGrayScale}-50)`;
            break;
          case "border":
            variableReference = `var(--${selectedGrayScale}-200)`;
            break;

          // Special cases that use absolute colors
          case "contrast":
            // Keep as hex since it's calculated dynamically (white/black)
            variableReference = role.color;
            break;

          default:
            // Fallback to hex color if no mapping found
            variableReference = role.color;
        }

        return `  --${finalPrefix}-${kebabKey}: ${variableReference};`;
      })
      .join("\n");

    return `:root {\n${cssVars}\n}`;
  };

  return {
    semanticPalette,
    generatePalette,
    exportCssVariables,
  };
}
