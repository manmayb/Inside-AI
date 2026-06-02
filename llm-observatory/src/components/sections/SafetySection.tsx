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
        <GlassPanel title="Your message" variant="hero" glow="accent" divider={false} className="min-h-[200px]"> {/* CHANGED: Added min-h-[200px] bounds wrapper */}
          <div className="flex flex-col gap-5 py-1">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <ShieldCheck className="h-10 w-10 shrink-0 text-[var(--accent)]" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-[var(--text)]">Looks good to send</p>
                <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">&ldquo;{prompt}&rdquo;</p>
              </div>
            </div>

            {/* 3-step filter pipeline */}
            <div className="grid grid-cols-3 gap-2 border-t border-[var(--panel-border)] pt-4"> {/* CHANGED: Added 3-step filter pipeline dashboard inside hero panel */}
              {[
                { label: "Input Guard", score: "99%", status: "pass" },
                { label: "Policy Scan", score: "97%", status: "pass" },
                { label: "Output Check", score: "98%", status: "pass" },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[var(--panel-border)] bg-[var(--elevated)] p-2.5 text-center text-xs"
                >
                  <p className="font-semibold text-[var(--text)] truncate">{step.label}</p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="text-[10px] text-[var(--accent)] font-medium">{step.score}</span>
                  </div>
                </div>
              ))}
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
