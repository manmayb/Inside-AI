# Pipeline overview

The **pipeline** is the ordered sequence of 15 **chapters** (stages) that auto-advance after the user starts the journey.

**Source of truth:** `PIPELINE_STAGES` in `src/types/pipeline.ts`  
**Durations:** `STAGE_META[stage].durationMs` in `src/lib/constants.ts`

---

## Lifecycle

1. **Idle** — `active === false`, welcome/prelude  
2. **Build** — `submitPrompt` materializes artifacts  
3. **Play** — `usePipelineRunner` advances progress  
4. **Complete** — `generationComplete`, metrics computed  
5. **Reset** — `reset()` or new question  

See [lifecycle.md](./lifecycle.md) and [stage-machine.md](./stage-machine.md).

---

## Stage order

```
input → tokenization → embedding → context → transformer →
attention → gpu → hidden → logits → autoregressive → kvcache →
safety → rag → streaming → analytics
```

---

## Brain region mapping

Multiple stages map to one cognitive region for narration. See `src/lib/brainRegions.ts` and [../STAGES/README.md](../STAGES/README.md).

---

## RAG chapter

If `ragEnabled` is false at submit, RAG stage still exists but uses placeholder/skip UX in section.
