"use client";

/**
 * Full-screen journey shell — replaces legacy dashboard layout.
 * One chapter per viewport via ChapterScene; minimal SceneChrome.
 * @see docs/COMPONENTS/README.md
 */
import { useEffect, useState } from "react";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { useSceneComposition } from "@/hooks/useSceneComposition";
import { usePipelineStore } from "@/store/pipelineStore";
import { StageSection } from "@/components/sections/StageContent";
import { ChapterScene } from "./ChapterScene";
import { SceneChrome } from "./SceneChrome";
import { JourneyComplete } from "./JourneyComplete";

interface DocumentaryJourneyProps {
  onExit: () => void;
}

/** Full-screen guided documentary — no dashboard shell */
export function DocumentaryJourney({ onExit }: DocumentaryJourneyProps) {
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const { mode, minimizeChrome } = useSceneComposition();
  const { showTechnical } = useLearningDepth();
  const [showFinale, setShowFinale] = useState(false);

  useEffect(() => {
    if (generationComplete) setShowFinale(true);
  }, [generationComplete]);

  const cinematic = mode === "cinematic";

  return (
    <div
      className="documentary-journey relative flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      data-scene-mode={mode}
      data-chrome-mode={minimizeChrome ? "minimal" : "standard"}
      data-has-details={showTechnical ? "true" : "false"}
      style={
        {
          "--scene-chrome-h": minimizeChrome ? "4.25rem" : "6.75rem",
          "--scene-header-h": cinematic ? "9rem" : "8.75rem",
          "--scene-details-trigger-h": showTechnical ? "2.75rem" : "0px",
          "--scene-safe-bottom": showTechnical
            ? "calc(var(--scene-chrome-h) + var(--scene-details-trigger-h) + 0.75rem)"
            : "calc(var(--scene-chrome-h) + 0.75rem)",
        } as React.CSSProperties
      }
    >
      <ChapterScene>
        <StageSection />
      </ChapterScene>

      <SceneChrome onExit={onExit} />

      {showFinale && (
        <JourneyComplete
          onNewQuestion={onExit}
          onContinue={() => setShowFinale(false)}
        />
      )}
    </div>
  );
}
