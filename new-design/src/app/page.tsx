"use client";

import { Logo } from "../components/Logo";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import "./page.css";

export default function Home() {
  return (
    <div className="page-container">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main>
        <Container>
          <section className="hero-section section-xl">
            <Logo size={64} />
            <h1 className="hero-title">
              Professional Color Picker & Design System Generator
            </h1>
            <p className="hero-description">
              Create beautiful color palettes, generate CSS variables, export
              Tailwind configs, and build complete design systems for your web
              projects. Free, fast, and accessible color tools for designers and
              developers.
            </p>

            {/* Hero CTA */}
            <Button
              size="lg"
              onClick={() => console.log("Get Started clicked")}
              aria-label="Start using ColorKit color picker tool"
            >
              Get Started
            </Button>
          </section>
        </Container>
      </main>
    </div>
  );
}
