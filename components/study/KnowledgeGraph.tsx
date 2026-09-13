"use client";

import { useEffect, useState } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  group: "core" | "concept" | "detail";
}

interface Edge {
  source: string;
  target: string;
}

export default function KnowledgeGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodes: Node[] = [
    { id: "1", label: "Quantum Computing", x: 50, y: 50, group: "core" },
    { id: "2", label: "Superposition", x: 30, y: 30, group: "concept" },
    { id: "3", label: "Entanglement", x: 70, y: 30, group: "concept" },
    { id: "4", label: "Qubits", x: 50, y: 20, group: "detail" },
    { id: "5", label: "Interference", x: 20, y: 60, group: "concept" },
    { id: "6", label: "Shor's Algorithm", x: 80, y: 60, group: "detail" },
    { id: "7", label: "Decoherence", x: 50, y: 80, group: "concept" },
  ];

  const edges: Edge[] = [
    { source: "1", target: "2" },
    { source: "1", target: "3" },
    { source: "2", target: "4" },
    { source: "3", target: "4" },
    { source: "1", target: "5" },
    { source: "1", target: "6" },
    { source: "1", target: "7" },
  ];

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[500px] bg-[#111113] rounded-[32px] border border-white/[0.06] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03] bg-center"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="absolute inset-0 p-8">
        <svg className="w-full h-full" style={{ overflow: "visible" }}>
          {edges.map((edge, i) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = activeNode === sourceNode.id || activeNode === targetNode.id;

            return (
              <line
                key={i}
                x1={`${sourceNode.x}%`}
                y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={isHighlighted ? "#3b82f6" : "rgba(255,255,255,0.1)"}
                strokeWidth={isHighlighted ? 2 : 1}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >
            <div
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className={`relative cursor-pointer group flex flex-col items-center justify-center
                ${node.group === "core" ? "w-24 h-24" : node.group === "concept" ? "w-20 h-20" : "w-16 h-16"}
              `}
            >
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                activeNode === node.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              } ${
                node.group === "core" ? "bg-blue-500/30 blur-xl" :
                node.group === "concept" ? "bg-purple-500/30 blur-lg" :
                "bg-emerald-500/30 blur-md"
              }`}></div>
              
              {/* Node Body */}
              <div className={`relative flex items-center justify-center w-full h-full rounded-full border backdrop-blur-md transition-all duration-300 ${
                activeNode === node.id ? "scale-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "scale-100"
              } ${
                node.group === "core" ? "bg-blue-900/40 border-blue-400/50" :
                node.group === "concept" ? "bg-purple-900/40 border-purple-400/50" :
                "bg-emerald-900/40 border-emerald-400/50"
              }`}>
                {node.group === "core" && <i className="fa-solid fa-brain text-blue-300 text-xl"></i>}
                {node.group === "concept" && <i className="fa-solid fa-diagram-project text-purple-300"></i>}
                {node.group === "detail" && <i className="fa-solid fa-atom text-emerald-300 text-sm"></i>}
              </div>
              
              {/* Label */}
              <div className={`absolute -bottom-8 whitespace-nowrap text-xs font-medium tracking-wide transition-all duration-300 ${
                activeNode === node.id ? "text-white opacity-100" : "text-white/60 opacity-80"
              }`}>
                {node.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute top-6 left-6 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex flex-col gap-3">
        <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Knowledge Map</h4>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-400/50"></div>
          <span className="text-xs text-white/70">Core Topic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500/50 border border-purple-400/50"></div>
          <span className="text-xs text-white/70">Key Concept</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-400/50"></div>
          <span className="text-xs text-white/70">Detail</span>
        </div>
      </div>
    </div>
  );
}
