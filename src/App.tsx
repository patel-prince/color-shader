import React, { useState, useRef, useEffect } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";
import {
  hexToRgb,
  generateMixedScale,
  generateHslScale,
} from "./components/ColorPicker/utils";

interface CssVarsModalProps {
  isOpen: boolean;
  scaleType: "mixed" | "hsl" | null;
  selectedColor: string;
  variablePrefix: string;
  onClose: () => void;
  onPrefixChange: (prefix: string) => void;
  generateCssVariables: (
    color: string,
    scaleType: "mixed" | "hsl",
    prefix: string
  ) => string;
}

const CssVarsModal: React.FC<CssVarsModalProps> = ({
  isOpen,
  scaleType,
  selectedColor,
  variablePrefix,
  onClose,
  onPrefixChange,
  generateCssVariables,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match the animation duration
  };

  const copyToClipboard = () => {
    if (!scaleType) return;
    const cssText = generateCssVariables(
      selectedColor,
      scaleType,
      variablePrefix
    );
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

  // Reset closing state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen || !scaleType) return null;

  const cssText = generateCssVariables(
    selectedColor,
    scaleType,
    variablePrefix
  );

  const scaleTitle = scaleType === "mixed" ? "Mixed Scale" : "HSL Scale";

  return (
    <div
      className={`modal-overlay${isClosing ? " closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content${isClosing ? " closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{scaleTitle} CSS Variables</h3>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="css-vars-actions">
            <div className="prefix-input-container">
              <label htmlFor="variable-prefix" className="prefix-label">
                Variable Prefix:
              </label>
              <input
                id="variable-prefix"
                type="text"
                value={variablePrefix}
                onChange={(e) => onPrefixChange(e.target.value)}
                className="prefix-input"
                placeholder="color"
              />
            </div>
            <button className="copy-css-btn" onClick={copyToClipboard}>
              {isCopied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
          <pre className="css-vars-code">
            <code>{cssText}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#4f39f6");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScaleType, setModalScaleType] = useState<"mixed" | "hsl" | null>(
    null
  );
  const [variablePrefix, setVariablePrefix] = useState("primary");

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleShowCssVars = (scaleType: "mixed" | "hsl") => {
    setModalScaleType(scaleType);
    setIsModalOpen(true);
  };

  const generateCssVariables = (
    color: string,
    scaleType: "mixed" | "hsl",
    prefix: string
  ) => {
    const rgb = hexToRgb(color);
    const finalPrefix = prefix.trim() || "color";

    if (scaleType === "mixed") {
      const mixedScale = generateMixedScale(rgb);
      const colorVars = Object.entries(mixedScale)
        .map(([level, hexColor]) => `  --${finalPrefix}-${level}: ${hexColor};`)
        .join("\n");
      return `:root {\n${colorVars}\n}`;
    } else {
      const hslScale = generateHslScale(rgb);
      const colorVars = Object.entries(hslScale)
        .map(([level, hexColor]) => `  --${finalPrefix}-${level}: ${hexColor};`)
        .join("\n");
      return `:root {\n${colorVars}\n}`;
    }
  };

  return (
    <div className="app-container">
      <aside className="app-sider">
        <ColorPicker
          color={selectedColor}
          onChange={setSelectedColor}
          showScales={false}
        />
      </aside>
      <main className="app-content">
        <h1>Color Scales</h1>
        <ColorScales color={selectedColor} onShowCssVars={handleShowCssVars} />
      </main>
      <CssVarsModal
        isOpen={isModalOpen}
        scaleType={modalScaleType}
        selectedColor={selectedColor}
        variablePrefix={variablePrefix}
        onClose={() => setIsModalOpen(false)}
        onPrefixChange={setVariablePrefix}
        generateCssVariables={generateCssVariables}
      />
    </div>
  );
};

export default App;
