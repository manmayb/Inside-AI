"use client";

import { useState } from "react";
import { ChevronUp, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SceneDetailsPanelProps {
  children: React.ReactNode;
  label?: string;
}

/** Collapsible overlay for Curious+ content — keeps hero viewport unobstructed */
export function SceneDetailsPanel({ children, label = "Explore details" }: SceneDetailsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "scene-details-trigger pointer-events-auto fixed right-4 z-40 rounded-full border border-[var(--panel-border)] bg-[var(--deep)]/85 px-4 py-2 text-xs font-medium text-[var(--text)] backdrop-blur-md transition hover:border-[var(--accent-dim)]",
          open && "pointer-events-none opacity-0"
        )}
        style={{ bottom: "var(--scene-safe-bottom)" }}
        aria-expanded={open}
      >
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[var(--void)]/60 backdrop-blur-sm"
              aria-label="Close details"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="scene-details-sheet fixed inset-x-0 z-50 max-h-[min(70vh,520px)] overflow-hidden rounded-t-2xl border border-[var(--panel-border)] bg-[var(--deep)]/95 shadow-2xl backdrop-blur-xl"
              style={{ bottom: "var(--scene-chrome-h)" }}
              role="dialog"
              aria-modal="true"
              aria-label={label}
            >
              <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-5 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                  <ChevronUp className="h-4 w-4 text-[var(--accent)]" />
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--text)]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="scene-details-scroll overflow-y-auto px-5 py-4">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
