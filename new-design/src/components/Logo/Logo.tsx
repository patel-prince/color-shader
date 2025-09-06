import LogoSymbol from "./LogoSymbol";
import "./Logo.css";

interface LogoProps {
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  size = "md",
  className = "",
  showText = true,
}: LogoProps) {
  if (!showText) {
    return <LogoSymbol size={size} className={className} />;
  }

  // Handle custom number sizes
  const isCustomSize = typeof size === "number";
  const textClass = isCustomSize ? "logo-text-custom" : `logo-text-${size}`;

  // For custom sizes, calculate font properties
  const customStyles = isCustomSize
    ? ({
        "--logo-font-size": `${Math.max(14, size * 0.55)}px`,
        "--logo-font-weight": size >= 48 ? "800" : "700",
      } as React.CSSProperties)
    : {};

  return (
    <div className={`logo ${className}`} style={customStyles}>
      <LogoSymbol size={size} />
      <span className={`logo-text ${textClass}`}>ColorKit</span>
    </div>
  );
}
