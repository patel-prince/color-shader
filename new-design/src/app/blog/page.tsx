"use client";

import { Header } from "../../components/Header";
import { Container } from "../../components/Container";
import "./page.css";

export default function BlogPage() {
  return (
    <div className="page-container">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main>
        <Container>
          <section className="blog-section section-xl">
            <h1 className="blog-title">ColorKit Blog</h1>
            <p className="blog-description">
              Learn about color theory, design systems, accessibility, and best
              practices for using colors in web design and development.
            </p>

            <div className="blog-placeholder">
              <p>📝 Blog Coming Soon!</p>
              <p>We're preparing valuable content about:</p>
              <ul>
                <li>Color theory fundamentals</li>
                <li>Building accessible color palettes</li>
                <li>Design system best practices</li>
                <li>CSS custom properties and color management</li>
                <li>Tailwind CSS color configuration</li>
                <li>Color psychology in web design</li>
                <li>Tools and workflows for designers</li>
              </ul>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
