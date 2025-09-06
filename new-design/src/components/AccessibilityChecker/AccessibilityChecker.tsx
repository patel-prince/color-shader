"use client";

import { useState, useMemo, useCallback } from "react";
import "./AccessibilityChecker.css";

interface AccessibilityCheckerProps {
  baseColor: string;
  className?: string;
}

interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

interface ColorTest {
  name: string;
  background: string;
  foreground: string;
  contrast: ContrastResult;
}

export function AccessibilityChecker({
  baseColor,
  className = "",
}: AccessibilityCheckerProps) {
  const [customBackground, setCustomBackground] = useState("#ffffff");
  const [customForeground, setCustomForeground] = useState("#000000");

  // Calculate relative luminance
  const getLuminance = useCallback((hex: string): number => {
    const rgb = {
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255,
    };

    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }, []);

  // Calculate contrast ratio
  const getContrastRatio = useCallback(
    (color1: string, color2: string): number => {
      const lum1 = getLuminance(color1);
      const lum2 = getLuminance(color2);
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    },
    [getLuminance]
  );

  // Evaluate contrast against WCAG standards
  const evaluateContrast = useCallback((ratio: number): ContrastResult => {
    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5,
    };
  }, []);

  // Predefined color tests
  const colorTests = useMemo((): ColorTest[] => {
    const commonBackgrounds = [
      { name: "White Background", color: "#ffffff" },
      { name: "Light Gray", color: "#f8f9fa" },
      { name: "Dark Gray", color: "#343a40" },
      { name: "Black Background", color: "#000000" },
    ];

    const commonForegrounds = [
      { name: "Black Text", color: "#000000" },
      { name: "Dark Gray Text", color: "#212529" },
      { name: "Medium Gray Text", color: "#6c757d" },
      { name: "White Text", color: "#ffffff" },
    ];

    const tests: ColorTest[] = [];

    // Test base color as background
    commonForegrounds.forEach((fg) => {
      const ratio = getContrastRatio(baseColor, fg.color);
      tests.push({
        name: `${fg.name} on Base Color`,
        background: baseColor,
        foreground: fg.color,
        contrast: evaluateContrast(ratio),
      });
    });

    // Test base color as foreground
    commonBackgrounds.forEach((bg) => {
      const ratio = getContrastRatio(bg.color, baseColor);
      tests.push({
        name: `Base Color on ${bg.name}`,
        background: bg.color,
        foreground: baseColor,
        contrast: evaluateContrast(ratio),
      });
    });

    return tests;
  }, [baseColor, getContrastRatio, evaluateContrast]);

  // Custom contrast test
  const customContrastTest = useMemo((): ColorTest => {
    const ratio = getContrastRatio(customBackground, customForeground);
    return {
      name: "Custom Test",
      background: customBackground,
      foreground: customForeground,
      contrast: evaluateContrast(ratio),
    };
  }, [customBackground, customForeground, getContrastRatio, evaluateContrast]);

  const getComplianceLevel = (contrast: ContrastResult): string => {
    if (contrast.aaa) return "AAA";
    if (contrast.aa) return "AA";
    if (contrast.aaaLarge) return "AAA Large";
    if (contrast.aaLarge) return "AA Large";
    return "Fail";
  };

  const getComplianceColor = (contrast: ContrastResult): string => {
    if (contrast.aaa) return "#22c55e"; // Green
    if (contrast.aa) return "#3b82f6"; // Blue
    if (contrast.aaaLarge || contrast.aaLarge) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  return (
    <div className={`accessibility-checker ${className}`}>
      <div className="accessibility-header">
        <h3 className="accessibility-title">Accessibility Checker</h3>
        <p className="accessibility-subtitle">
          WCAG contrast compliance for {baseColor.toUpperCase()}
        </p>
      </div>

      <div className="wcag-standards">
        <div className="standard-item">
          <div className="standard-badge aa">AA</div>
          <div className="standard-info">
            <span className="standard-name">Normal Text</span>
            <span className="standard-ratio">4.5:1 minimum</span>
          </div>
        </div>
        <div className="standard-item">
          <div className="standard-badge aaa">AAA</div>
          <div className="standard-info">
            <span className="standard-name">Enhanced</span>
            <span className="standard-ratio">7:1 minimum</span>
          </div>
        </div>
        <div className="standard-item">
          <div className="standard-badge large">Large</div>
          <div className="standard-info">
            <span className="standard-name">Large Text</span>
            <span className="standard-ratio">3:1 minimum</span>
          </div>
        </div>
      </div>

      <div className="custom-test-section">
        <h4 className="section-title">Custom Contrast Test</h4>
        <div className="custom-inputs">
          <div className="input-group">
            <label htmlFor="bg-color">Background</label>
            <div className="color-input-wrapper">
              <input
                id="bg-color"
                type="color"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
                className="color-picker-input"
              />
              <input
                type="text"
                value={customBackground}
                onChange={(e) => {
                  if (isValidHex(e.target.value)) {
                    setCustomBackground(e.target.value);
                  }
                }}
                className="hex-input"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="fg-color">Foreground</label>
            <div className="color-input-wrapper">
              <input
                id="fg-color"
                type="color"
                value={customForeground}
                onChange={(e) => setCustomForeground(e.target.value)}
                className="color-picker-input"
              />
              <input
                type="text"
                value={customForeground}
                onChange={(e) => {
                  if (isValidHex(e.target.value)) {
                    setCustomForeground(e.target.value);
                  }
                }}
                className="hex-input"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <div className="contrast-result">
          <div
            className="contrast-preview"
            style={{
              backgroundColor: customContrastTest.background,
              color: customContrastTest.foreground,
            }}
          >
            <span className="preview-text">Sample Text</span>
            <span className="preview-large">Large Text</span>
          </div>
          <div className="contrast-details">
            <div className="contrast-ratio">
              <span className="ratio-value">
                {customContrastTest.contrast.ratio.toFixed(2)}:1
              </span>
              <span
                className="compliance-badge"
                style={{
                  backgroundColor: getComplianceColor(
                    customContrastTest.contrast
                  ),
                }}
              >
                {getComplianceLevel(customContrastTest.contrast)}
              </span>
            </div>
            <div className="compliance-details">
              <div
                className={`compliance-item ${
                  customContrastTest.contrast.aa ? "pass" : "fail"
                }`}
              >
                AA Normal: {customContrastTest.contrast.aa ? "✓" : "✗"}
              </div>
              <div
                className={`compliance-item ${
                  customContrastTest.contrast.aaa ? "pass" : "fail"
                }`}
              >
                AAA Normal: {customContrastTest.contrast.aaa ? "✓" : "✗"}
              </div>
              <div
                className={`compliance-item ${
                  customContrastTest.contrast.aaLarge ? "pass" : "fail"
                }`}
              >
                AA Large: {customContrastTest.contrast.aaLarge ? "✓" : "✗"}
              </div>
              <div
                className={`compliance-item ${
                  customContrastTest.contrast.aaaLarge ? "pass" : "fail"
                }`}
              >
                AAA Large: {customContrastTest.contrast.aaaLarge ? "✓" : "✗"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="predefined-tests">
        <h4 className="section-title">Common Color Combinations</h4>
        <div className="tests-grid">
          {colorTests.map((test, index) => (
            <div key={index} className="test-item">
              <div
                className="test-preview"
                style={{
                  backgroundColor: test.background,
                  color: test.foreground,
                }}
              >
                <span className="test-text">Aa</span>
              </div>
              <div className="test-info">
                <span className="test-name">{test.name}</span>
                <div className="test-ratio">
                  <span className="ratio-text">
                    {test.contrast.ratio.toFixed(1)}:1
                  </span>
                  <span
                    className="test-badge"
                    style={{
                      backgroundColor: getComplianceColor(test.contrast),
                    }}
                  >
                    {getComplianceLevel(test.contrast)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
