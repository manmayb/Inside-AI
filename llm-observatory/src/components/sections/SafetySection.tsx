"use client";

import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { usePipelineStore } from "@/store/pipelineStore";

export function SafetySection() {
  const safetyScore = usePipelineStore((s) => s.safetyScore);
  const prompt = usePipelineStore((s) => s.prompt);

  const checks = [
    { name: "Policy classifier", status: "pass", score: 0.99 },
    { name: "Jailbreak detector", status: "pass", score: 0.97 },
    { name: "PII scanner", status: "pass", score: 1.0 },
    { name: "Harm category", status: "pass", score: 0.98 },
    { name: "Output validator", status: "pending", score: null },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">Safety &amp; Moderation</h2>
        <p className="mt-1 text-sm text-slate-500">Pre/post inference guardrails</p>
      </header>

      <MetricCard
        label="Safety score"
        value={(safetyScore * 100).toFixed(1)}
        unit="%"
        className="max-w-xs"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <GlassPanel title="Input scan" glow="emerald">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
            <p className="text-sm text-slate-400 line-clamp-2">{prompt}</p>
          </div>
        </GlassPanel>
        <GlassPanel title="Classifier pipeline">
          <ul className="space-y-2">
            {checks.map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between rounded border border-white/5 px-3 py-2 font-mono text-xs"
              >
                <span className="flex items-center gap-2 text-slate-400">
                  {c.status === "pass" ? (
                    <Shield className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="h-3 w-3 text-amber-400" />
                  )}
                  {c.name}
                </span>
                <span className={c.status === "pass" ? "text-emerald-400" : "text-amber-400"}>
                  {c.score !== null ? c.score.toFixed(2) : "…"}
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
