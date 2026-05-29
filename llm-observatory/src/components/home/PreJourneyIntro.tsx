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
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16">
      <button
        type="button"
        onClick={prev}
        className="absolute left-6 top-6 flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <AnimatePresence mode="wait">
        {!isLast ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-lg text-center"
          >
            <p className="text-sm font-medium text-[var(--accent)]">
              Before we begin · {step + 1} / {SLIDES.length}
            </p>
            <h2 className="display-title mt-4 text-3xl text-[var(--text)] md:text-4xl">
              {SLIDES[step].title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
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
            className="max-w-lg text-center"
          >
            <p className="text-sm font-medium text-[var(--accent)]">Your question</p>
            <blockquote className="display-title mt-4 text-2xl text-[var(--text)] md:text-3xl">
              &ldquo;{prompt.length > 120 ? `${prompt.slice(0, 120)}…` : prompt}&rdquo;
            </blockquote>
            <p className="mt-6 text-[var(--muted)]">
              Press play when you&apos;re ready. You can pause anytime.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-14 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[...SLIDES, { title: "ready" }].map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-8 bg-[var(--accent)]" : "w-1.5 bg-[var(--muted)]/40"
              }`}
            />
          ))}
        </div>
        <button type="button" onClick={next} className="btn-primary min-w-[200px]">
          {isLast ? "Begin" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
