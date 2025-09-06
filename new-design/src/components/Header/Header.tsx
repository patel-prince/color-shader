"use client";

import Link from "next/link";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Logo } from "../Logo";
import { Button } from "../Button";
import "./Header.css";

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${className}`} role="banner">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" aria-label="ColorKit homepage" onClick={closeMobileMenu}>
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="nav desktop-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/tool" className="nav-link">
            Tool
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/releases" className="nav-link">
            Releases
          </Link>

          {/* Desktop CTA Button */}
          <Button
            size="sm"
            onClick={() => console.log("Try Tool clicked")}
            aria-label="Try ColorKit color picker tool"
            className="header-cta-button"
          >
            Try Tool
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className="menu-icon" />
          ) : (
            <MenuIcon className="menu-icon" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={closeMobileMenu}>
          <nav
            className="mobile-nav"
            role="navigation"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="mobile-nav-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <CloseIcon className="close-icon" />
            </button>

            {/* Navigation Links */}
            <div className="mobile-nav-links">
              <Link
                href="/"
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/tool"
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Tool
              </Link>
              <Link
                href="/blog"
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
              <Link
                href="/releases"
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Releases
              </Link>
            </div>

            {/* Divider */}
            <div className="mobile-nav-divider"></div>

            {/* Mobile CTA Button */}
            <Button
              size="md"
              onClick={() => {
                console.log("Try Tool clicked");
                closeMobileMenu();
              }}
              aria-label="Try ColorKit color picker tool"
              className="mobile-cta-button"
            >
              Try Tool
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
