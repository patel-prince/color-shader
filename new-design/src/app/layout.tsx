import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColorKit - Professional Color Picker & Design System Generator",
  description:
    "Create beautiful color palettes and design systems with ColorKit. Generate CSS variables, Tailwind configs, and export complete design systems for your projects.",
  keywords: [
    "color picker",
    "design system",
    "color palette generator",
    "CSS variables",
    "Tailwind config",
    "color tool",
    "web design",
    "UI colors",
    "color scheme",
    "brand colors",
    "hex colors",
    "RGB colors",
    "HSL colors",
    "color harmony",
    "accessibility colors",
    "WCAG colors",
    "contrast checker",
    "color export",
    "design tokens",
    "color management",
  ],
  authors: [{ name: "ColorKit Team" }],
  creator: "ColorKit",
  publisher: "ColorKit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kreattixcom.github.io/colorkit",
    siteName: "ColorKit",
    title: "ColorKit - Professional Color Picker & Design System Generator",
    description:
      "Create beautiful color palettes and design systems with ColorKit. Generate CSS variables, Tailwind configs, and export complete design systems for your projects.",
    images: [
      {
        url: "https://kreattixcom.github.io/colorkit/og-image.png",
        width: 1200,
        height: 630,
        alt: "ColorKit - Professional Color Picker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorKit - Professional Color Picker & Design System Generator",
    description:
      "Create beautiful color palettes and design systems with ColorKit. Generate CSS variables, Tailwind configs, and export complete design systems for your projects.",
    images: ["https://kreattixcom.github.io/colorkit/twitter-image.png"],
    creator: "@colorkit",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://kreattixcom.github.io/colorkit",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ColorKit",
    alternateName: "ColorKit - Color Picker Tool",
    description:
      "Professional color picker and design system generator. Create beautiful color palettes, generate CSS variables, Tailwind configs, and export complete design systems.",
    url: "https://kreattixcom.github.io/colorkit",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    browserRequirements:
      "Requires JavaScript. Supports Chrome, Firefox, Safari, Edge.",
    softwareVersion: "1.0.0",
    datePublished: "2024-12-19",
    dateModified: "2024-12-19",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "ColorKit Team",
      url: "https://kreattixcom.github.io/colorkit",
    },
    featureList: [
      "Interactive Color Picker",
      "Color Palette Generator",
      "CSS Variables Export",
      "Tailwind Config Export",
      "Design System Generator",
      "Color Accessibility Checker",
      "Multiple Color Formats (HEX, RGB, HSL)",
      "Real-time Color Preview",
    ],
    screenshot: "https://kreattixcom.github.io/colorkit/screenshot.png",
    sameAs: ["https://github.com/kreattixcom/colorkit"],
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
