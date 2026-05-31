"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { HiddenStateSlice } from "@/types/pipeline";

interface HiddenStateFlowProps {
  slices: HiddenStateSlice[];
  inspectedLayer: number;
  selectedTokenIndex: number;
  maxLayers?: number;
  cinematic?: boolean;
}

function HiddenStateFlowInner({
  slices,
  inspectedLayer,
  selectedTokenIndex,
  maxLayers = 24,
  cinematic = false,
}: HiddenStateFlowProps) {
  const layerCount = slices[0]?.layerMagnitudes.length ?? maxLayers;

  const paths = useMemo(() => {
    return slices.map((slice, ti) => {
      const points = slice.layerMagnitudes.map((m, li) => ({
        x: (li / Math.max(layerCount - 1, 1)) * 100,
        y: 50 - m * 40,
      }));
      const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
      return { d, ti, slice };
    });
  }, [slices, layerCount]);

  return (
    <div
      className={`relative w-full ${cinematic ? "flex h-full min-h-0 flex-col justify-center px-6 py-12" : "overflow-x-auto rounded-xl border border-white/5 bg-black/50 p-4"}`}
    >
      <svg
        viewBox="0 0 100 55"
        className={cinematic ? "h-full w-full min-h-[200px]" : "min-w-[600px] w-full"}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hs-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={55}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.2"
          />
        ))}
        <line
          x1={(inspectedLayer / Math.max(layerCount - 1, 1)) * 100}
          y1={0}
          x2={(inspectedLayer / Math.max(layerCount - 1, 1)) * 100}
          y2={55}
          stroke="var(--accent)"
          strokeWidth="0.4"
          strokeDasharray="1 1"
        />
        {paths.map(({ d, ti, slice }) => {
          const isSel = ti === selectedTokenIndex;
          return (
            <motion.path
              key={ti}
              d={d}
              fill="none"
              stroke={isSel ? "url(#hs-grad)" : "rgba(100,116,139,0.25)"}
              strokeWidth={isSel ? 0.8 : 0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: ti * 0.04 }}
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-slate-600">
        <span>Layer 0</span>
        <span className="text-[var(--accent)]">Inspect L{inspectedLayer + 1}</span>
        <span>Layer {layerCount}</span>
      </div>
      {slices[selectedTokenIndex] && (
        <p className="mt-1 font-mono text-[10px] text-slate-400">
          Token &quot;{slices[selectedTokenIndex].text}&quot; — representation trajectory across depth
        </p>
      )}
    </div>
  );
}

export const HiddenStateFlow = memo(HiddenStateFlowInner);
