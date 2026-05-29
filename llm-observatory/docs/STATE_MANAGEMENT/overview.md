# State management overview

**Library:** Zustand 5 · **Store:** `src/store/pipelineStore.ts`

Single store for pipeline navigation, simulated artifacts, and user preferences. See [actions.md](./actions.md) and [persistence.md](./persistence.md).

## State categories

| Category | Examples |
|----------|----------|
| Navigation | `currentStage`, `stageProgress`, `stageStatuses`, `isPaused`, `playbackSpeed` |
| Session | `active`, `prompt`, `generationComplete` |
| Prefs | `viewMode`, `themeAccent`, `modelPreset`, `ragEnabled`, `config` |
| Artifacts | `tokens`, `embeddings`, `attention`, `logits`, `streamedText`, … |
| Interaction | `selectedTokenIndex`, `selectedHead`, `inspectedLayer` |

## Why one store

One linear journey shares the same artifacts across all chapters; splitting stores would complicate runner ↔ UI sync.
