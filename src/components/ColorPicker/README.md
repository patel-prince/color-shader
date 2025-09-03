# ColorPicker Component

A professional, customizable color picker component built with React and TypeScript. Features an always-visible interface with visual saturation/brightness picker, hue slider, and editable color format inputs.

## Features

- 🎨 **Visual Color Selection**: Interactive saturation/brightness picker and hue slider
- 📝 **Editable Inputs**: Support for HEX, RGB, and HSL format inputs
- ✅ **Input Validation**: Auto-revert invalid inputs to last valid values
- 🔄 **Real-time Sync**: All formats update simultaneously
- 🎯 **Precision Preservation**: No color conversion loss
- 📱 **Responsive Design**: Works on all screen sizes
- 🎭 **CSS Modules**: Scoped styling with no conflicts
- 🔧 **TypeScript**: Full type safety and IntelliSense support
- 🧩 **Modular Architecture**: Composed of reusable sub-components
- 🔧 **Advanced Usage**: Individual components and hooks can be used separately
- 🎣 **Custom Hooks**: Reusable hooks for mouse interactions, validation, and state management

## Installation

```bash
npm install @your-org/color-picker
```

## Usage

```tsx
import React, { useState } from "react";
import ColorPicker from "@your-org/color-picker";

function App() {
  const [color, setColor] = useState("#4f39f6");

  return (
    <div>
      <ColorPicker
        color={color}
        onChange={setColor}
        className="my-color-picker"
      />
      <div>Selected color: {color}</div>
    </div>
  );
}
```

## Props

| Prop        | Type                      | Required | Default | Description                       |
| ----------- | ------------------------- | -------- | ------- | --------------------------------- |
| `color`     | `string`                  | Yes      | -       | Current color value in HEX format |
| `onChange`  | `(color: string) => void` | Yes      | -       | Callback fired when color changes |
| `className` | `string`                  | No       | `''`    | Additional CSS class for styling  |

## Color Formats

The component supports three color formats:

- **HEX**: `#ff5733`
- **RGB**: `rgb(255, 87, 51)`
- **HSL**: `hsl(12, 100%, 60%)`

## Type Definitions

```typescript
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}
```

## Styling

The component uses CSS Modules for styling. You can override styles by targeting the class names:

```css
.colorPicker {
  /* Main container */
}
.saturationPicker {
  /* Saturation/brightness area */
}
.hueSlider {
  /* Hue slider */
}
.colorPreview {
  /* Color preview square */
}
.colorValueInput {
  /* Input fields */
}
```

## Advanced Usage

### With Custom Validation

```tsx
const handleColorChange = (newColor: string) => {
  // Custom validation logic
  if (isValidColor(newColor)) {
    setColor(newColor);
  }
};

<ColorPicker color={color} onChange={handleColorChange} />;
```

### With Controlled State

```tsx
const [colorState, setColorState] = useState({
  current: "#4f39f6",
  previous: "#000000",
});

const handleChange = (color: string) => {
  setColorState((prev) => ({
    current: color,
    previous: prev.current,
  }));
};
```

### Using Individual Components

For advanced customization, you can use the individual components:

```tsx
import {
  SaturationPicker,
  HueSlider,
  ColorPreview,
  ColorInputs,
  rgbToHsv,
  hsvToRgb,
} from "@your-org/color-picker";

const MyCustomColorPicker = () => {
  const [hsv, setHsv] = useState({ h: 249, s: 92, v: 96 });
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

  return (
    <div>
      <SaturationPicker
        hsv={hsv}
        onChange={(s, v) => setHsv((prev) => ({ ...prev, s, v }))}
      />
      <HueSlider
        hsv={hsv}
        onChange={(h) => setHsv((prev) => ({ ...prev, h }))}
      />
      {/* Custom layout with individual components */}
    </div>
  );
};
```

### Using Custom Hooks

For even more control, you can use the individual hooks:

```tsx
import {
  useColorState,
  useColorValidation,
  useMouseDrag,
} from "@your-org/color-picker";

const MyColorPicker = () => {
  const colorState = useColorState({
    initialColor: "#4f39f6",
    onChange: (color) => console.log(color),
  });

  const { validateColor } = useColorValidation();

  const { hsv, currentRgb, inputValues, updateHsv } = colorState;

  // Build your custom color picker with full control
  return <div>{/* Your custom implementation */}</div>;
};
```

## Component Architecture

The ColorPicker is composed of four main sub-components and three custom hooks:

### Components

- **SaturationPicker**: The main 2D area for selecting saturation and brightness
- **HueSlider**: Horizontal slider for selecting color hue
- **ColorPreview**: Shows current color and contains the hue slider
- **ColorInputs**: Editable input fields for HEX, RGB, and HSL formats

### Custom Hooks

- **useColorState**: Manages complex color state with format preservation
- **useColorValidation**: Provides validation functions for different color formats
- **useMouseDrag**: Reusable hook for mouse drag interactions

## Utility Functions

The package also exports utility functions for color conversion:

```typescript
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from "@your-org/color-picker";

const rgb = hexToRgb("#ff5733"); // { r: 255, g: 87, b: 51 }
const hex = rgbToHex(255, 87, 51); // '#ff5733'
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

MIT License - see LICENSE file for details.
