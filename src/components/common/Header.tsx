import React, { useState } from "react";
import { APP_ROUTES } from "../../app/routes";
import { RoutePath } from "../../types";
import { useDataset } from "../../hooks/useDataset";
import {
  FileText,
  GitFork,
  Compass,
  Layers,
  Sparkles,
  BookOpen,
  Menu,
  X,
  RotateCcw,
  UploadCloud,
} from "lucide-react";

interface HeaderProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
  onOpenUpload: () => void;
}

const ROUTE_ICONS: Record<RoutePath, React.FC<{ className?: string }>> = {
  "/": ({ className }) => <Compass className={className} />,
  "/explore": ({ className }) => <FileText className={className} />,
  "/connections": ({ className }) => <GitFork className={className} />,
  "/patterns": ({ className }) => <Layers className={className} />,
  "/chapters": ({ className }) => <BookOpen className={className} />,
  "/story": ({ className }) => <Sparkles className={className} />,
};

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenUpload }) => {
  const { stats, isCustomDataset, resetToDemoData } = useDataset();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: RoutePath) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-neutral-950 focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav("/")}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md py-1"
            aria-label="LIFE//RECEIPT home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-amber-400 shadow-inner group-hover:border-amber-400/60 transition-colors">
              🧾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-widest text-neutral-100 group-hover:text-amber-300 transition-colors">
                  LIFE//RECEIPT
                </span>
                <span className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.2 font-mono text-[10px] text-neutral-400">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 hidden sm:block">Your digital life, decoded.</p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
          {APP_ROUTES.map(route => {
            const isActive = currentPath === route.path;
            const Icon = ROUTE_ICONS[route.path];
            return (
              <button
                key={route.path}
                onClick={() => handleNav(route.path)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? "bg-neutral-800/80 text-amber-300 shadow-sm border border-neutral-700/60"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
                <span>{route.shortLabel}</span>
                {route.badge && (
                  <span
                    className={`ml-0.5 rounded px-1 text-[9px] font-mono uppercase tracking-wider ${
                      route.badge === "Signature"
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {route.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dataset controls & stats pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs text-neutral-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>{stats.totalReceipts} receipts</span>
            <span className="text-neutral-600">/</span>
            <span>{stats.discoveredConnections} connections</span>
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-md border border-neutral-700/70 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-amber-400/50 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
            title="Import Kaggle Dataset"
          >
            <UploadCloud className="h-3.5 w-3.5 text-neutral-400" />
            <span>Adapter</span>
          </button>

          {isCustomDataset && (
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1 rounded-md border border-rose-900/60 bg-rose-950/40 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-900/50 transition-colors"
              title="Reset to deterministic demo dataset"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenUpload}
            className="p-2 rounded-md text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            aria-label="Dataset adapter"
          >
            <UploadCloud className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="rounded-md border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-3 md:hidden space-y-1">
          {APP_ROUTES.map(route => {
            const isActive = currentPath === route.path;
            const Icon = ROUTE_ICONS[route.path];
            return (
              <button
                key={route.path}
                onClick={() => handleNav(route.path)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-neutral-800 text-amber-300 border border-neutral-700"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
                  <span>{route.label}</span>
                </div>
                {route.badge && (
                  <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                    {route.badge}
                  </span>
                )}
              </button>
            );
          })}
          {isCustomDataset && (
            <button
              onClick={() => {
                resetToDemoData();
                setMobileMenuOpen(false);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-rose-800/80 bg-rose-950/50 py-2 text-xs text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Demo Dataset</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
