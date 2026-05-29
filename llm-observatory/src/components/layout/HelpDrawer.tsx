"use client";

import { HelpCircle, X } from "lucide-react";
import { useState } from "react";

const SHORTCUTS = [
  { keys: "Space", action: "Pause / resume tour" },
  { keys: "Shift + →", action: "Next stage" },
  { keys: "Shift + ←", action: "Previous stage" },
  { keys: "⌘/Ctrl + Enter", action: "Submit prompt (home)" },
  { keys: "Shift + click", action: "Compare attention (attention stage)" },
];

const FEATURES = [
  "Choose model size & accent color on the home screen",
  "Scrub transformer layers in Hidden States",
  "Compare greedy vs sampled logits side-by-side",
  "Export inference analytics as JSON",
  "Glossary explains every core term",
  "Replay tour without re-typing your prompt",
];

export function HelpDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="Help and shortcuts"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Help</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close help"
          />
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-deep p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-white">Neural Observatory</h2>
            <p className="mt-2 text-sm text-slate-400">
              A 15-stage simulated walkthrough of LLM inference. Use playback controls to learn at
              your own pace.
            </p>

            <h3 className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              Features
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[var(--accent)]">·</span>
                  {f}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Keyboard shortcuts
            </h3>
            <dl className="mt-2 space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="flex justify-between gap-4 text-sm">
                  <dt className="font-mono text-[var(--accent)]">{s.keys}</dt>
                  <dd className="text-right text-slate-400">{s.action}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
