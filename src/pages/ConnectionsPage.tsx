import React, { useMemo } from "react";
import { useDataset } from "../hooks/useDataset";
import { RelationshipGraph } from "../components/visualization/RelationshipGraph";
import { GitFork, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { CONNECTION_TYPE_LABELS } from "../utils/formatting";

export const ConnectionsPage: React.FC = () => {
  const { receipts, connections, setSelectedConnection } = useDataset();

  // Compute graph statistics
  const graphStats = useMemo(() => {
    const avgScore =
      connections.length > 0
        ? Math.round(
            (connections.reduce((acc, c) => acc + c.score, 0) / connections.length) * 100
          )
        : 0;

    // Find node with highest degree
    const degreeMap: Record<string, number> = {};
    for (const c of connections) {
      degreeMap[c.sourceId] = (degreeMap[c.sourceId] || 0) + 1;
      degreeMap[c.targetId] = (degreeMap[c.targetId] || 0) + 1;
    }
    const topNodeEntry = Object.entries(degreeMap).sort((a, b) => b[1] - a[1])[0];
    const topNode = topNodeEntry ? receipts.find(r => r.id === topNodeEntry[0]) : null;

    // Count by connection type
    const typeCounts: Record<string, number> = {};
    for (const c of connections) {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    }

    return {
      avgScore,
      topNode,
      topNodeDegree: topNodeEntry ? topNodeEntry[1] : 0,
      typeCounts,
    };
  }, [receipts, connections]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <GitFork className="h-3.5 w-3.5" />
          <span>Topological Relationship Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-sans mt-1">
          Discovered Connections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
          A receipt does not exist in isolation. Our deterministic relationship engine connects events through spatial proximity, temporal adjacency, shared entities, and cross-category behavioral loops.
        </p>
      </div>

      {/* Graph Statistics HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">
            Discovered Edges
          </span>
          <div className="font-mono text-2xl font-extrabold text-emerald-400">
            {connections.length}
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            Pruned at threshold ≥ 42% affinity
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">
            Mean Edge Affinity
          </span>
          <div className="font-mono text-2xl font-extrabold text-amber-400">
            {graphStats.avgScore}%
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            Multi-variable weighted cosine metric
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">
            Primary Relational Hub
          </span>
          <div className="text-sm font-bold text-neutral-100 truncate">
            {graphStats.topNode ? graphStats.topNode.title : "None"}
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            {graphStats.topNodeDegree} verified connections
          </p>
        </div>
      </div>

      {/* THE MAIN GRAPH VISUALIZATION & FALLBACK TABLE */}
      <RelationshipGraph receipts={receipts} connections={connections} />

      {/* CONNECTION ENGINE METHODOLOGY EXPLANATION */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-200">
            Deterministic Affinity Scoring Engine Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              1. Spatial Proximity (+0.40)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Events taking place at the exact same geographical coordinate or verified venue anchor.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              2. Temporal Proximity (+0.35)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Events occurring within 90 minutes of each other, or +0.20 when sharing the same calendar date.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              3. Shared Entities (+0.30)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Explicit overlap of named people, hardware, albums, or specific organizational subjects.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              4. Thematic Overlap (+0.15/tag)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Intersection of semantic keywords (e.g. #focus, #coffee, #late-night, #code).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              5. Behavioral Synergy (+0.20)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Coupled cross-domain routines such as Purchases ↔ Music (coffee ritual) or Events ↔ Photos.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1">
            <span className="font-mono text-amber-400 text-[11px] font-bold block">
              6. Pruning Threshold (&lt; 0.42)
            </span>
            <p className="text-neutral-400 leading-relaxed">
              All candidate pairs below 0.42 are discarded to prevent graph clutter and false positives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
