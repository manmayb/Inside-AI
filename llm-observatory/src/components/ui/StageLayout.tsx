"use client";

import { SimpleInsight } from "@/components/ui/SimpleInsight";
import { SceneDetailsHost } from "@/components/ui/SceneDetailsHost";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { cn } from "@/lib/utils";

export interface StageLayoutProps {
  /** Beginner plain-language line (string) or custom node */
  insight?: React.ReactNode;
  /** Hero visualization — always visible in every learning depth */
  focal?: React.ReactNode;
  /** Optional supporting copy below the focal area */
  explanation?: React.ReactNode;
  /** Curious+ technical panels — opens in overlay drawer, never inline */
  curious?: React.ReactNode;
  /** Advanced metrics / export — appended in drawer */
  advanced?: React.ReactNode;
  className?: string;
}

/**
 * Documentary chapter composition contract.
 * ChapterScene owns titles — sections must not add duplicate h2 headers.
 * @see docs/COMPONENTS/stage-layout.md
 */
export function StageLayout({
  insight,
  focal,
  explanation,
  curious,
  advanced,
  className,
}: StageLayoutProps) {
  const { isBeginner } = useLearningDepth();

  return (
    <div className={cn("chapter-stack scene-compact-content flex h-full min-h-0 flex-col justify-center gap-4", className)}>
      {insight != null && isBeginner &&
        (typeof insight === "string" ? <SimpleInsight>{insight}</SimpleInsight> : insight)}
      {focal}
      {explanation}
      <SceneDetailsHost curious={curious} advanced={advanced} />
    </div>
  );
}
