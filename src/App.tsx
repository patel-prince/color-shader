import { useState, useEffect, useRef } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";
import CSSVarsModal from "./components/Modal/CSSVarsModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { HistoryContainer } from "./components/ColorHistory";
import { SemanticPalette } from "./components/SemanticColors";
import { useColorHistory } from "./components/ColorPicker/hooks/useColorHistory";
import { hexToRgb, generateMixedScale } from "./components/ColorPicker/utils";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#4f39f6");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScaleType, setModalScaleType] = useState<"mixed" | null>(null);
  const [variablePrefix, setVariablePrefix] = useState("primary");

  // History management
  const { addToHistory } = useColorHistory();
  const previousColorRef = useRef(selectedColor);

  // Add color to history when it changes (with debouncing to avoid spam)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedColor !== previousColorRef.current) {
        addToHistory(selectedColor);
        previousColorRef.current = selectedColor;
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedColor, addToHistory]);

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

  const handleShowCssVars = (scaleType: "mixed") => {
    setModalScaleType(scaleType);
    setIsModalOpen(true);
  };

  const generateCssVariables = (color: string, prefix: string) => {
    const rgb = hexToRgb(color);
    const finalPrefix = prefix.trim() || "color";

    const mixedScale = generateMixedScale(rgb);
    const colorVars = Object.entries(mixedScale)
      .map(([level, hexColor]) => `  --${finalPrefix}-${level}: ${hexColor};`)
      .join("\n");
    return `:root {\n${colorVars}\n}`;
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

          {/* History/Favorites in accordion format for all screen sizes */}
          <div className="sidebar-history-section">
            <ErrorBoundary
              fallback={
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  History temporarily unavailable
                </div>
              }
            >
              <HistoryContainer
                currentColor={selectedColor}
                onColorSelect={setSelectedColor}
                isSidebarView={true}
              />
            </ErrorBoundary>
          </div>
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

          <div style={{ marginTop: "var(--spacing-md)" }}>
            <h1>Design System</h1>
            <ErrorBoundary
              fallback={
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  Design system temporarily unavailable
                </div>
              }
            >
              <SemanticPalette
                currentColor={selectedColor}
              />
            </ErrorBoundary>
          </div>
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
