"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "You ask a question",
    body: "Type anything—a question, a story, a thought. This is where every AI conversation begins.",
  },
  {
    icon: Brain,
    title: "Watch it travel inward",
    body: "See your words move through six clear stages: receiving, understanding, remembering, thinking, choosing, and speaking back.",
  },
  {
    icon: ArrowRight,
    title: "Learn at your pace",
    body: "Stay in Beginner mode for plain language, or switch to Curious or Advanced when you want more detail.",
  },
];

interface WelcomeIntroProps {
  onContinue: () => void;
}

export function WelcomeIntro({ onContinue }: WelcomeIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 p-6 backdrop-blur-md"
    >
      <div className="museum-card-elevated w-full max-w-lg p-8 md:p-10">
        <p className="text-sm font-medium text-[var(--accent)]">Welcome</p>
        <h2 className="display-title mt-2 text-2xl text-[var(--text)] md:text-3xl">
          A museum tour inside an AI mind
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          Nothing here connects to a real model. Everything is simulated in your browser so you
          can explore safely.
        </p>

        <ol className="mt-8 space-y-6">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-glow)]">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--text)]">
                  <span className="mr-2 text-[var(--muted)]">{i + 1}.</span>
                  {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <button type="button" onClick={onContinue} className="btn-primary mt-10 w-full">
          Begin the journey
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
