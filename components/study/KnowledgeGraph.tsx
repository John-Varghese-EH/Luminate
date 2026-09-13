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
    <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] bg-white dark:bg-[#111113] rounded-3xl border border-gray-200 dark:border-white/[0.06] overflow-hidden shadow-lg dark:shadow-2xl transition-colors">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>

      <div className="absolute inset-0 p-4 sm:p-6 md:p-8">
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
                stroke={isHighlighted ? "#3b82f6" : "rgba(150,150,150,0.2)"}
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
              onTouchStart={() => setActiveNode(node.id)}
              onTouchEnd={() => setActiveNode(null)}
              className={`relative cursor-pointer group flex flex-col items-center justify-center
                ${node.group === "core" ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" : node.group === "concept" ? "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" : "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"}
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
                node.group === "core" ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-400/50" :
                node.group === "concept" ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-400/50" :
                "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-400/50"
              }`}>
                {node.group === "core" && <i className="fa-solid fa-brain text-blue-600 dark:text-blue-300 text-base sm:text-lg md:text-xl"></i>}
                {node.group === "concept" && <i className="fa-solid fa-diagram-project text-purple-600 dark:text-purple-300 text-sm sm:text-base"></i>}
                {node.group === "detail" && <i className="fa-solid fa-atom text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm"></i>}
              </div>
              
              {/* Label */}
              <div className={`absolute -bottom-6 sm:-bottom-8 whitespace-nowrap text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-300 ${
                activeNode === node.id ? "text-gray-900 dark:text-white opacity-100" : "text-gray-500 dark:text-white/60 opacity-80"
              }`}>
                {node.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 p-2.5 sm:p-4 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/5 flex flex-col gap-2 sm:gap-3">
        <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/40 font-bold mb-0.5 sm:mb-1">Knowledge Map</h4>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500/50 border border-blue-400/50"></div>
          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-white/70">Core Topic</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-500/50 border border-purple-400/50"></div>
          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-white/70">Key Concept</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/50 border border-emerald-400/50"></div>
          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-white/70">Detail</span>
        </div>
      </div>
    </div>
  );
}
