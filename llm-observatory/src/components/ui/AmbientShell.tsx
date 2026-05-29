"use client";

import dynamic from "next/dynamic";

const NeuralUniverse = dynamic(
  () => import("@/components/environment/NeuralUniverse").then((m) => m.NeuralUniverse),
  { ssr: false }
);

interface AmbientShellProps {
  calm?: boolean;
}

/** Subtle ambient atmosphere — never competes with content */
export function AmbientShell({ calm = true }: AmbientShellProps) {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <NeuralUniverse calm={calm} />
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-80"
        aria-hidden="true"
      >
        <div className="volumetric-fog" />
        <div
          className="ambient-orb left-[-20%] top-[-25%] h-[50vh] w-[50vh] opacity-20"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="ambient-orb bottom-[-30%] right-[-15%] h-[45vh] w-[45vh] opacity-12"
          style={{ background: "var(--secondary)", animationDelay: "-14s" }}
        />
      </div>
    </>
  );
}
