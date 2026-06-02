"use client";

import type { LucideIcon } from "lucide-react";
import { STAGE_META } from "@/lib/constants";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { PIPELINE_STAGES, type PipelineStage } from "@/types/pipeline";

const STAGE_INDEX = Object.fromEntries(
  PIPELINE_STAGES.map((s, i) => [s, i + 1])
) as Record<PipelineStage, number>;

interface StageSectionHeaderProps {
  stage: PipelineStage;
  icon: LucideIcon;
  /** drawer = inside details sheet (no duplicate chapter title) */
  variant?: "section" | "drawer";
  children?: React.ReactNode;
}

export function StageSectionHeader({
  stage,
  icon: Icon,
  variant = "drawer",
  children,
}: StageSectionHeaderProps) {
  const meta = STAGE_META[stage];
  const step = STAGE_INDEX[stage];
  const { isBeginner, showTechnical } = useLearningDepth();

  if (isBeginner) return null;

  if (variant === "drawer") {
    return (
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-glow)]">
            <Icon className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-[var(--muted)]">
            Chapter {step} · {meta.short}
            {showTechnical && ` · ${meta.label}`}
          </p>
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </header>
    );
  }

  return (
    <header className="mb-6 flex flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
          <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--accent)]">
            Chapter {step}
            {showTechnical && ` · ${meta.short}`}
          </p>
          <h2 className="display-title mt-0.5 text-xl text-[var(--text)] md:text-2xl">
            {meta.label}
          </h2>
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  );
}
