import "./Container.css";

interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Container({
  children,
  size = "lg",
  className = "",
}: ContainerProps) {
  return (
    <div className={`container container-${size} ${className}`}>{children}</div>
  );
}
