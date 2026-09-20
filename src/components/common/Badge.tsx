import React from "react";
import { ReceiptCategory } from "../../types";
import { CATEGORY_CONFIGS } from "../../utils/formatting";

interface BadgeProps {
  category: ReceiptCategory;
  showDot?: boolean;
  size?: "sm" | "md";
}

export const CategoryBadge: React.FC<BadgeProps> = ({
  category,
  showDot = true,
  size = "sm",
}) => {
  const config = CATEGORY_CONFIGS[category] || {
    label: category,
    badgeBg: "bg-neutral-800",
    badgeText: "text-neutral-300",
    borderColor: "border-neutral-700",
    dotColor: "bg-neutral-400",
    accentHex: "#a3a3a3",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-mono font-medium tracking-wide uppercase ${config.badgeBg} ${config.badgeText} ${config.borderColor} ${sizeClasses}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
