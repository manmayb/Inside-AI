"use client";

import { useLearningDepth } from "@/hooks/useLearningDepth";

/** Renders children only in Curious or Advanced modes */
export function LearningDetail({ children }: { children: React.ReactNode }) {
  const { showTechnical } = useLearningDepth();
  if (!showTechnical) return null;
  return <>{children}</>;
}

/** Renders children only in Advanced mode */
export function AdvancedDetail({ children }: { children: React.ReactNode }) {
  const { showMetrics } = useLearningDepth();
  if (!showMetrics) return null;
  return <>{children}</>;
}
