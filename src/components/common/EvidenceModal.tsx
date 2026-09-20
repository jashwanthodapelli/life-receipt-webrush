import React, { useEffect } from "react";
import { ReceiptEvidenceChain } from "../../types";
import { X, Sparkles, ArrowDown, GitFork, Layers, BookOpen, Quote } from "lucide-react";
import { formatEditorialDate } from "../../utils/date";
import { CategoryBadge } from "./Badge";

interface EvidenceModalProps {
  chain: ReceiptEvidenceChain | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ chain, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (chain) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [chain, onClose]);

  if (!chain) return null;

  const { receipt, connections, patterns, chapter, storyInfluence } = chain;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="relative w-full max-w-3xl rounded-xl border border-amber-400/40 bg-neutral-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Signature Inquiry</span>
              </span>
              <span className="text-neutral-500">·</span>
              <span className="font-mono text-xs text-neutral-400">Deterministic Evidence Chain</span>
            </div>
            <h2
              id="evidence-modal-title"
              className="text-2xl sm:text-3xl font-bold font-sans text-neutral-100"
            >
              Why Did This Matter?
            </h2>
            <p className="text-xs text-neutral-400">
              Tracing an individual digital receipt across connections, patterns, chapters, and the overarching story.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The 5-Step Evidence Chain */}
        <div className="space-y-4">
          {/* 1. The Receipt */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                Step 1: The Atomic Moment (Receipt)
              </span>
              <CategoryBadge category={receipt.category} size="sm" />
            </div>
            <h3 className="text-base font-semibold text-neutral-100">{receipt.title}</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{receipt.description}</p>
            <div className="text-[11px] font-mono text-neutral-400 pt-1">
              Recorded at {receipt.location || "Private Venue"} · {formatEditorialDate(receipt.timestamp)}
            </div>
          </div>

          {/* Transition Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 2. Discovered Connection */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400">
              <GitFork className="h-3 w-3" />
              <span>Step 2: Relational Resonance (Connections)</span>
            </div>
            {connections.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs text-neutral-200">
                  Linked to {connections.length} other life events through spatial, temporal, or thematic ties.
                </p>
                <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 font-mono">
                  "{connections[0].explanation}"
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                Operates as an isolated baseline moment, establishing temporal boundaries.
              </p>
            )}
          </div>

          {/* Transition Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 3. Discovered Pattern */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-purple-400">
              <Layers className="h-3 w-3" />
              <span>Step 3: Emergent Habit (Pattern Intelligence)</span>
            </div>
            {patterns.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-neutral-100">{patterns[0].title}</h4>
                  <span className="font-mono text-[10px] text-neutral-400">
                    Method: {patterns[0].detectionMethod.slice(0, 45)}…
                  </span>
                </div>
                <p className="text-xs text-neutral-300">{patterns[0].evidenceExplanation}</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                Acts as a stabilizing intermediate record bridging distinct behavioral bursts.
              </p>
            )}
          </div>

          {/* Transition Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 4. Life Chapter */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              <BookOpen className="h-3 w-3" />
              <span>Step 4: Chronological Era (Life Chapter)</span>
            </div>
            {chapter ? (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-neutral-100">Chapter: "{chapter.title}"</h4>
                <p className="text-xs text-neutral-300">{chapter.narrative}</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Transitional era epoch.</p>
            )}
          </div>

          {/* Transition Arrow */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* 5. Story Influence */}
          <div className="rounded-lg border border-amber-400/40 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300">
              <Quote className="h-3 w-3" />
              <span>Step 5: Narrative Synthesis (The Story Climax)</span>
            </div>
            <p className="text-sm text-neutral-100 font-sans italic leading-relaxed">
              "{storyInfluence}"
            </p>
            <p className="text-[11px] text-amber-400/80 font-mono">
              Proof that transactions are coordinates of attention and devotion.
            </p>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Close Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};
