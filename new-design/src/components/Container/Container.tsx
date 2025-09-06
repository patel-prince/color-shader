import "./Container.css";

interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Container({
  children,
  size,
  className = "",
}: ContainerProps) {
  const sizeClass = size ? `container-${size}` : "";
  return (
    <div className={`container ${sizeClass} ${className}`}>{children}</div>
  );
}
