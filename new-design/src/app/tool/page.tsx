"use client";

import { Header } from "../../components/Header";
import { Container } from "../../components/Container";
import "./page.css";

export default function ToolPage() {
  return (
    <div className="page-container">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main>
        <Container>
          <section className="tool-section section-xl">
            <h1 className="tool-title">Color Picker Tool</h1>
            <p className="tool-description">
              Professional color picker and palette generator. Create beautiful
              color schemes, export CSS variables, generate Tailwind configs,
              and build complete design systems.
            </p>

            <div className="tool-placeholder">
              <p>🎨 Color Picker Tool Coming Soon!</p>
              <p>This will be the main color picker interface with:</p>
              <ul>
                <li>Interactive color wheel and sliders</li>
                <li>Color palette generation</li>
                <li>Multiple export formats (CSS, SCSS, JSON, Tailwind)</li>
                <li>Real-time preview</li>
                <li>Accessibility checker</li>
              </ul>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
