"use client";

import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipelineStore";

const VISIBLE_LAYERS = 12;

export function TransformerStack() {
  const config = usePipelineStore((s) => s.config);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const tokens = usePipelineStore((s) => s.tokens);
  const activeLayer = Math.floor((stageProgress / 100) * (VISIBLE_LAYERS - 1));

  return (
    <div className="relative flex h-[420px] items-stretch justify-center gap-1 overflow-hidden">
      {Array.from({ length: VISIBLE_LAYERS }).map((_, layer) => {
        const isActive = layer === activeLayer;
        const isPast = layer < activeLayer;
        return (
          <motion.div
            key={layer}
            className="relative flex-1 max-w-[72px]"
            animate={{
              opacity: isPast ? 0.5 : isActive ? 1 : 0.25,
              scaleY: isActive ? 1.02 : 1,
            }}
          >
            <div
              className={`flex h-full flex-col rounded-lg border ${
                isActive
                  ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="border-b border-white/5 p-1 text-center font-mono text-[9px] text-slate-500">
                L{layer + 1}
              </div>
              <div className="flex flex-1 flex-col justify-around p-1">
                {["Attn", "FFN", "Norm"].map((block) => (
                  <div
                    key={block}
                    className={`rounded px-1 py-2 text-center font-mono text-[8px] ${
                      isActive ? "bg-violet-500/20 text-violet-300" : "bg-black/30 text-slate-600"
                    }`}
                  >
                    {block}
                  </div>
                ))}
              </div>
              {isActive &&
                tokens.map((_, ti) => (
                  <motion.div
                    key={ti}
                    className="absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-400"
                    initial={{ bottom: "0%" }}
                    animate={{ bottom: `${(ti / Math.max(tokens.length, 1)) * 80 + 10}%` }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: ti * 0.15,
                    }}
                  />
                ))}
            </div>
          </motion.div>
        );
      })}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-slate-500">
        {config.layers} layers · {config.heads} heads · d={config.hiddenDim}
      </div>
    </div>
  );
}
