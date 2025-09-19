"use client";

import { useState } from "react";
import { Header } from "../../src/components/Header";
import ErrorBoundary from "../../src/components/ErrorBoundary";
import "../../src/styles/colors-page.css";

// Industry-standard Material Design color scales
// These are the universally recognized colors used across the design industry

const colorScales = [
  {
    name: "Red",
    colors: [
      { shade: 50, hex: "#FFEBEE", name: "red-50" }, // Material Design Red 50
      { shade: 100, hex: "#FFCDD2", name: "red-100" }, // Material Design Red 100
      { shade: 200, hex: "#EF9A9A", name: "red-200" }, // Material Design Red 200
      { shade: 300, hex: "#E57373", name: "red-300" }, // Material Design Red 300
      { shade: 400, hex: "#EF5350", name: "red-400" }, // Material Design Red 400
      { shade: 500, hex: "#F44336", name: "red-500" }, // Material Design Red 500 (Primary)
      { shade: 600, hex: "#E53935", name: "red-600" }, // Material Design Red 600
      { shade: 700, hex: "#D32F2F", name: "red-700" }, // Material Design Red 700
      { shade: 800, hex: "#C62828", name: "red-800" }, // Material Design Red 800
      { shade: 900, hex: "#B71C1C", name: "red-900" }, // Material Design Red 900
      { shade: 950, hex: "#7F1D1D", name: "red-950" }, // Tailwind Red 950 (darkest)
    ],
  },
  {
    name: "Deep Orange",
    colors: [
      { shade: 50, hex: "#FBE9E7", name: "deep-orange-50" }, // Material Design Deep Orange 50
      { shade: 100, hex: "#FFCCBC", name: "deep-orange-100" }, // Material Design Deep Orange 100
      { shade: 200, hex: "#FFAB91", name: "deep-orange-200" }, // Material Design Deep Orange 200
      { shade: 300, hex: "#FF8A65", name: "deep-orange-300" }, // Material Design Deep Orange 300
      { shade: 400, hex: "#FF7043", name: "deep-orange-400" }, // Material Design Deep Orange 400
      { shade: 500, hex: "#FF5722", name: "deep-orange-500" }, // Material Design Deep Orange 500 (Primary)
      { shade: 600, hex: "#F4511E", name: "deep-orange-600" }, // Material Design Deep Orange 600
      { shade: 700, hex: "#E64A19", name: "deep-orange-700" }, // Material Design Deep Orange 700
      { shade: 800, hex: "#D84315", name: "deep-orange-800" }, // Material Design Deep Orange 800
      { shade: 900, hex: "#BF360C", name: "deep-orange-900" }, // Material Design Deep Orange 900
      { shade: 950, hex: "#7C2D12", name: "deep-orange-950" }, // Tailwind Orange 950 (darkest)
    ],
  },
  {
    name: "Orange",
    colors: [
      { shade: 50, hex: "#FFF3E0", name: "orange-50" }, // Material Design Orange 50
      { shade: 100, hex: "#FFE0B2", name: "orange-100" }, // Material Design Orange 100
      { shade: 200, hex: "#FFCC80", name: "orange-200" }, // Material Design Orange 200
      { shade: 300, hex: "#FFB74D", name: "orange-300" }, // Material Design Orange 300
      { shade: 400, hex: "#FFA726", name: "orange-400" }, // Material Design Orange 400
      { shade: 500, hex: "#FF9800", name: "orange-500" }, // Material Design Orange 500 (Primary)
      { shade: 600, hex: "#FB8C00", name: "orange-600" }, // Material Design Orange 600
      { shade: 700, hex: "#F57C00", name: "orange-700" }, // Material Design Orange 700
      { shade: 800, hex: "#EF6C00", name: "orange-800" }, // Material Design Orange 800
      { shade: 900, hex: "#E65100", name: "orange-900" }, // Material Design Orange 900
      { shade: 950, hex: "#9A3412", name: "orange-950" }, // Tailwind Orange 950 (darkest)
    ],
  },
  {
    name: "Amber",
    colors: [
      { shade: 50, hex: "#FFF8E1", name: "amber-50" }, // Material Design Amber 50
      { shade: 100, hex: "#FFECB3", name: "amber-100" }, // Material Design Amber 100
      { shade: 200, hex: "#FFE082", name: "amber-200" }, // Material Design Amber 200
      { shade: 300, hex: "#FFD54F", name: "amber-300" }, // Material Design Amber 300
      { shade: 400, hex: "#FFCA28", name: "amber-400" }, // Material Design Amber 400
      { shade: 500, hex: "#FFC107", name: "amber-500" }, // Material Design Amber 500 (Primary)
      { shade: 600, hex: "#FFB300", name: "amber-600" }, // Material Design Amber 600
      { shade: 700, hex: "#FFA000", name: "amber-700" }, // Material Design Amber 700
      { shade: 800, hex: "#FF8F00", name: "amber-800" }, // Material Design Amber 800
      { shade: 900, hex: "#FF6F00", name: "amber-900" }, // Material Design Amber 900
      { shade: 950, hex: "#92400E", name: "amber-950" }, // Tailwind Amber 950 (darkest)
    ],
  },
  {
    name: "Yellow",
    colors: [
      { shade: 50, hex: "#FFFDE7", name: "yellow-50" }, // Material Design Yellow 50
      { shade: 100, hex: "#FFF9C4", name: "yellow-100" }, // Material Design Yellow 100
      { shade: 200, hex: "#FFF59D", name: "yellow-200" }, // Material Design Yellow 200
      { shade: 300, hex: "#FFF176", name: "yellow-300" }, // Material Design Yellow 300
      { shade: 400, hex: "#FFEE58", name: "yellow-400" }, // Material Design Yellow 400
      { shade: 500, hex: "#FFEB3B", name: "yellow-500" }, // Material Design Yellow 500 (Primary)
      { shade: 600, hex: "#FDD835", name: "yellow-600" }, // Material Design Yellow 600
      { shade: 700, hex: "#F9A825", name: "yellow-700" }, // Material Design Yellow 700
      { shade: 800, hex: "#F57F17", name: "yellow-800" }, // Material Design Yellow 800
      { shade: 900, hex: "#F57C00", name: "yellow-900" }, // Material Design Yellow 900
      { shade: 950, hex: "#713F12", name: "yellow-950" }, // Tailwind Yellow 950 (darkest)
    ],
  },
  {
    name: "Lime",
    colors: [
      { shade: 50, hex: "#F9FBE7", name: "lime-50" }, // Material Design Lime 50
      { shade: 100, hex: "#F0F4C3", name: "lime-100" }, // Material Design Lime 100
      { shade: 200, hex: "#E6EE9C", name: "lime-200" }, // Material Design Lime 200
      { shade: 300, hex: "#DCE775", name: "lime-300" }, // Material Design Lime 300
      { shade: 400, hex: "#D4E157", name: "lime-400" }, // Material Design Lime 400
      { shade: 500, hex: "#CDDC39", name: "lime-500" }, // Material Design Lime 500 (Primary)
      { shade: 600, hex: "#C0CA33", name: "lime-600" }, // Material Design Lime 600
      { shade: 700, hex: "#AFB42B", name: "lime-700" }, // Material Design Lime 700
      { shade: 800, hex: "#9E9D24", name: "lime-800" }, // Material Design Lime 800
      { shade: 900, hex: "#827717", name: "lime-900" }, // Material Design Lime 900
      { shade: 950, hex: "#365314", name: "lime-950" }, // Tailwind Lime 950 (darkest)
    ],
  },
  {
    name: "Light Green",
    colors: [
      { shade: 50, hex: "#F1F8E9", name: "light-green-50" }, // Material Design Light Green 50
      { shade: 100, hex: "#DCEDC8", name: "light-green-100" }, // Material Design Light Green 100
      { shade: 200, hex: "#C5E1A5", name: "light-green-200" }, // Material Design Light Green 200
      { shade: 300, hex: "#AED581", name: "light-green-300" }, // Material Design Light Green 300
      { shade: 400, hex: "#9CCC65", name: "light-green-400" }, // Material Design Light Green 400
      { shade: 500, hex: "#8BC34A", name: "light-green-500" }, // Material Design Light Green 500 (Primary)
      { shade: 600, hex: "#7CB342", name: "light-green-600" }, // Material Design Light Green 600
      { shade: 700, hex: "#689F38", name: "light-green-700" }, // Material Design Light Green 700
      { shade: 800, hex: "#558B2F", name: "light-green-800" }, // Material Design Light Green 800
      { shade: 900, hex: "#33691E", name: "light-green-900" }, // Material Design Light Green 900
      { shade: 950, hex: "#14532D", name: "light-green-950" }, // Tailwind Green 950 (darkest)
    ],
  },
  {
    name: "Green",
    colors: [
      { shade: 50, hex: "#E8F5E8", name: "green-50" }, // Material Design Green 50
      { shade: 100, hex: "#C8E6C8", name: "green-100" }, // Material Design Green 100
      { shade: 200, hex: "#A5D6A7", name: "green-200" }, // Material Design Green 200
      { shade: 300, hex: "#81C784", name: "green-300" }, // Material Design Green 300
      { shade: 400, hex: "#66BB6A", name: "green-400" }, // Material Design Green 400
      { shade: 500, hex: "#4CAF50", name: "green-500" }, // Material Design Green 500 (Primary)
      { shade: 600, hex: "#43A047", name: "green-600" }, // Material Design Green 600
      { shade: 700, hex: "#388E3C", name: "green-700" }, // Material Design Green 700
      { shade: 800, hex: "#2E7D32", name: "green-800" }, // Material Design Green 800
      { shade: 900, hex: "#1B5E20", name: "green-900" }, // Material Design Green 900
      { shade: 950, hex: "#052E16", name: "green-950" }, // Tailwind Green 950 (darkest)
    ],
  },
  {
    name: "Emerald",
    colors: [
      { shade: 50, hex: "#ECFDF5", name: "emerald-50" }, // Tailwind Emerald 50 (true emerald)
      { shade: 100, hex: "#D1FAE5", name: "emerald-100" }, // Tailwind Emerald 100
      { shade: 200, hex: "#A7F3D0", name: "emerald-200" }, // Tailwind Emerald 200
      { shade: 300, hex: "#6EE7B7", name: "emerald-300" }, // Tailwind Emerald 300
      { shade: 400, hex: "#34D399", name: "emerald-400" }, // Tailwind Emerald 400
      { shade: 500, hex: "#10B981", name: "emerald-500" }, // Tailwind Emerald 500 (Primary)
      { shade: 600, hex: "#059669", name: "emerald-600" }, // Tailwind Emerald 600
      { shade: 700, hex: "#047857", name: "emerald-700" }, // Tailwind Emerald 700
      { shade: 800, hex: "#065F46", name: "emerald-800" }, // Tailwind Emerald 800
      { shade: 900, hex: "#064E3B", name: "emerald-900" }, // Tailwind Emerald 900
      { shade: 950, hex: "#022C22", name: "emerald-950" }, // Tailwind Emerald 950 (darkest)
    ],
  },
  {
    name: "Teal",
    colors: [
      { shade: 50, hex: "#E0F2F1", name: "teal-50" }, // Material Design Teal 50
      { shade: 100, hex: "#B2DFDB", name: "teal-100" }, // Material Design Teal 100
      { shade: 200, hex: "#80CBC4", name: "teal-200" }, // Material Design Teal 200
      { shade: 300, hex: "#4DB6AC", name: "teal-300" }, // Material Design Teal 300
      { shade: 400, hex: "#26A69A", name: "teal-400" }, // Material Design Teal 400
      { shade: 500, hex: "#009688", name: "teal-500" }, // Material Design Teal 500 (Primary)
      { shade: 600, hex: "#00897B", name: "teal-600" }, // Material Design Teal 600
      { shade: 700, hex: "#00796B", name: "teal-700" }, // Material Design Teal 700
      { shade: 800, hex: "#00695C", name: "teal-800" }, // Material Design Teal 800
      { shade: 900, hex: "#004D40", name: "teal-900" }, // Material Design Teal 900
      { shade: 950, hex: "#042F2E", name: "teal-950" }, // Tailwind Teal 950 (darkest)
    ],
  },
  {
    name: "Cyan",
    colors: [
      { shade: 50, hex: "#E0F7FA", name: "cyan-50" }, // Material Design Cyan 50
      { shade: 100, hex: "#B2EBF2", name: "cyan-100" }, // Material Design Cyan 100
      { shade: 200, hex: "#80DEEA", name: "cyan-200" }, // Material Design Cyan 200
      { shade: 300, hex: "#4DD0E1", name: "cyan-300" }, // Material Design Cyan 300
      { shade: 400, hex: "#26C6DA", name: "cyan-400" }, // Material Design Cyan 400
      { shade: 500, hex: "#00BCD4", name: "cyan-500" }, // Material Design Cyan 500 (Primary)
      { shade: 600, hex: "#00ACC1", name: "cyan-600" }, // Material Design Cyan 600
      { shade: 700, hex: "#0097A7", name: "cyan-700" }, // Material Design Cyan 700
      { shade: 800, hex: "#00838F", name: "cyan-800" }, // Material Design Cyan 800
      { shade: 900, hex: "#006064", name: "cyan-900" }, // Material Design Cyan 900
      { shade: 950, hex: "#083344", name: "cyan-950" }, // Tailwind Cyan 950 (darkest)
    ],
  },
  {
    name: "Light Blue",
    colors: [
      { shade: 50, hex: "#E1F5FE", name: "light-blue-50" }, // Material Design Light Blue 50
      { shade: 100, hex: "#B3E5FC", name: "light-blue-100" }, // Material Design Light Blue 100
      { shade: 200, hex: "#81D4FA", name: "light-blue-200" }, // Material Design Light Blue 200
      { shade: 300, hex: "#4FC3F7", name: "light-blue-300" }, // Material Design Light Blue 300
      { shade: 400, hex: "#29B6F6", name: "light-blue-400" }, // Material Design Light Blue 400
      { shade: 500, hex: "#03A9F4", name: "light-blue-500" }, // Material Design Light Blue 500 (Primary)
      { shade: 600, hex: "#039BE5", name: "light-blue-600" }, // Material Design Light Blue 600
      { shade: 700, hex: "#0288D1", name: "light-blue-700" }, // Material Design Light Blue 700
      { shade: 800, hex: "#0277BD", name: "light-blue-800" }, // Material Design Light Blue 800
      { shade: 900, hex: "#01579B", name: "light-blue-900" }, // Material Design Light Blue 900
      { shade: 950, hex: "#0C2766", name: "light-blue-950" }, // Tailwind Sky 950 (darkest)
    ],
  },
  {
    name: "Blue",
    colors: [
      { shade: 50, hex: "#E3F2FD", name: "blue-50" }, // Material Design Blue 50
      { shade: 100, hex: "#BBDEFB", name: "blue-100" }, // Material Design Blue 100
      { shade: 200, hex: "#90CAF9", name: "blue-200" }, // Material Design Blue 200
      { shade: 300, hex: "#64B5F6", name: "blue-300" }, // Material Design Blue 300
      { shade: 400, hex: "#42A5F5", name: "blue-400" }, // Material Design Blue 400
      { shade: 500, hex: "#2196F3", name: "blue-500" }, // Material Design Blue 500 (Primary)
      { shade: 600, hex: "#1E88E5", name: "blue-600" }, // Material Design Blue 600
      { shade: 700, hex: "#1976D2", name: "blue-700" }, // Material Design Blue 700
      { shade: 800, hex: "#1565C0", name: "blue-800" }, // Material Design Blue 800
      { shade: 900, hex: "#0D47A1", name: "blue-900" }, // Material Design Blue 900
      { shade: 950, hex: "#1E3A8A", name: "blue-950" }, // Tailwind Blue 950 (darkest)
    ],
  },
  {
    name: "Indigo",
    colors: [
      { shade: 50, hex: "#E8EAF6", name: "indigo-50" }, // Material Design Indigo 50
      { shade: 100, hex: "#C5CAE9", name: "indigo-100" }, // Material Design Indigo 100
      { shade: 200, hex: "#9FA8DA", name: "indigo-200" }, // Material Design Indigo 200
      { shade: 300, hex: "#7986CB", name: "indigo-300" }, // Material Design Indigo 300
      { shade: 400, hex: "#5C6BC0", name: "indigo-400" }, // Material Design Indigo 400
      { shade: 500, hex: "#3F51B5", name: "indigo-500" }, // Material Design Indigo 500 (Primary)
      { shade: 600, hex: "#3949AB", name: "indigo-600" }, // Material Design Indigo 600
      { shade: 700, hex: "#303F9F", name: "indigo-700" }, // Material Design Indigo 700
      { shade: 800, hex: "#283593", name: "indigo-800" }, // Material Design Indigo 800
      { shade: 900, hex: "#1A237E", name: "indigo-900" }, // Material Design Indigo 900
      { shade: 950, hex: "#1E1B4B", name: "indigo-950" }, // Tailwind Indigo 950 (darkest)
    ],
  },
  {
    name: "Purple",
    colors: [
      { shade: 50, hex: "#F3E5F5", name: "purple-50" }, // Material Design Purple 50
      { shade: 100, hex: "#E1BEE7", name: "purple-100" }, // Material Design Purple 100
      { shade: 200, hex: "#CE93D8", name: "purple-200" }, // Material Design Purple 200
      { shade: 300, hex: "#BA68C8", name: "purple-300" }, // Material Design Purple 300
      { shade: 400, hex: "#AB47BC", name: "purple-400" }, // Material Design Purple 400
      { shade: 500, hex: "#9C27B0", name: "purple-500" }, // Material Design Purple 500 (Primary)
      { shade: 600, hex: "#8E24AA", name: "purple-600" }, // Material Design Purple 600
      { shade: 700, hex: "#7B1FA2", name: "purple-700" }, // Material Design Purple 700
      { shade: 800, hex: "#6A1B9A", name: "purple-800" }, // Material Design Purple 800
      { shade: 900, hex: "#4A148C", name: "purple-900" }, // Material Design Purple 900
      { shade: 950, hex: "#581C87", name: "purple-950" }, // Tailwind Purple 950 (darkest)
    ],
  },
  {
    name: "Fuchsia",
    colors: [
      { shade: 50, hex: "#FDF4FF", name: "fuchsia-50" }, // Tailwind Fuchsia 50
      { shade: 100, hex: "#FAE8FF", name: "fuchsia-100" }, // Tailwind Fuchsia 100
      { shade: 200, hex: "#F5D0FE", name: "fuchsia-200" }, // Tailwind Fuchsia 200
      { shade: 300, hex: "#F0ABFC", name: "fuchsia-300" }, // Tailwind Fuchsia 300
      { shade: 400, hex: "#E879F9", name: "fuchsia-400" }, // Tailwind Fuchsia 400
      { shade: 500, hex: "#D946EF", name: "fuchsia-500" }, // Tailwind Fuchsia 500 (Primary)
      { shade: 600, hex: "#C026D3", name: "fuchsia-600" }, // Tailwind Fuchsia 600
      { shade: 700, hex: "#A21CAF", name: "fuchsia-700" }, // Tailwind Fuchsia 700
      { shade: 800, hex: "#86198F", name: "fuchsia-800" }, // Tailwind Fuchsia 800
      { shade: 900, hex: "#701A75", name: "fuchsia-900" }, // Tailwind Fuchsia 900
      { shade: 950, hex: "#4A044E", name: "fuchsia-950" }, // Tailwind Fuchsia 950 (darkest)
    ],
  },
  {
    name: "Pink",
    colors: [
      { shade: 50, hex: "#FCE4EC", name: "pink-50" }, // Material Design Pink 50
      { shade: 100, hex: "#F8BBD9", name: "pink-100" }, // Material Design Pink 100
      { shade: 200, hex: "#F48FB1", name: "pink-200" }, // Material Design Pink 200
      { shade: 300, hex: "#F06292", name: "pink-300" }, // Material Design Pink 300
      { shade: 400, hex: "#EC407A", name: "pink-400" }, // Material Design Pink 400
      { shade: 500, hex: "#E91E63", name: "pink-500" }, // Material Design Pink 500 (Primary)
      { shade: 600, hex: "#D81B60", name: "pink-600" }, // Material Design Pink 600
      { shade: 700, hex: "#C2185B", name: "pink-700" }, // Material Design Pink 700
      { shade: 800, hex: "#AD1457", name: "pink-800" }, // Material Design Pink 800
      { shade: 900, hex: "#880E4F", name: "pink-900" }, // Material Design Pink 900
      { shade: 950, hex: "#500724", name: "pink-950" }, // Tailwind Pink 950 (darkest)
    ],
  },
  {
    name: "Rose",
    colors: [
      { shade: 50, hex: "#FFF1F2", name: "rose-50" }, // Tailwind Rose 50
      { shade: 100, hex: "#FFE4E6", name: "rose-100" }, // Tailwind Rose 100
      { shade: 200, hex: "#FECDD3", name: "rose-200" }, // Tailwind Rose 200
      { shade: 300, hex: "#FDA4AF", name: "rose-300" }, // Tailwind Rose 300
      { shade: 400, hex: "#FB7185", name: "rose-400" }, // Tailwind Rose 400
      { shade: 500, hex: "#F43F5E", name: "rose-500" }, // Tailwind Rose 500 (Primary)
      { shade: 600, hex: "#E11D48", name: "rose-600" }, // Tailwind Rose 600
      { shade: 700, hex: "#BE123C", name: "rose-700" }, // Tailwind Rose 700
      { shade: 800, hex: "#9F1239", name: "rose-800" }, // Tailwind Rose 800
      { shade: 900, hex: "#881337", name: "rose-900" }, // Tailwind Rose 900
      { shade: 950, hex: "#4C0519", name: "rose-950" }, // Tailwind Rose 950 (darkest)
    ],
  },
  {
    name: "Brown",
    colors: [
      { shade: 50, hex: "#EFEBE9", name: "brown-50" }, // Material Design Brown 50
      { shade: 100, hex: "#D7CCC8", name: "brown-100" }, // Material Design Brown 100
      { shade: 200, hex: "#BCAAA4", name: "brown-200" }, // Material Design Brown 200
      { shade: 300, hex: "#A1887F", name: "brown-300" }, // Material Design Brown 300
      { shade: 400, hex: "#8D6E63", name: "brown-400" }, // Material Design Brown 400
      { shade: 500, hex: "#795548", name: "brown-500" }, // Material Design Brown 500 (Primary)
      { shade: 600, hex: "#6D4C41", name: "brown-600" }, // Material Design Brown 600
      { shade: 700, hex: "#5D4037", name: "brown-700" }, // Material Design Brown 700
      { shade: 800, hex: "#4E342E", name: "brown-800" }, // Material Design Brown 800
      { shade: 900, hex: "#3E2723", name: "brown-900" }, // Material Design Brown 900
      { shade: 950, hex: "#292524", name: "brown-950" }, // Custom Brown 950 (darkest)
    ],
  },
  {
    name: "Stone",
    colors: [
      { shade: 50, hex: "#FAFAF9", name: "stone-50" }, // Tailwind Stone 50 (warm gray)
      { shade: 100, hex: "#F5F5F4", name: "stone-100" }, // Tailwind Stone 100
      { shade: 200, hex: "#E7E5E4", name: "stone-200" }, // Tailwind Stone 200
      { shade: 300, hex: "#D6D3D1", name: "stone-300" }, // Tailwind Stone 300
      { shade: 400, hex: "#A8A29E", name: "stone-400" }, // Tailwind Stone 400
      { shade: 500, hex: "#78716C", name: "stone-500" }, // Tailwind Stone 500 (Primary)
      { shade: 600, hex: "#57534E", name: "stone-600" }, // Tailwind Stone 600
      { shade: 700, hex: "#44403C", name: "stone-700" }, // Tailwind Stone 700
      { shade: 800, hex: "#292524", name: "stone-800" }, // Tailwind Stone 800
      { shade: 900, hex: "#1C1917", name: "stone-900" }, // Tailwind Stone 900
      { shade: 950, hex: "#0C0A09", name: "stone-950" }, // Tailwind Stone 950 (darkest)
    ],
  },
  {
    name: "Gray",
    colors: [
      { shade: 50, hex: "#FAFAFA", name: "gray-50" }, // Material Design Gray 50
      { shade: 100, hex: "#F5F5F5", name: "gray-100" }, // Material Design Gray 100
      { shade: 200, hex: "#EEEEEE", name: "gray-200" }, // Material Design Gray 200
      { shade: 300, hex: "#E0E0E0", name: "gray-300" }, // Material Design Gray 300
      { shade: 400, hex: "#BDBDBD", name: "gray-400" }, // Material Design Gray 400
      { shade: 500, hex: "#9E9E9E", name: "gray-500" }, // Material Design Gray 500 (Primary)
      { shade: 600, hex: "#757575", name: "gray-600" }, // Material Design Gray 600
      { shade: 700, hex: "#616161", name: "gray-700" }, // Material Design Gray 700
      { shade: 800, hex: "#424242", name: "gray-800" }, // Material Design Gray 800
      { shade: 900, hex: "#212121", name: "gray-900" }, // Material Design Gray 900
      { shade: 950, hex: "#030712", name: "gray-950" }, // Tailwind Gray 950 (darkest)
    ],
  },
  {
    name: "Neutral",
    colors: [
      { shade: 50, hex: "#FAFAFA", name: "neutral-50" }, // Tailwind Neutral 50
      { shade: 100, hex: "#F5F5F5", name: "neutral-100" }, // Tailwind Neutral 100
      { shade: 200, hex: "#E5E5E5", name: "neutral-200" }, // Tailwind Neutral 200
      { shade: 300, hex: "#D4D4D4", name: "neutral-300" }, // Tailwind Neutral 300
      { shade: 400, hex: "#A3A3A3", name: "neutral-400" }, // Tailwind Neutral 400
      { shade: 500, hex: "#737373", name: "neutral-500" }, // Tailwind Neutral 500 (Primary)
      { shade: 600, hex: "#525252", name: "neutral-600" }, // Tailwind Neutral 600
      { shade: 700, hex: "#404040", name: "neutral-700" }, // Tailwind Neutral 700
      { shade: 800, hex: "#262626", name: "neutral-800" }, // Tailwind Neutral 800
      { shade: 900, hex: "#171717", name: "neutral-900" }, // Tailwind Neutral 900
      { shade: 950, hex: "#0A0A0A", name: "neutral-950" }, // Tailwind Neutral 950 (darkest)
    ],
  },
  {
    name: "Zinc",
    colors: [
      { shade: 50, hex: "#FAFAFA", name: "zinc-50" }, // Tailwind Zinc 50 (neutral gray)
      { shade: 100, hex: "#F4F4F5", name: "zinc-100" }, // Tailwind Zinc 100
      { shade: 200, hex: "#E4E4E7", name: "zinc-200" }, // Tailwind Zinc 200
      { shade: 300, hex: "#D4D4D8", name: "zinc-300" }, // Tailwind Zinc 300
      { shade: 400, hex: "#A1A1AA", name: "zinc-400" }, // Tailwind Zinc 400
      { shade: 500, hex: "#71717A", name: "zinc-500" }, // Tailwind Zinc 500 (Primary)
      { shade: 600, hex: "#52525B", name: "zinc-600" }, // Tailwind Zinc 600
      { shade: 700, hex: "#3F3F46", name: "zinc-700" }, // Tailwind Zinc 700
      { shade: 800, hex: "#27272A", name: "zinc-800" }, // Tailwind Zinc 800
      { shade: 900, hex: "#18181B", name: "zinc-900" }, // Tailwind Zinc 900
      { shade: 950, hex: "#09090B", name: "zinc-950" }, // Tailwind Zinc 950 (darkest)
    ],
  },
  {
    name: "Slate",
    colors: [
      { shade: 50, hex: "#F8FAFC", name: "slate-50" }, // Tailwind Slate 50 (cool blue-gray)
      { shade: 100, hex: "#F1F5F9", name: "slate-100" }, // Tailwind Slate 100
      { shade: 200, hex: "#E2E8F0", name: "slate-200" }, // Tailwind Slate 200
      { shade: 300, hex: "#CBD5E1", name: "slate-300" }, // Tailwind Slate 300
      { shade: 400, hex: "#94A3B8", name: "slate-400" }, // Tailwind Slate 400
      { shade: 500, hex: "#64748B", name: "slate-500" }, // Tailwind Slate 500 (Primary)
      { shade: 600, hex: "#475569", name: "slate-600" }, // Tailwind Slate 600
      { shade: 700, hex: "#334155", name: "slate-700" }, // Tailwind Slate 700
      { shade: 800, hex: "#1E293B", name: "slate-800" }, // Tailwind Slate 800
      { shade: 900, hex: "#0F172A", name: "slate-900" }, // Tailwind Slate 900
      { shade: 950, hex: "#020617", name: "slate-950" }, // Tailwind Slate 950 (darkest)
    ],
  },
  {
    name: "Blue Gray",
    colors: [
      { shade: 50, hex: "#ECEFF1", name: "blue-gray-50" }, // Material Design Blue Gray 50
      { shade: 100, hex: "#CFD8DC", name: "blue-gray-100" }, // Material Design Blue Gray 100
      { shade: 200, hex: "#B0BEC5", name: "blue-gray-200" }, // Material Design Blue Gray 200
      { shade: 300, hex: "#90A4AE", name: "blue-gray-300" }, // Material Design Blue Gray 300
      { shade: 400, hex: "#78909C", name: "blue-gray-400" }, // Material Design Blue Gray 400
      { shade: 500, hex: "#607D8B", name: "blue-gray-500" }, // Material Design Blue Gray 500 (Primary)
      { shade: 600, hex: "#546E7A", name: "blue-gray-600" }, // Material Design Blue Gray 600
      { shade: 700, hex: "#455A64", name: "blue-gray-700" }, // Material Design Blue Gray 700
      { shade: 800, hex: "#37474F", name: "blue-gray-800" }, // Material Design Blue Gray 800
      { shade: 900, hex: "#263238", name: "blue-gray-900" }, // Material Design Blue Gray 900
      { shade: 950, hex: "#0F172A", name: "blue-gray-950" }, // Custom Blue Gray 950 (darkest)
    ],
  },
];

function ColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleColorClick = async (
    hex: string,
    colorName: string,
    shade: number
  ) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(`${colorName}-${shade}`);

      // Clear the copied state after 1 second
      setTimeout(() => {
        setCopiedColor(null);
      }, 1000);

      console.log(`Copied ${hex} to clipboard`);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-layout">
        <Header />
        <div className="colors-page">
          <div className="colors-container">
            <h1>Color Palette</h1>
            <p className="page-description">
              Explore our 25 comprehensive color scales with 275 total colors
              organized into
              <strong> Colors</strong> and <strong>Neutrals</strong>. Each scale
              includes 11 carefully crafted shades from 50 (lightest) to 950
              (darkest). Click any color to copy its hex value instantly.
            </p>

            <div className="color-scales">
              {/* MAIN COLORS CARD */}
              <div className="color-scale-card">
                <h2 className="color-scale-title">🌈 Colors</h2>
                <p className="color-section-description">
                  19 vibrant colors from warm reds to cool blues and purples
                </p>
                <div className="color-scales-group">
                  {colorScales.slice(0, 19).map((colorScale) => (
                    <div key={colorScale.name} className="color-scale-row">
                      <h3 className="color-scale-name">{colorScale.name}</h3>
                      <div className="color-scale-grid">
                        {colorScale.colors.map((color) => (
                          <div
                            key={`${colorScale.name}-${color.shade}`}
                            className="color-swatch"
                            onClick={() =>
                              handleColorClick(
                                color.hex,
                                colorScale.name,
                                color.shade
                              )
                            }
                            title={`Click to copy ${color.hex}`}
                          >
                            <div
                              className="color-preview"
                              style={{ backgroundColor: color.hex }}
                            >
                              {copiedColor ===
                                `${colorScale.name}-${color.shade}` && (
                                <div className="copied-overlay">copied</div>
                              )}
                            </div>
                            <div className="color-info">
                              <div className="color-shade">{color.shade}</div>
                              <div className="color-hex">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GREY SHADES CARD */}
              <div className="color-scale-card">
                <h2 className="color-scale-title">⚫ Neutrals & Greys</h2>
                <p className="color-section-description">
                  6 sophisticated neutral tones from warm stone to cool
                  blue-grey
                </p>
                <div className="color-scales-group">
                  {colorScales.slice(19).map((colorScale) => (
                    <div key={colorScale.name} className="color-scale-row">
                      <h3 className="color-scale-name">{colorScale.name}</h3>
                      <div className="color-scale-grid">
                        {colorScale.colors.map((color) => (
                          <div
                            key={`${colorScale.name}-${color.shade}`}
                            className="color-swatch"
                            onClick={() =>
                              handleColorClick(
                                color.hex,
                                colorScale.name,
                                color.shade
                              )
                            }
                            title={`Click to copy ${color.hex}`}
                          >
                            <div
                              className="color-preview"
                              style={{ backgroundColor: color.hex }}
                            >
                              {copiedColor ===
                                `${colorScale.name}-${color.shade}` && (
                                <div className="copied-overlay">copied</div>
                              )}
                            </div>
                            <div className="color-info">
                              <div className="color-shade">{color.shade}</div>
                              <div className="color-hex">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function ColorsPageWrapper() {
  return <ColorsPage />;
}
