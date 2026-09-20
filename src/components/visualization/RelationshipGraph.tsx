import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Receipt, Connection, ReceiptCategory } from "../../types";
import { CATEGORY_CONFIGS } from "../../utils/formatting";
import { useDataset } from "../../hooks/useDataset";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ListFilter,
  Eye,
  Info,
  GitFork,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CategoryBadge } from "../common/Badge";

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  degree: number;
  category: ReceiptCategory;
  title: string;
  receipt: Receipt;
}

interface RelationshipGraphProps {
  receipts: Receipt[];
  connections: Connection[];
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  receipts,
  connections,
}) => {
  const { setSelectedReceipt, setSelectedConnection, inspectEvidenceChain } = useDataset();
  const prefersReducedMotion = useReducedMotion();

  const [viewMode, setViewMode] = useState<"graph" | "accessible_list">(
    prefersReducedMotion ? "accessible_list" : "graph"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [hoveredNode, setHoveredNode] = useState<NodePosition | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<Connection | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWidth = 900;
  const canvasHeight = 600;

  // Filter connections and receipts if a category is picked
  const filteredReceipts = useMemo(() => {
    if (selectedCategory === "ALL") return receipts;
    return receipts.filter(r => r.category === selectedCategory);
  }, [receipts, selectedCategory]);

  const filteredConnections = useMemo(() => {
    const validIds = new Set(filteredReceipts.map(r => r.id));
    return connections.filter(c => validIds.has(c.sourceId) && validIds.has(c.targetId));
  }, [connections, filteredReceipts]);

  // Calculate degrees (number of connections) per node
  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of filteredConnections) {
      map.set(c.sourceId, (map.get(c.sourceId) || 0) + 1);
      map.set(c.targetId, (map.get(c.targetId) || 0) + 1);
    }
    return map;
  }, [filteredConnections]);

  // Deterministic initial placement using radial layout grouped by category
  const initialNodes = useMemo<NodePosition[]>(() => {
    const categories = Array.from(new Set(filteredReceipts.map(r => r.category)));
    const total = filteredReceipts.length;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return filteredReceipts.map((receipt, idx) => {
      const catIndex = categories.indexOf(receipt.category);
      const catAngle = (catIndex / Math.max(1, categories.length)) * Math.PI * 2;
      const subAngle = ((idx % 7) / 7) * 0.8 - 0.4;
      const angle = catAngle + subAngle;

      const degree = degreeMap.get(receipt.id) || 1;
      // High degree nodes sit closer to center
      const distance = Math.max(80, 240 - degree * 12) + ((idx * 31) % 50);

      const radius = Math.min(18, Math.max(8, 7 + degree * 1.5));

      return {
        id: receipt.id,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius,
        degree,
        category: receipt.category,
        title: receipt.title,
        receipt,
      };
    });
  }, [filteredReceipts, degreeMap]);

  // Single-step deterministic relaxation for stable positions without jitter
  const nodes = useMemo<NodePosition[]>(() => {
    const simulated = initialNodes.map(n => ({ ...n }));
    const nodeById = new Map(simulated.map(n => [n.id, n]));

    // Light spring forces along edges
    for (const c of filteredConnections) {
      const src = nodeById.get(c.sourceId);
      const tgt = nodeById.get(c.targetId);
      if (src && tgt) {
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const desired = 130 - c.score * 30;
        const force = (dist - desired) * 0.04;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        src.x += fx;
        src.y += fy;
        tgt.x -= fx;
        tgt.y -= fy;
      }
    }

    return simulated;
  }, [initialNodes, filteredConnections]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodePosition>();
    for (const n of nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [nodes]);

  // Pan and drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const categories = ["ALL", ...Array.from(new Set(receipts.map(r => r.category)))];

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-900/60">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-xs font-mono text-neutral-400">
            Domain:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs font-mono text-neutral-200 focus:border-amber-400 focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            ({filteredReceipts.length} nodes · {filteredConnections.length} edges)
          </span>
        </div>

        {/* View Switcher & Canvas Controls */}
        <div className="flex items-center gap-2">
          {viewMode === "graph" && (
            <div className="flex items-center gap-1 border-r border-neutral-800 pr-2">
              <button
                onClick={() => setZoom(z => Math.min(2.2, z + 0.2))}
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
                aria-label="Reset zoom"
                title="Reset zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setViewMode(m => (m === "graph" ? "accessible_list" : "graph"))}
            className="flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-mono text-neutral-200 hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-pressed={viewMode === "accessible_list"}
          >
            {viewMode === "graph" ? (
              <>
                <ListFilter className="h-3.5 w-3.5 text-amber-400" />
                <span>Accessible Table View</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-amber-400" />
                <span>Topological Graph View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GRAPH VIEW */}
      {viewMode === "graph" ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-[540px] sm:h-[620px] rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          tabIndex={0}
          role="region"
          aria-label="Interactive relationship network visualization. Press Tab to access alternative table."
        >
          {/* Legend Banner */}
          <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center gap-3 rounded-lg border border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Node = Receipt</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4 bg-neutral-600" />
              <span>Edge = Affinity</span>
            </span>
            <span className="text-neutral-400">Click node for details · Click edge for why connected</span>
          </div>

          {/* SVG Canvas */}
          <svg
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            className="w-full h-full"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
          >
            <defs>
              <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#262626" />
              </pattern>
            </defs>

            <rect width={canvasWidth} height={canvasHeight} fill="url(#grid-dots)" />

            {/* Edges */}
            <g className="edges">
              {filteredConnections.map(conn => {
                const src = nodeMap.get(conn.sourceId);
                const tgt = nodeMap.get(conn.targetId);
                if (!src || !tgt) return null;

                const isHovered = hoveredEdge?.id === conn.id;
                const isConnectedToHoveredNode =
                  hoveredNode && (hoveredNode.id === conn.sourceId || hoveredNode.id === conn.targetId);

                return (
                  <line
                    key={conn.id}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      isHovered
                        ? "#f59e0b"
                        : isConnectedToHoveredNode
                        ? "#cbd5e1"
                        : "#404040"
                    }
                    strokeWidth={
                      isHovered ? 3 : isConnectedToHoveredNode ? 2 : Math.max(1, conn.score * 2)
                    }
                    strokeOpacity={isHovered ? 1 : isConnectedToHoveredNode ? 0.85 : 0.45}
                    className="cursor-pointer transition-all duration-150"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedConnection(conn);
                    }}
                    onMouseEnter={() => setHoveredEdge(conn)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {nodes.map(node => {
                const config = CATEGORY_CONFIGS[node.category];
                const isHovered = hoveredNode?.id === node.id;
                const isEdgeEndpoint =
                  hoveredEdge && (hoveredEdge.sourceId === node.id || hoveredEdge.targetId === node.id);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedReceipt(node.receipt);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Glow ring on hover */}
                    {(isHovered || isEdgeEndpoint) && (
                      <circle
                        r={node.radius + 6}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ transformOrigin: "0 0" }}
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      r={node.radius}
                      fill={config?.accentHex || "#fbbf24"}
                      stroke="#0a0a0a"
                      strokeWidth="2"
                      className="transition-transform duration-150"
                    />

                    {/* Text Label on High Degree or Hover */}
                    {(node.degree >= 3 || isHovered) && (
                      <text
                        dy={node.radius + 12}
                        textAnchor="middle"
                        fill={isHovered ? "#fbbf24" : "#e5e5e5"}
                        fontSize="10"
                        fontFamily="monospace"
                        className="pointer-events-none drop-shadow"
                      >
                        {node.title.length > 18 ? node.title.slice(0, 16) + "…" : node.title}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Edge Tooltip */}
          {hoveredEdge && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm p-3 rounded-lg border border-amber-400/50 bg-neutral-900/95 backdrop-blur-md shadow-2xl text-xs space-y-1 pointer-events-none">
              <div className="flex items-center justify-between font-mono">
                <span className="text-amber-400 font-bold">Verified Connection</span>
                <span className="text-neutral-400">{Math.round(hoveredEdge.score * 100)}% match</span>
              </div>
              <p className="text-neutral-200">{hoveredEdge.explanation}</p>
              <span className="text-[10px] text-amber-400/90 font-mono block">Click line to inspect modal</span>
            </div>
          )}

          {/* Floating Node Tooltip */}
          {hoveredNode && !hoveredEdge && (
            <div className="absolute top-4 right-4 max-w-xs p-3 rounded-lg border border-neutral-700 bg-neutral-900/95 backdrop-blur-md shadow-2xl text-xs space-y-1 pointer-events-none">
              <div className="flex items-center justify-between">
                <CategoryBadge category={hoveredNode.category} size="sm" />
                <span className="font-mono text-[10px] text-neutral-400">Degree: {hoveredNode.degree} links</span>
              </div>
              <h4 className="font-semibold text-neutral-100">{hoveredNode.title}</h4>
              <p className="text-[11px] text-neutral-400 line-clamp-2">{hoveredNode.receipt.description}</p>
              <span className="text-[10px] text-amber-400 font-mono block pt-0.5">Click node to inspect details</span>
            </div>
          )}
        </div>
      ) : (
        /* ACCESSIBLE TABLE / LIST FALLBACK */
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 border-b border-neutral-800 pb-3">
            <Info className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Accessible Relationship Register. Fully keyboard traversable with complete textual descriptions.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="border-b border-neutral-800 text-[11px] font-mono uppercase text-neutral-400">
                <tr>
                  <th scope="col" className="py-2.5 px-3">
                    Node A (Receipt)
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Relationship Type
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Node B (Connected)
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Affinity
                  </th>
                  <th scope="col" className="py-2.5 px-3">
                    Reason & Explanation
                  </th>
                  <th scope="col" className="py-2.5 px-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {filteredConnections.map(conn => {
                  const src = receipts.find(r => r.id === conn.sourceId);
                  const tgt = receipts.find(r => r.id === conn.targetId);
                  return (
                    <tr key={conn.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          onClick={() => src && setSelectedReceipt(src)}
                          className="font-medium text-neutral-100 hover:text-amber-300 text-left focus-visible:underline"
                        >
                          {src?.title || conn.sourceId}
                        </button>
                        <div className="text-[10px] font-mono text-neutral-400">
                          {src?.category}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-400">
                        {conn.type.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => tgt && setSelectedReceipt(tgt)}
                          className="font-medium text-neutral-100 hover:text-amber-300 text-left focus-visible:underline"
                        >
                          {tgt?.title || conn.targetId}
                        </button>
                        <div className="text-[10px] font-mono text-neutral-400">
                          {tgt?.category}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {Math.round(conn.score * 100)}%
                      </td>
                      <td className="py-3 px-3 text-neutral-300 max-w-xs text-[11px] leading-relaxed">
                        {conn.explanation}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedConnection(conn)}
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-[10px] text-neutral-200 hover:border-amber-400 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                        >
                          Inspect Link
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
