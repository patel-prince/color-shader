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
  baseColor: string
): SemanticPaletteHookReturn {
  // Generate semantic palette whenever base color changes
  const semanticPalette = useMemo(() => {
    return generateSemanticPalette(baseColor);
  }, [baseColor]);

  /**
   * Generate palette from a new base color
   */
  const generatePalette = (newBaseColor: string): SemanticPalette => {
    return generateSemanticPalette(newBaseColor);
  };

  /**
   * Export semantic colors as CSS custom properties
   */
  const exportCssVariables = (prefix: string = "color"): string => {
    const { roles } = semanticPalette;

    const cssVars = Object.entries(roles)
      .map(([key, role]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `  --${prefix}-${kebabKey}: ${role.color};`;
      })
      .join("\n");

    return `:root {\n${cssVars}\n}`;
  };

  /**
   * Export semantic colors as Tailwind CSS config
   */
  const exportTailwindConfig = (): string => {
    const { roles } = semanticPalette;

    const colorConfig = Object.entries(roles)
      .map(([key, role]) => {
        return `    ${key}: '${role.color}',`;
      })
      .join("\n");

    return `// Tailwind CSS Color Configuration
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
${colorConfig}
        }
      }
    }
  }
}`;
  };

  return {
    semanticPalette,
    generatePalette,
    exportCssVariables,
    exportTailwindConfig,
  };
}
