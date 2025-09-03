import React from "react";
import type { ColorPickerProps, ColorFormat } from "./types";
import { useColorState, useColorValidation } from "./hooks";
import {
  SaturationPicker,
  ColorPreview,
  ColorInputs,
  ColorScale,
} from "./components";
import styles from "./ColorPicker.module.css";

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  className = "",
  showScales = true,
}) => {
  // Use custom hooks for clean separation of concerns
  const colorState = useColorState({ initialColor: color, onChange });
  const { validateColor } = useColorValidation();

  const {
    hsv,
    currentRgb,
    inputValues,
    lastValidValues,
    updateHsv,
    updateInputFormat,
    revertInvalidInput,
  } = colorState;

  // Handle visual picker changes
  const handleSaturationChange = (s: number, v: number) => {
    updateHsv({ s, v });
  };

  const handleHueChange = (h: number) => {
    updateHsv({ h });
  };

  // Handle input changes
  const handleInputChange = (format: ColorFormat, value: string) => {
    updateInputFormat(format, value);
  };

  // Handle input blur - revert invalid inputs
  const handleInputBlur = (format: ColorFormat) => {
    const currentValue = inputValues[format];
    if (!validateColor(format, currentValue)) {
      revertInvalidInput(format);
    }
  };

  if (!showScales) {
    // Simple vertical layout without scales
    return (
      <div className={`${styles.colorPicker} ${className}`}>
        <SaturationPicker hsv={hsv} onChange={handleSaturationChange} />
        <ColorPreview
          rgb={currentRgb}
          hsv={hsv}
          onHueChange={handleHueChange}
        />
        <ColorInputs
          inputValues={inputValues}
          lastValidValues={lastValidValues}
          onInputChange={handleInputChange}
          onInputBlur={handleInputBlur}
        />
      </div>
    );
  }

  // Full horizontal layout with scales
  return (
    <div className={`${styles.colorPickerContainer} ${className}`}>
      <div className={styles.colorPickerMain}>
        <div className={styles.colorPicker}>
          <SaturationPicker hsv={hsv} onChange={handleSaturationChange} />
          <ColorPreview
            rgb={currentRgb}
            hsv={hsv}
            onHueChange={handleHueChange}
          />
          <ColorInputs
            inputValues={inputValues}
            lastValidValues={lastValidValues}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
          />
        </div>
      </div>
      <div className={styles.colorScalesContainer}>
        <ColorScale title="Mixed Scale" baseRgb={currentRgb} type="mixed" />
        <ColorScale title="HSL Scale" baseRgb={currentRgb} type="hsl" />
      </div>
    </div>
  );
};

export default ColorPicker;
