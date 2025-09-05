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

// History and Favorites interfaces
export interface ColorHistoryItem {
  id: string;
  hex: string;
  timestamp: number;
}

export interface ColorFavoriteItem {
  id: string;
  hex: string;
  name: string;
  timestamp: number;
}

export interface ColorHistoryState {
  history: ColorHistoryItem[];
  favorites: ColorFavoriteItem[];
}

export interface ColorHistoryHookReturn {
  history: ColorHistoryItem[];
  favorites: ColorFavoriteItem[];
  addToHistory: (hex: string) => void;
  addToFavorites: (hex: string, name: string) => void;
  removeFromFavorites: (id: string) => void;
  clearHistory: () => void;
  isFavorite: (hex: string) => boolean;
}

// Semantic Color System interfaces
export interface SemanticColorRole {
  name: string;
  description: string;
  color: string;
  usage: string;
}

export interface SemanticPalette {
  baseColor: string;
  roles: {
    // Interactive States
    main: SemanticColorRole;
    hover: SemanticColorRole;
    active: SemanticColorRole;
    disabled: SemanticColorRole;

    // Contrast & Text
    contrast: SemanticColorRole;
    textPrimary: SemanticColorRole;
    textSecondary: SemanticColorRole;

    // Design System Variants
    light: SemanticColorRole;
    lighter: SemanticColorRole;
    dark: SemanticColorRole;
    darker: SemanticColorRole;

    // Borders & Surfaces
    border: SemanticColorRole;
    surface: SemanticColorRole;
  };
}

export interface SemanticPaletteHookReturn {
  semanticPalette: SemanticPalette;
  generatePalette: (baseColor: string) => SemanticPalette;
  exportCssVariables: (prefix?: string) => string;
  exportTailwindConfig: () => string;
}
