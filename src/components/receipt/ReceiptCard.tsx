import React from "react";
import { Receipt } from "../../types";
import { CategoryBadge } from "../common/Badge";
import { formatEditorialDate } from "../../utils/date";
import { MapPin, Tag, ArrowUpRight, GitBranch, Sparkles } from "lucide-react";
import { useDataset } from "../../hooks/useDataset";

interface ReceiptCardProps {
  receipt: Receipt;
  onSelect?: (receipt: Receipt) => void;
  compact?: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onSelect,
  compact = false,
}) => {
  const { setSelectedReceipt, inspectEvidenceChain, startThread } = useDataset();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(receipt);
    } else {
      setSelectedReceipt(receipt);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={handleCardClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`group relative flex flex-col justify-between rounded-lg border border-neutral-800/90 bg-neutral-900/60 p-4 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/95 hover:shadow-lg hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
        compact ? "space-y-2 p-3" : "space-y-3"
      }`}
      aria-label={`Receipt: ${receipt.title}, Category ${receipt.category}`}
    >
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <CategoryBadge category={receipt.category} size="sm" />
          <time
            dateTime={receipt.timestamp}
            className="font-mono text-[11px] text-neutral-400"
          >
            {formatEditorialDate(receipt.timestamp).split(" · ")[0]}
          </time>
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-neutral-100 text-sm md:text-base leading-snug group-hover:text-amber-300 transition-colors">
          {receipt.title}
        </h3>

        {/* Description */}
        {!compact && (
          <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {receipt.description}
          </p>
        )}
      </div>

      {/* Footer meta & actions */}
      <div className="pt-2 border-t border-neutral-800/60 space-y-2">
        {receipt.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
            <MapPin className="h-3 w-3 text-neutral-500 shrink-0" aria-hidden="true" />
            <span className="truncate">{receipt.location}</span>
          </div>
        )}

        {/* Tags */}
        {receipt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <Tag className="h-2.5 w-2.5 text-neutral-500 mr-0.5" aria-hidden="true" />
            {receipt.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded bg-neutral-800/80 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
              >
                #{tag}
              </span>
            ))}
            {receipt.tags.length > 3 && (
              <span className="text-[10px] font-mono text-neutral-400">
                +{receipt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action triggers */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                inspectEvidenceChain(receipt.id);
              }}
              className="flex items-center gap-1 rounded bg-amber-400/10 px-2 py-1 font-mono text-[10px] text-amber-300 hover:bg-amber-400/20 border border-amber-400/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              title="Inspect Why Did This Matter evidence chain"
            >
              <Sparkles className="h-2.5 w-2.5" />
              <span>Why It Mattered</span>
            </button>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                startThread(receipt.id);
              }}
              className="flex items-center gap-1 rounded bg-neutral-800/90 px-2 py-1 font-mono text-[10px] text-neutral-300 hover:bg-neutral-700/80 border border-neutral-700/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
              title="Follow the Thread through the dataset"
            >
              <GitBranch className="h-2.5 w-2.5 text-neutral-400" />
              <span>Thread</span>
            </button>
          </div>

          <span className="flex items-center gap-0.5 text-[11px] font-mono text-neutral-400 group-hover:text-amber-400 transition-colors">
            <span>Details</span>
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
};
