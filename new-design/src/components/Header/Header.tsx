"use client";

import Link from "next/link";
import { Logo } from "../Logo";
import { Button } from "../Button";
import "./Header.css";

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`header ${className}`} role="banner">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" aria-label="ColorKit homepage">
          <Logo size="md" />
        </Link>

        {/* Navigation Menu */}
        <nav className="nav" role="navigation" aria-label="Main navigation">
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

          {/* CTA Button */}
          <Button
            size="sm"
            onClick={() => console.log("Try Tool clicked")}
            aria-label="Try ColorKit color picker tool"
          >
            Try Tool
          </Button>
        </nav>
      </div>
    </header>
  );
}
