import React from "react";
import { RoutePath } from "../../types";

interface FooterProps {
  currentPath?: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPath, onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-neutral-800/80 bg-neutral-950/60 py-12 text-xs text-neutral-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800/60">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-neutral-200">
                LIFE//RECEIPT
              </span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-amber-400/90">
                Deterministic Client-Side Architecture
              </span>
            </div>
            <p className="text-neutral-400 max-w-md leading-relaxed">
              Every receipt is an isolated artifact. When connected through space, time, entities, and routines, they uncover the true contours of personal history.
            </p>
            <div className="text-[11px] text-neutral-500 font-mono">
              Pure Frontend Evaluation Engine · Zero Backend · Zero AI APIs · 100% Deterministic Algorithms
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("/")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline"
                >
                  Overview & Findings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("/explore")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline"
                >
                  Receipt Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("/connections")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline"
                >
                  Relationship Graph
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("/patterns")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline"
                >
                  Pattern Intelligence
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
              Narrative Engine
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("/chapters")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline"
                >
                  Life Chapters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("/story")}
                  className="hover:text-amber-300 transition-colors focus-visible:underline text-amber-400/90"
                >
                  Immersive Story Mode ✦
                </button>
              </li>
              <li className="pt-2">
                <span className="inline-block rounded border border-neutral-800 bg-neutral-900 px-2 py-1 font-mono text-[10px] text-neutral-400">
                  WCAG AA Compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <p>© 2026 LIFE//RECEIPT. Built with strict TypeScript, Vite & Tailwind CSS.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Graph Complexity: O(N²)</span>
            <span>·</span>
            <span>Deterministic Seed: Verified</span>
            <span>·</span>
            <span>Kaggle Schema Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
