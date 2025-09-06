"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import ColorPicker, { ColorScales } from "../src/components/ColorPicker";
import SemanticColorsModal from "../src/components/Modal/SemanticColorsModal";
import ErrorBoundary from "../src/components/ErrorBoundary";
import { HistoryContainer } from "../src/components/ColorHistory";
import { SemanticPalette } from "../src/components/SemanticColors";
import { useColorHistory } from "../src/components/ColorPicker/hooks/useColorHistory";
import { useUrlParams } from "../src/hooks/useUrlParams";
import { Logo } from "../src/components/Logo";

function ColorShaderApp() {
  // URL parameter management - URL is the single source of truth
  const {
    color: selectedColor,
    grayScale: selectedGrayScale,
    updateColor,
    updateGrayScale,
    getShareableUrl,
  } = useUrlParams();

  const [isSemanticModalOpen, setIsSemanticModalOpen] = useState(false);
  const [semanticPrefix, setSemanticPrefix] = useState("primary");

  // History management
  const { addToHistory } = useColorHistory();
  const previousColorRef = useRef(selectedColor);

  // Add color to history when it changes (with debouncing to avoid spam)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedColor !== previousColorRef.current) {
        addToHistory(selectedColor);
        previousColorRef.current = selectedColor;
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedColor, addToHistory]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isSemanticModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSemanticModalOpen]);

  const handleShowSemanticModal = (prefix: string) => {
    setSemanticPrefix(prefix);
    setIsSemanticModalOpen(true);

    // Track Export CSS button click
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "export_css_clicked", {
        event_category: "engagement",
        event_label: "export_button",
        value: 1,
      });
    }
  };

  const handleCloseSemanticModal = () => {
    setIsSemanticModalOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      const shareableUrl = getShareableUrl();
      await navigator.clipboard.writeText(shareableUrl);

      // Track share link click
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "share_link_clicked", {
          event_category: "engagement",
          event_label: "share_button",
          value: 1,
        });
      }

      // TODO: Add a toast notification for success
      console.log("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for browsers that don't support clipboard API
      const shareableUrl = getShareableUrl();
      prompt("Copy this link:", shareableUrl);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <aside className="app-sider">
          <ErrorBoundary
            fallback={
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Color picker temporarily unavailable
              </div>
            }
          >
            <ColorPicker
              color={selectedColor}
              onChange={updateColor}
              showScales={false}
            />
          </ErrorBoundary>

          {/* History/Favorites in accordion format for all screen sizes */}
          <div className="sidebar-history-section">
            <ErrorBoundary
              fallback={
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  History temporarily unavailable
                </div>
              }
            >
              <HistoryContainer
                currentColor={selectedColor}
                onColorSelect={updateColor}
                isSidebarView={true}
              />
            </ErrorBoundary>
          </div>
        </aside>

        <main className="app-content">
          <div className="app-content-header">
            <Logo size="lg" className="app-title" />
            <div className="header-actions">
              <button
                className="share-button"
                onClick={handleCopyLink}
                title="Copy shareable link"
              >
                Share Link
              </button>
              <button
                className="export-button"
                onClick={() => handleShowSemanticModal("primary")}
              >
                Export CSS
              </button>
            </div>
          </div>

          <ErrorBoundary
            fallback={
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Color scales temporarily unavailable
              </div>
            }
          >
            <ColorScales
              color={selectedColor}
              selectedGrayScale={selectedGrayScale}
              onGrayScaleChange={updateGrayScale}
            />
          </ErrorBoundary>

          <div style={{ marginTop: "var(--spacing-md)" }}>
            <ErrorBoundary
              fallback={
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  Semantic palette temporarily unavailable
                </div>
              }
            >
              <SemanticPalette
                currentColor={selectedColor}
                selectedGrayScale={selectedGrayScale}
              />
            </ErrorBoundary>
          </div>

          {/* SEO Content Section */}
          <section className="seo-content-section">
            <div className="seo-content-card">
              <h2>Professional Color Picker & Design System Generator</h2>
              <p>
                Create stunning color palettes and comprehensive design systems with our advanced color picker tool. 
                Generate CSS variables, semantic color tokens, and export complete design systems for your web projects.
              </p>
              
              <div className="features-grid">
                <div className="feature-item">
                  <h3>🎨 Advanced Color Picker</h3>
                  <p>Pick colors with precision using our professional-grade color picker with HSL, RGB, and HEX support.</p>
                </div>
                
                <div className="feature-item">
                  <h3>🎯 Semantic Color System</h3>
                  <p>Generate semantic color roles (primary, secondary, surface, text) that follow design system best practices.</p>
                </div>
                
                <div className="feature-item">
                  <h3>📊 Color Scale Generation</h3>
                  <p>Automatically generate 50-950 color scales from any base color, perfect for modern design systems.</p>
                </div>
                
                <div className="feature-item">
                  <h3>💾 CSS Variable Export</h3>
                  <p>Export your color system as CSS custom properties, ready to use in your projects.</p>
                </div>
                
                <div className="feature-item">
                  <h3>🔗 Shareable Color Palettes</h3>
                  <p>Share your color combinations with team members using shareable URLs.</p>
                </div>
                
                <div className="feature-item">
                  <h3>📱 Responsive Design</h3>
                  <p>Works perfectly on desktop, tablet, and mobile devices for design on-the-go.</p>
                </div>
              </div>
              
              <div className="use-cases">
                <h3>Perfect for:</h3>
                <ul>
                  <li><strong>Web Designers</strong> - Create consistent color schemes for websites</li>
                  <li><strong>UI/UX Designers</strong> - Build comprehensive design systems</li>
                  <li><strong>Frontend Developers</strong> - Generate CSS variables and design tokens</li>
                  <li><strong>Design Teams</strong> - Collaborate on color palettes and share designs</li>
                  <li><strong>Brand Designers</strong> - Develop brand color guidelines and variations</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
        <SemanticColorsModal
          isOpen={isSemanticModalOpen}
          selectedColor={selectedColor}
          selectedGrayScale={selectedGrayScale}
          variablePrefix={semanticPrefix}
          onClose={handleCloseSemanticModal}
          onPrefixChange={setSemanticPrefix}
        />
      </div>
    </ErrorBoundary>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          Loading Color Shader...
        </div>
      }
    >
      <ColorShaderApp />
    </Suspense>
  );
}
