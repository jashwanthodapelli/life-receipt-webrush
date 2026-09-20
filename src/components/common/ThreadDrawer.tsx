import React, { useEffect } from "react";
import { ThreadStep } from "../../hooks/useDataset";
import { useDataset } from "../../hooks/useDataset";
import { X, GitBranch, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { CategoryBadge } from "./Badge";

interface ThreadDrawerProps {
  thread: ThreadStep[] | null;
  onClose: () => void;
}

export const ThreadDrawer: React.FC<ThreadDrawerProps> = ({ thread, onClose }) => {
  const { receipts, setSelectedReceipt, inspectEvidenceChain } = useDataset();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (thread) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [thread, onClose]);

  if (!thread) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="thread-drawer-title"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-neutral-950/95 border-t border-neutral-700 shadow-2xl backdrop-blur-lg"
    >
      <div className="mx-auto max-w-5xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-400 text-neutral-950">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="thread-drawer-title" className="text-sm sm:text-base font-bold text-neutral-100 font-mono">
                  FOLLOW THE THREAD
                </h3>
                <span className="text-[10px] rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-amber-400">
                  Digital Archaeology
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Connected relational trajectory through moments, links, patterns, and life chapters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close thread"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The 4-step horizontal or wrap journey */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {thread.map((step, idx) => {
            const isReceipt = step.type === "start_receipt" || step.type === "connected_receipt";
            return (
              <div
                key={step.id + idx}
                className="relative flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900/70 p-3.5 space-y-2 hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-amber-400" />
                      <span>Stage 0{idx + 1}</span>
                    </span>
                    {step.category && <CategoryBadge category={step.category} size="sm" />}
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-100 leading-snug line-clamp-2">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-3 leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                {isReceipt && (
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
                    <button
                      onClick={() => {
                        const target = receipts.find(r => r.id === step.id);
                        if (target) setSelectedReceipt(target);
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Receipt</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    <button
                      onClick={() => inspectEvidenceChain(step.id)}
                      className="text-neutral-400 hover:text-amber-300"
                      title="Why It Mattered"
                    >
                      <Sparkles className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
