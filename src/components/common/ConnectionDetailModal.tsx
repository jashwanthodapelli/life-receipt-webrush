import React, { useEffect } from "react";
import { Connection } from "../../types";
import { useDataset } from "../../hooks/useDataset";
import { X, GitFork, ArrowRight, ShieldCheck } from "lucide-react";
import { CategoryBadge } from "./Badge";
import { CONNECTION_TYPE_LABELS } from "../../utils/formatting";

interface ConnectionDetailModalProps {
  connection: Connection | null;
  onClose: () => void;
}

export const ConnectionDetailModal: React.FC<ConnectionDetailModalProps> = ({
  connection,
  onClose,
}) => {
  const { receipts, setSelectedReceipt } = useDataset();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (connection) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [connection, onClose]);

  if (!connection) return null;

  const source = receipts.find(r => r.id === connection.sourceId);
  const target = receipts.find(r => r.id === connection.targetId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connection-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="relative w-full max-w-xl rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-5 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-xs font-bold uppercase text-amber-400">
                <GitFork className="h-3.5 w-3.5" />
                <span>Relationship Verification</span>
              </span>
              <span className="text-neutral-500">·</span>
              <span className="font-mono text-xs text-neutral-400">
                Type: {CONNECTION_TYPE_LABELS[connection.type]}
              </span>
            </div>
            <h3 id="connection-detail-title" className="text-lg font-bold text-neutral-100 font-sans">
              Why Are These Receipts Connected?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The Two Connected Receipts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {source && (
            <div
              onClick={() => {
                setSelectedReceipt(source);
                onClose();
              }}
              className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Node A (Source)</span>
                <CategoryBadge category={source.category} size="sm" />
              </div>
              <h4 className="text-xs font-semibold text-neutral-200">{source.title}</h4>
              <p className="text-[11px] text-neutral-400 line-clamp-2">{source.description}</p>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5 pt-1">
                <span>View Node Details</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </span>
            </div>
          )}

          {target && (
            <div
              onClick={() => {
                setSelectedReceipt(target);
                onClose();
              }}
              className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Node B (Target)</span>
                <CategoryBadge category={target.category} size="sm" />
              </div>
              <h4 className="text-xs font-semibold text-neutral-200">{target.title}</h4>
              <p className="text-[11px] text-neutral-400 line-clamp-2">{target.description}</p>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5 pt-1">
                <span>View Node Details</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </span>
            </div>
          )}
        </div>

        {/* Explanation & Score */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Calculated Affinity Score</span>
            </span>
            <span className="font-mono text-base font-bold text-amber-400">
              {Math.round(connection.score * 100)}% Match
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
            "{connection.explanation}"
          </p>

          {/* Shared Features Chips */}
          {connection.sharedFeatures.length > 0 && (
            <div className="pt-2 border-t border-neutral-800/80">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5">
                Shared Feature Vectors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {connection.sharedFeatures.map((feat, i) => (
                  <span
                    key={i}
                    className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300 border border-neutral-700/60"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
