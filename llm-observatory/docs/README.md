# Inside AI — Documentation

**Source of truth** for product vision, UX structure, design systems, architecture, and implementation patterns for the `llm-observatory` application.

> **Maintenance rule:** When you change architecture, flows, visual systems, motion, learning modes, or stage behavior — update the relevant doc in the **same PR / change cycle**. See [CONTRIBUTING/maintenance.md](./CONTRIBUTING/maintenance.md).

---

## Quick links

| I want to… | Start here |
|------------|------------|
| Understand what this product is | [PRODUCT/vision.md](./PRODUCT/vision.md) |
| Run the app locally | [CONTRIBUTING/setup.md](./CONTRIBUTING/setup.md) |
| Learn the app flow (welcome → journey) | [UX/experience-flow.md](./UX/experience-flow.md) |
| See how state & simulation work | [STATE_MANAGEMENT/overview.md](./STATE_MANAGEMENT/overview.md) · [SIMULATION_ENGINE/overview.md](./SIMULATION_ENGINE/overview.md) |
| Add or change a pipeline chapter | [STAGES/README.md](./STAGES/README.md) · [AI/contributor-guide.md](./AI/contributor-guide.md) |
| Match UI / motion conventions | [VISUAL_SYSTEM/overview.md](./VISUAL_SYSTEM/overview.md) · [MOTION/overview.md](./MOTION/overview.md) |
| Understand past design choices | [DECISIONS/README.md](./DECISIONS/README.md) |
| Contribute code | [CONTRIBUTING/README.md](./CONTRIBUTING/README.md) |

---

## Documentation map

```
docs/
├── README.md                 ← You are here
├── PRODUCT/                  Product vision, audience, identity
├── UX/                       Experience structure, cognitive load, flows
├── DESIGN/                   Design principles (links to visual + motion)
├── VISUAL_SYSTEM/            Tokens, typography, surfaces, atmosphere
├── MOTION/                   Pacing, transitions, Framer Motion patterns
├── ARCHITECTURE/             App layers, modules, rendering flow
├── STATE_MANAGEMENT/         Zustand store, persistence, scrubber
├── PIPELINE/                 Stage machine, runner, lifecycle
├── STAGES/                   All 15 chapters (one doc each)
├── SIMULATION_ENGINE/        lib/* deterministic simulations
├── LEARNING_SYSTEM/          Beginner / Curious / Advanced, copy, glossary
├── COMPONENTS/               Major UI & viz components
├── THEMING/                  Accent moods, CSS variables
├── PERFORMANCE/              Canvas, dynamic import, bundle notes
├── WORKFLOWS/                End-to-end technical workflows
├── DECISIONS/                Architecture Decision Records (ADRs)
├── ROADMAP/                  Planned work & technical debt
├── CONTRIBUTING/             Setup, conventions, maintenance
├── AI/                       Guide for Cursor / AI assistants
└── REFERENCE/                Glossary, keyboard shortcuts, file map
```

---

## Relationship to root markdown files

| Root file | Role |
|-----------|------|
| [../README.md](../README.md) | Project entry point — overview, quick start, links into `docs/` |
| [../ARCHITECTURE.md](../ARCHITECTURE.md) | **Summary index** — points to `docs/ARCHITECTURE/` for detail |
| [../PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) | **Summary index** — points to `docs/PRODUCT/` for detail |

Detailed content lives under **`docs/`**. Root files stay short so they do not drift from the nested source of truth.

---

## Audience

| Reader | Recommended path |
|--------|------------------|
| New contributor | PRODUCT → UX → ARCHITECTURE → CONTRIBUTING |
| Designer / UX | PRODUCT → UX → VISUAL_SYSTEM → MOTION |
| Engineer (simulation) | SIMULATION_ENGINE → PIPELINE → STATE_MANAGEMENT |
| Engineer (UI) | COMPONENTS → VISUAL_SYSTEM → STAGES |
| AI coding assistant | [AI/contributor-guide.md](./AI/contributor-guide.md) first |

---

## Diagram: documentation layers vs code layers

```
┌─────────────────────────────────────────────────────────┐
│  PRODUCT · UX · LEARNING_SYSTEM  (why & who)              │
├─────────────────────────────────────────────────────────┤
│  DESIGN · VISUAL_SYSTEM · MOTION  (how it feels)        │
├─────────────────────────────────────────────────────────┤
│  ARCHITECTURE · STATE · PIPELINE · SIMULATION  (how it  │
│  works)                                                 │
├─────────────────────────────────────────────────────────┤
│  COMPONENTS · STAGES · WORKFLOWS  (where in the code)   │
├─────────────────────────────────────────────────────────┤
│  DECISIONS · ROADMAP · REFERENCE  (history & future)    │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    src/  (implementation)
```
