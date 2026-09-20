import React from "react";
import { useDataset } from "../hooks/useDataset";
import { TimeDistributionBar } from "../components/visualization/TimeDistributionBar";
import { Layers, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { PATTERN_TYPE_ICONS } from "./patternsHelper";

export const PatternsPage: React.FC = () => {
  const { patterns, receipts, stats, setSelectedReceipt, inspectEvidenceChain } = useDataset();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
          <Layers className="h-3.5 w-3.5" />
          <span>Deterministic Behavioral Extraction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-sans mt-1">
          Pattern Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
          Algorithmic detection across activity peaks, repeated physical anchors, cross-domain category couplings, circadian time rhythms, and macro temporal shifts.
        </p>
      </div>

      {/* Circadian Overview Bar */}
      <TimeDistributionBar
        distribution={stats.timeOfDayDistribution}
        total={stats.totalReceipts}
      />

      {/* Detected Patterns List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold font-sans text-neutral-100">
            Detected Macro Patterns ({patterns.length})
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            All backed by verified receipts
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {patterns.map(pattern => {
            const supportingReceipts = receipts.filter(r =>
              pattern.supportingReceiptIds.includes(r.id)
            );

            return (
              <article
                key={pattern.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-7 space-y-4 hover:border-neutral-700 transition-colors"
              >
                {/* Top Badge & Confidence */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded border border-purple-800/60 bg-purple-950/40 px-2.5 py-0.5 font-mono text-xs font-medium uppercase text-purple-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>{pattern.type.replace(/_/g, " ")}</span>
                  </span>

                  <div className="flex items-center gap-3 font-mono text-xs text-neutral-400">
                    <span>
                      Confidence:{" "}
                      <strong className="text-amber-400 font-bold">
                        {Math.round(pattern.confidence * 100)}%
                      </strong>
                    </span>
                    <span>·</span>
                    <span>{pattern.supportingReceiptIds.length} verified events</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-100 font-sans">
                    {pattern.title}
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
                    {pattern.description}
                  </p>
                </div>

                {/* Rigorous Evidence & Method Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                      What Was Detected:
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {pattern.evidenceExplanation}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                      Deterministic Detection Algorithm:
                    </span>
                    <p className="text-neutral-300 font-mono text-[11px] leading-relaxed">
                      {pattern.detectionMethod}
                    </p>
                  </div>
                </div>

                {/* Supporting Receipts Horizontal Carousel */}
                <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Supporting Receipt Evidence ({supportingReceipts.length}):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {supportingReceipts.map(receipt => (
                      <div
                        key={receipt.id}
                        onClick={() => setSelectedReceipt(receipt)}
                        className="min-w-[220px] max-w-[260px] p-2.5 rounded-lg border border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 cursor-pointer transition-colors space-y-1 shrink-0"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400/90 truncate max-w-[120px]">
                            {receipt.category}
                          </span>
                          <span className="text-neutral-500">{receipt.timestamp.slice(5, 10)}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-200 truncate">
                          {receipt.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-neutral-400 truncate max-w-[130px]">
                            {receipt.location || "San Francisco"}
                          </span>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              inspectEvidenceChain(receipt.id);
                            }}
                            className="text-amber-400 hover:text-amber-300"
                            title="Why It Mattered"
                          >
                            <Sparkles className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
