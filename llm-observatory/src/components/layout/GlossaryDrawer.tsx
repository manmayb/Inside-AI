"use client";

import { BookOpen, X } from "lucide-react";
import { useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/glossary";
import { cn } from "@/lib/utils";

export function GlossaryDrawer() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const terms = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [filter]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Glossary</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close glossary"
          />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-deep shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h2 className="text-lg font-semibold text-white">Glossary</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-white/5 p-4">
              <input
                type="search"
                placeholder="Search terms…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <ul className="flex-1 overflow-y-auto p-4 space-y-3">
              {terms.map((t) => (
                <li
                  key={t.term}
                  className="rounded-lg border border-white/5 bg-elevated/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[var(--accent)]">{t.term}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase",
                        t.category === "core" && "bg-[var(--accent-glow)] text-[var(--accent)]",
                        t.category === "compute" && "bg-violet-500/15 text-violet-300",
                        t.category === "safety" && "bg-amber-500/15 text-amber-300"
                      )}
                    >
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t.definition}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
