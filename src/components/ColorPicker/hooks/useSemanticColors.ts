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

    // Organize variables by category
    const primaryInteractive: string[] = [];
    const primaryVariants: string[] = [];
    const neutralColors: string[] = [];

    Object.entries(roles).forEach(([key, role]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      // Map semantic roles to their corresponding scale variables
      let variableReference: string;
      let variableName: string;

      switch (key) {
        // Primary color scale references
        case "main":
          variableReference = `var(--${finalPrefix}-600)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryInteractive.push(`  --${variableName}: ${variableReference};`);
          break;
        case "hover":
          variableReference = `var(--${finalPrefix}-500)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryInteractive.push(`  --${variableName}: ${variableReference};`);
          break;
        case "active":
          variableReference = `var(--${finalPrefix}-700)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryInteractive.push(`  --${variableName}: ${variableReference};`);
          break;
        case "disabled":
          variableReference = `var(--${finalPrefix}-300)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryInteractive.push(`  --${variableName}: ${variableReference};`);
          break;
        case "contrast":
          variableReference = role.color;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryInteractive.push(`  --${variableName}: ${variableReference};`);
          break;

        case "light":
          variableReference = `var(--${finalPrefix}-100)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryVariants.push(`  --${variableName}: ${variableReference};`);
          break;
        case "lighter":
          variableReference = `var(--${finalPrefix}-50)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryVariants.push(`  --${variableName}: ${variableReference};`);
          break;
        case "dark":
          variableReference = `var(--${finalPrefix}-800)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryVariants.push(`  --${variableName}: ${variableReference};`);
          break;
        case "darker":
          variableReference = `var(--${finalPrefix}-900)`;
          variableName = `${finalPrefix}-${kebabKey}`;
          primaryVariants.push(`  --${variableName}: ${variableReference};`);
          break;

        // Gray scale references for neutral colors - use semantic names
        case "textPrimary":
          variableReference = `var(--${selectedGrayScale}-950)`;
          neutralColors.push(`  --text-color: ${variableReference};`);
          break;
        case "textSecondary":
          variableReference = `var(--${selectedGrayScale}-600)`;
          neutralColors.push(`  --muted-color: ${variableReference};`);
          break;
        case "surface":
          variableReference = `var(--${selectedGrayScale}-50)`;
          neutralColors.push(`  --surface-color: ${variableReference};`);
          break;
        case "surfaceAlt":
          variableReference = "#ffffff";
          neutralColors.push(`  --surface-alt-color: ${variableReference};`);
          break;
        case "border":
          variableReference = `var(--${selectedGrayScale}-200)`;
          neutralColors.push(`  --border-color: ${variableReference};`);
          break;
      }
    });

    // Combine organized sections
    const organizedCss = [
      "  /* Primary Interactive Colors */",
      ...primaryInteractive,
      "",
      "  /* Primary Variants */",
      ...primaryVariants,
      "",
      "  /* Neutral Colors */",
      ...neutralColors,
    ].join("\n");

    return `:root {\n${organizedCss}\n}`;
  };

  return {
    semanticPalette,
    generatePalette,
    exportCssVariables,
  };
}
