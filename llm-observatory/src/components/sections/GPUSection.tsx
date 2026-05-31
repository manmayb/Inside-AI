"use client";

import { useMemo } from "react";
import { Cpu } from "lucide-react";
import { MatrixMultiply } from "@/components/viz/MatrixMultiply";
import { ComputeChamber } from "@/components/viz/ComputeChamber";
import { MetricCard } from "@/components/ui/MetricCard";
import { CinematicScene } from "@/components/ui/CinematicScene";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

export function GPUSection() {
  const tokens = usePipelineStore((s) => s.tokens);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const phase = useMemo(() => stageProgress / 100, [stageProgress]);
  const seed = tokens.reduce((a, t) => a + t.id, 0);

  return (
    <CinematicScene
      insight="Thousands of tiny calculations fire at once—this is how the brain of the AI thinks so fast."
      hero={<ComputeChamber stageProgress={stageProgress} cinematic />}
      curious={
        <>
          <StageSectionHeader stage="gpu" icon={Cpu} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Memory in use" value="~4.2k" unit="MB (sim)" />
            <MetricCard label="Parallel lanes" value="Active" />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <MatrixMultiply label="Mixing patterns" rows={4} cols={4} inner={4} seed={seed} phase={phase} />
            <MatrixMultiply
              label="Blending context"
              rows={4}
              cols={4}
              inner={4}
              seed={seed + 13}
              phase={(phase + 0.35) % 1}
            />
          </div>
        </>
      }
    />
  );
}
