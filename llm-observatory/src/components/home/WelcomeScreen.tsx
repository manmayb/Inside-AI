"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Settings2, X } from "lucide-react";
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
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    <div className="welcome-scene relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="welcome-scene-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="welcome-scene-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="welcome-scene-vignette pointer-events-none absolute inset-0" aria-hidden />

      <header className="welcome-scene-header relative z-10 px-6 pt-[clamp(2.5rem,8vh,5rem)] text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 0.68, 0.12, 1] }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-[var(--muted)] uppercase">
            Inside AI
          </p>
          <h1 className="display-title mt-4 text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.08] text-[var(--text)]">
            See how AI thinks.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
            A short, guided journey through what happens after you send a message—no jargon required.
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col justify-end px-6 pb-8 md:px-12 md:pb-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 0.68, 0.12, 1] }}
          className={cn("welcome-prompt-compose mx-auto w-full max-w-2xl", focused && "is-focused")}
        >
          <div className="welcome-prompt-line">
            <label htmlFor="journey-prompt" className="sr-only">
              Your question
            </label>
            <textarea
              id="journey-prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={1}
              placeholder="Ask anything…"
              className="welcome-prompt-field w-full resize-none border-0 bg-transparent text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-[var(--text)] placeholder:text-[var(--muted)]/40 shadow-none focus:outline-none focus:ring-0"
            />
          </div>

          <div className="welcome-prompt-actions mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="welcome-examples min-w-0">
              <p className="mb-2.5 text-[11px] tracking-[0.12em] text-[var(--muted)] uppercase">
                Try an example
              </p>
              <ul className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-1 sm:gap-y-1">
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <li key={p} className="flex items-center sm:inline-flex">
                    {i > 0 && (
                      <span className="welcome-example-sep mx-2 hidden text-[var(--muted)]/30 sm:inline" aria-hidden>
                        ·
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setInput(p)}
                      className="welcome-example-chip text-left text-sm text-[var(--muted)] transition hover:text-[var(--text)]"
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={!canStart}
              className={cn(
                "welcome-start-btn shrink-0",
                canStart ? "btn-primary" : "welcome-start-btn--idle"
              )}
            >
              Start the journey
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>
      </main>

      <footer className="welcome-scene-footer relative z-10 flex items-center justify-between gap-4 px-6 pb-6 md:px-12">
        <p className="text-[11px] text-[var(--muted)]">
          Simulated in your browser · nothing is sent to a real AI
        </p>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="welcome-settings-trigger flex items-center gap-1.5 text-[11px] text-[var(--muted)] transition hover:text-[var(--text)]"
          aria-expanded={settingsOpen}
        >
          <Settings2 className="h-3.5 w-3.5" />
          Customize
        </button>
      </footer>

      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[var(--void)]/65 backdrop-blur-sm"
              aria-label="Close settings"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="welcome-settings-sheet fixed inset-x-0 bottom-0 z-50 max-h-[min(72vh,480px)] overflow-hidden rounded-t-2xl border border-[var(--panel-border)] bg-[var(--deep)]/95 shadow-2xl backdrop-blur-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Customize experience"
            >
              <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-5 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                  <ChevronDown className="h-4 w-4 text-[var(--accent)]" />
                  Customize experience
                </span>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--text)]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-5 overflow-y-auto px-5 py-5">
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
