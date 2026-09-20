import React, { useState, useEffect, useCallback } from "react";
import { useDataset } from "../hooks/useDataset";
import {
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { CategoryBadge } from "../components/common/Badge";
import { formatShortDate } from "../utils/date";

export const StoryPage: React.FC = () => {
  const { story, receipts, setSelectedReceipt, inspectEvidenceChain } = useDataset();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalScenes = story.length;
  const currentScene = story[currentSceneIndex] || story[0];

  const handleNext = useCallback(() => {
    setCurrentSceneIndex(i => (i < totalScenes - 1 ? i + 1 : 0));
  }, [totalScenes]);

  const handlePrev = useCallback(() => {
    setCurrentSceneIndex(i => (i > 0 ? i - 1 : totalScenes - 1));
  }, [totalScenes]);

  // Keyboard navigation: Left/Right arrows & Space for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay loop timer (6 seconds per stage)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  // Find supporting receipts for current scene
  const supportingReceipts = receipts.filter(r =>
    currentScene.supportingReceiptIds.includes(r.id)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top documentary header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Digital Documentary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-sans mt-0.5">
            Story Mode: The Arc of Attention
          </h1>
        </div>

        {/* Autoplay & Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              isPlaying
                ? "bg-amber-400 text-neutral-950 font-bold"
                : "border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Documentary</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-amber-400" />
                <span>Play Autoplay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stage Stepper Navigation Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {story.map((sc, idx) => {
          const isActive = idx === currentSceneIndex;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setCurrentSceneIndex(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 min-w-[90px] text-left p-2 rounded-lg border transition-all ${
                isActive
                  ? "border-amber-400 bg-neutral-900 text-neutral-100"
                  : "border-neutral-800/80 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300"
              }`}
            >
              <div className="font-mono text-[10px] uppercase font-bold text-amber-400/90">
                0{idx + 1}
              </div>
              <div className="text-[11px] font-medium truncate">{sc.stage}</div>
            </button>
          );
        })}
      </div>

      {/* THE MAIN CINEMATIC DOCUMENTARY VIEWPORT */}
      {currentScene && (
        <article
          className="relative min-h-[440px] rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/95 via-neutral-950 to-neutral-950 p-6 sm:p-12 shadow-2xl flex flex-col justify-between space-y-8"
        >
          {/* Top metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
                STAGE 0{currentSceneIndex + 1} OF 0{totalScenes} · {(currentScene.stage || currentScene.type).toUpperCase()}
              </span>
              <span className="font-mono text-xs text-neutral-500 hidden sm:inline">
                Use Left / Right Arrows to Navigate
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 font-sans tracking-tight leading-tight">
              {currentScene.title}
            </h2>
          </div>

          {/* Narrative Proportions */}
          <div className="space-y-6 max-w-3xl">
            <div className="relative pl-6 border-l-2 border-amber-400">
              <Quote className="absolute -left-3 -top-3 h-6 w-6 text-neutral-800 bg-neutral-950 rounded p-1" />
              <p className="text-base sm:text-xl text-neutral-200 font-sans font-light leading-relaxed">
                "{currentScene.narrative}"
              </p>
            </div>

            {currentScene.insight && (
              <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-950/20 text-xs sm:text-sm text-amber-200 font-mono leading-relaxed">
                <strong>Core Reflection:</strong> {currentScene.insight}
              </div>
            )}
          </div>

          {/* Supporting Evidence Receipts Bar */}
          <div className="space-y-2 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="uppercase tracking-wider">
                Verifiable Historical Footnotes ({supportingReceipts.length}):
              </span>
              <span>Click to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {supportingReceipts.map(receipt => (
                <div
                  key={receipt.id}
                  onClick={() => setSelectedReceipt(receipt)}
                  className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={receipt.category} size="sm" />
                    <span className="text-[10px] font-mono text-neutral-500">
                      {formatShortDate(receipt.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-200 truncate">
                    {receipt.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                    <span className="text-neutral-400 truncate max-w-[130px]">
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
                      <span>Evidence</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentary Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-mono text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Beat</span>
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {story.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSceneIndex(i);
                    setIsPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSceneIndex ? "w-6 bg-amber-400" : "w-2 bg-neutral-700"
                  }`}
                  aria-label={`Go to stage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-mono font-bold text-neutral-950 hover:bg-amber-300 transition-colors"
            >
              <span>{currentSceneIndex === totalScenes - 1 ? "Replay From Start" : "Next Beat"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}
    </div>
  );
};
