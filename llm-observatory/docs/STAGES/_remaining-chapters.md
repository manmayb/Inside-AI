# Chapters 4–15 (summary)

Full rows follow the same template as [input.md](./input.md). Quick reference:

| ID | Beginner focus | Primary viz / components |
|----|----------------|--------------------------|
| `context` | Bundling memory | Context blocks UI |
| `transformer` | Layer stack | `TransformerStack`, `TransformerCity` |
| `attention` | Which words matter | `AttentionArcs`, `AttentionHeatmap` |
| `gpu` | Parallel math | `ComputeChamber`, `MatrixMultiply` |
| `hidden` | Representations evolve | `HiddenStateFlow` |
| `logits` | Picking next word | `ProbabilityField`, `LogitBars` |
| `autoregressive` | One token at a time | Sampling controls, logit refresh |
| `kvcache` | Cache for speed | `TensorGrid` / KV viz |
| `safety` | Moderation | Safety scores, flags |
| `rag` | Retrieval (optional) | `RAGSection` — skip if disabled |
| `streaming` | Reply appears | Streamed text append |
| `analytics` | Summary | Metrics export (Advanced) |

Expand individual files when a chapter changes significantly.
