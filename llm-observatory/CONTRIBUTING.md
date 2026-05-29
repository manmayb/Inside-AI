# Contributing to Neural Observatory

## Principles

1. **Incremental evolution** — Extend existing sections and viz components; avoid full rewrites.
2. **Browser-only simulation** — No real LLM APIs; deterministic/heuristic data in `src/lib/`.
3. **Performance** — Prefer Framer Motion for UI; use dynamic `import()` for Three/R3F; narrow Zustand selectors (`useShallowStage` or inline selectors).
4. **Accessibility** — Sliders need `role`/`aria-*`; viz needs labels where possible.

## Project layout

| Area | Path |
|------|------|
| Stages UI | `src/components/sections/` |
| Visualizations | `src/components/viz/` |
| Shell / HUD | `src/components/layout/` |
| State | `src/store/pipelineStore.ts` |
| Simulation | `src/lib/tokenizer.ts`, `inference.ts`, `tensorAnim.ts` |
| Tour scrubbing | `src/lib/tourProgress.ts` |
| Motion presets | `src/motion/stageTransitions.ts` |

## Adding a pipeline stage

1. Add to `PIPELINE_STAGES` in `src/types/pipeline.ts`.
2. Add `STAGE_META` entry in `src/lib/constants.ts`.
3. Create `*Section.tsx` and register in `StageContent.tsx`.
4. Update `StageRail`, glossary, and docs if user-facing.

## Running locally

```bash
cd llm-observatory
npm install
npm run dev
```

Verify with `npm run build` before opening a PR.

## Dependencies

- Do not add animation libraries without using them (removed unused `gsap`).
- Three.js only via `@react-three/fiber` + `@react-three/drei` in client components with `ssr: false` when needed.
