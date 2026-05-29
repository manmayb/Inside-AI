"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { AttentionMatrix } from "@/types/pipeline";

interface AttentionHeatmapProps {
  matrix: AttentionMatrix;
  selectedIndex: number;
  head: number;
  onSelectToken: (i: number) => void;
  causalMask?: boolean;
}

export function AttentionHeatmap({
  matrix,
  selectedIndex,
  head,
  onSelectToken,
  causalMask = false,
}: AttentionHeatmapProps) {
  const ref = useRef<SVGSVGElement>(null);
  const n = matrix.tokens.length;

  useEffect(() => {
    if (!ref.current || n === 0) return;

    const size = Math.min(420, 32 * n + 60);
    const cell = (size - 50) / n;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", size).attr("height", size);

    const g = svg.append("g").attr("transform", "translate(40,10)");

    const color = d3
      .scaleSequential(d3.interpolateTurbo)
      .domain([0, d3.max(matrix.weights.flat()) ?? 1]);

    matrix.weights.forEach((row, i) => {
      row.forEach((w, j) => {
        const masked = causalMask && j > i;
        g.append("rect")
          .attr("x", j * cell)
          .attr("y", i * cell)
          .attr("width", cell - 1)
          .attr("height", cell - 1)
          .attr("fill", masked ? "rgba(15,23,42,0.85)" : color(w * (1 + head * 0.02)))
          .attr("stroke", i === selectedIndex || j === selectedIndex ? "var(--accent)" : "none")
          .attr("stroke-width", 1)
          .attr("opacity", masked ? 0.35 : 1)
          .style("cursor", masked ? "not-allowed" : "pointer")
          .on("click", () => {
            if (!masked) onSelectToken(i);
          });
      });
    });

    matrix.tokens.forEach((t, i) => {
      g.append("text")
        .attr("x", i * cell + cell / 2)
        .attr("y", -4)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", 9)
        .attr("font-family", "monospace")
        .text(t.slice(0, 6));

      g.append("text")
        .attr("x", -6)
        .attr("y", i * cell + cell / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", 9)
        .attr("font-family", "monospace")
        .text(t.slice(0, 6));
    });
  }, [matrix, selectedIndex, head, n, onSelectToken, causalMask]);

  return (
    <svg ref={ref} className="mx-auto max-w-full overflow-visible" role="img" aria-label="Attention heatmap" />
  );
}
