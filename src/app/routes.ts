import { RoutePath } from "../types";

export interface NavRoute {
  path: RoutePath;
  label: string;
  shortLabel: string;
  badge?: string;
  description: string;
  shortcut: string;
}

export const APP_ROUTES: NavRoute[] = [
  {
    path: "/",
    label: "Overview",
    shortLabel: "Home",
    description: "Executive summary, system observations, and macro metrics.",
    shortcut: "1",
  },
  {
    path: "/explore",
    label: "Receipt Archive",
    shortLabel: "Explore",
    badge: "Interactive",
    description: "Search, filter, and inspect individual verifiable transactions.",
    shortcut: "2",
  },
  {
    path: "/connections",
    label: "Relationship Graph",
    shortLabel: "Connections",
    description: "Deterministic graph topology revealing cross-domain links.",
    shortcut: "3",
  },
  {
    path: "/patterns",
    label: "Pattern Intelligence",
    shortLabel: "Patterns",
    description: "Calculated behavioral rhythms, repeated places, and category transitions.",
    shortcut: "4",
  },
  {
    path: "/chapters",
    label: "Life Chapters",
    shortLabel: "Chapters",
    description: "Synthesized chronological eras with narrative evidence.",
    shortcut: "5",
  },
  {
    path: "/story",
    label: "Immersive Story",
    shortLabel: "Story Mode",
    badge: "Signature",
    description: "Seven-stage cinematic sequence bringing your digital life together.",
    shortcut: "6",
  },
];

export function isKnownRoute(path: string): path is RoutePath {
  return APP_ROUTES.some(r => r.path === path);
}
