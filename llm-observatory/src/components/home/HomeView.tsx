"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ModelPresetSelect } from "@/components/layout/ModelPresetSelect";
import { WelcomeIntro } from "@/components/home/WelcomeIntro";
import { usePipelineStore } from "@/store/pipelineStore";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Explain how rainbows form",
  "What happens when I send a message to ChatGPT?",
  "Write a short poem about curiosity",
];

const INTRO_KEY = "inside-ai-intro-seen";

export function HomeView() {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  // CHANGED: submitPrompt selector removed — ADR-004 violation, no prelude guard (see HomeView.tsx audit)
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const setRagEnabled = usePipelineStore((s) => s.setRagEnabled);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowIntro(!localStorage.getItem(INTRO_KEY));
  }, []);

  const trimmed = input.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canSubmit) return;
      // LEGACY: submitPrompt call removed — ADR-004 violation, no prelude guard
      // CHANGED: form submit is now a no-op; journey must start via WelcomeScreen → PreJourneyIntro → Begin
    },
    [canSubmit, trimmed] // CHANGED: submitPrompt removed from dep array
  );

  const dismissIntro = () => {
    localStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <WelcomeIntro onContinue={dismissIntro} />}
      </AnimatePresence>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 w-full max-w-2xl text-center"
        >
          <p className="text-sm font-medium tracking-wide text-[var(--accent)]">
            Interactive learning
          </p>

          <h1 className="display-title mt-4 text-4xl text-[var(--text)] md:text-5xl lg:text-[3.25rem]">
            What happens inside AI
            <br />
            <span className="text-gradient">after you send a message?</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--muted)]">
            A calm, guided journey through a simulated mind—built for curiosity, not jargon.
          </p>

          <form
            onSubmit={handleSubmit}
            className={cn(
              "museum-card-elevated mx-auto mt-12 max-w-xl text-left transition-shadow duration-500",
              focused && "ring-2 ring-[var(--accent-dim)]"
            )}
          >
            <label htmlFor="prompt-input" className="sr-only">
              Your question or thought
            </label>
            <textarea
              id="prompt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={3}
              placeholder="Start with a thought…"
              className="w-full resize-none bg-transparent px-6 py-5 text-lg text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:outline-none"
            />

            <div className="border-t border-[var(--panel-border)] px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--muted)]">
                  <input
                    type="checkbox"
                    checked={ragEnabled}
                    onChange={(e) => setRagEnabled(e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--accent)]"
                  />
                  Include a &ldquo;looking things up&rdquo; step
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary shrink-0"
                >
                  Watch the AI think
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <details className="group mt-4">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-[var(--muted)] marker:content-none hover:text-[var(--text)]">
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  Optional settings
                </summary>
                <div className="mt-3 pb-1">
                  <ModelPresetSelect />
                </div>
              </details>
            </div>
          </form>

          <p className="mt-6 text-sm text-[var(--muted)]">Or try an example</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInput(p)}
                className="btn-ghost"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-10 text-xs text-[var(--muted)]">
            Simulated locally in your browser · no data sent anywhere
          </p>
        </motion.div>
      </div>
    </>
  );
}
