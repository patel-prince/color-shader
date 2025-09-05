/**
 * SemanticPalette Component
 * Displays automatically generated semantic colors with their roles and usage
 */

import { useState } from "react";
import type { SemanticPalette } from "../ColorPicker/types";
import { useSemanticColors } from "../ColorPicker/hooks/useSemanticColors";
import styles from "./SemanticPalette.module.css";

export interface SemanticPaletteProps {
  currentColor: string;
  selectedGrayScale: string;
  className?: string;
}

export function SemanticPalette({
  currentColor,
  selectedGrayScale,
  className,
}: SemanticPaletteProps) {
  const { semanticPalette } = useSemanticColors(
    currentColor,
    selectedGrayScale
  );
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const handleColorClick = async (color: string, roleName: string) => {
    // Copy to clipboard only - don't change main color
    try {
      await navigator.clipboard.writeText(color.toUpperCase());
      setCopiedRole(roleName);
      setTimeout(() => setCopiedRole(null), 1500);
    } catch (error) {
      console.warn("Failed to copy color to clipboard:", error);
    }
  };


  // Categorize roles into Primary and Neutral colors
  const primaryRoles = [
    "main",
    "hover",
    "active",
    "disabled",
    "contrast",
    "light",
    "lighter",
    "dark",
    "darker",
  ];

  const neutralRoles = ["border", "surface", "textPrimary", "textSecondary"];

  // Mapping of semantic roles to their shade levels
  const roleToShade: Record<string, string> = {
    main: "600",
    hover: "500",
    active: "700",
    disabled: "300",
    light: "100",
    lighter: "50",
    dark: "800",
    darker: "900",
    contrast: "Auto",
    textPrimary: "950",
    textSecondary: "600",
    border: "200",
    surface: "50",
  };

  return (
    <div className={`${styles.semanticPalette} ${className || ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Design System Colors</h3>
        <p className={styles.subtitle}>
          Auto-generated from{" "}
          <span className={styles.baseColor}>
            {currentColor.toUpperCase()}
          </span>
        </p>
      </div>

      <div className={styles.categoriesContainer}>
        {/* Primary Colors */}
        <div className={styles.categorySection}>
          <h4 className={styles.categoryTitle}>Primary Colors</h4>
          <p className={styles.categorySubtitle}>
            Generated from {currentColor.toUpperCase()}
          </p>
          <div className={styles.colorsGrid}>
            {primaryRoles.map((roleKey) => {
              const role =
                semanticPalette.roles[
                  roleKey as keyof typeof semanticPalette.roles
                ];
              return (
                <div
                  key={roleKey}
                  className={styles.colorItem}
                  onClick={() => handleColorClick(role.color, roleKey)}
                  title={`${role.name}: ${role.description}\nUsage: ${role.usage}\nClick to copy`}
                >
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: role.color }}
                  >
                    {copiedRole === roleKey && (
                      <div className={styles.copiedOverlay}>Copied</div>
                    )}
                  </div>
                  <div className={styles.colorInfo}>
                    <span className={styles.colorName}>
                      {role.name} - {roleToShade[roleKey] || "N/A"}
                    </span>
                    <span className={styles.colorCode}>
                      {role.color.toUpperCase()}
                    </span>
                    <span className={styles.colorUsage}>{role.usage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className={styles.categorySection}>
          <h4 className={styles.categoryTitle}>Neutral Colors</h4>
          <p className={styles.categorySubtitle}>
            UI elements using{" "}
            {selectedGrayScale.charAt(0).toUpperCase() +
              selectedGrayScale.slice(1)}{" "}
            scale
          </p>
          <div className={styles.colorsGrid}>
            {neutralRoles.map((roleKey) => {
              const role =
                semanticPalette.roles[
                  roleKey as keyof typeof semanticPalette.roles
                ];
              return (
                <div
                  key={roleKey}
                  className={styles.colorItem}
                  onClick={() => handleColorClick(role.color, roleKey)}
                  title={`${role.name}: ${role.description}\nUsage: ${role.usage}\nClick to copy`}
                >
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: role.color }}
                  >
                    {copiedRole === roleKey && (
                      <div className={styles.copiedOverlay}>Copied</div>
                    )}
                  </div>
                  <div className={styles.colorInfo}>
                    <span className={styles.colorName}>
                      {role.name} - {roleToShade[roleKey] || "N/A"}
                    </span>
                    <span className={styles.colorCode}>
                      {role.color.toUpperCase()}
                    </span>
                    <span className={styles.colorUsage}>{role.usage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
