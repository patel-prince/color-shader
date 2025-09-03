export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  showScales?: boolean;
}

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
}
