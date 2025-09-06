interface LogoSymbolProps {
  size?: "sm" | "md" | "lg" | number;
  className?: string;
}

export default function LogoSymbol({
  size = "md",
  className = "",
}: LogoSymbolProps) {
  // Handle both string sizes and custom numbers
  const getHeight = () => {
    if (typeof size === "number") return `${size}px`;

    const sizeMap = {
      sm: "24px",
      md: "32px",
      lg: "40px",
    };
    return sizeMap[size];
  };

  const height = getHeight();

  return (
    <svg
      className={className}
      width={height}
      height={height}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for each square */}
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        <linearGradient id="grad8" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>

        <linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>

      {/* Top Row - Using viewBox coordinates (scales automatically) */}
      <rect x="4" y="4" width="12" height="12" rx="1" fill="url(#grad1)" />
      <rect x="18" y="4" width="12" height="12" rx="1" fill="url(#grad2)" />
      <rect x="32" y="4" width="12" height="12" rx="1" fill="url(#grad3)" />

      {/* Middle Row */}
      <rect x="4" y="18" width="12" height="12" rx="1" fill="url(#grad4)" />
      <rect x="18" y="18" width="12" height="12" rx="1" fill="url(#grad5)" />
      <rect x="32" y="18" width="12" height="12" rx="1" fill="url(#grad6)" />

      {/* Bottom Row */}
      <rect x="4" y="32" width="12" height="12" rx="1" fill="url(#grad7)" />
      <rect x="18" y="32" width="12" height="12" rx="1" fill="url(#grad8)" />
      <rect x="32" y="32" width="12" height="12" rx="1" fill="url(#grad9)" />
    </svg>
  );
}
