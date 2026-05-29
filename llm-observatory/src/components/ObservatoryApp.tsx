"use client";

/**
 * Root application shell — documentary UX flow.
 *
 * Phases (local React state, not Zustand):
 *   welcome → prelude → journey
 *
 * Simulation starts only after PreJourneyIntro "Begin" calls submitPrompt.
 * See docs/UX/experience-flow.md and docs/DECISIONS/004-prelude-before-simulation.md
 */
import { useCallback, useEffect, useState } from "react";
import { WelcomeScreen } from "@/components/home/WelcomeScreen";
import { PreJourneyIntro } from "@/components/home/PreJourneyIntro";
import { DocumentaryJourney } from "@/components/journey/DocumentaryJourney";
import { AmbientShell } from "@/components/ui/AmbientShell";
import { PreferencesHydrator } from "@/components/PreferencesHydrator";
import { usePipelineRunner } from "@/hooks/usePipelineRunner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePipelineStore } from "@/store/pipelineStore";

type AppPhase = "welcome" | "prelude" | "journey";

export function ObservatoryApp() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [pendingPrompt, setPendingPrompt] = useState("");

  const active = usePipelineStore((s) => s.active);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const submitPrompt = usePipelineStore((s) => s.submitPrompt);

  usePipelineRunner();
  useKeyboardShortcuts();

  const handleStartJourney = useCallback((prompt: string) => {
    setPendingPrompt(prompt);
    setPhase("prelude");
  }, []);

  const handleBeginSimulation = useCallback(() => {
    submitPrompt(pendingPrompt);
    setPhase("journey");
  }, [pendingPrompt, submitPrompt]);

  const handleExitJourney = useCallback(() => {
    usePipelineStore.getState().reset();
    setPhase("welcome");
    setPendingPrompt("");
  }, []);

  useEffect(() => {
    if (!active && phase === "journey") {
      setPhase("welcome");
      setPendingPrompt("");
    }
  }, [active, phase]);

  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden bg-void"
      data-view={viewMode}
      data-phase={phase}
    >
      <PreferencesHydrator />
      <AmbientShell calm />
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        {phase === "welcome" && (
          <WelcomeScreen onStartJourney={handleStartJourney} />
        )}

        {phase === "prelude" && (
          <PreJourneyIntro
            prompt={pendingPrompt}
            onBegin={handleBeginSimulation}
            onBack={() => setPhase("welcome")}
          />
        )}

        {phase === "journey" && active && (
          <DocumentaryJourney onExit={handleExitJourney} />
        )}
      </div>
    </div>
  );
}
