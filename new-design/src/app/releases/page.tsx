"use client";

import { Header } from "../../components/Header";
import { Container } from "../../components/Container";
import "./page.css";

export default function ReleasesPage() {
  return (
    <div className="page-container">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main>
        <Container>
          <section className="releases-section section-xl">
            <h1 className="releases-title">Release Notes</h1>
            <p className="releases-description">
              Stay updated with the latest features, improvements, and bug fixes
              in ColorKit. Track our development progress and upcoming features.
            </p>

            <div className="releases-placeholder">
              <p>🚀 Release Notes Coming Soon!</p>
              <p>We'll keep you updated with:</p>
              <ul>
                <li>New feature announcements</li>
                <li>Performance improvements</li>
                <li>Bug fixes and stability updates</li>
                <li>Export format additions</li>
                <li>UI/UX enhancements</li>
                <li>Accessibility improvements</li>
                <li>Developer API updates</li>
              </ul>

              <div className="version-preview">
                <h3>Upcoming v1.0.0</h3>
                <p>🎯 MVP Release - Core color picker functionality</p>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
