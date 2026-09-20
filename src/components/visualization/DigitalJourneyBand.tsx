import React from "react";
import { Receipt, LifeChapter } from "../../types";
import { formatShortDate } from "../../utils/date";
import { CATEGORY_CONFIGS } from "../../utils/formatting";
import { useDataset } from "../../hooks/useDataset";
import { Sparkles, Milestone } from "lucide-react";

interface DigitalJourneyBandProps {
  receipts: Receipt[];
  chapters: LifeChapter[];
}

export const DigitalJourneyBand: React.FC<DigitalJourneyBandProps> = ({
  receipts,
  chapters,
}) => {
  const { setSelectedReceipt, inspectEvidenceChain } = useDataset();

  // Pick 4-6 key milestones across the dataset
  const milestoneIndices = [0, 4, 14, 25, 34, receipts.length - 1];
  const milestones = milestoneIndices
    .map(i => receipts[i])
    .filter((r): r is Receipt => Boolean(r));

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-7 space-y-6">
      {/* Title & subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-neutral-200">
              The Digital Journey Topology
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Non-linear journey structure mapped across chapter bands, density clusters, and verified milestones.
          </p>
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          {receipts.length} verified events · {chapters.length} evolutionary eras
        </div>
      </div>

      {/* Chapter Stratum Bands */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
          Geological Chapter Strata
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="rounded-lg border p-3 space-y-1.5 transition-colors"
              style={{
                borderColor: `${ch.colorAccent}40`,
                backgroundColor: `${ch.colorAccent}10`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[10px] uppercase font-bold"
                  style={{ color: ch.colorAccent }}
                >
                  Era 0{idx + 1}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {ch.receiptCount} items
                </span>
              </div>
              <h4 className="text-xs font-bold text-neutral-100 font-sans truncate">
                {ch.title}
              </h4>
              <div className="text-[10px] font-mono text-neutral-400">
                {formatShortDate(ch.startDate)} – {formatShortDate(ch.endDate)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Density & Continuous Category Transition Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>March 01, 2026 (Genesis)</span>
          <span className="uppercase tracking-wider">Continuous Event Flow & Category Gradient</span>
          <span>April 15, 2026 (Synthesis)</span>
        </div>

        {/* Micro-bar strip */}
        <div className="flex h-7 w-full rounded-md border border-neutral-800 bg-neutral-900 overflow-hidden p-0.5 gap-0.5">
          {receipts.map((r, i) => {
            const config = CATEGORY_CONFIGS[r.category];
            return (
              <div
                key={r.id + i}
                onClick={() => setSelectedReceipt(r)}
                title={`${r.title} (${r.category}) · ${formatShortDate(r.timestamp)}`}
                className="flex-1 h-full rounded-sm cursor-pointer transition-transform hover:scale-y-125 hover:z-10"
                style={{
                  backgroundColor: config?.accentHex || "#fbbf24",
                  opacity: 0.85,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Critical Milestones */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300">
          <Milestone className="h-3.5 w-3.5 text-amber-400" />
          <span>Inflection Milestones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map((receipt, index) => (
            <div
              key={receipt.id}
              onClick={() => setSelectedReceipt(receipt)}
              className="group p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold uppercase">Milestone 0{index + 1}</span>
                <span className="text-neutral-400">{formatShortDate(receipt.timestamp)}</span>
              </div>
              <h5 className="text-xs font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                {receipt.title}
              </h5>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {receipt.description}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="truncate">{receipt.location || "San Francisco"}</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    inspectEvidenceChain(receipt.id);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Why It Mattered</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
