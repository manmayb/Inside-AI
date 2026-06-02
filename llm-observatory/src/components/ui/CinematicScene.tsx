"use client";

import { SceneDetailsHost } from "@/components/ui/SceneDetailsHost";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { useSceneComposition } from "@/hooks/useSceneComposition";
import { cn } from "@/lib/utils";

export interface CinematicSceneProps {
  /** Beginner insight — floats over hero, not stacked above it */
  insight?: React.ReactNode;
  /** Full-bleed hero visualization — owns the stage */
  hero: React.ReactNode;
  /** Curious+ panels — opens in bottom overlay, not inline stack */
  curious?: React.ReactNode;
  advanced?: React.ReactNode;
  className?: string;
}

/**
 * Viewport-driven scene: hero fills the stage; narrative overlays; details in drawer.
 * @see docs/COMPONENTS/cinematic-scene.md
 */
export function CinematicScene({
  insight,
  hero,
  curious,
  advanced,
  className,
}: CinematicSceneProps) {
  const { isBeginner } = useLearningDepth();
  const { viewportUsage } = useSceneComposition();

  return (
    <div
      className={cn("cinematic-scene relative h-full min-h-0 w-full flex-1", className)}
      style={{ "--scene-viewport-usage": viewportUsage } as React.CSSProperties}
    >
      <div
        className="scene-hero-layer absolute inset-x-0 z-0 overflow-hidden"
        style={{
          top:    "var(--scene-header-h)",
          bottom: "var(--scene-chrome-h)",
        }}
      >
        {hero}
      </div>

      <div className="scene-vignette-top pointer-events-none absolute inset-x-0 top-0 z-[1] h-24" />
      <div className="scene-vignette-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32" />

      <div className="relative z-10 flex h-full min-h-0 flex-col pointer-events-none">
        <div className="flex-1" />
        {insight != null && isBeginner && (
          <div className="scene-insight-slot pointer-events-auto mx-auto max-w-md px-4">
            {typeof insight === "string" ? (
              <p className="scene-insight-overlay rounded-2xl px-5 py-3.5 text-center text-base leading-relaxed text-[var(--text)]">
                {insight}
              </p>
            ) : (
              insight
            )}
          </div>
        )}
      </div>

      <SceneDetailsHost curious={curious} advanced={advanced} />
    </div>
  );
}
