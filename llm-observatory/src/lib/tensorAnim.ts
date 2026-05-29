/** Deterministic matrix values for visualization (not real GEMM) */

export function seededMatrix(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => rand() * 2 - 1)
  );
}

export function multiplyVisual(
  a: number[][],
  b: number[][],
  t: number
): { result: number[][]; highlight: [number, number, number][] } {
  const rows = a.length;
  const cols = b[0]?.length ?? 0;
  const inner = b.length;
  const result: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
  const highlight: [number, number, number][] = [];

  const phase = Math.floor(t * inner) % inner;
  const activeRow = Math.floor(t * rows) % rows;
  const activeCol = Math.floor(t * cols) % cols;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += a[i][k] * b[k][j];
        if (k === phase && i === activeRow && j === activeCol) {
          highlight.push([i, k, j]);
        }
      }
      result[i][j] = sum;
    }
  }
  return { result, highlight };
}

export function buildHiddenStateSlices(
  tokenCount: number,
  layerCount: number,
  tokens: { text: string }[],
  seed: number
): import("@/types/pipeline").HiddenStateSlice[] {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  return Array.from({ length: tokenCount }, (_, ti) => ({
    tokenIndex: ti,
    text: tokens[ti]?.text ?? "",
    layerMagnitudes: Array.from({ length: layerCount }, (_, li) =>
      0.2 + rand() * 0.8 * Math.sin((li / layerCount) * Math.PI + ti * 0.4)
    ),
  }));
}
