import { useState, useEffect, useRef } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";
import SemanticColorsModal from "./components/Modal/SemanticColorsModal";
import ErrorBoundary from "./components/ErrorBoundary";
import { HistoryContainer } from "./components/ColorHistory";
import { SemanticPalette } from "./components/SemanticColors";
import { useColorHistory } from "./components/ColorPicker/hooks/useColorHistory";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#4f39f6");
  const [isSemanticModalOpen, setIsSemanticModalOpen] = useState(false);
  const [semanticPrefix, setSemanticPrefix] = useState("primary");
  const [selectedGrayScale, setSelectedGrayScale] = useState<string>("gray");

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
    if (isSemanticModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSemanticModalOpen]);

  const handleShowSemanticModal = (prefix: string) => {
    setSemanticPrefix(prefix);
    setIsSemanticModalOpen(true);
  };

  const handleCloseSemanticModal = () => {
    setIsSemanticModalOpen(false);
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
          <div className="app-content-header">
            <h1 className="app-title">Design System</h1>
            <button
              className="export-button"
              onClick={() => handleShowSemanticModal("primary")}
            >
              Export CSS
            </button>
          </div>

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
              selectedGrayScale={selectedGrayScale}
              onGrayScaleChange={setSelectedGrayScale}
            />
          </ErrorBoundary>

          <div style={{ marginTop: "var(--spacing-md)" }}>
            <ErrorBoundary
              fallback={
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  Semantic palette temporarily unavailable
                </div>
              }
            >
              <SemanticPalette
                currentColor={selectedColor}
                selectedGrayScale={selectedGrayScale}
              />
            </ErrorBoundary>
          </div>
        </main>
        <SemanticColorsModal
          isOpen={isSemanticModalOpen}
          selectedColor={selectedColor}
          selectedGrayScale={selectedGrayScale}
          variablePrefix={semanticPrefix}
          onClose={handleCloseSemanticModal}
          onPrefixChange={setSemanticPrefix}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
