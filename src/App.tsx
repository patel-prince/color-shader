import React, { useState } from "react";
import ColorPicker, { ColorScales } from "./components/ColorPicker";

const App = () => {
  const [selectedColor, setSelectedColor] = useState("#4f39f6");

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
        <ColorScales color={selectedColor} />
      </main>
    </div>
  );
};

export default App;
