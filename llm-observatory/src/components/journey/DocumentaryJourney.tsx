"use client";

/**
 * Full-screen journey shell — replaces legacy dashboard layout.
 * One chapter per viewport via ChapterScene; minimal SceneChrome.
 * @see docs/COMPONENTS/README.md
 */
import { useEffect, useState } from "react";
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
  const [showFinale, setShowFinale] = useState(false);

  useEffect(() => {
    if (generationComplete) setShowFinale(true);
  }, [generationComplete]);

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
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
