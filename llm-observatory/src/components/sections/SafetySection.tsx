"use client";

import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
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
    <StageLayout
      insight="Filters scan for harmful or policy-breaking content—like a careful editor before speaking."
      focal={
        <GlassPanel title="Your message" variant="hero" glow="accent" divider={false}>
          <div className="flex flex-col items-center gap-4 py-2 text-center sm:flex-row sm:text-left">
            <ShieldCheck className="h-12 w-12 shrink-0 text-[var(--accent)]" aria-hidden />
            <div>
              <p className="text-lg font-medium text-[var(--text)]">Looks good to send</p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">&ldquo;{prompt}&rdquo;</p>
              <p className="mt-2 text-sm text-[var(--accent)]">
                Safety score {(safetyScore * 100).toFixed(0)}% (simulated)
              </p>
            </div>
          </div>
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="safety" icon={Shield} />
          <MetricCard
            label="Safety score"
            value={(safetyScore * 100).toFixed(1)}
            unit="%"
            className="max-w-xs"
          />
          <GlassPanel title="Classifier pipeline" divider={false}>
            <ul className="space-y-2">
              {checks.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 text-[var(--muted)]">
                    {c.status === "pass" ? (
                      <Shield className="h-3 w-3 text-[var(--accent)]" />
                    ) : (
                      <ShieldAlert className="h-3 w-3 text-[var(--secondary)]" />
                    )}
                    {c.name}
                  </span>
                  <span className="text-[var(--accent)]">
                    {c.score !== null ? c.score.toFixed(2) : "…"}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </>
      }
    />
  );
}
