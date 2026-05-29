# Simulation engine overview

Pure TypeScript under `src/lib/` — **no React imports**. Deterministic where possible (seeded randomness).

---

## Modules

| Module | Purpose |
|--------|---------|
| `tokenizer.ts` | Greedy BPE-style subword split → `TokenUnit[]` |
| `inference.ts` | Embeddings, context, attention, logits, KV cache, response text |
| `analytics.ts` | `computeMetrics`, FLOPs estimates, formatting |
| `constants.ts` | `DEFAULT_CONFIG`, `STAGE_META`, stage status builder |
| `modelPresets.ts` | Compact / Standard / Frontier config bundles |
| `tensorAnim.ts` | Matrix animation helpers for GPU viz |
| `tourProgress.ts` | Global scrub math |
| `brainRegions.ts` | Stage → cognitive region map |
| `stageTips.ts` | Educational copy |
| `glossary.ts` | Static term definitions |
| `persistence.ts` | localStorage prefs |
| `utils.ts` | `cn()`, helpers |

---

## Fidelity disclaimer

Attention, logits, and embeddings are **heuristic** — influenced by token position and seeded noise. They are **not** from a trained model. Document this in any user-facing export.

---

## Extension points

| Goal | Approach |
|------|----------|
| Real tokenizer | Replace `tokenizer.ts`; keep `TokenUnit` shape |
| Real weights | Server export JSON → load in viz components |
| Live API | Add route + gate `submitPrompt` |

See [../ROADMAP/technical-debt.md](../ROADMAP/technical-debt.md).

---

## Called from

`pipelineStore.submitPrompt` only for full build. `refreshLogits` during AR stage.
