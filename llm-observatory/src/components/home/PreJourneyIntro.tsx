"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";

const SLIDES = [
  {
    title: "AI doesn’t read words the way you do",
    body: "When you send a message, the model doesn’t see letters or sentences—it receives patterns it learned from vast amounts of text.",
  },
  {
    title: "Language becomes signals",
    body: "Your message is broken into pieces, turned into meaning, weighed against memory, and shaped into a reply—one careful step at a time.",
  },
  {
    title: "You’re about to travel inward",
    body: "We’ll walk through fifteen short chapters. Each one shows a single moment in that journey—calm, visual, and easy to follow.",
  },
];

interface PreJourneyIntroProps {
  prompt: string;
  onBegin: () => void;
  onBack: () => void;
}

export function PreJourneyIntro({ prompt, onBegin, onBack }: PreJourneyIntroProps) {
  const [step, setStep] = useState(0);
  const isLast = step === SLIDES.length;

  const next = useCallback(() => {
    if (isLast) onBegin();
    else setStep((s) => s + 1);
  }, [isLast, onBegin]);

  const prev = () => {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  };

  return (
    <div className="prelude-scene relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="welcome-scene-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="prelude-scene-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="welcome-scene-vignette pointer-events-none absolute inset-0" aria-hidden />

      <button
        type="button"
        onClick={prev}
        className="absolute left-6 top-6 z-20 flex items-center gap-1 text-sm text-[var(--muted)] transition hover:text-[var(--text)] md:left-10 md:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-20 md:px-12">
        <AnimatePresence mode="wait">
          {!isLast ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 0.68, 0.12, 1] }}
              className="max-w-xl text-center"
            >
              <p className="text-[10px] font-medium tracking-[0.22em] text-[var(--accent)] uppercase">
                Before we begin · {step + 1} / {SLIDES.length}
              </p>
              <h2 className="display-title mt-5 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight text-[var(--text)]">
                {SLIDES[step].title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                {SLIDES[step].body}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl text-center"
            >
              <p className="text-[10px] font-medium tracking-[0.22em] text-[var(--accent)] uppercase">
                Your question
              </p>
              <blockquote className="display-title mt-5 text-[clamp(1.5rem,4vw,2.25rem)] leading-snug text-[var(--text)]">
                &ldquo;{prompt.length > 120 ? `${prompt.slice(0, 120)}…` : prompt}&rdquo;
              </blockquote>
              <p className="mt-6 text-[var(--muted)]">
                Press play when you&apos;re ready. You can pause anytime.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="prelude-scene-footer relative z-10 px-6 pb-8 md:px-12">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5">
          <div className="flex gap-2">
            {[...SLIDES, { title: "ready" }].map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === step ? "w-7 bg-[var(--accent)]" : "w-1 bg-[var(--muted)]/35"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={next} className="btn-primary min-w-[12rem]">
            {isLast ? "Begin" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
