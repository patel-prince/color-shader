import { useState, useEffect } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";
import CSSVarsModal from "./components/Modal/CSSVarsModal";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  hexToRgb,
  generateMixedScale,
  generateHslScale,
} from "./components/ColorPicker/utils";

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
    <ErrorBoundary>
      <div className="app-container">
        <aside className="app-sider">
          <ErrorBoundary
            fallback={
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Color picker temporarily unavailable
              </div>
            }
          >
            <ColorPicker
              color={selectedColor}
              onChange={setSelectedColor}
              showScales={false}
            />
          </ErrorBoundary>
        </aside>
        <main className="app-content">
          <h1>Color Scales</h1>
          <ErrorBoundary
            fallback={
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Color scales temporarily unavailable
              </div>
            }
          >
            <ColorScales
              color={selectedColor}
              onShowCssVars={handleShowCssVars}
            />
          </ErrorBoundary>
        </main>
        <CSSVarsModal
          isOpen={isModalOpen}
          scaleType={modalScaleType}
          selectedColor={selectedColor}
          variablePrefix={variablePrefix}
          onClose={() => setIsModalOpen(false)}
          onPrefixChange={setVariablePrefix}
          generateCSSVariables={generateCssVariables}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
