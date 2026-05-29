# Architecture (index)

Detailed architecture lives in **[docs/ARCHITECTURE/](./docs/ARCHITECTURE/)**.

## Summary

- **Client-only** Next.js app; simulated inference in `src/lib/*`
- **Phases:** welcome → prelude → journey (`ObservatoryApp`)
- **Journey:** `DocumentaryJourney` → `ChapterScene` → `StageSection`
- **State:** single Zustand `pipelineStore`
- **Runner:** `usePipelineRunner` (50ms stage machine)

## Key docs

| Topic | Link |
|-------|------|
| Overview | [docs/ARCHITECTURE/overview.md](./docs/ARCHITECTURE/overview.md) |
| App structure | [docs/ARCHITECTURE/app-structure.md](./docs/ARCHITECTURE/app-structure.md) |
| Data flow | [docs/ARCHITECTURE/data-flow.md](./docs/ARCHITECTURE/data-flow.md) |
| State | [docs/STATE_MANAGEMENT/overview.md](./docs/STATE_MANAGEMENT/overview.md) |
| Pipeline | [docs/PIPELINE/overview.md](./docs/PIPELINE/overview.md) |
| Decisions (ADRs) | [docs/DECISIONS/README.md](./docs/DECISIONS/README.md) |

Do not expand this file with duplicate detail — edit `docs/` instead.
