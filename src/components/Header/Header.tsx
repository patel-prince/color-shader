"use client";

import { Logo } from "../Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Colors", href: "/colors" },
    { name: "Color Picker", href: "/" },
  ];

  return (
    <header className={`${styles.appHeader} ${className}`}>
      <div className={styles.appHeaderContainer}>
        {/* Logo on the left */}
        <div className={styles.headerLogo}>
          <Link href="/" className={styles.logoLink}>
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation menu on the right */}
        <nav
          className={styles.headerNav}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className={styles.navList}>
            {navigation.map((item) => (
              <li key={item.name} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    pathname === item.href ? styles.navLinkActive : ""
                  }`}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
