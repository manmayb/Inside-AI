"use client";

import { SceneDetailsPanel } from "@/components/ui/SceneDetailsPanel";
import { useLearningDepth } from "@/hooks/useLearningDepth";

interface SceneDetailsHostProps {
  curious?: React.ReactNode;
  advanced?: React.ReactNode;
}

/** Curious+ content in bottom sheet — never stacked in the chapter flow */
export function SceneDetailsHost({ curious, advanced }: SceneDetailsHostProps) {
  const { showTechnical, showMetrics } = useLearningDepth();

  if (!showTechnical || !curious) return null;

  return (
    <SceneDetailsPanel label={showMetrics && advanced ? "Technical details" : "Explore details"}>
      {curious}
      {showMetrics && advanced && (
        <div className="mt-6 border-t border-[var(--panel-border)] pt-6">{advanced}</div>
      )}
    </SceneDetailsPanel>
  );
}
