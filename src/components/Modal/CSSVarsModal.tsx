import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import styles from "./Modal.module.css";

interface CSSVarsModalProps {
  isOpen: boolean;
  scaleType: "mixed" | null;
  selectedColor: string;
  variablePrefix: string;
  onClose: () => void;
  onPrefixChange: (prefix: string) => void;
  generateCSSVariables: (color: string, prefix: string) => string;
}

const CSSVarsModal: React.FC<CSSVarsModalProps> = ({
  isOpen,
  scaleType,
  selectedColor,
  variablePrefix,
  onClose,
  onPrefixChange,
  generateCSSVariables,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = () => {
    if (!scaleType) return;
    const cssText = generateCSSVariables(selectedColor, variablePrefix);
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

  if (!scaleType) return null;

  const cssText = generateCSSVariables(selectedColor, variablePrefix);

  const scaleTitle = "Color Scale";

  return (
    <Modal
      isOpen={isOpen}
      title={`${scaleTitle} CSS Variables`}
      onClose={onClose}
    >
      <div className={styles.actions}>
        <div className={styles.prefixInputContainer}>
          <label htmlFor="variable-prefix" className={styles.prefixLabel}>
            Variable Prefix:
          </label>
          <input
            id="variable-prefix"
            type="text"
            value={variablePrefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className={styles.prefixInput}
            placeholder="color"
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

export default CSSVarsModal;
