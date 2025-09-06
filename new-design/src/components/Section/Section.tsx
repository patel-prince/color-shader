import "./Section.css";

interface SectionProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Section({
  children,
  spacing = "md",
  className = "",
}: SectionProps) {
  return (
    <section className={`section-${spacing} ${className}`}>{children}</section>
  );
}
