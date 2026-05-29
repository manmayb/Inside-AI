"use client";

import { useMemo } from "react";
import { Cpu } from "lucide-react";
import { MatrixMultiply } from "@/components/viz/MatrixMultiply";
import { ComputeChamber } from "@/components/viz/ComputeChamber";
import { MetricCard } from "@/components/ui/MetricCard";
import { SimpleInsight } from "@/components/ui/SimpleInsight";
import { LearningDetail } from "@/components/ui/LearningDetail";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

export function GPUSection() {
  const tokens = usePipelineStore((s) => s.tokens);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const phase = useMemo(() => stageProgress / 100, [stageProgress]);
  const seed = tokens.reduce((a, t) => a + t.id, 0);

  return (
    <>
      <SimpleInsight>
        Thousands of tiny calculations fire at once—this is how the brain of the AI thinks so fast.
      </SimpleInsight>

      <LearningDetail>
        <StageSectionHeader stage="gpu" icon={Cpu} />
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="Memory in use" value="~4.2k" unit="MB (sim)" />
          <MetricCard label="Parallel lanes" value="Active" />
        </div>
        <ComputeChamber stageProgress={stageProgress} />
        <div className="grid gap-4 lg:grid-cols-2">
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
      </LearningDetail>
    </>
  );
}
