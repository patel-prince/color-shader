import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import styles from "./Modal.module.css";
import { useSemanticColors } from "../ColorPicker/hooks/useSemanticColors";
import { hexToRgb, generateMixedScale } from "../ColorPicker/utils";

// Gray scale base colors
const GRAY_SCALES = {
  slate: "#64748b",
  zinc: "#71717a",
  gray: "#6b7280",
  neutral: "#737373",
  stone: "#78716c",
};

interface SemanticColorsModalProps {
  isOpen: boolean;
  selectedColor: string;
  selectedGrayScale?: string;
  variablePrefix: string;
  onClose: () => void;
  onPrefixChange: (prefix: string) => void;
}

const SemanticColorsModal: React.FC<SemanticColorsModalProps> = ({
  isOpen,
  selectedColor,
  selectedGrayScale = "gray",
  variablePrefix,
  onClose,
  onPrefixChange,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const { exportCssVariables } = useSemanticColors(
    selectedColor,
    selectedGrayScale
  );

  const generateCompleteCssVariables = (): string => {
    const finalPrefix = variablePrefix.trim() || "primary";

    // Generate base color scale variables
    const baseRgb = hexToRgb(selectedColor);
    const baseColorScale = generateMixedScale(baseRgb);
    const baseColorVars = Object.entries(baseColorScale)
      .map(([level, hexColor]) => `  --${finalPrefix}-${level}: ${hexColor};`)
      .join("\n");

    // Generate gray scale variables
    const selectedGrayHex =
      GRAY_SCALES[selectedGrayScale as keyof typeof GRAY_SCALES] ||
      GRAY_SCALES.gray;
    const grayRgb = hexToRgb(selectedGrayHex);
    const grayScale = generateMixedScale(grayRgb);
    const grayVars = Object.entries(grayScale)
      .map(
        ([level, hexColor]) => `  --${selectedGrayScale}-${level}: ${hexColor};`
      )
      .join("\n");

    // Generate semantic variables that reference the base scales
    const semanticVars = exportCssVariables(finalPrefix);

    // Combine all CSS variables
    return `:root {\n  /* Base Color Scale */\n${baseColorVars}\n\n  /* Gray Scale (${
      selectedGrayScale.charAt(0).toUpperCase() + selectedGrayScale.slice(1)
    }) */\n${grayVars}\n\n  /* Semantic Colors */\n${semanticVars
      .replace(":root {\n", "")
      .replace("\n}", "")}\n}`;
  };

  const copyToClipboard = () => {
    const cssText = generateCompleteCssVariables();
    navigator.clipboard.writeText(cssText);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsCopied(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const cssText = generateCompleteCssVariables();

  return (
    <Modal
      isOpen={isOpen}
      title="Complete Design System CSS Variables"
      onClose={onClose}
    >
      <div className={styles.actions}>
        <div className={styles.prefixInputContainer}>
          <label
            htmlFor="semantic-variable-prefix"
            className={styles.prefixLabel}
          >
            Variable Prefix:
          </label>
          <input
            id="semantic-variable-prefix"
            type="text"
            value={variablePrefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className={styles.prefixInput}
            placeholder="primary"
          />
        </div>
        <button className={styles.copyBtn} onClick={copyToClipboard}>
          {isCopied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
      <pre className={styles.code}>
        <code>{cssText}</code>
      </pre>
    </Modal>
  );
};

export default SemanticColorsModal;
