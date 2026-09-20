import { ReceiptCategory, ConnectionType } from "../types";

export interface CategoryVisualConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
  accentHex: string;
}

export const CATEGORY_CONFIGS: Record<ReceiptCategory, CategoryVisualConfig> = {
  "Music": {
    label: "Music",
    badgeBg: "bg-emerald-950/60",
    badgeText: "text-emerald-300",
    borderColor: "border-emerald-700/50",
    dotColor: "bg-emerald-400",
    accentHex: "#34d399",
  },
  "Movies & Entertainment": {
    label: "Entertainment",
    badgeBg: "bg-purple-950/60",
    badgeText: "text-purple-300",
    borderColor: "border-purple-700/50",
    dotColor: "bg-purple-400",
    accentHex: "#c084fc",
  },
  "Places": {
    label: "Places",
    badgeBg: "bg-amber-950/60",
    badgeText: "text-amber-300",
    borderColor: "border-amber-700/50",
    dotColor: "bg-amber-400",
    accentHex: "#fbbf24",
  },
  "Purchases": {
    label: "Purchases",
    badgeBg: "bg-rose-950/60",
    badgeText: "text-rose-300",
    borderColor: "border-rose-700/50",
    dotColor: "bg-rose-400",
    accentHex: "#fb7185",
  },
  "Photos": {
    label: "Photos",
    badgeBg: "bg-cyan-950/60",
    badgeText: "text-cyan-300",
    borderColor: "border-cyan-700/50",
    dotColor: "bg-cyan-400",
    accentHex: "#22d3ee",
  },
  "Messages": {
    label: "Messages",
    badgeBg: "bg-blue-950/60",
    badgeText: "text-blue-300",
    borderColor: "border-blue-700/50",
    dotColor: "bg-blue-400",
    accentHex: "#60a5fa",
  },
  "Searches": {
    label: "Searches",
    badgeBg: "bg-indigo-950/60",
    badgeText: "text-indigo-300",
    borderColor: "border-indigo-700/50",
    dotColor: "bg-indigo-400",
    accentHex: "#818cf8",
  },
  "Events": {
    label: "Events",
    badgeBg: "bg-orange-950/60",
    badgeText: "text-orange-300",
    borderColor: "border-orange-700/50",
    dotColor: "bg-orange-400",
    accentHex: "#fb923c",
  },
  "Personal Notes": {
    label: "Notes",
    badgeBg: "bg-zinc-800/80",
    badgeText: "text-zinc-300",
    borderColor: "border-zinc-700/60",
    dotColor: "bg-zinc-400",
    accentHex: "#a1a1aa",
  },
};

export const CONNECTION_TYPE_LABELS: Record<ConnectionType, string> = {
  location_spatial: "Spatial Proximity",
  temporal_proximity: "Temporal Sequence",
  shared_entity: "Shared Subject / Entity",
  thematic_tags: "Thematic Convergence",
  semantic_cross_category: "Cross-Domain Synergy",
  behavioral_sequence: "Habitual Sequence",
};

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

export function formatScorePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}
