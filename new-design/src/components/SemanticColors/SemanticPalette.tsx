"use client";

import { useState } from "react";
import type { SemanticPalette } from "../ColorPicker/utils/semanticColors";
import { useSemanticColors } from "../ColorPicker/hooks/useSemanticColors";
import "./SemanticPalette.css";

export interface SemanticPaletteProps {
  currentColor: string;
  selectedGrayScale: string;
  className?: string;
}

export function SemanticPalette({
  currentColor,
  selectedGrayScale,
  className = "",
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

  const neutralRoles = [
    "border",
    "surface",
    "surfaceAlt",
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
    surfaceAlt: "White",
  };

  return (
    <div className={`semantic-palette ${className}`}>
      <div className="semantic-header">
        <h3 className="semantic-title">Design System Colors</h3>
        <p className="semantic-subtitle">
          Auto-generated from{" "}
          <span className="base-color">{currentColor.toUpperCase()}</span>
        </p>
      </div>

      <div className="categories-container">
        {/* Primary Colors */}
        <div className="category-section">
          <h4 className="category-title">Primary Colors</h4>
          <p className="category-subtitle">
            Generated from {currentColor.toUpperCase()}
          </p>
          <div className="colors-grid">
            {primaryRoles.map((roleKey) => {
              const role =
                semanticPalette.roles[
                  roleKey as keyof typeof semanticPalette.roles
                ];
              return (
                <div
                  key={roleKey}
                  className="color-item"
                  onClick={() => handleColorClick(role.color, roleKey)}
                  title={`${role.name}: ${role.description}\nUsage: ${role.usage}\nClick to copy`}
                >
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: role.color }}
                  >
                    {copiedRole === roleKey && (
                      <div className="copied-overlay">Copied</div>
                    )}
                  </div>
                  <div className="color-info">
                    <span className="color-name">
                      {role.name} - {roleToShade[roleKey] || "N/A"}
                    </span>
                    <span className="color-code">
                      {role.color.toUpperCase()}
                    </span>
                    <span className="color-usage">{role.usage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="category-section">
          <h4 className="category-title">Neutral Colors</h4>
          <p className="category-subtitle">
            UI elements using{" "}
            {selectedGrayScale.charAt(0).toUpperCase() +
              selectedGrayScale.slice(1)}{" "}
            scale
          </p>
          <div className="colors-grid">
            {neutralRoles.map((roleKey) => {
              const role =
                semanticPalette.roles[
                  roleKey as keyof typeof semanticPalette.roles
                ];
              if (!role) return null;

              return (
                <div
                  key={roleKey}
                  className="color-item"
                  onClick={() => handleColorClick(role.color, roleKey)}
                  title={`${role.name}: ${role.description}\nUsage: ${role.usage}\nClick to copy`}
                >
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: role.color }}
                  >
                    {copiedRole === roleKey && (
                      <div className="copied-overlay">Copied</div>
                    )}
                  </div>
                  <div className="color-info">
                    <span className="color-name">
                      {role.name} - {roleToShade[roleKey] || "N/A"}
                    </span>
                    <span className="color-code">
                      {role.color.toUpperCase()}
                    </span>
                    <span className="color-usage">{role.usage}</span>
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
