"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { ColorPicker, ColorScales } from "../../components/ColorPicker";
import { SemanticPalette } from "../../components/SemanticColors";
import { ExportModal } from "../../components/ExportModal";
import { ColorHistory } from "../../components/ColorHistory";
import { ColorHarmony } from "../../components/ColorHarmony";
import { AccessibilityChecker } from "../../components/AccessibilityChecker";
import "./page.css";

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

// Utility function to convert hex to ColorValue
function hexToColorValue(hex: string): ColorValue {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  // Convert RGB to HSV
  const vNorm = max;
  const sNormHsv = max === 0 ? 0 : (max - min) / max;

  return {
    hex,
    rgb: { r, g, b },
    hsl: { h: h * 360, s: s * 100, l: l * 100 },
    hsv: { h: h * 360, s: sNormHsv * 100, v: vNorm * 100 },
  };
}

function ColorKitApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial values from URL or use defaults
  const getInitialColor = (): ColorValue => {
    const colorParam = searchParams.get("color");
    if (colorParam && /^#[0-9A-F]{6}$/i.test(colorParam)) {
      return hexToColorValue(colorParam);
    }
    return {
      hex: "#3b82f6",
      rgb: { r: 59, g: 130, b: 246 },
      hsl: { h: 217, s: 91, l: 60 },
      hsv: { h: 217, s: 76, v: 96 },
    };
  };

  const getInitialGrayScale = (): string => {
    const grayParam = searchParams.get("gray");
    const validGrayScales = ["slate", "zinc", "gray", "neutral", "stone"];
    return validGrayScales.includes(grayParam || "") ? grayParam! : "slate";
  };

  const [selectedColor, setSelectedColor] = useState<ColorValue>(
    getInitialColor()
  );
  const [selectedGrayScale, setSelectedGrayScale] = useState(
    getInitialGrayScale()
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Update URL when state changes
  const updateURL = useCallback(
    (color: string, grayScale: string) => {
      const params = new URLSearchParams();
      params.set("color", color);
      params.set("gray", grayScale);
      const newURL = `${window.location.pathname}?${params.toString()}`;
      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  const handleColorChange = useCallback(
    (color: ColorValue) => {
      setSelectedColor(color);
      updateURL(color.hex, selectedGrayScale);
    },
    [selectedGrayScale, updateURL]
  );

  const handleGrayScaleChange = useCallback(
    (grayScale: string) => {
      setSelectedGrayScale(grayScale);
      updateURL(selectedColor.hex, grayScale);
    },
    [selectedColor.hex, updateURL]
  );

  // Sync state with URL on mount and URL changes
  useEffect(() => {
    const colorParam = searchParams.get("color");
    const grayParam = searchParams.get("gray");

    if (colorParam && /^#[0-9A-F]{6}$/i.test(colorParam)) {
      const newColor = hexToColorValue(colorParam);
      if (newColor.hex !== selectedColor.hex) {
        setSelectedColor(newColor);
      }
    }

    if (
      grayParam &&
      ["slate", "zinc", "gray", "neutral", "stone"].includes(grayParam)
    ) {
      if (grayParam !== selectedGrayScale) {
        setSelectedGrayScale(grayParam);
      }
    }
  }, [searchParams, selectedColor.hex, selectedGrayScale]);

  const handleCopyLink = async () => {
    try {
      // Use current URL which already has the correct parameters
      const shareableUrl = window.location.href;
      await navigator.clipboard.writeText(shareableUrl);

      // Show temporary success feedback
      const button = document.querySelector(
        ".share-button"
      ) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Link Copied!";
        button.style.backgroundColor = "#22c55e";
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "";
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for older browsers
      const shareableUrl = window.location.href;
      prompt("Copy this link:", shareableUrl);
    }
  };

  const handleShowExportModal = () => {
    setIsExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
  };

  const handleColorSelectFromHistory = useCallback(
    (hex: string) => {
      const newColor = hexToColorValue(hex);
      setSelectedColor(newColor);
      updateURL(hex, selectedGrayScale);
    },
    [selectedGrayScale, updateURL]
  );

  return (
    <>
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main className="tool-page">
        <Container>
          <div className="tool-layout">
            {/* Color Picker Section */}
            <div className="color-picker-section">
              <div className="tool-header">
                <Logo size="lg" className="tool-logo" />
                <div className="tool-actions">
                  <button
                    className="share-button"
                    onClick={handleCopyLink}
                    title="Copy shareable link"
                  >
                    Share Link
                  </button>
                  <button
                    className="export-button"
                    onClick={handleShowExportModal}
                  >
                    Export CSS
                  </button>
                </div>
              </div>

              <div className="color-picker-container">
                <ColorPicker
                  initialColor="#3b82f6"
                  onChange={handleColorChange}
                  showScales={false}
                />
              </div>

              {/* Color History & Favorites */}
              <div className="history-section">
                <ColorHistory
                  currentColor={selectedColor.hex}
                  onColorSelect={handleColorSelectFromHistory}
                />
              </div>
            </div>

            {/* Color Scales and Semantic Colors */}
            <div className="color-scales-section">
              <ColorScales
                color={selectedColor.hex}
                selectedGrayScale={selectedGrayScale}
                onGrayScaleChange={handleGrayScaleChange}
              />

              <div style={{ marginTop: "var(--spacing-6)" }}>
                <SemanticPalette
                  currentColor={selectedColor.hex}
                  selectedGrayScale={selectedGrayScale}
                />
              </div>

              <div style={{ marginTop: "var(--spacing-6)" }}>
                <ColorHarmony
                  baseColor={selectedColor.hex}
                  onColorSelect={handleColorSelectFromHistory}
                />
              </div>

              <div style={{ marginTop: "var(--spacing-6)" }}>
                <AccessibilityChecker baseColor={selectedColor.hex} />
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="seo-content-section">
            <div className="seo-content-card">
              <h2>Professional Color Picker & Design System Generator</h2>
              <p>
                Create stunning color palettes and comprehensive design systems
                with our advanced color picker tool. Generate CSS variables,
                semantic color tokens, and export complete design systems for
                your web projects.
              </p>

              <div className="features-grid">
                <div className="feature-item">
                  <h3>🎨 Advanced Color Picker</h3>
                  <p>
                    Pick colors with precision using our professional-grade
                    color picker with HSL, RGB, and HEX support.
                  </p>
                </div>

                <div className="feature-item">
                  <h3>🎯 Semantic Color System</h3>
                  <p>
                    Generate semantic color roles (primary, secondary, surface,
                    text) that follow design system best practices.
                  </p>
                </div>

                <div className="feature-item">
                  <h3>📊 Color Scale Generation</h3>
                  <p>
                    Automatically generate 50-950 color scales from any base
                    color, perfect for modern design systems.
                  </p>
                </div>

                <div className="feature-item">
                  <h3>💾 CSS Variable Export</h3>
                  <p>
                    Export your color system as CSS custom properties, ready to
                    use in your projects.
                  </p>
                </div>

                <div className="feature-item">
                  <h3>🔗 Shareable Color Palettes</h3>
                  <p>
                    Share your color combinations with team members using
                    shareable URLs.
                  </p>
                </div>

                <div className="feature-item">
                  <h3>📱 Responsive Design</h3>
                  <p>
                    Works perfectly on desktop, tablet, and mobile devices for
                    design on-the-go.
                  </p>
                </div>
              </div>

              <div className="use-cases">
                <h3>Perfect for:</h3>
                <ul>
                  <li>
                    <strong>Web Designers</strong> - Create consistent color
                    schemes for websites
                  </li>
                  <li>
                    <strong>UI/UX Designers</strong> - Build comprehensive
                    design systems
                  </li>
                  <li>
                    <strong>Frontend Developers</strong> - Generate CSS
                    variables and design tokens
                  </li>
                  <li>
                    <strong>Design Teams</strong> - Collaborate on color
                    palettes and share designs
                  </li>
                  <li>
                    <strong>Brand Designers</strong> - Develop brand color
                    guidelines and variations
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </Container>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        selectedColor={selectedColor}
        selectedGrayScale={selectedGrayScale}
      />
    </>
  );
}

export default function ToolPage() {
  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <div className="loading-spinner">Loading ColorKit...</div>
        </div>
      }
    >
      <ColorKitApp />
    </Suspense>
  );
}
