import React, { useState, useMemo } from "react";
import { useDataset } from "../hooks/useDataset";
import { Receipt, ReceiptCategory } from "../types";
import { ReceiptCard } from "../components/receipt/ReceiptCard";
import { parseISO } from "../utils/date";
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  MapPin,
  Tag,
  ArrowUpDown,
  FileQuestion,
} from "lucide-react";

export const ExplorePage: React.FC = () => {
  const { receipts } = useDataset();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "relevance">("newest");

  // Derive unique categories, locations, and tags for filter dropdowns
  const categories: string[] = ["ALL", ...Array.from(new Set(receipts.map(r => r.category)))];
  const locations: string[] = [
    "ALL",
    ...Array.from(new Set(receipts.map(r => r.location).filter((l): l is string => Boolean(l)))),
  ];
  const tags: string[] = [
    "ALL",
    ...Array.from(new Set(receipts.flatMap(r => r.tags))).sort(),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedLocation("ALL");
    setSelectedTag("ALL");
    setStartDate("");
    setEndDate("");
    setSortOrder("newest");
  };

  // Filtered & Sorted receipts
  const filteredReceipts = useMemo(() => {
    return receipts
      .filter(r => {
        // Category
        if (selectedCategory !== "ALL" && r.category !== selectedCategory) return false;

        // Location
        if (selectedLocation !== "ALL" && r.location !== selectedLocation) return false;

        // Tag
        if (selectedTag !== "ALL" && !r.tags.includes(selectedTag)) return false;

        // Date range
        if (startDate) {
          const rDate = r.timestamp.slice(0, 10);
          if (rDate < startDate) return false;
        }
        if (endDate) {
          const rDate = r.timestamp.slice(0, 10);
          if (rDate > endDate) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          const matchLoc = r.location ? r.location.toLowerCase().includes(q) : false;
          const matchTags = r.tags.some(t => t.toLowerCase().includes(q));
          const matchEntities = r.entities ? r.entities.some(e => e.toLowerCase().includes(q)) : false;

          if (!matchTitle && !matchDesc && !matchLoc && !matchTags && !matchEntities) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
        }
        if (sortOrder === "oldest") {
          return parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime();
        }
        if (sortOrder === "relevance" && searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const aScore = (a.title.toLowerCase().includes(q) ? 3 : 0) + (a.tags.some(t => t.includes(q)) ? 2 : 0);
          const bScore = (b.title.toLowerCase().includes(q) ? 3 : 0) + (b.tags.some(t => t.includes(q)) ? 2 : 0);
          return bScore - aScore;
        }
        return 0;
      });
  }, [receipts, searchQuery, selectedCategory, selectedLocation, selectedTag, startDate, endDate, sortOrder]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "ALL" ||
    selectedLocation !== "ALL" ||
    selectedTag !== "ALL" ||
    startDate ||
    endDate;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Verified Event Stream</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-sans mt-1">
          Explore Receipts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
          Inspect atomic digital records. Search across transcripts, filter by spatial anchors and thematic tags, and activate deep relational tracing.
        </p>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 space-y-4 shadow-sm">
        {/* Top search bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search receipts, entities, notes, places, or tags (e.g. coffee, ambient, library)..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2.5 pl-9 pr-4 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
              <label htmlFor="sort-select" className="text-neutral-400 text-[11px] font-mono">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as "newest" | "oldest" | "relevance")}
                className="bg-transparent font-mono text-neutral-200 focus:outline-none"
              >
                <option value="newest" className="bg-neutral-900">Newest First</option>
                <option value="oldest" className="bg-neutral-900">Oldest First</option>
                <option value="relevance" className="bg-neutral-900">Search Relevance</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-mono text-neutral-300 hover:bg-neutral-700 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary filter selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category-select" className="text-[10px] font-mono uppercase text-neutral-400">
              Domain Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-2 text-neutral-200 focus:border-amber-400 focus:outline-none font-mono"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label htmlFor="location-select" className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Spatial Anchor</span>
            </label>
            <select
              id="location-select"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-2 text-neutral-200 focus:border-amber-400 focus:outline-none font-mono"
            >
              {locations.map(loc => (
                <option key={loc} value={loc} className="bg-neutral-900">
                  {loc.length > 28 ? loc.slice(0, 26) + "…" : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div className="space-y-1">
            <label htmlFor="tag-select" className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Thematic Tag</span>
            </label>
            <select
              id="tag-select"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-2 text-neutral-200 focus:border-amber-400 focus:outline-none font-mono"
            >
              {tags.map(t => (
                <option key={t} value={t} className="bg-neutral-900">
                  {t === "ALL" ? "ALL" : `#${t}`}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filter */}
          <div className="space-y-1">
            <label htmlFor="start-date-input" className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Date Window</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-1/2 rounded-md border border-neutral-800 bg-neutral-950 p-1.5 text-[11px] font-mono text-neutral-200 focus:border-amber-400 focus:outline-none"
                aria-label="Start date filter"
              />
              <span className="text-neutral-600 text-xs">-</span>
              <input
                id="end-date-input"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-1/2 rounded-md border border-neutral-800 bg-neutral-950 p-1.5 text-[11px] font-mono text-neutral-200 focus:border-amber-400 focus:outline-none"
                aria-label="End date filter"
              />
            </div>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
          <div>
            Showing <span className="text-amber-400 font-bold">{filteredReceipts.length}</span> of{" "}
            <span>{receipts.length}</span> receipts
          </div>
          {hasActiveFilters && (
            <div className="text-[11px] text-neutral-500">
              Active filters applied
            </div>
          )}
        </div>
      </div>

      {/* RECEIPT CARDS GRID */}
      {filteredReceipts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceipts.map(receipt => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-12 text-center space-y-3">
          <FileQuestion className="h-8 w-8 text-neutral-500 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-200 font-sans">
            No receipts match your filter criteria
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try resetting your search query or broadening the date and category filters.
          </p>
          <button
            onClick={resetFilters}
            className="rounded-md bg-neutral-800 px-4 py-2 text-xs font-mono text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
