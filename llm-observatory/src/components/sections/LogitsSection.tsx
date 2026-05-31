"use client";

import { useMemo } from "react";
import { Dice5 } from "lucide-react";
import { ProbabilityField } from "@/components/viz/ProbabilityField";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { StageLayout } from "@/components/ui/StageLayout";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";
import { buildLogits, entropy } from "@/lib/inference";
import { cn } from "@/lib/utils";

export function LogitsSection() {
  const logits = usePipelineStore((s) => s.logits);
  const tokens = usePipelineStore((s) => s.tokens);
  const config = usePipelineStore((s) => s.config);
  const setConfig = usePipelineStore((s) => s.setConfig);
  const refreshLogits = usePipelineStore((s) => s.refreshLogits);
  const arStep = usePipelineStore((s) => s.arStep);

  const greedyLogits = useMemo(
    () => buildLogits(tokens, { ...config, sampling: "greedy", temperature: 0.01 }, arStep),
    [tokens, config, arStep]
  );

  const ent = entropy(logits);

  return (
    <StageLayout
      insight="Many possible next words flicker—then one path wins, like the mind settling on a single word."
      focal={
        <GlassPanel title="Possible next words" variant="hero" glow="accent" className="min-h-[360px]"> {/* CHANGED: Added min-h-[360px] to prevent layout shifting/height mismatches */}
          <ProbabilityField
            candidates={logits}
            animateKey={`${config.sampling}-${config.temperature}-${arStep}`}
          />
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="logits" icon={Dice5} />
          <Equation
            beginner=""
            engineer="Scores become probabilities; temperature controls randomness vs focus."
            research="π = softmax(z/T); sample t ~ π or argmax"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Uncertainty" value={ent.toFixed(2)} unit="bits" highlight />
            <MetricCard label="Temperature" value={String(config.temperature)} />
          </div>
          <GlassPanel title="Shape the choice" divider={false}>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                Creativity
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => {
                    setConfig({ temperature: parseFloat(e.target.value) });
                    refreshLogits(arStep);
                  }}
                  className="w-32 accent-[var(--accent)]"
                  aria-valuemin={0.1}
                  aria-valuemax={2}
                  aria-valuenow={config.temperature}
                  aria-label="Sampling temperature"
                />
              </label>
              {(["greedy", "top_k", "top_p"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setConfig({ sampling: m });
                    refreshLogits(arStep);
                  }}
                  className={cn(
                    "rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] px-3 py-1.5 text-xs capitalize",
                    config.sampling === m ? "text-[var(--accent)]" : "text-[var(--muted)]"
                  )}
                >
                  {m.replace("_", "-")}
                </button>
              ))}
            </div>
          </GlassPanel>
        </>
      }
      advanced={
        <GlassPanel title="Greedy comparison" glow="secondary">
          <ProbabilityField candidates={greedyLogits} animateKey={`greedy-${arStep}`} />
        </GlassPanel>
      }
    />
  );
}
