import React from "react";

type Variant = "default" | "light" | "gradient";
type Size = "sm" | "md" | "lg";

interface TextDividerProps {
  text: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

const sizeMap: Record<Size, { my: string; text: string }> = {
  sm: { my: "my-4", text: "text-xs" },
  md: { my: "my-6", text: "text-sm" },
  lg: { my: "my-8", text: "text-base" },
};

export default function TextDivider({
  text,
  variant = "default",
  size = "md",
  className = "",
  lineClassName = "",
  textClassName = "",
  Icon,
}: TextDividerProps) {
  const { my, text: textSize } = sizeMap[size];

  const lineBase =
    variant === "gradient"
      ? "h-[2px] bg-gradient-to-r from-brand-navy via-brand-gray to-brand-navy rounded-full"
      : `border-t ${variant === "light" ? "border-gray-200" : "border-gray-300"}`;

  const textBase = variant === "light" ? "text-gray-500" : "text-brand-navy";

  return (
    <div className={`flex items-center justify-start ${my} ${className}`}>
      <span
        className={`mr-4 ${textBase} ${textSize} font-medium tracking-wide flex items-center gap-2 ${textClassName}`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {text}
      </span>
      <div className={`flex-grow ${lineBase} ${lineClassName}`} />
    </div>
  );
}
