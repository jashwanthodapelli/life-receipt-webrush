import React, { useEffect } from "react";
import { Receipt } from "../../types";
import { CategoryBadge } from "./Badge";
import { formatEditorialDate } from "../../utils/date";
import { useDataset } from "../../hooks/useDataset";
import {
  X,
  MapPin,
  Tag,
  GitFork,
  Layers,
  Sparkles,
  GitBranch,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ReceiptDetailModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  receipt,
  onClose,
}) => {
  const { receipts, connections, patterns, inspectEvidenceChain, startThread, setSelectedReceipt, setSelectedConnection } = useDataset();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (receipt) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [receipt, onClose]);

  if (!receipt) return null;

  // Find connections involving this receipt
  const relatedConns = connections.filter(
    c => c.sourceId === receipt.id || c.targetId === receipt.id
  );

  // Find patterns supported by this receipt
  const relatedPatterns = patterns.filter(p =>
    p.supportingReceiptIds.includes(receipt.id)
  );

  // Find adjacent receipts chronologically (nearby events)
  const currentIndex = receipts.findIndex(r => r.id === receipt.id);
  const prevReceipt = currentIndex > 0 ? receipts[currentIndex - 1] : null;
  const nextReceipt = currentIndex < receipts.length - 1 ? receipts[currentIndex + 1] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CategoryBadge category={receipt.category} size="md" />
              <span className="font-mono text-xs text-neutral-400">ID: {receipt.id}</span>
            </div>
            <h2
              id="receipt-detail-title"
              className="text-xl sm:text-2xl font-bold font-sans text-neutral-100"
            >
              {receipt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Highlights */}
        <div className="flex flex-wrap gap-2.5 p-3 rounded-lg border border-amber-400/20 bg-amber-950/20">
          <button
            onClick={() => {
              inspectEvidenceChain(receipt.id);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Why Did This Matter?</span>
          </button>

          <button
            onClick={() => {
              startThread(receipt.id);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <GitBranch className="h-3.5 w-3.5 text-neutral-400" />
            <span>Follow the Thread</span>
          </button>
        </div>

        {/* Full Details Grid */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Verified Description
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed bg-neutral-900/60 p-3 rounded-md border border-neutral-800/80">
              {receipt.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-md bg-neutral-900/40 border border-neutral-800/60">
              <Calendar className="h-4 w-4 text-amber-400/80 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[10px] font-mono uppercase">Timestamp</span>
                <span className="text-neutral-200 font-mono">{formatEditorialDate(receipt.timestamp)}</span>
              </div>
            </div>

            {receipt.location && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-neutral-900/40 border border-neutral-800/60">
                <MapPin className="h-4 w-4 text-amber-400/80 shrink-0" />
                <div>
                  <span className="text-neutral-400 block text-[10px] font-mono uppercase">Location Anchor</span>
                  <span className="text-neutral-200 truncate block">{receipt.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags & Entities */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
              Thematic Descriptors & Entities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {receipt.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-xs text-neutral-300 flex items-center gap-1"
                >
                  <Tag className="h-2.5 w-2.5 text-neutral-500" />
                  #{tag}
                </span>
              ))}
              {receipt.entities?.map(entity => (
                <span
                  key={entity}
                  className="rounded border border-amber-900/40 bg-amber-950/30 px-2 py-0.5 font-mono text-xs text-amber-300"
                >
                  Entity: {entity}
                </span>
              ))}
            </div>
          </div>

          {/* Raw Metadata if available */}
          {receipt.metadata && Object.keys(receipt.metadata).length > 0 && (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                Technical Metadata Payload
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-neutral-900/40 p-2.5 rounded-md border border-neutral-800/80 font-mono text-xs">
                {Object.entries(receipt.metadata).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="text-neutral-400 block text-[10px]">{k}:</span>
                    <span className="text-neutral-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Connections Section */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300">
              <GitFork className="h-3.5 w-3.5 text-amber-400" />
              <span>Discovered Connections ({relatedConns.length})</span>
            </div>
            {relatedConns.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No connections above threshold for this item.</p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {relatedConns.map(conn => {
                  const otherId = conn.sourceId === receipt.id ? conn.targetId : conn.sourceId;
                  const otherReceipt = receipts.find(r => r.id === otherId);
                  return (
                    <div
                      key={conn.id}
                      onClick={() => {
                        setSelectedConnection(conn);
                        onClose();
                      }}
                      className="p-2.5 rounded-md border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-200 truncate">
                          ↔ {otherReceipt?.title || otherId}
                        </span>
                        <span className="font-mono text-amber-400 font-bold">
                          {Math.round(conn.score * 100)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">{conn.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contributing Patterns Section */}
          {relatedPatterns.length > 0 && (
            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span>Supporting Macro Patterns ({relatedPatterns.length})</span>
              </div>
              <div className="space-y-2">
                {relatedPatterns.map(pattern => (
                  <div
                    key={pattern.id}
                    className="p-2.5 rounded-md border border-neutral-800 bg-neutral-900/40 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-200">{pattern.title}</span>
                      <span className="font-mono text-neutral-400 text-[10px]">
                        {Math.round(pattern.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Chronological Events */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Chronological Horizon</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {prevReceipt && (
                <button
                  onClick={() => setSelectedReceipt(prevReceipt)}
                  className="text-left p-2 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 transition-colors"
                >
                  <span className="text-[10px] text-neutral-500 block font-mono">← PRECEDING</span>
                  <span className="font-medium text-neutral-300 truncate block">{prevReceipt.title}</span>
                </button>
              )}
              {nextReceipt && (
                <button
                  onClick={() => setSelectedReceipt(nextReceipt)}
                  className="text-left p-2 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 transition-colors"
                >
                  <span className="text-[10px] text-neutral-500 block font-mono text-right">SUCCEEDING →</span>
                  <span className="font-medium text-neutral-300 truncate block text-right">{nextReceipt.title}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
