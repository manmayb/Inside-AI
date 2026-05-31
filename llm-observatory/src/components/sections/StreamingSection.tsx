"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CinematicScene } from "@/components/ui/CinematicScene";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { usePipelineStore } from "@/store/pipelineStore";

const STREAM_BARS = Array.from({ length: 32 }, (_, i) => ({
  min: 4 + ((i * 7) % 9),
  mid: 8 + ((i * 13) % 28),
  max: 4 + ((i * 11) % 12),
}));

export function StreamingSection() {
  const streamedText = usePipelineStore((s) => s.streamedText);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const active = streamedText.length > 0;
  const { motionEnabled, repeat } = useMotionPreferences();

  const barHeights = useMemo(() => STREAM_BARS, []);

  return (
    <CinematicScene
      insight="Words arrive one by one—like the mind finishing a sentence in real time."
      hero={
        <div className="flex h-full flex-col items-center justify-center px-8 md:px-16">
          <div className="scene-stream-text max-w-2xl text-center text-xl leading-relaxed text-[var(--text)] md:text-2xl lg:text-3xl">
            {streamedText || (
              <span className="text-[var(--muted)]">The reply is forming…</span>
            )}
            <motion.span
              className="ml-0.5 inline-block h-6 w-0.5 bg-[var(--accent)] align-middle md:h-7"
              animate={motionEnabled ? { opacity: [1, 0] } : { opacity: 1 }}
              transition={{ repeat, duration: 0.6 }}
              aria-hidden
            />
          </div>
        </div>
      }
      curious={
        <>
          <StageSectionHeader stage="streaming" icon={Radio} />
          <GlassPanel title="Live stream">
            <div className="mb-4 flex h-12 items-end justify-center gap-0.5">
              {barHeights.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-t bg-[var(--accent)]"
                  animate={motionEnabled ? { height: [h.min, h.mid, h.max] } : { height: h.mid }}
                  transition={{
                    duration: 0.8 + (i % 5) * 0.1,
                    repeat,
                    delay: i * 0.03,
                  }}
                  style={{ opacity: active ? 0.5 + (i / 32) * 0.5 : 0.15 }}
                />
              ))}
            </div>
          </GlassPanel>
          <GlassPanel title="Latency timeline" divider={false}>
            <div className="space-y-3 text-[10px]">
              {[
                { label: "TTFB", ms: 120, at: 15 },
                { label: "First token", ms: 145, at: 25 },
                { label: "Stream chunk", ms: 18, at: 50 },
                { label: "Render frame", ms: 4, at: 80 },
              ].map((e) => (
                <div key={e.label} className="flex items-center gap-3">
                  <span className="w-24 text-[var(--muted)]">{e.label}</span>
                  <div className="relative h-2 flex-1 rounded-full bg-[var(--elevated)]">
                    <motion.div
                      className="absolute h-full rounded-full"
                      style={{ background: "var(--gradient-brand)" }}
                      initial={{ width: 0 }}
                      animate={{
                        width: stageProgress > e.at ? `${Math.min(100, e.ms / 1.5)}%` : 0,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-[var(--accent)]">{e.ms}ms</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </>
      }
    />
  );
}
