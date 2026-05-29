"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePipelineStore } from "@/store/pipelineStore";

interface JourneyCompleteProps {
  onNewQuestion: () => void;
  onContinue: () => void;
}

export function JourneyComplete({ onNewQuestion, onContinue }: JourneyCompleteProps) {
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const rerunTour = usePipelineStore((s) => s.rerunTour);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-20 flex items-center justify-center bg-[var(--void)]/85 px-6 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-md text-center"
      >
        <Sparkles className="mx-auto h-10 w-10 text-[var(--accent)]" />
        <h2 className="display-title mt-4 text-3xl text-[var(--text)]">
          You followed a thought from start to finish
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          From your first words to the streamed reply—you saw how language becomes patterns,
          memory, choice, and speech.
        </p>
        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              jumpToStage("analytics");
              onContinue();
            }}
            className="btn-ghost w-full"
          >
            See the summary chapter
          </button>
          <button type="button" onClick={rerunTour} className="btn-ghost w-full">
            Watch again
          </button>
          <button type="button" onClick={onNewQuestion} className="btn-primary w-full">
            Ask something new
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
