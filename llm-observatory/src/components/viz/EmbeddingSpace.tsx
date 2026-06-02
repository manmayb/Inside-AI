"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmbeddingPoint } from "@/types/pipeline";
import { cosineSimilarity } from "@/lib/inference";
import { usePipelineStore } from "@/store/pipelineStore";
import { useLearningDepth } from "@/hooks/useLearningDepth"; // CHANGED: import useLearningDepth
import { useMotionPreferences } from "@/hooks/useMotionPreferences"; // CHANGED: import useMotionPreferences hook

// ── Chapter-specific accent palette: mapped to globals.css tokens ──
const A = {
  teal:      "var(--accent)", // CHANGED: replaced hardcoded hex with var(--accent)
  tealDim:   "var(--accent-glow)", // CHANGED: replaced hardcoded rgba with var(--accent-glow)
  tealFaint: "var(--accent-beam)", // CHANGED: replaced hardcoded rgba with var(--accent-beam)
  emerald:   "var(--secondary)", // CHANGED: replaced hardcoded hex with var(--secondary)
  blue:      "var(--accent-beam)", // CHANGED: replaced hardcoded hex with var(--accent-beam)
  violet:    "var(--rose)", // CHANGED: replaced hardcoded hex with var(--rose)
  panel:     "var(--panel)", // CHANGED: replaced hardcoded rgba with var(--panel)
  text:      "var(--text)", // CHANGED: replaced hardcoded hex with var(--text)
  muted:     "var(--muted)", // CHANGED: replaced hardcoded hex with var(--muted)
};

// ── Pre-defined semantic cluster regions ──
interface Cluster {
  id: string;
  name: string;
  color: string;
  glow: string;
  cx: number;
  cy: number;
  r: number;
}

const CLUSTERS: Cluster[] = [
  { id: "language", name: "Language",  color: A.teal,    glow: "color-mix(in srgb, var(--accent) 11%, transparent)",  cx: -0.68, cy: -0.26, r: 0.44 }, // CHANGED: replaced hardcoded glow with color-mix
  { id: "science",  name: "Science",   color: A.emerald,  glow: "color-mix(in srgb, var(--secondary) 11%, transparent)",  cx:  0.58, cy: -0.60, r: 0.40 }, // CHANGED: replaced hardcoded glow with color-mix
  { id: "code",     name: "Code",      color: A.blue,     glow: "color-mix(in srgb, var(--accent-beam) 9%, transparent)",  cx:  0.66, cy:  0.52, r: 0.38 }, // CHANGED: replaced hardcoded glow with color-mix
  { id: "concepts", name: "Concepts",  color: A.violet,   glow: "color-mix(in srgb, var(--rose) 9%, transparent)", cx: -0.56, cy:  0.60, r: 0.42 }, // CHANGED: replaced hardcoded glow with color-mix
];

// Deterministic star field
const STARS = Array.from({ length: 32 }, (_, i) => ({
  cx: (((i * 0.7139 + Math.sin(i * 1.231) * 0.5 + 1) % 2.8) - 1.4),
  cy: (((i * 0.4311 + Math.cos(i * 0.873) * 0.5 + 1) % 2.8) - 1.4),
  r:  0.007 + (i % 4) * 0.003,
  opacity: 0.04 + (i % 5) * 0.025,
}));

function nearestCluster(p: EmbeddingPoint): Cluster {
  let best = CLUSTERS[0];
  let bestDist = Infinity;
  for (const c of CLUSTERS) {
    const d = Math.hypot(p.x - c.cx, -p.y - c.cy);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return best;
}

// ── Component ──
interface EmbeddingSpaceProps {
  points: EmbeddingPoint[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  cinematic?: boolean;
}

export function EmbeddingSpace({
  points,
  selectedIndex,
  onSelect,
  cinematic = false,
}: EmbeddingSpaceProps) {
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const { isBeginner } = useLearningDepth(); // CHANGED: acquire isBeginner gate
  const { repeat } = useMotionPreferences(); // CHANGED: acquire repeat behavior based on motion settings
  const [panelOpen, setPanelOpen] = useState(false);

  const selected = points[selectedIndex] ?? null;

  // Animation gates driven by stage progress
  const clusterAlpha  = Math.max(0, Math.min(1, (stageProgress - 50) / 30));
  const neighborAlpha = Math.max(0, Math.min(1, (stageProgress - 80) / 20));

  // k-nearest neighbors of selected token
  const neighbors = useMemo(() => {
    if (!selected || points.length < 2) return [];
    return points
      .map((p, i) => ({ i, sim: i !== selectedIndex ? cosineSimilarity(selected, p) : -Infinity }))
      .filter((n) => n.i !== selectedIndex && isFinite(n.sim))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 4);
  }, [selected, selectedIndex, points]);

  const selectedCluster = selected ? nearestCluster(selected) : null;

  const handleClick = (i: number) => {
    const wasAlreadySelected = i === selectedIndex;
    onSelect(i);
    setPanelOpen((prev) => (wasAlreadySelected ? !prev : true));
  };

  // ── Compact fallback ──
  if (!cinematic) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/5 bg-black/40">
        <svg viewBox="-1.5 -1.5 3 3" className="h-full w-full">
          {points.map((p, i) => {
            const c = nearestCluster(p);
            return (
              <motion.circle
                key={i}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: i === selectedIndex ? 0.08 : 0.05, opacity: 1 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                cx={p.x}
                cy={-p.y}
                fill={i === selectedIndex ? A.teal : `color-mix(in srgb, ${c.color} 53%, transparent)`} // CHANGED: Replace hex opacity suffix with modern color-mix
                onClick={() => onSelect(i)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>
        {!isBeginner && ( // CHANGED: Wrapped in isBeginner gate to hide advanced latent space text per audit requirements
          <div className="absolute bottom-2 left-3 font-mono text-[9px]" style={{ color: A.tealFaint }}>
            {/* CHANGED: Hide dimensions/projection text in Beginner Mode */}
            {isBeginner ? "latent projection" : "latent projection · d=4096 → 3D PCA"}
          </div>
        )}
      </div>
    );
  }

  // ── Full cinematic semantic space ──
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Radial depth atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 88% 78% at 50% 50%, rgba(20,32,44,0.45) 0%, rgba(15,17,20,0.0) 100%)",
        }}
      />

      {/* Full-bleed SVG */}
      <svg
        viewBox="-1.5 -1.5 3 3"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {CLUSTERS.map((c) => (
            <radialGradient key={`rg-${c.id}`} id={`rg-${c.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={c.color} stopOpacity="0.20" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0"    />
            </radialGradient>
          ))}
          <radialGradient id="rg-selected" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={A.teal} stopOpacity="0.45" />
            <stop offset="100%" stopColor={A.teal} stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Star field */}
        {STARS.map((s, i) => (
          <circle key={`star-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />
        ))}

        {/* ── Cluster halos (fade in as stageProgress > 50%) ── */}
        {CLUSTERS.map((c) => (
          <g key={`cluster-${c.id}`}>
            <motion.circle
              cx={c.cx} cy={c.cy} r={c.r}
              fill={`url(#rg-${c.id})`}
              stroke={c.color}
              strokeWidth="0.006"
              initial={{ opacity: 0 }}
              animate={{ opacity: clusterAlpha, strokeOpacity: clusterAlpha * 0.3 }}
              transition={{ duration: 1.0 }}
            />
            {/* Cluster label */}
            <motion.text
              x={c.cx}
              y={c.cy - c.r - 0.055}
              textAnchor="middle"
              fontSize={0.062}
              fill={c.color}
              fontFamily="var(--font-dm-sans)" // CHANGED: Replace monospace with DM Sans
              letterSpacing={0.025}
              initial={{ opacity: 0 }}
              animate={{ opacity: clusterAlpha * 0.8 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {c.name.toUpperCase()}
            </motion.text>
          </g>
        ))}

        {/* ── Neighbor connection lines (panel open) ── */}
        {panelOpen && selected && neighbors.map(({ i, sim }) => {
          const p = points[i];
          if (!p) return null;
          return (
            <motion.line
              key={`line-${i}`}
              x1={selected.x} y1={-selected.y}
              x2={p.x}        y2={-p.y}
              stroke={A.teal}
              strokeWidth={0.005 + sim * 0.007}
              initial={{ opacity: 0 }}
              animate={{ opacity: sim * 0.6 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            />
          );
        })}

        {/* ── Subtle neighbor halos at high similarity ── */}
        {neighborAlpha > 0 && selected && points.map((p, i) => {
          if (i === selectedIndex) return null;
          const sim = cosineSimilarity(selected, p);
          if (sim < 0.55) return null;
          return (
            <motion.circle
              key={`nhalo-${i}`}
              cx={p.x} cy={-p.y}
              r={0.10}
              fill="url(#rg-selected)"
              initial={{ opacity: 0 }}
              animate={{ opacity: sim * neighborAlpha * 0.45 }}
              transition={{ duration: 0.6 }}
            />
          );
        })}

        {/* ── Token nodes ── */}
        {points.map((p, i) => {
          const isSelected = i === selectedIndex;
          const cluster    = nearestCluster(p);
          const isNeighbor = panelOpen && neighbors.some((n) => n.i === i);
          const nodeR      = isSelected ? 0.076 : 0.040 + p.magnitude * 0.030;
          const nodeColor  = isSelected
            ? A.teal
            : isNeighbor
              ? cluster.color
              : `color-mix(in srgb, ${cluster.color} 50%, transparent)`; // CHANGED: Replace hex opacity suffix with modern color-mix

          return (
            <g key={i} onClick={() => handleClick(i)} style={{ cursor: "pointer" }}>
              {/* Pulse ring on selected */}
              {isSelected && (
                <motion.circle
                  cx={p.x} cy={-p.y}
                  r={nodeR + 0.04}
                  fill="none"
                  stroke={A.teal}
                  strokeWidth="0.005"
                  animate={{
                    r:       [nodeR + 0.03, nodeR + 0.07, nodeR + 0.03],
                    opacity: [0.55, 0.12, 0.55],
                  }}
                  transition={{ duration: 2.6, repeat: repeat, ease: "easeInOut" }} // CHANGED: wire repeat to motion preferences
                />
              )}

              {/* Main node — animates from center (0,0) to real position */}
              <motion.circle
                fill={nodeColor}
                initial={{ cx: 0, cy: 0, r: 0, opacity: 0 }}
                animate={{ cx: p.x, cy: -p.y, r: nodeR, opacity: 1 }}
                transition={{
                  delay:    i * 0.055,
                  duration: 0.85,
                  ease:     [0.22, 0.68, 0, 1.2],
                }}
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 7px ${A.teal})`
                    : isNeighbor
                      ? `drop-shadow(0 0 4px ${cluster.color})`
                      : undefined,
                }}
              />

              {/* Token label */}
              <motion.text
                x={p.x}
                y={-p.y + nodeR + 0.072}
                textAnchor="middle"
                fontSize={isSelected ? 0.068 : 0.052}
                fill={isSelected ? A.text : isNeighbor ? cluster.color : A.muted + "bb"}
                fontFamily="var(--font-dm-sans)" // CHANGED: Replace monospace with DM Sans
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.055 + 0.38, duration: 0.5 }}
              >
                {p.text.trim().slice(0, 10)}
              </motion.text>
            </g>
          );
        })}

        {/* Selected-token glow blob */}
        {selected && (
          <motion.circle
            cx={selected.x} cy={-selected.y}
            r={0.18}
            fill="url(#rg-selected)"
            pointerEvents="none"
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 3.2, repeat: repeat, ease: "easeInOut" }} // CHANGED: wire repeat to motion preferences
          />
        )}
      </svg>

      {/* ══ Left Panel: Token Details (click-to-reveal) ══ */}
      <AnimatePresence>
        {panelOpen && selected && (
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            transition={{ duration: 0.32, ease: [0.22, 0.68, 0, 1] }}
            className="absolute left-4 top-1/2 z-20 w-52 -translate-y-1/2 rounded-2xl border p-4"
            style={{
              background:    A.panel,
              backdropFilter: "blur(22px)",
              borderColor:   "rgba(255,255,255,0.09)",
              boxShadow:     "0 8px 40px rgba(0,0,0,0.45)",
            }}
          >
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: A.teal }}>
              Selected Token
            </p>

            <p className="mb-0.5 text-[15px] font-semibold" style={{ color: A.text }}>
              &ldquo;{selected.text.trim()}&rdquo;
            </p>
            <p className="mb-3 font-mono text-[10px]" style={{ color: A.muted }}>
              Token #{selected.tokenIndex}
            </p>

            {/* CHANGED: Hide raw vector floating point values in Beginner Mode */}
            {!isBeginner && (
              <div className="mb-3 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                  Vector (4096-d)
                </p>
                <p className="font-mono text-[10px] leading-relaxed" style={{ color: A.teal }}>
                  [{selected.x.toFixed(3)},{"\u00a0"}
                  {selected.y.toFixed(3)},{"\u00a0"}
                  {selected.z.toFixed(3)},&nbsp;…]
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                Nearest Neighbors
              </p>
              <div className="space-y-1.5">
                {neighbors.map(({ i, sim }) => {
                  const pt = points[i];
                  if (!pt) return null;
                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/8"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      onClick={() => handleClick(i)}
                      onKeyDown={(e) => e.key === "Enter" && handleClick(i)}
                    >
                      <span className="font-mono text-[11px]" style={{ color: A.text }}>
                        {pt.text.trim().slice(0, 10)}
                      </span>
                      {/* CHANGED: Hide cosine similarity percentage metric in Beginner Mode */}
                      {!isBeginner && (
                        <span className="font-mono text-[10px] tabular-nums" style={{ color: A.teal }}>
                          {(sim * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setPanelOpen(false)}
              className="mt-3 w-full rounded-lg py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: A.muted,
              }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Right Panel: Embedding Insights (click-to-reveal) ══ */}
      <AnimatePresence>
        {panelOpen && selected && selectedCluster && (
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 22 }}
            transition={{ duration: 0.32, ease: [0.22, 0.68, 0, 1] }}
            className="absolute right-4 top-1/2 z-20 w-48 -translate-y-1/2 rounded-2xl border p-4"
            style={{
              background:    A.panel,
              backdropFilter: "blur(22px)",
              borderColor:   "rgba(255,255,255,0.09)",
              boxShadow:     "0 8px 40px rgba(0,0,0,0.45)",
            }}
          >
            <p
              className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: selectedCluster.color }}
            >
              Embedding Insights
            </p>

            <div className="space-y-3.5">
              {/* Cluster */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                  Cluster
                </p>
                <p className="mt-0.5 text-sm font-medium" style={{ color: selectedCluster.color }}>
                  {selectedCluster.name}
                </p>
              </div>

              {/* Top similarity with mini bar */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                  Top Similarity
                </p>
                <p className="mt-0.5 font-mono text-sm tabular-nums" style={{ color: A.text }}>
                  {neighbors[0] ? `${(neighbors[0].sim * 100).toFixed(1)}%` : "—"}
                </p>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: selectedCluster.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(neighbors[0]?.sim ?? 0) * 100}%` }}
                    transition={{ duration: 0.65, ease: [0.22, 0.68, 0, 1] }}
                  />
                </div>
              </div>

              {/* Magnitude */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                  Magnitude
                </p>
                <p className="mt-0.5 font-mono text-sm tabular-nums" style={{ color: A.text }}>
                  {selected.magnitude.toFixed(3)}
                </p>
              </div>

              {/* Projection */}
              {/* CHANGED: Hide Projection dimensionality details in Beginner Mode */}
              {!isBeginner && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                    Projection
                  </p>
                  <p className="mt-0.5 font-mono text-[10px]" style={{ color: A.muted }}>
                    4096-d → 3D PCA
                  </p>
                </div>
              )}

              {/* Position encoding */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: A.muted }}>
                  Position Encoding
                </p>
                <p className="mt-0.5 font-mono text-[10px]" style={{ color: A.teal }}>
                  pos #{selected.tokenIndex}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom-left metadata label ── */}
      {/* CHANGED: Hide raw dimensionality text from bottom-left label in Beginner Mode */}
      <div
        className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px]"
        style={{ color: A.tealFaint }}
      >
        {isBeginner ? "latent projection (simulated)" : "latent projection · d=4096 → 3D PCA (simulated)"}
      </div>

      {/* ── Click hint (fades once a token is selected) ── */}
      <AnimatePresence>
        {!panelOpen && points.length > 0 && (
          <motion.div
            className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px]"
            style={{ color: A.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.4, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, repeat: repeat, times: [0, 0.2, 0.8, 1] }} // CHANGED: wire repeat to motion preferences
          >
            click a token to explore →
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
