"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { ModelPresetSelect } from "@/components/layout/ModelPresetSelect";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { ThemePicker } from "@/components/layout/ThemePicker";
import { usePipelineStore } from "@/store/pipelineStore";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Explain how rainbows form",
  "What happens when I text an AI?",
  "Why do models pause before answering?",
];

interface WelcomeScreenProps {
  onStartJourney: (prompt: string) => void;
}

export function WelcomeScreen({ onStartJourney }: WelcomeScreenProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const setRagEnabled = usePipelineStore((s) => s.setRagEnabled);

  const trimmed = input.trim();
  const canStart = trimmed.length > 0;

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canStart) return;
      onStartJourney(trimmed);
    },
    [canStart, trimmed, onStartJourney]
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <h1 className="display-title text-4xl text-[var(--text)] md:text-5xl">
          See how AI thinks.
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-lg leading-relaxed text-[var(--muted)]">
          A short, guided journey through what happens after you send a message—no jargon required.
        </p>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "mx-auto mt-12 w-full text-left transition-shadow duration-500",
            focused && "ring-2 ring-[var(--accent-dim)] rounded-2xl"
          )}
        >
          <label htmlFor="journey-prompt" className="sr-only">
            Your question
          </label>
          <textarea
            id="journey-prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={2}
            placeholder="Ask anything…"
            className="w-full resize-none rounded-2xl border border-[var(--panel-border)] bg-[var(--elevated)] px-5 py-4 text-lg text-[var(--text)] placeholder:text-[var(--muted)]/60 focus:border-[var(--accent-dim)] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!canStart}
            className="btn-primary mt-5 w-full"
          >
            Start the journey
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted)]">Try an example</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setInput(p)}
              className="btn-ghost text-sm"
            >
              {p}
            </button>
          ))}
        </div>

        <details className="group mx-auto mt-12 max-w-md text-left">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-1 text-sm text-[var(--muted)] marker:content-none hover:text-[var(--text)]">
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            Customize experience
          </summary>
          <div className="museum-card mt-4 space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-[var(--muted)]">Learning depth</span>
              <ModeToggle />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-[var(--muted)]">Color mood</span>
              <ThemePicker />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-[var(--accent)]"
              />
              Include a &ldquo;looking things up&rdquo; chapter
            </label>
            <ModelPresetSelect />
          </div>
        </details>

        <p className="mt-12 text-xs text-[var(--muted)]">
          Simulated in your browser · nothing is sent to a real AI
        </p>
      </motion.div>
    </div>
  );
}
