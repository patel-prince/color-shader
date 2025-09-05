/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import "../src/styles/globals.css";
import "../src/styles/design-system.css";
import "../src/styles/layout.css";

export const metadata: Metadata = {
  title: {
    default:
      "Color Shader - Professional Color Picker & Design System Generator",
    template: "%s | Color Shader",
  },
  description:
    "Create beautiful color palettes and design systems with our professional color picker tool. Generate CSS variables, semantic colors, and export complete design systems for your projects.",
  keywords: [
    "color picker",
    "design system",
    "color palette",
    "CSS variables",
    "color tool",
    "web design",
    "UI design",
    "color generator",
    "semantic colors",
    "design tokens",
  ],
  authors: [{ name: "Color Shader" }],
  creator: "Color Shader",
  publisher: "Color Shader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://patel-prince.github.io/color-shader"
      : "http://localhost:3000"
  ),
  openGraph: {
    title: "Color Shader - Professional Color Picker & Design System Generator",
    description:
      "Create beautiful color palettes and design systems with our professional color picker tool.",
    url: "/",
    siteName: "Color Shader",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Color Shader - Professional Color Picker Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Shader - Professional Color Picker & Design System Generator",
    description:
      "Create beautiful color palettes and design systems with our professional color picker tool.",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: "NUwjKzx6bHKBmXWIWlpCYZ9nN56R7N41LeerzHLPjDU", // Google Search Console verification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4f39f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Color Shader",
              description:
                "Professional color picker and design system generator tool",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Color Shader",
              },
            }),
          }}
        />
        
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-M4Z1GFJBBQ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M4Z1GFJBBQ');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
