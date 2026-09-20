import React, { useState } from "react";
import { useDataset } from "../hooks/useDataset";
import { formatShortDate } from "../utils/date";
import {
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { CategoryBadge } from "../components/common/Badge";

export const ChaptersPage: React.FC = () => {
  const { chapters, receipts, setSelectedReceipt, inspectEvidenceChain } = useDataset();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeChapter = chapters[activeChapterIndex] || chapters[0];
  const activeReceipts = receipts.filter(r =>
    activeChapter?.receiptIds.includes(r.id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Chronological Life Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-sans mt-1">
          Life Chapters
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
          Your digital life segmented into meaningful narrative eras. Boundaries are algorithmically determined by shifts in dominant category variance and temporal rhythm breaks.
        </p>
      </div>

      {/* Chapter Tabs / Memoir Page Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {chapters.map((ch, idx) => {
          const isSelected = idx === activeChapterIndex;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "border-amber-400 bg-neutral-900 shadow-lg shadow-black/40"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/40"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span
                  style={{ color: ch.colorAccent }}
                  className="font-bold uppercase tracking-wider"
                >
                  Chapter 0{idx + 1}
                </span>
                <span className="text-neutral-500">{ch.receiptCount} receipts</span>
              </div>
              <h3 className="text-xs font-semibold text-neutral-100 truncate">
                {ch.title}
              </h3>
              <div className="text-[10px] font-mono text-neutral-400 mt-1">
                {formatShortDate(ch.startDate)} – {formatShortDate(ch.endDate)}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CHAPTER SPOTLIGHT CARD (Memoir Page Layout) */}
      {activeChapter && (
        <div
          className="rounded-2xl border p-6 sm:p-10 space-y-8 transition-colors bg-gradient-to-b from-neutral-900/90 to-neutral-950"
          style={{ borderColor: `${activeChapter.colorAccent}50` }}
        >
          {/* Top Title Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{
                  color: activeChapter.colorAccent,
                  borderColor: `${activeChapter.colorAccent}40`,
                  backgroundColor: `${activeChapter.colorAccent}10`,
                }}
              >
                ERA 0{activeChapterIndex + 1} OF 0{chapters.length}
              </span>

              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatShortDate(activeChapter.startDate)} —{" "}
                  {formatShortDate(activeChapter.endDate)}
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 font-sans tracking-tight">
              {activeChapter.title}
            </h2>
          </div>

          {/* Narrative Paragraph */}
          <div className="border-l-2 pl-4 sm:pl-6 space-y-2" style={{ borderColor: activeChapter.colorAccent }}>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              Memoir Narrative
            </span>
            <p className="text-base sm:text-lg text-neutral-200 font-sans leading-relaxed">
              "{activeChapter.narrative}"
            </p>
          </div>

          {/* Behavioral Shift & Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Observed Behavioral Shift</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {activeChapter.behavioralShift}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                <Tag className="h-3.5 w-3.5" />
                <span>Dominant Core Themes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeChapter.themes.map(t => (
                  <span
                    key={t}
                    className="rounded-md border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 font-mono text-xs text-neutral-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Algorithmic Boundary Determination Explanation */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase text-neutral-400 block font-bold">
              Boundary Formulation Logic:
            </span>
            <p className="text-neutral-300 leading-relaxed font-sans text-xs">
              This chapter transition was triggered by a &gt;45% change in primary category distribution, marking the shift from isolated workstation focus to multi-node collaborative and outdoor activities.
            </p>
          </div>

          {/* Key Receipts within this Chapter */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
                Anchor Receipts in This Era ({activeReceipts.length})
              </span>
              <span className="text-xs font-mono text-neutral-500">
                Click to inspect or follow thread
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeReceipts.map(receipt => (
                <div
                  key={receipt.id}
                  onClick={() => setSelectedReceipt(receipt)}
                  className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={receipt.category} size="sm" />
                    <span className="text-[10px] font-mono text-neutral-500">
                      {formatShortDate(receipt.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-200 truncate">
                    {receipt.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {receipt.description}
                  </p>
                  <div className="pt-1 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-neutral-500 truncate max-w-[130px]">
                      {receipt.location || "San Francisco"}
                    </span>
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

          {/* Chapter Navigation controls */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex(i => Math.max(0, i - 1))}
              className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Chapter</span>
            </button>

            <span className="font-mono text-xs text-neutral-400">
              {activeChapterIndex + 1} / {chapters.length}
            </span>

            <button
              disabled={activeChapterIndex === chapters.length - 1}
              onClick={() => setActiveChapterIndex(i => Math.min(chapters.length - 1, i + 1))}
              className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next Chapter</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
