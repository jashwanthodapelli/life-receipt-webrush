/**
 * Core Type Definitions for LIFE//RECEIPT
 * Strongly typed domain models for receipts, connections, patterns, chapters, and story.
 */

export type ReceiptCategory =
  | "Music"
  | "Movies & Entertainment"
  | "Places"
  | "Purchases"
  | "Photos"
  | "Messages"
  | "Searches"
  | "Events"
  | "Personal Notes";

export interface Receipt {
  id: string;
  timestamp: string; // ISO 8601 string, e.g. 2026-04-12T19:42:00Z
  category: ReceiptCategory;
  title: string;
  description: string;
  location?: string;
  tags: string[];
  entities?: string[];
  metadata?: Record<string, string | number | boolean>;
}

export type ConnectionType =
  | "location_spatial"
  | "temporal_proximity"
  | "shared_entity"
  | "thematic_tags"
  | "semantic_cross_category"
  | "behavioral_sequence";

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  score: number; // 0 to 1
  type: ConnectionType;
  explanation: string;
  sharedFeatures: string[];
}

export type PatternType =
  | "activity_peak"
  | "repeated_place"
  | "category_relationship"
  | "category_coupling"
  | "time_of_day_rhythm"
  | "circadian_rhythm"
  | "category_shift"
  | "macro_shift";

export interface Pattern {
  id: string;
  type: PatternType;
  title: string;
  description: string;
  confidence: number; // 0 to 1
  evidenceExplanation: string;
  detectionMethod: string;
  supportingReceiptIds: string[];
  metrics?: Record<string, string | number>;
}

export interface LifeChapter {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  receiptCount: number;
  dominantCategories: ReceiptCategory[];
  dominantLocations: string[];
  keyPatternIds: string[];
  representativeReceiptIds: string[];
  receiptIds: string[];
  themes: string[];
  behavioralShift?: string;
  narrative: string;
  colorAccent: string;
}

export type SceneType =
  | "intro"
  | "discovery"
  | "pattern"
  | "connection"
  | "chapter"
  | "reflection"
  | "ending";

export interface StoryScene {
  id: string;
  type: SceneType;
  title: string;
  stage?: string;
  narrative: string;
  insight?: string;
  supportingReceiptIds: string[];
  supportingMetric?: { label: string; value: string };
  highlightReceiptIds: string[];
  associatedChapterId?: string;
  associatedPatternId?: string;
  associatedConnectionId?: string;
}

export interface DatasetStats {
  totalReceipts: number;
  activeDays: number;
  categoryCounts: Record<ReceiptCategory, number>;
  uniqueLocations: number;
  discoveredConnections: number;
  detectedPatterns: number;
  lifeChapters: number;
  dateRange: { start: string; end: string };
  timeOfDayDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  automatedObservations: string[];
}

export interface AnalysisOutput {
  receipts: Receipt[];
  connections: Connection[];
  patterns: Pattern[];
  chapters: LifeChapter[];
  story: StoryScene[];
  stats: DatasetStats;
}

export interface ReceiptEvidenceChain {
  receipt: Receipt;
  connections: Connection[];
  patterns: Pattern[];
  chapter?: LifeChapter;
  storyInfluence: string;
}

export type RoutePath =
  | "/"
  | "/explore"
  | "/connections"
  | "/patterns"
  | "/chapters"
  | "/story";
