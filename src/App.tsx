import { useState, useEffect } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";
import CSSVarsModal from "./components/Modal/CSSVarsModal";
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
  );
};

export default App;
