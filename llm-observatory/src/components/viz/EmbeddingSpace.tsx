"use client";

import { motion } from "framer-motion";
import type { EmbeddingPoint } from "@/types/pipeline";
import { cosineSimilarity } from "@/lib/inference";

interface EmbeddingSpaceProps {
  points: EmbeddingPoint[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}

export function EmbeddingSpace({ points, selectedIndex, onSelect }: EmbeddingSpaceProps) {
  const selected = points[selectedIndex];

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/5 bg-black/50">
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="h-full w-full">
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={0.2 + i * 0.12}
            fill="none"
            stroke="rgba(34,211,238,0.08)"
            strokeWidth="0.005"
          />
        ))}
        {points.map((p, i) => {
          const sim =
            selected && i !== selectedIndex
              ? cosineSimilarity(selected, p)
              : 0;
          const isSelected = i === selectedIndex;
          return (
            <g key={i} onClick={() => onSelect(i)} style={{ cursor: "pointer" }}>
              <motion.circle
                cx={p.x}
                cy={-p.y}
                r={isSelected ? 0.08 : 0.05 + p.magnitude * 0.04}
                fill={
                  isSelected
                    ? "#22d3ee"
                    : `rgba(34,211,238,${0.3 + sim * 0.5})`
                }
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
              {sim > 0.7 && !isSelected && (
                <line
                  x1={selected.x}
                  y1={-selected.y}
                  x2={p.x}
                  y2={-p.y}
                  stroke="rgba(139,92,246,0.4)"
                  strokeWidth="0.01"
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-500">
        latent projection · d=4096 → 3D PCA (simulated)
      </div>
    </div>
  );
}
