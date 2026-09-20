import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  Receipt,
  ReceiptCategory,
  Connection,
  Pattern,
  LifeChapter,
  StoryScene,
  DatasetStats,
  AnalysisOutput,
  ReceiptEvidenceChain,
} from "../types";
import { DEMO_RECEIPTS } from "../data/demo/demoReceipts";
import { analyzeDataset, buildEvidenceChain } from "../utils/analysisPipeline";
import { adaptKaggleDataset } from "../data/datasetAdapter";
import { RawKaggleRecord } from "../data/datasetSchema";

export interface ThreadStep {
  type: "start_receipt" | "connected_receipt" | "pattern" | "chapter";
  id: string;
  title: string;
  subtitle: string;
  category?: ReceiptCategory;
}

interface DatasetContextType {
  // Analyzed Pipeline State
  receipts: Receipt[];
  connections: Connection[];
  patterns: Pattern[];
  chapters: LifeChapter[];
  story: StoryScene[];
  stats: DatasetStats;
  isCustomDataset: boolean;

  // Modals & Active Inspector State
  selectedReceipt: Receipt | null;
  setSelectedReceipt: (receipt: Receipt | null) => void;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;

  // Signature Feature 1: Why Did This Matter?
  activeEvidenceChain: ReceiptEvidenceChain | null;
  inspectEvidenceChain: (receiptId: string) => void;
  clearEvidenceChain: () => void;

  // Signature Feature 2: Follow the Thread
  activeThread: ThreadStep[] | null;
  startThread: (receiptId: string) => void;
  clearThread: () => void;

  // Kaggle Ingestion & Dataset Controls
  importKaggleData: (records: RawKaggleRecord[]) => { importedCount: number; errors: string[] };
  resetToDemoData: () => void;
}

const DatasetContext = createContext<DatasetContextType | null>(null);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawReceipts, setRawReceipts] = useState<Receipt[]>(DEMO_RECEIPTS);
  const [isCustomDataset, setIsCustomDataset] = useState(false);

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeEvidenceChain, setActiveEvidenceChain] = useState<ReceiptEvidenceChain | null>(null);
  const [activeThread, setActiveThread] = useState<ThreadStep[] | null>(null);

  // Memoized deterministic analysis pipeline
  const analysis: AnalysisOutput = useMemo(() => {
    return analyzeDataset(rawReceipts);
  }, [rawReceipts]);

  // Why Did This Matter? Builder
  const inspectEvidenceChain = useCallback((receiptId: string) => {
    const chain = buildEvidenceChain(
      receiptId,
      analysis.receipts,
      analysis.connections,
      analysis.patterns,
      analysis.chapters
    );
    setActiveEvidenceChain(chain);
    const found = analysis.receipts.find(r => r.id === receiptId);
    if (found) {
      setSelectedReceipt(found);
    }
  }, [analysis]);

  const clearEvidenceChain = useCallback(() => {
    setActiveEvidenceChain(null);
  }, []);

  // Follow the Thread Builder
  const startThread = useCallback((receiptId: string) => {
    const startReceipt = analysis.receipts.find(r => r.id === receiptId);
    if (!startReceipt) return;

    // 1. Starting receipt
    const steps: ThreadStep[] = [
      {
        type: "start_receipt",
        id: startReceipt.id,
        title: startReceipt.title,
        subtitle: `${startReceipt.category} · ${startReceipt.location || "Private Venue"}`,
        category: startReceipt.category,
      },
    ];

    // 2. Connected receipt with highest affinity
    const topConn = analysis.connections.find(
      c => c.sourceId === receiptId || c.targetId === receiptId
    );
    if (topConn) {
      const otherId = topConn.sourceId === receiptId ? topConn.targetId : topConn.sourceId;
      const otherReceipt = analysis.receipts.find(r => r.id === otherId);
      if (otherReceipt) {
        steps.push({
          type: "connected_receipt",
          id: otherReceipt.id,
          title: otherReceipt.title,
          subtitle: `${otherReceipt.category} · Score: ${Math.round(topConn.score * 100)}% (${topConn.explanation})`,
          category: otherReceipt.category,
        });
      }
    }

    // 3. Discovered Pattern
    const pattern = analysis.patterns.find(p => p.supportingReceiptIds.includes(receiptId)) || analysis.patterns[0];
    if (pattern) {
      steps.push({
        type: "pattern",
        id: pattern.id,
        title: pattern.title,
        subtitle: pattern.description,
      });
    }

    // 4. Life Chapter
    const chapter = analysis.chapters.find(ch => ch.representativeReceiptIds.includes(receiptId)) || analysis.chapters[0];
    if (chapter) {
      steps.push({
        type: "chapter",
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle,
      });
    }

    setActiveThread(steps);
  }, [analysis]);

  const clearThread = useCallback(() => {
    setActiveThread(null);
  }, []);

  // Kaggle Data Import
  const importKaggleData = useCallback((records: RawKaggleRecord[]) => {
    const res = adaptKaggleDataset(records);
    if (res.receipts.length > 0) {
      setRawReceipts(res.receipts);
      setIsCustomDataset(true);
      setSelectedReceipt(null);
      setSelectedConnection(null);
      setActiveEvidenceChain(null);
      setActiveThread(null);
    }
    return {
      importedCount: res.receipts.length,
      errors: res.parseErrors,
    };
  }, []);

  const resetToDemoData = useCallback(() => {
    setRawReceipts(DEMO_RECEIPTS);
    setIsCustomDataset(false);
    setSelectedReceipt(null);
    setSelectedConnection(null);
    setActiveEvidenceChain(null);
    setActiveThread(null);
  }, []);

  const value: DatasetContextType = {
    receipts: analysis.receipts,
    connections: analysis.connections,
    patterns: analysis.patterns,
    chapters: analysis.chapters,
    story: analysis.story,
    stats: analysis.stats,
    isCustomDataset,

    selectedReceipt,
    setSelectedReceipt,
    selectedConnection,
    setSelectedConnection,

    activeEvidenceChain,
    inspectEvidenceChain,
    clearEvidenceChain,

    activeThread,
    startThread,
    clearThread,

    importKaggleData,
    resetToDemoData,
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

export function useDataset(): DatasetContextType {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}
