"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { signalEase } from "@/motion/neuralMotion";

const ArtificialBrain = dynamic(
  () => import("@/components/brain/ArtificialBrain").then((m) => m.ArtificialBrain),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-40 max-w-2xl animate-pulse rounded-2xl bg-[var(--elevated)]" />
    ),
  }
);

interface BrainJourneyProps {
  children: React.ReactNode;
  stageKey: string;
}

/** Guided chapter layout: conceptual map on top, lesson below */
export function BrainJourney({ children, stageKey }: BrainJourneyProps) {
  const { calmLayout, showTechnical } = useLearningDepth();

  return (
    <div className="flex h-full flex-col">
      <section className="shrink-0 border-b border-[var(--panel-border)] bg-[var(--deep)]/60 px-4 py-6 md:py-8">
        <ArtificialBrain />
      </section>

      <motion.section
        key={stageKey}
        initial={{ opacity: 0, y: calmLayout ? 8 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: signalEase }}
        className={`stage-atmosphere min-h-0 flex-1 overflow-y-auto ${
          calmLayout ? "px-4 py-6 md:px-8" : "px-4 py-6 md:px-10 md:py-8"
        }`}
      >
        <div
          className={
            showTechnical
              ? "relative z-[1] mx-auto max-w-5xl space-y-6"
              : "relative z-[1] mx-auto max-w-xl space-y-5"
          }
        >
          {children}
        </div>
      </motion.section>
    </div>
  );
}
