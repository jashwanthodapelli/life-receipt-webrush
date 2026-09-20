import React from "react";
import { useDataset } from "../hooks/useDataset";
import { RoutePath } from "../types";
import { DigitalJourneyBand } from "../components/visualization/DigitalJourneyBand";
import { TimeDistributionBar } from "../components/visualization/TimeDistributionBar";
import {
  FileText,
  Sparkles,
  ArrowRight,
  GitFork,
  Layers,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  FolderSync,
} from "lucide-react";

interface HomePageProps {
  onNavigate: (path: RoutePath) => void;
  onOpenUpload: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenUpload }) => {
  const { receipts, chapters, stats, inspectEvidenceChain } = useDataset();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-6 border-b border-neutral-800/80">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-950/20 px-3 py-1 text-xs font-mono text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Deterministic Digital Archaeology Engine</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-100">
              LIFE<span className="text-amber-400">//</span>RECEIPT
            </h1>
            <p className="font-sans text-xl sm:text-2xl text-neutral-300 font-light tracking-wide">
              Your digital life, decoded.
            </p>
          </div>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Receipts are moments. Connections reveal meaning. Chapters reveal patterns. Your story brings it all together.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate("/explore")}
              className="group flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all shadow-lg shadow-amber-400/10"
            >
              <FileText className="h-4 w-4" />
              <span>Explore My Receipts</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("/story")}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-200 hover:border-amber-400/60 hover:text-amber-300 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Enter Story Mode</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-xs font-mono text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors"
            >
              <FolderSync className="h-4 w-4 text-neutral-500" />
              <span>Import Kaggle Dataset</span>
            </button>
          </div>
        </div>

        {/* METRICS HUD */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Total Receipts</span>
            <div className="font-mono text-2xl font-extrabold text-neutral-100">{stats.totalReceipts}</div>
            <span className="text-[10px] text-neutral-400 font-mono">100% Verified Artifacts</span>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Active Days</span>
            <div className="font-mono text-2xl font-extrabold text-amber-400">{stats.activeDays}</div>
            <span className="text-[10px] text-neutral-400 font-mono">Continuous Span</span>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Domains</span>
            <div className="font-mono text-2xl font-extrabold text-neutral-100">
              {Object.values(stats.categoryCounts).filter(c => c > 0).length}
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">9 Standard Categories</span>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Discovered Links</span>
            <div className="font-mono text-2xl font-extrabold text-emerald-400">{stats.discoveredConnections}</div>
            <span className="text-[10px] text-neutral-400 font-mono">Score ≥ 42% Affinity</span>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Detected Patterns</span>
            <div className="font-mono text-2xl font-extrabold text-purple-400">{stats.detectedPatterns}</div>
            <span className="text-[10px] text-neutral-400 font-mono">Algorithmic Evidence</span>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Life Chapters</span>
            <div className="font-mono text-2xl font-extrabold text-cyan-400">{stats.lifeChapters}</div>
            <span className="text-[10px] text-neutral-400 font-mono">Chronological Eras</span>
          </div>
        </div>
      </section>

      {/* WHAT WE FOUND (AUTOMATED OBSERVATIONS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Automated Synthesis
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-sans mt-0.5">
              WHAT WE FOUND
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            Derived deterministically from log variances
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stats.automatedObservations.map((obs, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 shrink-0 mt-0.5 border border-amber-400/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                  Finding 0{index + 1}
                </span>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                  {obs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIGITAL JOURNEY VISUALIZATION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-sans">
            Your Macro Trajectory
          </h2>
          <button
            onClick={() => onNavigate("/chapters")}
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Inspect All Chapters</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <DigitalJourneyBand receipts={receipts} chapters={chapters} />
      </section>

      {/* TIME OF DAY CIRCADIAN BREAKDOWN */}
      <section>
        <TimeDistributionBar
          distribution={stats.timeOfDayDistribution}
          total={stats.totalReceipts}
        />
      </section>

      {/* SIGNATURE FEATURE SPOTLIGHT */}
      <section className="rounded-xl border border-amber-400/30 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-6 sm:p-8 space-y-5">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Signature Mechanics</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-100">
            Why Did This Matter? & Follow the Thread
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Most digital viewers stop at raw logs. LIFE//RECEIPT constructs an unbroken chain: selecting any receipt generates immediate verification of its connections, patterns, chapter classification, and overarching narrative significance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => inspectEvidenceChain("rcpt-001")}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Test "Why It Mattered" on Genesis Coffee Receipt</span>
          </button>

          <button
            onClick={() => onNavigate("/connections")}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <GitFork className="h-3.5 w-3.5 text-neutral-400" />
            <span>Explore Relationship Graph</span>
          </button>
        </div>
      </section>
    </div>
  );
};
