import React, { useState, useEffect } from "react";
import { useDataset } from "../../hooks/useDataset";
import { X, UploadCloud, FileCode, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { RawKaggleRecord } from "../../data/datasetSchema";

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_KAGGLE_PAYLOAD: RawKaggleRecord[] = [
  {
    event_id: "kg-001",
    utc_timestamp: "2026-05-01T08:30:00Z",
    category_label: "Purchases",
    headline: "Third Wave Coffee & Brioche",
    details: "Card payment at artisanal roasters in Mission District.",
    location_name: "Ritual Coffee Roasters · Valencia St",
    keywords: ["coffee", "morning", "ritual", "focus"],
    entities_mentioned: ["Ritual Coffee"],
  },
  {
    event_id: "kg-002",
    utc_timestamp: "2026-05-01T09:15:00Z",
    category_label: "Music",
    headline: "Music for Airports (Brian Eno)",
    details: "Streamed complete album during morning planning session.",
    location_name: "Ritual Coffee Roasters · Valencia St",
    keywords: ["ambient", "focus", "deep-work"],
    entities_mentioned: ["Brian Eno"],
  },
  {
    event_id: "kg-003",
    utc_timestamp: "2026-05-02T14:20:00Z",
    category_label: "Searches",
    headline: "Information retrieval graph models",
    details: "Academic queries on bipartite graph topologies and node centrality.",
    location_name: "SF Public Library · Main Branch",
    keywords: ["research", "code", "knowledge-graph"],
    entities_mentioned: ["Knowledge Graphs"],
  },
  {
    event_id: "kg-004",
    utc_timestamp: "2026-05-03T20:00:00Z",
    category_label: "Events",
    headline: "Live Synthesizer Ensemble",
    details: "Evening modular audio performance at Divisadero auditorium.",
    location_name: "The Independent Music Hall · Divisadero",
    keywords: ["music", "concert", "evening"],
    entities_mentioned: ["The Independent Music Hall"],
  },
];

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({ isOpen, onClose }) => {
  const { importKaggleData, resetToDemoData, isCustomDataset } = useDataset();
  const [jsonInput, setJsonInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProcess = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const records = Array.isArray(parsed) ? parsed : (parsed.records || [parsed]);
      const res = importKaggleData(records);

      if (res.importedCount > 0) {
        setStatusMessage({
          type: "success",
          text: `Successfully adapted and analyzed ${res.importedCount} records through the pipeline!`,
        });
      } else {
        setStatusMessage({
          type: "error",
          text: `No valid records adapted. Errors: ${res.errors.join(", ")}`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Invalid JSON format. Please verify standard JSON syntax.",
      });
    }
  };

  const loadSample = () => {
    setJsonInput(JSON.stringify(SAMPLE_KAGGLE_PAYLOAD, null, 2));
    setStatusMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-5 my-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-xs font-bold uppercase text-amber-400">
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Kaggle Dataset Adapter</span>
              </span>
              <span className="text-neutral-500">·</span>
              <span className="font-mono text-xs text-neutral-400">datasetAdapter.ts</span>
            </div>
            <h3 id="upload-modal-title" className="text-lg font-bold text-neutral-100 font-sans">
              Inject Custom or Kaggle Data
            </h3>
            <p className="text-xs text-neutral-400">
              The application normalizes heterogeneous logs (Google Takeout, Apple Health, Spotify Streaming, Kaggle) into the unified Receipt model.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <FileCode className="h-3.5 w-3.5 text-amber-400" />
            <span>Load Kaggle Test Sample</span>
          </button>

          {isCustomDataset && (
            <button
              type="button"
              onClick={() => {
                resetToDemoData();
                setStatusMessage({
                  type: "success",
                  text: "Reset to rich 42-item deterministic demo dataset.",
                });
              }}
              className="flex items-center gap-1 rounded border border-rose-900 bg-rose-950/40 px-3 py-1.5 text-xs font-mono text-rose-300 hover:bg-rose-900/60 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Demo Data</span>
            </button>
          )}
        </div>

        {/* Input box */}
        <div className="space-y-1.5">
          <label htmlFor="kaggle-json-input" className="block text-xs font-mono uppercase text-neutral-400">
            Paste JSON Payload (RawKaggleRecord[]):
          </label>
          <textarea
            id="kaggle-json-input"
            rows={8}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder='[ { "event_id": "kg-01", "utc_timestamp": "...", "category_label": "Music", "headline": "...", "keywords": ["ambient", "focus"] } ]'
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/80 p-3 font-mono text-xs text-neutral-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Status indicator */}
        {statusMessage && (
          <div
            className={`p-3 rounded-md text-xs font-mono flex items-center gap-2 border ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                : "bg-rose-950/60 border-rose-800 text-rose-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleProcess}
            disabled={!jsonInput.trim()}
            className="rounded-md bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Normalize & Run Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
