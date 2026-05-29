# Pipeline chapters (15 stages)

Each row links to dedicated documentation. Implementation: `src/components/sections/<Name>Section.tsx`.

| # | ID | Beginner label | Region | Doc |
|---|-----|----------------|--------|-----|
| 1 | `input` | Receiving your words | Receiving | [input.md](./input.md) |
| 2 | `tokenization` | Breaking into pieces | Understanding words | [tokenization.md](./tokenization.md) |
| 3 | `embedding` | Finding meaning | Understanding words | [embedding.md](./embedding.md) |
| 4 | `context` | Building memory | Memory | [context.md](./context.md) |
| 5 | `transformer` | Thinking deeper | Deep thinking | [transformer.md](./transformer.md) |
| 6 | `attention` | What matters most | Deep thinking | [attention.md](./attention.md) |
| 7 | `gpu` | Fast parallel thought | Deep thinking | [gpu.md](./gpu.md) |
| 8 | `hidden` | Ideas evolving | Deep thinking | [hidden.md](./hidden.md) |
| 9 | `logits` | Choosing next words | Choosing words | [logits.md](./logits.md) |
| 10 | `autoregressive` | Writing step by step | Choosing words | [autoregressive.md](./autoregressive.md) |
| 11 | `kvcache` | Remembering past work | Memory | [kvcache.md](./kvcache.md) |
| 12 | `safety` | Checking safety | Speaking back | [safety.md](./safety.md) |
| 13 | `rag` | Looking things up | Memory | [rag.md](./rag.md) |
| 14 | `streaming` | Speaking back | Speaking back | [streaming.md](./streaming.md) |
| 15 | `analytics` | Journey complete | Speaking back | [analytics.md](./analytics.md) |

**Duration:** `STAGE_META[id].durationMs` (~1–3s per chapter at 1× speed).

**Copy source:** `src/lib/stageTips.ts` — update docs when tips change.

## Stage doc template

Each `*.md` includes: purpose, beginner metaphor, Curious/Advanced additions, components, state deps, interactions.
