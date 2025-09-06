"use client";

import { useState } from "react";
import { useSemanticColors } from "../ColorPicker/hooks/useSemanticColors";
import { generateMixedScale } from "../ColorPicker/utils/colorScales";
import "./ExportModal.css";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    hsv: { h: number; s: number; v: number };
  };
  selectedGrayScale: string;
}

export function ExportModal({
  isOpen,
  onClose,
  selectedColor,
  selectedGrayScale,
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<"color-scale" | "semantic">(
    "color-scale"
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const { exportCssVariables } = useSemanticColors(
    selectedColor.hex,
    selectedGrayScale
  );

  if (!isOpen) return null;

  // Generate color scale CSS variables
  const colorScale = generateMixedScale(selectedColor.rgb);
  const colorScaleCss = `:root {
  /* Color Scale Variables */
${Object.entries(colorScale)
  .map(([level, hex]) => `  --color-${level}: ${hex};`)
  .join("\n")}
}`;

  // Generate semantic colors CSS
  const semanticCss = exportCssVariables("color");

  const handleCopy = async (content: string, section: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="export-modal-overlay" onClick={handleOverlayClick}>
      <div className="export-modal">
        <div className="export-modal-header">
          <h2 className="export-modal-title">Export CSS Variables</h2>
          <button
            className="export-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="export-modal-tabs">
          <button
            className={`export-tab ${
              activeTab === "color-scale" ? "active" : ""
            }`}
            onClick={() => setActiveTab("color-scale")}
          >
            Color Scale
          </button>
          <button
            className={`export-tab ${activeTab === "semantic" ? "active" : ""}`}
            onClick={() => setActiveTab("semantic")}
          >
            Semantic Colors
          </button>
        </div>

        <div className="export-modal-content">
          {activeTab === "color-scale" && (
            <div className="export-section">
              <div className="export-section-header">
                <h3>Color Scale Variables</h3>
                <p className="export-description">
                  50-950 color scale based on {selectedColor.hex.toUpperCase()}
                </p>
                <button
                  className={`copy-button ${
                    copiedSection === "color-scale" ? "copied" : ""
                  }`}
                  onClick={() => handleCopy(colorScaleCss, "color-scale")}
                >
                  {copiedSection === "color-scale" ? "Copied!" : "Copy CSS"}
                </button>
              </div>
              <pre className="export-code">
                <code>{colorScaleCss}</code>
              </pre>
            </div>
          )}

          {activeTab === "semantic" && (
            <div className="export-section">
              <div className="export-section-header">
                <h3>Semantic Color Variables</h3>
                <p className="export-description">
                  Design system colors with semantic naming
                </p>
                <button
                  className={`copy-button ${
                    copiedSection === "semantic" ? "copied" : ""
                  }`}
                  onClick={() => handleCopy(semanticCss, "semantic")}
                >
                  {copiedSection === "semantic" ? "Copied!" : "Copy CSS"}
                </button>
              </div>
              <pre className="export-code">
                <code>{semanticCss}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="export-modal-footer">
          <div className="export-usage-info">
            <h4>Usage Instructions:</h4>
            <ul>
              <li>Copy the CSS variables to your stylesheet</li>
              <li>
                Use them in your components:{" "}
                <code>color: var(--color-600);</code>
              </li>
              <li>Semantic colors provide meaningful names for UI elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
