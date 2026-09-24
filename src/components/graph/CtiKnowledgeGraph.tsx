'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ShieldAlert,
  Bug,
  Crosshair,
  Server,
  Globe,
  Binary,
  AlertTriangle,
  Layers,
  Building2,
  ChevronRight,
  Route,
  Info,
  ExternalLink
} from 'lucide-react';
import { useCTIStore } from '@/lib/store/cti-store';
import { initialGraphNodes, initialGraphEdges, GraphNodeItem } from '@/lib/mock-data/graph';
import { GraphNodeData, GraphEdgeData, EntityType } from '@/types/cti';
import { StatusBadge } from '@/components/common/StatusBadge';

export const CtiKnowledgeGraph: React.FC = () => {
  const router = useRouter();
  const { startNewInvestigation } = useCTIStore();

  // Graph layout state
  const [nodes, setNodes] = useState<GraphNodeItem[]>(initialGraphNodes);
  const [edges] = useState<GraphEdgeData[]>(initialGraphEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(initialGraphNodes[0].data);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdgeData | null>(null);

  // Pan and Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Dragging individual nodes
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Filters
  const [activeEntityTypes, setActiveEntityTypes] = useState<string[]>([
    'actor',
    'malware',
    'campaign',
    'ip',
    'domain',
    'cve',
    'technique',
    'organization',
    'hash'
  ]);
  const [minConfidence, setMinConfidence] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Path Finding tool
  const [pathSource, setPathSource] = useState<string>('node-ip-primary');
  const [pathTarget, setPathTarget] = useState<string>('node-target-aero');
  const [highlightedPathNodeIds, setHighlightedPathNodeIds] = useState<string[]>([]);
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<string[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  // Filtered nodes and edges
  const visibleNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchType = activeEntityTypes.includes(node.data.type);
      const matchConf = (node.data.confidence ?? 100) >= minConfidence;
      const matchSearch =
        searchQuery.trim() === '' ||
        node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchConf && matchSearch;
    });
  }, [nodes, activeEntityTypes, minConfidence, searchQuery]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter(
      edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, visibleNodeIds]);

  // Handle Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-bg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingNodeId) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        setNodes(prev =>
          prev.map(n =>
            n.id === draggingNodeId
              ? { ...n, position: { x: Math.round(mouseX), y: Math.round(mouseY) } }
              : n
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.4, Math.min(2.5, z * factor)));
  };

  const fitToScreen = () => {
    setZoom(0.85);
    setPan({ x: 60, y: 40 });
  };

  const toggleEntityType = (type: string) => {
    setActiveEntityTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Path finding execution (Simple BFS between source and target)
  const executePathFind = () => {
    if (!pathSource || !pathTarget || pathSource === pathTarget) return;

    const queue: Array<{ id: string; path: string[]; edgePath: string[] }> = [
      { id: pathSource, path: [pathSource], edgePath: [] }
    ];
    const visited = new Set<string>([pathSource]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.id === pathTarget) {
        setHighlightedPathNodeIds(current.path);
        setHighlightedEdgeIds(current.edgePath);
        return;
      }

      // Find neighbors
      edges.forEach(edge => {
        let neighbor = '';
        if (edge.source === current.id && !visited.has(edge.target)) {
          neighbor = edge.target;
        } else if (edge.target === current.id && !visited.has(edge.source)) {
          neighbor = edge.source;
        }

        if (neighbor) {
          visited.add(neighbor);
          queue.push({
            id: neighbor,
            path: [...current.path, neighbor],
            edgePath: [...current.edgePath, edge.id]
          });
        }
      });
    }

    alert('No direct path found between selected entities within current filtered graph.');
  };

  const clearPath = () => {
    setHighlightedPathNodeIds([]);
    setHighlightedEdgeIds([]);
  };

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'actor':
        return { fill: '#3b0d11', stroke: '#ef4444', text: '#fca5a5' };
      case 'malware':
        return { fill: '#2a113b', stroke: '#a855f7', text: '#d8b4fe' };
      case 'campaign':
        return { fill: '#3b200b', stroke: '#f97316', text: '#fdba74' };
      case 'ip':
        return { fill: '#0b263b', stroke: '#06b6d4', text: '#67e8f9' };
      case 'domain':
        return { fill: '#0b1d3b', stroke: '#3b82f6', text: '#93c5fd' };
      case 'cve':
        return { fill: '#3b0b23', stroke: '#f43f5e', text: '#fda4af' };
      case 'technique':
        return { fill: '#0b3b24', stroke: '#10b981', text: '#6ee7b7' };
      case 'organization':
        return { fill: '#1f293d', stroke: '#94a3b8', text: '#cbd5e1' };
      case 'hash':
        return { fill: '#3b2d0b', stroke: '#eab308', text: '#fde047' };
      default:
        return { fill: '#141d2e', stroke: '#475569', text: '#94a3b8' };
    }
  };

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex flex-col bg-[#07090e] select-none relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#0a0e17] border-b border-[#1c273c] px-4 flex items-center justify-between z-10 gap-3">
        {/* Search in Graph */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search graph nodes..."
              className="w-full bg-[#0f1422] border border-[#1e2a42] rounded pl-8 pr-3 py-1 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Entity Type Filter Badges */}
        <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'actor', label: 'Actors' },
            { id: 'malware', label: 'Malware' },
            { id: 'campaign', label: 'Campaigns' },
            { id: 'ip', label: 'IPs' },
            { id: 'domain', label: 'Domains' },
            { id: 'cve', label: 'CVEs' },
            { id: 'technique', label: 'ATT&CK' },
            { id: 'organization', label: 'Victims' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => toggleEntityType(t.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                activeEntityTypes.includes(t.id)
                  ? 'bg-sky-950/80 border-sky-600/80 text-sky-300 font-bold'
                  : 'bg-[#101625] border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Path Finder & Controls */}
        <div className="flex items-center gap-2">
          {/* Path Finding dropdown */}
          <div className="hidden md:flex items-center gap-1 text-xs font-mono bg-[#0f1422] p-1 rounded border border-[#1e2a42]">
            <Route className="w-3.5 h-3.5 text-sky-400 ml-1" />
            <select
              value={pathSource}
              onChange={e => setPathSource(e.target.value)}
              className="bg-transparent text-slate-300 text-[11px] focus:outline-none max-w-[100px] truncate"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id} className="bg-[#0f1422] text-slate-200">
                  {n.data.label}
                </option>
              ))}
            </select>
            <span className="text-slate-600">→</span>
            <select
              value={pathTarget}
              onChange={e => setPathTarget(e.target.value)}
              className="bg-transparent text-slate-300 text-[11px] focus:outline-none max-w-[100px] truncate"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id} className="bg-[#0f1422] text-slate-200">
                  {n.data.label}
                </option>
              ))}
            </select>
            <button
              onClick={executePathFind}
              className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-[10px]"
            >
              Find Path
            </button>
            {highlightedPathNodeIds.length > 0 && (
              <button
                onClick={clearPath}
                className="px-1.5 text-slate-400 hover:text-white"
                title="Clear highlighted path"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#0f1422] p-0.5 rounded border border-[#1e2a42]">
            <button
              onClick={() => setZoom(z => Math.min(2.5, z * 1.15))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.4, z * 0.85))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={fitToScreen}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Fit to screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area + Right Drawer */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* SVG Interactive Canvas */}
        <svg
          ref={svgRef}
          id="graph-bg"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="soc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#121826" strokeWidth="1" />
            </pattern>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#soc-grid)" id="graph-bg" />

          {/* Graph Transform Group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {visibleEdges.map(edge => {
              const sourceNode = nodeMap.get(edge.source);
              const targetNode = nodeMap.get(edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                highlightedEdgeIds.includes(edge.id) ||
                (selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id));

              const x1 = sourceNode.position.x;
              const y1 = sourceNode.position.y;
              const x2 = targetNode.position.x;
              const y2 = targetNode.position.y;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isHighlighted ? '#38bdf8' : '#1e2b45'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={edge.verified ? 'none' : '4 3'}
                    markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />
                  {/* Edge Label Pill */}
                  <rect
                    x={midX - 35}
                    y={midY - 9}
                    width={70}
                    height={18}
                    rx={4}
                    fill="#0a0f1b"
                    stroke={isHighlighted ? '#38bdf8' : '#1e2a44'}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    fill={isHighlighted ? '#7dd3fc' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {visibleNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isPathHighlighted = highlightedPathNodeIds.includes(node.id);
              const colors = getNodeColor(node.data.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.position.x}, ${node.position.y})`}
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedNode(node.data);
                  }}
                  onMouseDown={e => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                >
                  {/* Outer selection ring */}
                  {(isSelected || isPathHighlighted || node.data.isTarget) && (
                    <rect
                      x="-88"
                      y="-32"
                      width="176"
                      height="64"
                      rx="8"
                      fill="none"
                      stroke={isPathHighlighted ? '#10b981' : isSelected ? '#38bdf8' : '#f59e0b'}
                      strokeWidth="2.5"
                      strokeDasharray={node.data.isTarget ? '4 3' : 'none'}
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Card */}
                  <rect
                    x="-82"
                    y="-28"
                    width="164"
                    height="56"
                    rx="6"
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="1.5"
                    className="transition-all hover:brightness-125 shadow-lg"
                  />

                  {/* Type Badge & Severity Bar */}
                  <rect
                    x="-82"
                    y="-28"
                    width="164"
                    height="16"
                    rx="6"
                    fill="#080c14"
                    opacity="0.75"
                  />

                  {/* Entity Type Label */}
                  <text
                    x="-74"
                    y="-17"
                    fill={colors.text}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    {node.data.type.toUpperCase()}
                  </text>

                  {/* Confidence Pill */}
                  {node.data.confidence && (
                    <text
                      x="72"
                      y="-17"
                      fill="#10b981"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="end"
                    >
                      {node.data.confidence}%
                    </text>
                  )}

                  {/* Node Title */}
                  <text
                    x="-74"
                    y="4"
                    fill="#f1f5f9"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {node.data.label.length > 18
                      ? node.data.label.slice(0, 16) + '...'
                      : node.data.label}
                  </text>

                  {/* Subtitle / Details */}
                  <text
                    x="-74"
                    y="18"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {node.data.subtitle
                      ? node.data.subtitle.length > 22
                        ? node.data.subtitle.slice(0, 20) + '...'
                        : node.data.subtitle
                      : ''}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Edge Explanation Popover */}
        {selectedEdge && (
          <div className="absolute bottom-4 left-4 bg-[#0e1424] border border-[#223354] rounded-lg p-3 max-w-sm z-20 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#1d2b45]">
              <span className="text-sky-300 font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Provenance Connection
              </span>
              <button
                onClick={() => setSelectedEdge(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div>Relationship: <strong className="text-sky-400">{selectedEdge.label}</strong></div>
              <div>Confidence: <strong className="text-emerald-400">{selectedEdge.confidence}%</strong></div>
              <div>Independent Evidence: <strong>{selectedEdge.sourceCount} sources</strong></div>
              <div className="text-slate-400 font-sans text-xs pt-1">
                Why connected: Primary observable telemetry links these entities via authenticated DNS, passive SSL fingerprinting, and threat intelligence pulses.
              </div>
            </div>
          </div>
        )}

        {/* Right-Side Detailed Node Drawer (User Prompt Requirement) */}
        {selectedNode && (
          <div className="w-80 md:w-96 bg-[#0c111c] border-l border-[#1f2c45] shadow-2xl z-20 flex flex-col justify-between animate-in slide-in-from-right duration-150">
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c273e]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                    ENTITY INTELLIGENCE
                  </span>
                  <StatusBadge type="severity" value={selectedNode.severity || 'critical'} />
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  {selectedNode.type}
                </span>
                <h3 className="text-lg font-mono font-bold text-slate-100 mt-0.5">
                  {selectedNode.label}
                </h3>
                {selectedNode.subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    {selectedNode.subtitle}
                  </p>
                )}
              </div>

              {/* Entity Attributes */}
              {selectedNode.details && (
                <div className="space-y-2 font-mono text-xs">
                  {Object.entries(selectedNode.details).map(([k, val]) => (
                    <div key={k} className="p-2 rounded bg-[#090d16] border border-[#1b263b]">
                      <span className="text-slate-500 block text-[10px] uppercase">{k}:</span>
                      <span className="text-slate-200 break-words">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Provenance & Evidence Stats */}
              <div className="p-3 rounded bg-[#0f1728] border border-sky-900/40 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Attribution Confidence:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.confidence || 92}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Evidence Provenance:</span>
                  <span className="text-sky-300 font-bold">Verified (STIX 2.1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Threat Cluster:</span>
                  <span className="text-slate-200">Operation Arctic Ghost</span>
                </div>
              </div>
            </div>

            {/* Bottom Quick Actions */}
            <div className="p-4 border-t border-[#1c273e] space-y-2 bg-[#0a0e18]">
              <button
                type="button"
                onClick={() => {
                  startNewInvestigation(selectedNode.label);
                  router.push('/investigate');
                }}
                className="w-full py-2 px-3 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Investigate Further</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

