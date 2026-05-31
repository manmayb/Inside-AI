"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipelineStore";
import { NEURAL_TIMING } from "@/motion/neuralMotion";
import { cn } from "@/lib/utils";
import { useSceneComposition } from "@/hooks/useSceneComposition";
import { useMotionPreferences } from "@/hooks/useMotionPreferences"; // CHANGED: Imported useMotionPreferences hook
import { useLearningDepth } from "@/hooks/useLearningDepth"; // CHANGED: Imported useLearningDepth hook

const VISIBLE = 18;

function TransformerCityInner() {
  const { mode } = useSceneComposition();
  const { repeat } = useMotionPreferences(); // CHANGED: Fetch preference-driven repeat behavior
  const { isBeginner } = useLearningDepth(); // CHANGED: Destructured isBeginner from hook
  const cinematic = mode === "cinematic";
  const config = usePipelineStore((s) => s.config);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const tokens = usePipelineStore((s) => s.tokens);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const inspectedLayer = usePipelineStore((s) => s.inspectedLayer);

  const activeLayer = Math.floor((stageProgress / 100) * (VISIBLE - 1));
  const focusLayer = Math.min(
    VISIBLE - 1,
    Math.floor((inspectedLayer / Math.max(config.layers, 1)) * (VISIBLE - 1))
  );

  const towers = useMemo(
    () =>
      Array.from({ length: VISIBLE }, (_, i) => ({
        layer: i,
        height: 80 + (i / VISIBLE) * 120 + (i % 4) * 18,
        offset: Math.sin(i * 0.7) * 12,
        width: 14 + (i % 3) * 4,
      })),
    []
  );

  return (
    <div className="scene-viz-transformer relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Deep-space floor grid */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[22%] h-[45%] opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent-glow) 1px, transparent 1px), linear-gradient(90deg, var(--accent-glow) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "perspective(400px) rotateX(72deg)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black 20%, transparent 90%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 58%, var(--accent-glow), transparent 68%)",
        }}
      />

      {/* Attention highways — vertical beams */}
      {towers.map((t) => (
        <motion.div
          key={`beam-${t.layer}`}
          className="pointer-events-none absolute w-px bg-gradient-to-t from-transparent via-[var(--accent)] to-transparent"
          style={{
            left: `${50 + (t.layer - VISIBLE / 2) * 3.2}%`,
            bottom: "calc(50% - 4rem)",
            height: `${t.height * 1.2}px`,
            opacity: t.layer <= activeLayer ? 0.35 : 0.08,
          }}
          animate={{
            opacity: t.layer === activeLayer ? [0.2, 0.7, 0.2] : t.layer <= activeLayer ? 0.25 : 0.06,
          }}
          transition={{
            duration: NEURAL_TIMING.signalPulse,
            repeat, // CHANGED: Wired repeat to motion preferences
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative flex max-h-[min(52vh,480px)] min-h-[200px] w-full max-w-5xl flex-1 items-stretch justify-center gap-0.5"> {/* CHANGED: Changed items-end to items-stretch and removed vertical padding to optimize visual rhythm and vertical bounds */}
        {towers.map((t) => {
          const isActive = t.layer === activeLayer;
          const isFocus = t.layer === focusLayer;
          const lit = t.layer <= activeLayer;

          return (
            <motion.div
              key={t.layer}
              className="relative flex flex-col items-center"
              style={{ marginBottom: t.offset, zIndex: isActive ? 20 : t.layer }}
              animate={{
                scaleY: isActive ? 1.08 : isFocus ? 1.03 : 0.88,
                opacity: lit ? 1 : 0.28,
                y: isActive ? -6 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.22, 0.68, 0.12, 1] }}
            >
              {/* Tower crown glow */}
              {isActive && (
                <motion.div
                  className="absolute -top-6 h-8 w-16 rounded-full blur-xl"
                  style={{ background: "var(--accent-beam)" }}
                  animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: NEURAL_TIMING.tensorFlow, repeat }} // CHANGED: Wired repeat to motion preferences
                />
              )}

              <div
                className="relative overflow-hidden"
                style={{
                  width: t.width,
                  height: t.height,
                  clipPath:
                    "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
                  borderLeft: `1px solid ${isActive ? "var(--accent)" : "rgba(255,255,255,0.06)"}`,
                  borderRight: `1px solid ${isActive ? "var(--accent)" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: isActive
                    ? "0 0 60px var(--accent-glow), inset 0 0 30px var(--accent-glow)"
                    : isFocus
                      ? "0 0 30px rgba(124,58,237,0.25)"
                      : undefined,
                  background: isActive
                    ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, var(--accent-glow) 40%, rgba(124,58,237,0.2) 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.85), rgba(124,58,237,0.12))",
                }}
              >
                {/* Tensor stream upward */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--accent)] to-transparent opacity-50"
                  animate={{ y: ["100%", "-20%"] }}
                  transition={{
                    duration: NEURAL_TIMING.tensorFlow,
                    repeat, // CHANGED: Wired repeat to motion preferences
                    ease: "linear",
                  }}
                />

                {!isBeginner && ["MHSA", "FFN", "LN"].map((block, bi) => ( // CHANGED: Gated technical component labels in beginner mode
                  <div
                    key={block}
                    className="absolute left-0 right-0 mx-0.5 text-center font-mono text-[6px] tracking-wider text-slate-500"
                    style={{
                      bottom: `${18 + bi * 24}%`,
                      background: "rgba(0,0,0,0.5)",
                      padding: "1px 0",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {block}
                  </div>
                ))}

                {lit &&
                  tokens.map((_, ti) => (
                    <motion.div
                      key={ti}
                      className="absolute left-1/2 rounded-full"
                      style={{
                        width: ti === selectedTokenIndex ? 6 : 4,
                        height: ti === selectedTokenIndex ? 6 : 4,
                        marginLeft: ti === selectedTokenIndex ? -3 : -2,
                        background: ti === selectedTokenIndex ? "#fff" : "var(--accent)",
                        boxShadow:
                          ti === selectedTokenIndex
                            ? "0 0 16px #fff, 0 0 24px var(--accent)"
                            : "0 0 10px var(--accent)",
                      }}
                      initial={{ bottom: "4%" }}
                      animate={{
                        bottom: [`${8 + (ti / Math.max(tokens.length, 1)) * 70}%`, "92%", "8%"],
                      }}
                      transition={{
                        duration: NEURAL_TIMING.tensorFlow + ti * 0.15,
                        repeat, // CHANGED: Wired repeat to motion preferences
                        delay: ti * 0.1,
                        ease: [0.45, 0.05, 0.15, 1],
                      }}
                    />
                  ))}
              </div>
              {!isBeginner && ( // CHANGED: Gated layer index label in beginner mode
                <span
                  className="mt-2 font-mono text-[7px] tracking-widest"
                  style={{ color: isActive ? "var(--accent)" : "#475569" }}
                >
                  L{t.layer + 1}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 text-center",
          cinematic ? "bottom-4" : "bottom-6"
        )}
      >
        {!isBeginner && ( // CHANGED: Gated bottom technical labels in beginner mode
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">
              Transformer megastructure
            </p>
            <p className="mt-1 font-mono text-[9px] text-[var(--muted)]">
              {config.layers} layers · residual stream · d={config.hiddenDim}
            </p>
          </>
        )}
      </div>

      {!isBeginner && ( // CHANGED: Gated top-left signal indicator in beginner mode
        <div className="pointer-events-none absolute left-4 top-[calc(var(--scene-header-h)+0.5rem)] font-mono text-[9px] uppercase tracking-widest text-[var(--accent)]">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: NEURAL_TIMING.signalPulse, repeat }} // CHANGED: Wired repeat to motion preferences
          >
            Signal L{activeLayer + 1}
          </motion.span>
        </div>
      )}

      {!isBeginner && ( // CHANGED: Gated top-right cognitive label in beginner mode
        <div className="pointer-events-none absolute right-4 top-[calc(var(--scene-header-h)+0.5rem)] max-w-[140px] text-right font-mono text-[8px] leading-relaxed text-[var(--muted)]">
          Flying through artificial cognition
        </div>
      )}
    </div>
  );
}

export const TransformerCity = memo(TransformerCityInner);
