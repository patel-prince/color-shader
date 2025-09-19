import { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Color Palette - 275 Professional Colors",
  description:
    "Browse our curated collection of 275 professional colors across 25 distinct scales. Featuring industry-standard Material Design and Tailwind CSS palettes with complete 11-shade ranges (50-950). Essential resource for designers and developers.",
  keywords: [
    "color palette",
    "material design colors",
    "tailwind css colors",
    "color library",
    "professional colors",
    "color swatches",
    "neutral colors",
    "hex colors",
    "color reference",
    "design colors",
  ],
  openGraph: {
    title: "Color Palette - 275 Professional Colors | Color Shader",
    description:
      "Browse our curated collection of 275 professional colors across 25 distinct scales. Industry-standard palettes with complete 11-shade ranges, essential for design projects.",
    url: "https://patel-prince.github.io/color-shader/colors/",
    siteName: "Color Shader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette - 275 Professional Colors | Color Shader",
    description:
      "Browse our curated collection of 275 professional colors across 25 distinct scales. Complete palettes with 11-shade ranges.",
  },
  alternates: {
    canonical: "https://patel-prince.github.io/color-shader/colors/",
  },
};

export default function ColorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Color Palette - 275 Professional Colors",
    description:
      "Browse our curated collection of 275 professional colors organized in 25 distinct scales. Industry-standard Material Design and Tailwind CSS palettes with complete 11-shade ranges (50-950).",
    url: "https://patel-prince.github.io/color-shader/colors/",
    mainEntity: {
      "@type": "CreativeWork",
      name: "Professional Color Palette Collection",
      description:
        "A comprehensive collection of 275 professional colors in 25 scales, including vibrant colors and neutral tones",
      about: "Color palette design tool for web developers and designers",
      keywords:
        "color palette, design colors, web colors, material design, tailwind css",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://patel-prince.github.io/color-shader/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Color Palette",
          item: "https://patel-prince.github.io/color-shader/colors/",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
