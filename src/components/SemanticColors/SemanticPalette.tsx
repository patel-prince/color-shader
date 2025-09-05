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
  className?: string;
}

export function SemanticPalette({
  currentColor,
  className,
}: SemanticPaletteProps) {
  const { semanticPalette, exportCssVariables, exportTailwindConfig } =
    useSemanticColors(currentColor);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind">("css");
  const [variablePrefix, setVariablePrefix] = useState("primary");

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

  const handleExport = async () => {
    try {
      const content =
        exportFormat === "css"
          ? exportCssVariables(variablePrefix || "color")
          : exportTailwindConfig();

      await navigator.clipboard.writeText(content);
      setCopiedRole("export");
      setTimeout(() => setCopiedRole(null), 2000);
    } catch (error) {
      console.warn("Failed to copy export to clipboard:", error);
    }
  };

  // Get all role keys in display order
  const allRoles = [
    "main",
    "hover",
    "active",
    "disabled",
    "contrast",
    "light",
    "lighter",
    "dark",
    "darker",
    "border",
    "surface",
    "textPrimary",
    "textSecondary",
  ];

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
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Design System Colors</h3>
          <p className={styles.subtitle}>
            Auto-generated from{" "}
            <span className={styles.baseColor}>
              {currentColor.toUpperCase()}
            </span>
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.exportControls}>
            <select
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(e.target.value as "css" | "tailwind")
              }
              className={styles.formatSelect}
            >
              <option value="css">CSS Variables</option>
              <option value="tailwind">Tailwind Config</option>
            </select>

            {exportFormat === "css" && (
              <input
                type="text"
                value={variablePrefix}
                onChange={(e) => setVariablePrefix(e.target.value)}
                placeholder="Prefix"
                className={styles.prefixInput}
                maxLength={20}
              />
            )}

            <button onClick={handleExport} className={styles.exportButton}>
              {copiedRole === "export" ? "Copied!" : "Export"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.colorsGrid}>
        {allRoles.map((roleKey) => {
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
  );
}
