import React from "react";
import type { ColorValues, ColorFormat } from "../types";
import { useColorValidation } from "../hooks";
import styles from "../ColorPicker.module.css";

interface ColorInputsProps {
  inputValues: ColorValues;
  lastValidValues: ColorValues;
  onInputChange: (format: ColorFormat, value: string) => void;
  onInputBlur: (format: ColorFormat) => void;
}

const ColorInputs: React.FC<ColorInputsProps> = ({
  inputValues,
  onInputChange,
  onInputBlur,
}) => {
  const { validateColor } = useColorValidation();

  const colorFormats: Array<{ key: ColorFormat; label: string }> = [
    { key: "hex", label: "HEX" },
    { key: "rgb", label: "RGB" },
    { key: "hsl", label: "HSL" },
  ];

  return (
    <div className={styles.colorValues}>
      {colorFormats.map(({ key, label }) => (
        <div key={key} className={styles.colorValue}>
          <label className={styles.colorValueLabel}>{label}</label>
          <input
            type="text"
            className={`${styles.colorValueInput} ${
              !validateColor(key, inputValues[key]) ? styles.invalid : ""
            }`}
            value={inputValues[key]}
            onChange={(e) => onInputChange(key, e.target.value)}
            onBlur={() => onInputBlur(key)}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorInputs;
